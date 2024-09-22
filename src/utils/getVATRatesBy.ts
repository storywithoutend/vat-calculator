const list = [
  ["Belgium", "BE", "Belgium", 0.21],
  ["Bulgaria", "BG", "Bulgaria", 0.2],
  ["Czechia", "CZ", "Czechia", 0.21],
  ["Denmark", "DK", "Denmark", 0.25],
  ["Germany", "DE", "Germany", 0.19],
  ["Estonia", "EE", "Estonia", 0.22],
  ["Ireland", "IE", "Ireland", 0.23],
  ["Greece", "EL", "Greece", 0.24],
  ["Spain", "ES", "Spain", 0.21],
  ["France", "FR", "France", 0.2],
  ["Croatia", "HR", "Croatia", 0.25],
  ["Italy", "IT", "Italy", 0.22],
  ["Cyprus", "CY", "Cyprus", 0.19],
  ["Latvia", "LV", "Latvia", 0.21],
  ["Lithuania", "LT", "Lithuania", 0.21],
  ["Luxembourg", "LU", "Luxembourg", 0.17],
  ["Hungary", "HU", "Hungary", 0.27],
  ["Malta", "MT", "Malta", 0.18],
  ["Netherlands", "NL", "Netherlands", 0.21],
  ["Austria", "AT", "Austria", 0.2],
  ["Poland", "PL", "Poland", 0.23],
  ["Portugal", "PT", "Portugal", 0.23],
  ["Romania", "RO", "Romania", 0.19],
  ["Slovenia", "SI", "Slovenia", 0.22],
  ["Slovakia", "SK", "Slovakia", 0.2],
  ["Finland", "FI", "Finland", 0.24],
  ["Sweden", "SE", "Sweden", 0.25],
  ["United Kingdom", "GB", "United Kingdom", 0.2],
  ["Northern Ireland", "XI", "United Kingdom", 0.2],
] as const

export const getVatRatesBy = (id: 'country' | 'shortcode' ,value: string): number => {
  const row = list.find((item) => id === 'country' ? item[0] === value : item[1] === value)
  if (!row) {
    if (process.env.NODE_ENV === 'development') console.error(`No VAT rate found for ${id} ${value}`)
    return 0
  }
  return row[3]
}

export const formatVatRate = (vatRate: number) => (vatRate * 100).toFixed(2)