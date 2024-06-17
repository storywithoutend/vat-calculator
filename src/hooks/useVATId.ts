import { sortObjectProperties } from "@/utils/sortObjectProperties"
import { useSyncExternalStore } from "react"

export type VATIds = Record<string, string>

const store = {
  getSnapshot: () => {
    const vatIds = localStorage.getItem('vat-ids')
    return vatIds ? sortObjectProperties(JSON.parse(vatIds)) : {}
  },
  subscribe: (listener: () => void) => {
    window.addEventListener('storage', listener)
    return () => window.removeEventListener('storage', listener)
  }
}

export const useVATId = () => {
  const vatIds = useSyncExternalStore(store.subscribe, store.getSnapshot)
  const setVatIds = (value: VATIds) => localStorage.setItem('vat-ids', JSON.stringify(value))
  return [vatIds, setVatIds]
}