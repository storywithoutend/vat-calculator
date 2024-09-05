import { InvoiceItem } from "../invoice/invoiceSchema";

export type VatIds = {
  [key: string]: string
}

export type ReturnType = {
  data: VatIds
  errors: string[]
}

export const makeVatIdList = ({invoiceItems}: {invoiceItems: InvoiceItem[]}): ReturnType => {
  return invoiceItems.reduce<ReturnType>((acc, { arrivalCountry, sellerVatNumber}) => {
    console.log('acc', acc, arrivalCountry, sellerVatNumber)
    if (!acc.data[arrivalCountry] && !!sellerVatNumber) return {
      ...acc,
      data: { ...acc.data, [arrivalCountry]: sellerVatNumber },
    }
    if (sellerVatNumber && acc.data[arrivalCountry] !== sellerVatNumber) return { ...acc, errors: [...acc.errors, `duplicate vat id for ${arrivalCountry}`] }
    return acc
  }, {
    data: {},
    errors: []
  })
}