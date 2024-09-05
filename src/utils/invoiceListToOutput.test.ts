import { invoiceListToOutput } from './invoiceListToOutput';
import { describe, it, expect } from 'vitest';
import { fileTeInvoice } from './fileToInvoice/fileToInvoice';
import fileItems from '@/../test/data/fileItems.json'

describe('invoiceListToOutput', () => {

  it('should generate output', async () => {
    const invoiceItems = (fileItems as any).map(fileTeInvoice)
    const output = invoiceListToOutput({ invoiceItems })
  })

})