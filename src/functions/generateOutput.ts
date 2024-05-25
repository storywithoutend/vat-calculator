import { getVatRatesBy } from "../utils/getVATRatesBy"
import { Invoice } from "../types/index"

const HOME_COUTNRY = "DE"

export const generateOutput = async (data: Invoice[]) => {
  const level1Data = data.reduce((acc, item) => {
    const { SALE_ARRIVAL_COUNTRY } = item
    return {
      ...acc,
      [SALE_ARRIVAL_COUNTRY]: true,
    }
  }, {} as any)
  const level1 = Object.keys(level1Data)
    .filter((s) => !!s)
    .sort()
    .map((s) => [1, s,'','','','','','',''])

  const shipData = data.reduce((acc, item) => {
    const {
      SALE_DEPART_COUNTRY,
      SALE_ARRIVAL_COUNTRY,
      TOTAL_ACTIVITY_VALUE_VAT_AMT_IN_EURO,
      NET_ACTIVITY_VALUE_AMT_IN_EURO,
    } = item

    if (!SALE_DEPART_COUNTRY || !SALE_ARRIVAL_COUNTRY) return acc

    const safeDepartObject = acc[SALE_DEPART_COUNTRY]
      ? acc[SALE_DEPART_COUNTRY]
      : {}
    const safeArrivalObject = safeDepartObject[SALE_ARRIVAL_COUNTRY]
      ? safeDepartObject[SALE_ARRIVAL_COUNTRY]
      : { net: 0, vat: 0 }
    const addNet = isNaN(NET_ACTIVITY_VALUE_AMT_IN_EURO)
      ? 0
      : NET_ACTIVITY_VALUE_AMT_IN_EURO
    const addVat = isNaN(TOTAL_ACTIVITY_VALUE_VAT_AMT_IN_EURO)
      ? 0
      : TOTAL_ACTIVITY_VALUE_VAT_AMT_IN_EURO
    return {
      ...acc,
      [SALE_DEPART_COUNTRY]: {
        ...safeDepartObject,
        [SALE_ARRIVAL_COUNTRY]: {
          net: safeArrivalObject.net + addNet,
          vat: safeArrivalObject.vat + addVat,
        },
      },
    }
  }, {} as any)

  const level2 = Object.keys(shipData[HOME_COUTNRY]).sort().map((country) => [3, country, 'STANDARD', getVatRatesBy('shortcode', country), shipData[HOME_COUTNRY][country].net.toFixed(2), shipData[HOME_COUTNRY][country].vat.toFixed(2),,,])
  const level3 = Object.keys(shipData).filter((s) => s !== HOME_COUTNRY).sort().flatMap((departCountry) => {
    const departObject = shipData[departCountry]
    return Object.keys(departObject).sort().map((arrivalCountry) => {
      const { net, vat } = departObject[arrivalCountry]
      return [5, arrivalCountry, 1, departCountry, 'VAT_ID', 'STANDARD', getVatRatesBy('shortcode', arrivalCountry), net.toFixed(2), vat.toFixed(2)]
    })
  }).sort((a, b) => a[1].localeCompare(b[1]))
  return [...level1, ...level2, ...level3]
}