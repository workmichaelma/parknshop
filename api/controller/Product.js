const axios = require('axios')
const isEmpty = require('lodash/isEmpty')
const find = require('lodash/find')
const get = require('lodash/get')

const Product = require('../models/Product')

const { getProductCategoryIDs } = require('./Category')
const { getProductBrandIDs } = require('./Brand')

const previewProduct = async ({ code, url }) => {
  const query = code ? `code/${code}` : url ? `url/${url}` : false
  if (query) {
    return await axios.get(`http://crawler:8082/${query}`).then(async (response) => {
      return response.data
    }).catch(err => {
      console.error(err)
      return null
    })
  }
  return null
}

const fetchSale = (product) => {
  let sale = []
  try {
    if (product.records.length > 1) {
      const latest = get(product.records[product.records.length - 1], 'prices')
      const prev = get(product.records[product.records.length - 2], 'prices')
      sale = latest.map(p => {
        const prevPrice = get(find(prev, { amount: p.amount }), 'value')
        return prevPrice ? (parseFloat(prevPrice) > parseFloat(p.value) ? p.amount : false) : p.amount
      }).filter(p => {
        return p !== false
      })
    }
  } catch (err) {
    console.log(err)
  }
  return sale
}

const fetchProduct = async (id, detail = false) => {
  const need = detail ? '/true' : ''
  return await axios.get(`http://crawler:8082/${id}${need}`).then(async (response) => {
    return response.data
  }).catch(err => {
    console.error(err)
    return null
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

module.exports = {
  preprocessProduct: product => {
    product.sale = fetchSale(product)
    return product
  },
  fetchProduct,
  previewProduct,
  addProduct: async (code) => {
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
        console.error(err)
        return err
      }
    })
  },
  updateProduct,
  updateProducts: async () => {
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
}