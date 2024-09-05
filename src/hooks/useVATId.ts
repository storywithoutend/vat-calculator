import { VatIds } from "@/utils/makeVatIdList/makeVatIdList"
import { sortObjectProperties } from "@/utils/sortObjectProperties"
import { useSyncExternalStore } from "react"

export type VATIds = Record<string, string>

const isSame = (a: VATIds, b: VATIds) => {
  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every((key) => a[key] === b[key])
}

const DEFAULT_VAT_IDS: VATIds = {
  "CZ": "",
  "DE": "",
  "ES": "",
  "FR": "",
  "IT": "",
  "PL": "",
}

let vatIds = DEFAULT_VAT_IDS

const store = {
  getSnapshot: () => {
    try {
      const data = localStorage.getItem('vat-ids')
      if (!data) return vatIds

      // TODO: Add validation here
      if (!isSame(vatIds, JSON.parse(data))) vatIds = sortObjectProperties(JSON.parse(data))
      return vatIds
    } catch {
      return vatIds
    }
  },
  subscribe: (listener: () => void) => {
    window.addEventListener('storage', listener)
    return () => window.removeEventListener('storage', listener)
  }
}

export const useVATId = () => {
  const _vatIds = useSyncExternalStore(store.subscribe, store.getSnapshot, () => vatIds)
  const setVatIds = (value: VATIds) => localStorage.setItem('vat-ids', JSON.stringify(value))
  return [_vatIds, setVatIds] as [VATIds, (value: VATIds) => void]
}
