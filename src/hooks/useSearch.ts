import { Ref } from 'vue'
import { Option } from './useCurrencies'

export function useSearch (options: Ref<Option[]>, currencyNames: Ref<Option[]>) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function debounce<T extends Function> (fn: T, wait: number) {
    let timeout: number

    return function (this: T, ...args: unknown[]) {
      clearTimeout(timeout)

      timeout = setTimeout(() =>
        fn.apply(this, args), wait
      )
    }
  }

  function searchValue (input: string) {
    options.value = input
      ? currencyNames.value.filter((currency) =>
        currency.value.toLowerCase()
          .includes(input.toLowerCase())
      )
      : currencyNames.value
  }

  return { onSearch: debounce(searchValue, 400) }
}
