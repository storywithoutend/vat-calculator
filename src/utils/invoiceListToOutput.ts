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

export const invoiceListToOutput = ({invoiceItems, vatIds}: {invoiceItems: InvoiceItem[], vatIds: VATIds},) => {

  const filteredInvoiceList = invoiceItems.filter(
    (invoice) => invoice.marketPlace === "OSS",
  )
  
  const shipData = filteredInvoiceList.reduce<Output>((acc, item) => {
    const { departCountry, arrivalCountry, vat, netSale, transactionCurrency, sellerVatNumber } =
      item

    if (!departCountry || !arrivalCountry) return acc

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
    .map((country) => [
      3,
      country,
      "STANDARD",
      formatVatRate(getVatRatesBy("shortcode", country)),
      shipData[HOME_COUNTRY][country].net.toFixed(2),
      shipData[HOME_COUNTRY][country].vat.toFixed(2),
      "",
      "",
      ""
    ])

    const level5 = Object.keys(shipData).filter((s) => s !== HOME_COUNTRY).sort().flatMap((departCountry) => {
      const departObject = shipData[departCountry]
      return Object.keys(departObject).sort().map((arrivalCountry) => {
        const { net, vat, currency } = departObject[arrivalCountry]
        return [5, arrivalCountry, 1, departCountry, vatIds[departCountry], "", 'STANDARD', formatVatRate(getVatRatesBy('shortcode', arrivalCountry)), convertToEuro(net, currency), convertToEuro(vat, currency)]
      })
    }).sort((a, b) =>{ 
      return (a[1] as string).localeCompare((b[1] as string))})    

  return [...level1, ...level3, ...level5]
}
