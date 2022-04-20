<template>
  <a-spin tip="Loading..." :spinning="spinning" size="large">
    <a-auto-complete
      placeholder="Введите название валюты"
      v-model:value="value"
      :options="options"
      @search="onSearch"
      @select="onSelect"
    />
    <a-button
      :disabled="selected"
      @click="removeCurrencies"
    >
      Удалить
    </a-button>
    <a-table
      :dataSource="currencies"
      :columns="columns"
      :rowSelection="rowSelection"
    />
  </a-spin>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useFetchCurrencies, Rate } from './hooks/useFetchCurrencies'
import { useCurrencies } from './hooks/useCurrencies'
import { useSearch } from './hooks/useSearch'
import { useSelect } from './hooks/useSelect'
import { useTable } from './hooks/useTable'

export default defineComponent({
  name: 'App',
  setup () {
    const allCurrenciesString = localStorage.getItem('allCurrencies')
    const currenciesAbbrString = localStorage.getItem('currenciesAbbr')
    const currencies = ref<Rate[]>([])
    const value = ref('')
    const spinning = ref(false)

    const {
      allCurrencies,
      currenciesAbbr,
      currencyNames,
      options
    } = useCurrencies(allCurrenciesString, currenciesAbbrString, spinning)
    const { onSearch } = useSearch(options, currencyNames)
    const { onSelect } = useSelect(
      allCurrencies,
      currenciesAbbr,
      currencies,
      value,
      spinning
    )
    const {
      selected,
      rowKeys,
      columns,
      rowSelection,
      removeCurrencies
    } = useTable(currencies)

    onMounted(() => {
      const response = useFetchCurrencies(currenciesAbbr.value)
      spinning.value = true

      response.then((value) => {
        localStorage.setItem('currencies', JSON.stringify(value))
        currencies.value = value
        spinning.value = false
      })
    })

    return {
      currenciesAbbr,
      currencies,
      options,
      onSearch,
      onSelect,
      value,
      columns,
      rowSelection,
      selected,
      rowKeys,
      removeCurrencies,
      spinning
    }
  }
})
</script>

<style>
body {
  padding: 15px;
  background: #333639;
  color: #fff;
}

h1, h2, h3, h4, h5, h6 {
  color: inherit;
}

ul {
  display: flex;
  gap: 15px;
  list-style: none;
}

.ant-select {
  display: block;
  width: 290px;
  margin-bottom: 15px;
}

.ant-select:not(
  .ant-select-customize-input
) .ant-select-selector {
  height: 42px;
  align-items: center;
}

.ant-select-selection-search {
  display: flex;
  align-items: center;
}

.ant-btn {
  margin-bottom: 15px;
}

@media (max-width: 425px) {
  .ant-table tr > .ant-table-cell {
    padding: 8px;
  }
}
</style>
