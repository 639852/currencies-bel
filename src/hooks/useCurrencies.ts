import { Ref, ref } from 'vue'
import { Rate, useFetchCurrencies } from './useFetchCurrencies'

export interface Option {
  value: string
}

export function useCurrencies (
  allCurrenciesString: string | null,
  currenciesAbbrString: string | null,
  spinning: Ref<boolean>
) {
  const value = JSON.stringify(['USD', 'EUR', 'RUB'])

  if (!allCurrenciesString) {
    const response = useFetchCurrencies()
    spinning.value = true

    response.then((value) => {
      localStorage.setItem('allCurrencies', JSON.stringify(value))
      spinning.value = false
    })
  }
  if (!currenciesAbbrString) {
    localStorage.setItem('currenciesAbbr', value)
  }

  const allCurrencies: Rate[] = JSON.parse(allCurrenciesString || '[]')
  const currenciesAbbr = ref<Set<string>>(
    new Set(JSON.parse(currenciesAbbrString || value))
  )

  const currencyNames = ref<Option[]>(
    Array.from<string>(new Set(
      allCurrencies.map((currency) =>
        currency.Cur_Name
      )
    )).map((currency) => ({ value: currency }))
  )
  const options = ref(currencyNames.value)

  return { allCurrencies, currenciesAbbr, currencyNames, options }
}
