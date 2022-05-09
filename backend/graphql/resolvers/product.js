import { getProduct, getProducts } from '../../models/Product'

module.exports = {
  Query: {
    product: async (obj, args, context, info) => {
      if (obj) return obj
      return getProduct(args)
    },
    products: async (obj, args, context, info) => {
      return getProducts(args)
    },
  },
}
