const EXCHANGE_RATE_TABLE = {
  EUR: 1,
  GBP: 0.85873,
  PLN: 4.3648,
  SEK: 11.2834,
  CZK: 24.716,
} as const

type ExchangeRateCountry = keyof typeof EXCHANGE_RATE_TABLE

export const getExchangeRate = (from: 'EUR', to: ExchangeRateCountry) => {
  if (from === 'EUR') return 1 / EXCHANGE_RATE_TABLE[to]
  return 1
}