import { VATIds } from "@/hooks/useVATId"
import { getExchangeRate } from "./currency/getExchangeRate"
import { getVatRatesBy, formatVatRate } from './getVATRatesBy';
import { InvoiceItem } from "./invoice/invoiceSchema"

const HOME_COUNTRY = "DE"

export type Output = {
  [key: string]: {
    [key: string]: {
      net: number
      vat: number
      currency: string
      sellerVatNumber: string
    }
  }
}

const convertToEuro = (value: number, from: string) => {
  return (getExchangeRate("EUR", from as any) * value).toFixed(2)
}

const formatCurrency= (value: number) => {
  return (Math.round(value * 100) / 100).toFixed(2)
}

const calculateNetFromVat = (vat: number, vatRate: number) => {
  return vat / vatRate
}

const normalizeCountry = (country: string) => {
  // GB === XI?
  // GB: 23.51
  // PL: 444.42 vs 113.28
  // SE: 14664.42 vs 1315.17

  if (country === 'MC') return 'FR'
  if (country === 'GR') return 'EL'
  if (country === 'GB') return 'XI'
  return country
}

export const invoiceListToOutput = ({invoiceItems, vatIds}: {invoiceItems: InvoiceItem[], vatIds: VATIds},) => {

  const filteredInvoiceList = invoiceItems.filter(
    (invoice) => invoice.marketPlace === "OSS",
  )
  
  const shipData = filteredInvoiceList.reduce<Output>((acc, item) => {
    const { departCountry, arrivalCountry: _arrivalCountry, vatEuro: vat, netSale, transactionCurrency, sellerVatNumber } =
      item

    if (!departCountry || !_arrivalCountry) return acc

    const arrivalCountry = normalizeCountry(_arrivalCountry)

    const safeDepartObject = acc[departCountry] ? acc[departCountry] : {}
    const safeArrivalObject = safeDepartObject[arrivalCountry]
      ? safeDepartObject[arrivalCountry]
      : { net: 0, vat: 0, currency: transactionCurrency, sellerVatNumber: ""}
    const addNet = isNaN(netSale) ? 0 : netSale
    const addVat = isNaN(vat) ? 0 : vat
    if (safeArrivalObject.sellerVatNumber && sellerVatNumber && sellerVatNumber !== safeArrivalObject.sellerVatNumber) {
     console.error(`sellerVatNumber mismatch: ${sellerVatNumber} !== ${safeArrivalObject.sellerVatNumber}`) 
    }
    return {
      ...acc,
      [departCountry]: {
        ...safeDepartObject,
        [arrivalCountry]: {
          net: safeArrivalObject.net + addNet,
          vat: safeArrivalObject.vat + addVat,
          currency: transactionCurrency,
          sellerVatNumber
        },
      },
    }
  }, {} as any)

  // TODO: Should home country be included???
  const level1 = Object.values(shipData)
    .flatMap((arrivalObj) => Object.keys(arrivalObj))
    .filter((value, index, array) => array.indexOf(value) === index)
    .map((country) => [1, country, "", "", "", "", "", "", ""])

  const level3 = Object.keys(shipData[HOME_COUNTRY])
    .sort()
    .map((country) => {
      const vat = shipData[HOME_COUNTRY][country].vat
      const vatRate = getVatRatesBy("shortcode", country)
      const net = calculateNetFromVat(vat, vatRate)
      return [
      3,
      country,
      "STANDARD",
      formatVatRate(vatRate),
      formatCurrency(net),
      formatCurrency(vat),
      "",
      "",
      ""
    ]})

    const level5 = Object.keys(shipData).filter((s) => s !== HOME_COUNTRY).sort().flatMap((departCountry) => {
      const departObject = shipData[departCountry]
      return Object.keys(departObject).sort().map((arrivalCountry) => {
        const { net, vat, currency } = departObject[arrivalCountry]
        const vatRate = getVatRatesBy('shortcode', arrivalCountry)
        const netFromVat = vat / vatRate
        return [5, arrivalCountry, 1, departCountry, vatIds[departCountry], "", 'STANDARD', formatVatRate(getVatRatesBy('shortcode', arrivalCountry)), formatCurrency(netFromVat), formatCurrency(vat)]
      })
    }).sort((a, b) =>{ 
      return (a[1] as string).localeCompare((b[1] as string))})    

  return [...level1, ...level3, ...level5]
}
