import get from 'lodash/get'
import dropRight from 'lodash/dropRight'
import takeRight from 'lodash/takeRight'
import sum from 'lodash/sum'
import find from 'lodash/find'

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
      return this.pastPrices.length > 0 ? (sum(this.pastPrices.map(record => {
        return parseFloat(get(find(record.prices, {amount: this.amount}), 'value', 0))
      })) / this.pastPrices.length).toFixed(2) : false
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