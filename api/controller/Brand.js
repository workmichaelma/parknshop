const Brand = require('../models/Brand')
const isEmpty = require('lodash/isEmpty')

module.exports = {
  getProductBrandIDs: async (brands) => {
    return await Promise.all(await brands.map(async b => {
      return await Brand.find({ code: b.code }).then(async record => {
        if (isEmpty(record)) {
          const newBrand = new Brand(b)
          const result = await newBrand.save()
          return result._id || null
        } else {
          return record[0]._id
        }
      })
    }))
  }
}