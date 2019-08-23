import get from 'lodash/get'
import dropRight from 'lodash/dropRight'
import takeRight from 'lodash/takeRight'
import sum from 'lodash/sum'
import find from 'lodash/find'
import reduce from 'lodash/reduce'

export default {
  data() {
    return {
      amount: 1
    }
  },
  computed: {
    amounts() {
      return get(this.product.latestPrice, 'prices', []).map(p => {
        return p.amount
      })
    },
    pastPrices() {
      const dayAfter = new Date(new Date().setDate(new Date().getDate() - this.day))
      return (dropRight(this.product.records) || []).filter(record => {
        return new Date(record.date) >= dayAfter
      })
    },
    pastAveragePrice() {
      if (this.pastPrices.length > 0) {
        const records = reduce(this.pastPrices, (arr, v, k) => {
          const record = parseFloat(get(find(v.prices, { amount: this.amount }), 'value', 0))
          if (record) {
            arr.push(record)
          }
          return arr
        }, [])
        return records.length > 0 ? (sum(records) / records.length).toFixed(2) : false
      }
      return false
    },
    currentPrice() {
      return get(find(this.product.latestPrice.prices || {}, {amount: this.amount}), 'value', false)
    },
    lastPrice() {
      if (this.pastPrices.length > 0) {
        return get(find(get(takeRight(this.pastPrices, 1), '[0].prices'), {amount: this.amount}), 'value', false)
      }
      return false
    }
  },
  created() {
    this.amount = this.amounts[0]
  }
}