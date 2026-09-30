import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Exercise the store snapshot without needing a browser or mounting a component.
vi.mock('react', () => ({
  useSyncExternalStore: (_subscribe: unknown, getSnapshot: () => unknown) => getSnapshot(),
}))

const defaultVatIds = { CZ: '', DE: '', ES: '', FR: '', IE: '', IT: '', PL: '' }

describe('useVATId', () => {
  const getItem = vi.fn()
  const setItem = vi.fn()

  beforeEach(() => {
    vi.resetModules()
    getItem.mockReset()
    setItem.mockReset()
    vi.stubGlobal('localStorage', { getItem, setItem })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('includes Ireland for new users', async () => {
    getItem.mockReturnValue(null)
    const { useVATId } = await import('./useVATId')

    expect(useVATId()[0]).toEqual(defaultVatIds)
    expect(getItem).toHaveBeenCalledWith('vat-ids')
  })

  it('adds Ireland while preserving existing saved VAT IDs and custom countries', async () => {
    getItem.mockReturnValue(JSON.stringify({ DE: 'DE123456789', AT: 'ATU12345678' }))
    const { useVATId } = await import('./useVATId')

    expect(useVATId()[0]).toEqual({ ...defaultVatIds, DE: 'DE123456789', AT: 'ATU12345678' })
  })

  it('preserves a saved Irish VAT ID and keeps the snapshot stable', async () => {
    getItem.mockReturnValue(JSON.stringify({ IE: 'IE1234567T' }))
    const { useVATId } = await import('./useVATId')
    const [vatIds, setVatIds] = useVATId()

    expect(vatIds.IE).toBe('IE1234567T')
    expect(useVATId()[0]).toBe(vatIds)
    setVatIds(vatIds)
    expect(setItem).toHaveBeenCalledWith('vat-ids', JSON.stringify(vatIds))
  })
})
