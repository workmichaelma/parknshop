const axios = require('axios')
const isEmpty = require('lodash/isEmpty')

const Product = require('../models/Product')

const { getProductCategoryIDs } = require('./Category')
const { getProductBrandIDs } = require('./Brand')

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
  fetchProduct,
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