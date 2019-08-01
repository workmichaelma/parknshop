const Product = require('../models/Product')
const Category = require('../models/Category')
const Brand = require('../models/Brand')

const axios = require('axios')
const ObjectId = require('mongoose').Types.ObjectId; 

const isEmpty = require('lodash/isEmpty')
const map = require('lodash/map')


const fetchProduct = async (id, detail = false) => {
  const need = detail ? '/true' : ''
  return await axios.get(`http://crawler:8082/${id}${need}`).then(async (response) => {
    return response.data
  }).catch(err => {
    console.error(err)
    return null
  })
}

const addProduct = async (code) => {
  return await Product.find({ code }).then(async products => {
    try {
      if (isEmpty(products) && code) {
        const product = await fetchProduct(code, true)
        if (product) {
          const categories = await getProductCategoryIDs(product.categories)
          const brands = await getProductBrandIDs(product.brands)
          const newProduct = new Product({
            code: product.code,
            title: product.title,
            image: product.image,
            categories,
            brands,
            records: [
              {
                date: product.timestamp,
                prices: product.prices
              }
            ]
          })
          return await newProduct.save()
        }
      }
      throw new Error(`No product inserted! ${code} is already exist!`)
    } catch (err) {
      return err
    }
  })
}

const updateProduct = async (p) => {
  return await Product.findOneAndUpdate({ code: p.code }, {
    new: true,
    $addToSet: {
      records: {
        date: p.timestamp,
        prices: p.prices
      },
    },
  })
}

const getProductCategoryIDs = async (categories) => {
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
const getProductBrandIDs = async (brands) => {
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

module.exports = {
  product: async ({ code, _id, page, filter }) => {
    const target = code ? { code } : _id ? { _id } : {}
    const itemPerPage = page === 0 ? 0 : 5

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
      .then(products => {
      return products
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
  addSampleProduct: async ({ code }, req) => {
    const sample = `496543 331592 112761 111405 444024 155209 328537 145700 161999 464828`.split(' ')
    return await Promise.all(await sample.map(async s => {
      return await addProduct(s)
    }))
  },
  addProduct: async ({ code }, req) => {
    return await addProduct(code)
  },
  updateProducts: async ({}, req) => {
    try {
      return await Product.find().then(async products => {
        return await Promise.all(products.map(async p => {
          const product = await fetchProduct(p.code)
          const newProduct = await updateProduct(product)
          if (!newProduct._id) {
            throw new Error("Product does not updated!")
          } else {
            return newProduct
          }
        }))
      })
    } catch (err) {
      return err
    }
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