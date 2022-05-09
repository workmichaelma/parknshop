const { map, isEmpty } = require('lodash')
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema
import moment from 'moment'

import BrandSchema from './Brand'
import CategorySchema from './Category'

const SaleSchema = new Schema(
  {
    price: Number,
    remark: String,
    start: String,
    end: String,
  },
  { _id: false }
)

const PriceSchema = new Schema(
  {
    price: Number,
    sales: [SaleSchema],
    date: String,
  },
  { _id: false }
)

const ProductSchema = new Schema({
  name: String,
  code: String,
  url: String,
  image: String,
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
  },
  unitSize: String,
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  prices: [PriceSchema],
})

ProductSchema.plugin(mongoosePaginate)

const buildProduct = async (product) => {
  const {
    name,
    code,
    url,
    price,
    image,
    brand,
    unitSize,
    category,
    sales = [],
  } = product

  return {
    name,
    code,
    url,
    image,
    brand,
    unitSize,
    category,
    prices: [
      {
        price,
        date: moment().add(8, 'h').format('YYYY-MM-DD'),
        sales: map(sales, (s) => {
          return {
            price: s.avg,
            remark: `買${s.quantity}件 $${s.price}`,
            start: s.start,
            end: s.end,
          }
        }),
      },
    ],
  }
}

ProductSchema.statics.saveProduct = async (p) => {
  try {
    const { name, code } = p

    if (name && code) {
      const product = await buildProduct(p)
      const record = (await Product.findOne({ code })) || {}
      if (record._id) {
        return Product.findOneAndUpdate(
          { _id: record._id },
          { prices: [...(product.prices || []), ...(record.prices || [])] },
          { new: true }
        )
      } else {
        return Product.create(product)
      }
    }
    return {}
  } catch (err) {
    console.log(`Save Product Failed, ${p?.code}`, err)
    return {}
  }
}

ProductSchema.statics.getProduct = async ({ code }) => {
  try {
    return Product.findOne({ code })
      .populate([
        { path: 'category', model: CategorySchema },
        { path: 'brand', model: BrandSchema },
      ])
      .lean()
  } catch (err) {
    console.log(`Get Product Failed, ${code}`, err)
    return {}
  }
}

ProductSchema.statics.getProducts = async ({
  page = 1,
  brandId,
  brandName,
  categoryId,
}) => {
  try {
    let obj = {}
    if (brandId) {
      obj = {
        brand: brandId,
      }
    }
    if (brandName) {
      const _id = await BrandSchema.getBrandIdOrWillCreate({
        name: brandName,
      })
      obj = {
        ...obj,
        brand: _id,
      }
    }
    if (categoryId) {
      obj = {
        category: {
          $in: [categoryId],
        },
      }
    }
    if (!isEmpty(obj)) {
      return Product.paginate(obj, {
        page,
        limit: 20,
        lean: true,
        populate: [
          { path: 'category', model: CategorySchema },
          { path: 'brand', model: BrandSchema },
        ],
      })
    } else {
      return []
    }
  } catch (err) {
    console.log(`Get Products Failed, ${code}`, err)
    return {}
  }
}

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product
