import { Ref } from 'vue'
import { Rate, useFetchCurrencies } from './useFetchCurrencies'

export function useSelect (
  allCurrencies: Rate[],
  currenciesAbbr: Ref<Set<string>>,
  currencies: Ref<Rate[]>,
  value: Ref<string>,
  spinning: Ref<boolean>
) {
  return {
    onSelect (input: string) {
      const currencyName = allCurrencies.find((currency) =>
        currency.Cur_Name === input
      )?.Cur_Abbreviation || ''
      const newCurrenciesString = localStorage.getItem('currenciesAbbr')
      const newCurrencies = JSON.parse(newCurrenciesString || '[]')

      if (newCurrencies.includes(currencyName)) return
      newCurrencies.push(currencyName)

      localStorage.setItem('currenciesAbbr', JSON.stringify(newCurrencies))
      currenciesAbbr.value.add(currencyName)

      const response = useFetchCurrencies(new Set([currencyName]))
      spinning.value = true

      response.then((value) => {
        const newCurrenciesString = localStorage.getItem('currencies')
        const newCurrencies = JSON.parse(newCurrenciesString || '[]')
        newCurrencies.push(...value)

        localStorage.setItem('currencies', JSON.stringify(newCurrencies))
        currencies.value.push(...value)
        spinning.value = false
      })

      value.value = ''
    }
  }
}
