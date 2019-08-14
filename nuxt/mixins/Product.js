import get from 'lodash/get'
import dropRight from 'lodash/dropRight'
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
      return (sum(this.pastPrices.map(record => {
        return parseFloat(get(find(record.prices, {amount: this.amount}), 'value', 0))
      })) / this.pastPrices.length).toFixed(2)
    },
  },
  created() {
    this.amount = this.amounts[0]
  }
}