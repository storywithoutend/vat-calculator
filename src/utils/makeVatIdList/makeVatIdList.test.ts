import { describe, it, expect } from 'vitest';

import { makeVatIdList } from './makeVatIdList';

describe('makeVatIdList', () => {
    it('should generate a list of VAT IDs', async () => {
      const invoiceItems: any[] = [
        {
          sellerVatNumber: 'DE123456789',
          arrivalCountry: 'DE',
        },
        {
          sellerVatNumber: 'AT987654321',
          arrivalCountry: 'AT',
        }
      ]
      const vatIds = makeVatIdList({ invoiceItems })
      expect(vatIds.data).toEqual({
        DE: 'DE123456789',
        AT: 'AT987654321',
      })
    })

    it('should be okay with same data', async () => {
      const invoiceItems: any[] = [
        {
          sellerVatNumber: 'DE123456789',
          arrivalCountry: 'DE',
        },
        {
          sellerVatNumber: 'DE123456789',
          arrivalCountry: 'DE',
        }
      ]
      const vatIds = makeVatIdList({ invoiceItems })
      expect(vatIds.data).toEqual({
        DE: 'DE123456789',
      })
      expect(vatIds.errors).toEqual([])
    })

    it('should be show error if duplicate info', async () => {
      const invoiceItems: any[] = [
        {
          sellerVatNumber: 'DE123456789',
          arrivalCountry: 'DE',
        },
        {
          sellerVatNumber: 'DE123456788',
          arrivalCountry: 'DE',
        }
      ]
      const vatIds = makeVatIdList({ invoiceItems })
      expect(vatIds.data).toEqual({
        DE: 'DE123456789',
      })
      expect(vatIds.errors).toEqual(['duplicate vat id for DE'])
    })
})