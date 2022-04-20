/* eslint-disable camelcase */
export interface Rate {
  Cur_Name: string
  Cur_Abbreviation: string
  Cur_ID: number
}

export async function useFetchCurrencies (currenciesId?: Set<string>) {
  const currencies: Rate[] = []

  if (currenciesId) {
    for await (const id of currenciesId.values()) {
      const response = await fetch(`https://www.nbrb.by/api/exrates/rates/${id}?parammode=2`)
      const currency = await response.json()
      const currencyRate = currency.Cur_OfficialRate / currency.Cur_Scale

      currencies.push({
        ...currency,
        Curr_Rate: currencyRate.toFixed(2),
        key: currency.Cur_ID
      })
    }
  } else {
    const response = await fetch('https://www.nbrb.by/api/exrates/rates?periodicity=0')
    const allCurrencies = await response.json()

    currencies.push(...allCurrencies)
  }

  return currencies
}
