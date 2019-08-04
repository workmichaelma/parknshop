const takeRight = require('lodash/takeRight')
const initial = require('lodash/initial')
const every = require('lodash/every')
const find = require('lodash/find')
const isEmpty = require('lodash/isEmpty')
const sum = require('lodash/sum')

module.exports = {
  fetchReport: async (day = 7) => {
    const products = await Product.find()
    let report = []
    try {
      report = products.map(product => {
        let records = takeRight(product.records, day)
        const latest = takeRight(records, 1)[0]
        records = initial(records)
        return latest.prices.map(p => {
          const amount = p.amount
          const history = records.map(record => {
            const r = find(record.prices, { amount })
            return r ? r.value : false
          }).filter(v => { return v !== false })
          
          const isCheapest = every(history, h => { return p.value < h })
          return isCheapest ? {
            product,
            record: p,
            average: (sum(history.map(h => parseFloat(h))) / history.length).toFixed(2)
          } : false
        }).filter(p => {
          return p
        })
      }).filter(p => {
        return !isEmpty(p)
      }).map(product => {
        const records = product.map(p => {
          return { amount: p.record.amount, value: parseFloat(p.record.value), average: p.average }
        })
        return {
          product: product[0].product,
          records,
        }
      })
    } catch (err) {
      console.error(err)
    }
    return report
  }
}