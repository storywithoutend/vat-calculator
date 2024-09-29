import { useQueries } from "@tanstack/react-query"
import { getStartAndEndPeriodFromFinancialQuarter } from "./utils/getStartAndEndPeriodFromFinancialQuarter"

type ExchangeRateTable = {
  CZK: number
  GBP: number
  PLN: number
  SEK: number
}

export type UseExchangeRatesReturnType = {
  financialQuarter: string,
  exchangeRates: ExchangeRateTable
}

const fetchExchangeRate = async ({
  queryKey,
}: any): Promise<UseExchangeRatesReturnType> => {
  const financialQuarter = queryKey?.[1]

  const searchPeriods =
    getStartAndEndPeriodFromFinancialQuarter(financialQuarter)
  if (!searchPeriods) throw new Error("Invalid financial quarter")

  const url = new URL(
    "https://data-api.ecb.europa.eu/service/data/EXR/D.CZK+GBP+PLN+SEK.EUR.SP00.A",
  )
  url.searchParams.set("startPeriod", searchPeriods.startPeriod)
  url.searchParams.set("endPeriod", searchPeriods.endPeriod)
  url.searchParams.set("format", "jsondata")

  const result = await fetch(url)
  const data = await result.json()
  const exchangeRates = data.dataSets?.[0].series

  return {
    financialQuarter,
    exchangeRates: {
      CZK: exchangeRates["0:0:0:0:0"].observations?.[0]?.[0],
      GBP: exchangeRates["0:1:0:0:0"].observations?.[0]?.[0],
      PLN: exchangeRates["0:2:0:0:0"].observations?.[0]?.[0],
      SEK: exchangeRates["0:3:0:0:0"].observations?.[0]?.[0],
    },
  }
}

export const useExchangeRate = ({
  financialQuarters = [],
}: {
  financialQuarters: string[]
}) => {
  const query = useQueries({
    queries: financialQuarters.map((financialQuarter) => ({
      queryKey: ["exchangeRate", financialQuarter],
      queryFn: fetchExchangeRate,
      staleTime: Infinity
    })),
  })
  return query
}
