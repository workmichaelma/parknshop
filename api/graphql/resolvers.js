const Product = require('../models/Product')
const Category = require('../models/Category')
const Brand = require('../models/Brand')

const ObjectId = require('mongoose').Types.ObjectId; 

const map = require('lodash/map')

const { addProduct, updateProducts } = require('../controller/Product')
const { fetchReport } = require('../controller/Report')

module.exports = {
  product: async ({ code, day, _id, page, filter }) => {
    const target = code ? { code } : _id ? { _id } : {}
    const itemPerPage = page === 0 ? 0 : 5
    const from = new Date(new Date().setDate(new Date().getDate() - day)).toLocaleString('en-GB', { timeZone: 'Asia/Hong_Kong' })

    const categories = filter ? map(filter.category || [], c => {
      return { categories: new ObjectId(c) }
    }) : {}
    const brands = filter ? map(filter.brand || [], c => {
      return { brands: new ObjectId(c) }
    }) : {}

    return Product
      .find(target, '-__v')
      .and(categories)
      .and(brands)
      .skip((page - 1) * itemPerPage)
      .limit(itemPerPage)
      .populate({ path: 'categories', select: '-__v -lastMod' })
      .populate({ path: 'brands', select: '-__v -lastMod' })
      .then(result => {
        return result.map(r => {
          r.records = r.records.filter(r => {
            return new Date(r.date) >= new Date(from)
          })
          return r
        })
    }).catch(err => {
      return []
    })
  },
  category: async ({ _id }) => {
    const target = _id ? {_id} : {}
    return Category.find(target, '-__v').then(categories => {
      return categories
    }).catch(err => {
      return { msg: 'No Category found' }
    });
  },
  brand: async ({ _id }) => {
    const target = _id ? {_id} : {}
    return Brand.find(target, '-__v').then(brands => {
      return brands
    }).catch(err => {
      return { msg: 'No Brand found' }
    });
  },
  report: async ({ day }) => {
    return await fetchReport(day)
  },
  addSampleProduct: async ({ code }, req) => {
    const sample = `496543 331592 112761 111405 444024 155209 328537 145700 161999 464828`.split(' ')
    return await Promise.all(await sample.map(async s => {
      return await addProduct(s)
    }))
  },
  addProduct: async ({ code }, req) => {
    return await addProduct(code)
  },
  updateProducts: async ({ }, req) => {
    return await updateProducts()
  },
  clear: async ({ }, req) => {
    return {
      Product: await Product.deleteMany({}).then(p => {
        return p.n
      }),
      Category: await Category.deleteMany({}).then(c => {
        return c.n
      }),
      Brand: await Brand.deleteMany({}).then(b => {
        return b.n
      }),
    }
  },
}