import { Ref, ref } from 'vue'
import { Rate } from './useFetchCurrencies'

export function useTable (currencies: Ref<Rate[]>) {
  const selected = ref(true)
  const rowKeys = ref<number[]>([])

  const columns = [
    {
      title: 'Код',
      dataIndex: 'Cur_Abbreviation',
      key: 'Cur_Abbreviation'
    },
    {
      title: 'Название',
      dataIndex: 'Cur_Name',
      key: 'Cur_Name'
    },
    {
      title: 'Курс',
      dataIndex: 'Curr_Rate',
      key: 'Curr_Rate'
    }
  ]

  const rowSelection = ref({
    checkStrictly: false,
    onChange (selectedRowKeys: number[]) {
      rowKeys.value = selectedRowKeys
    },
    onSelect (_: Rate, select: boolean) {
      selected.value = !select
    },
    onSelectAll (select: boolean) {
      selected.value = !select
    }
  })

  function removeCurrencies () {
    const newCurrencies = currencies.value.filter((currency) =>
      !rowKeys.value.includes(currency.Cur_ID)
    )
    const newCurrenciesAbbr = newCurrencies.map((currency) =>
      currency.Cur_Abbreviation
    )

    localStorage.setItem('currencies', JSON.stringify(newCurrencies))
    localStorage.setItem('currenciesAbbr', JSON.stringify(newCurrenciesAbbr))

    currencies.value = newCurrencies
    selected.value = true
  }

  return {
    selected,
    rowKeys,
    columns,
    rowSelection,
    removeCurrencies
  }
}
