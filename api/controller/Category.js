const Category = require('../models/Category')
const isEmpty = require('lodash/isEmpty')

module.exports = {
  getProductCategoryIDs: async (categories) => {
    return await Promise.all(await categories.map(async c => {
      return await Category.find({ code: c.code }).then(async record => {
        if (isEmpty(record)) {
          const newCategory = new Category(c)
          const result = await newCategory.save()
          return result._id || null
        } else {
          return record[0]._id
        }
      })
    }))
  }
}
