const Product = require('../models/Product')
const Category = require('../models/Category')
const Brand = require('../models/Brand')

const ObjectId = require('mongoose').Types.ObjectId; 

const map = require('lodash/map')
const get = require('lodash/get')

const { addProduct, updateProducts, preprocessProduct } = require('../controller/Product')
const { fetchReport } = require('../controller/Report')

module.exports = {
  product: async ({ code, day, _id, page, filter }) => {
    const target = code ? { code } : _id ? { _id } : {}
    const itemPerPage = page === 0 ? 0 : 5
    const from = new Date(new Date().setDate(new Date().getDate() - day)).toLocaleString('en-GB', { timeZone: 'Asia/Hong_Kong' })

    const categories = get(filter, 'category.length', 0) > 0 ? map(filter.category || [], c => {
      return { categories: new ObjectId(c) }
    }) || {} : {}
    const brands = get(filter, 'brand.length', 0) > 0 ? map(filter.brand || [], c => {
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
      .then(async result => {
        return result.map(r => {
          const records = r.records.filter(r => {
            return new Date(r.date) >= new Date(from)
          })
          const categories = r.categories.map(c => {
            const products = Product
            .find({ code: { "$ne": r.code }})
            .and({ categories: new ObjectId(c._id) })
            .limit(5)
            .populate({ path: 'categories', select: '-__v -lastMod' })
            .populate({ path: 'brands', select: '-__v -lastMod' })
            .then(ps => {
              return ps.map(p => preprocessProduct(p._doc))
            })
            return { ...c._doc, products }
          })
          const brands = r.brands.map(b => {
            const products = Product
            .find({ code: { "$ne": r.code }})
            .and({ brands: new ObjectId(b._id) })
            .limit(5)
            .populate({ path: 'categories', select: '-__v -lastMod' })
            .populate({ path: 'brands', select: '-__v -lastMod' })
            .then(ps => {
              return ps.map(p => preprocessProduct(p._doc))
            })
            return { ...b._doc, products }
          })
          let product = preprocessProduct(r._doc)
          return { ...product, categories, records, brands }
        })
      }).catch(err => {
        console.error(err)
        return []
    })
  },
  category: async ({ _id, title }) => {
    const target = _id ? { _id } : title ? { title } : {}
    return Category.find(target, '-__v').then(categories => {
      return categories
    }).catch(err => {
      return { msg: 'No Category found' }
    });
  },
  brand: async ({ _id }) => {
    const target = _id ? { _id } : title ? { title } : {}
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
    const sample = `496543 331592 112761 111405 444024 155209 328537 145700 161999 464828 140993 117652 139904 113599 183791 495574 460603 460605 460600 350737 346560 362608 493901 497046 497044`.split(' ')
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