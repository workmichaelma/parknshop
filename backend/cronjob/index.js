import axios from 'axios'
import { find, forEach, isEmpty, isNumber, map, reduce } from 'lodash'

import { axiosConfig, parseProducts } from './lib'

import ProductSchema from '../models/Product'
import BrandSchema from '../models/Brand'
import CategorySchema from '../models/Category'

import '../mongoose'

const url = 'https://www.parknshop.com/rest/v1/hybris/products/'

export const startCron = async (id) => {
  const products = (await fetchData(id)) || []

  try {
    if (!isEmpty(products)) {
      const brands = await getProductsBrandIds(products)
      const categories = await getProductsCategoryIds(products)

      const _products = map(products, (p) => {
        const brand = find(brands, { name: p.brand.name })
        const category = map(p.category, (c) => {
          return find(categories, { code: c.code })
        })
        return {
          ...p,
          brand,
          category,
        }
      })
      return insertProducts(_products)
    }
    return []
  } catch (err) {
    console.log(err)
    return []
  }
}

const getProductsCategoryIds = async (products) => {
  const categories = reduce(
    products,
    (arr, product) => {
      const category = product.category || []
      forEach(category, (c) => {
        if (!find(arr, c)) {
          arr.push(c)
        }
      })
      return arr
    },
    []
  )
  return Promise.all(
    map(categories, async (c) => {
      const _id = await CategorySchema.getCategoryIdOrWillCreate({
        name: c.name,
        code: c.code,
      })
      return {
        ...c,
        _id,
      }
    })
  )
}

const getProductsBrandIds = async (products) => {
  const brands = reduce(
    products,
    (arr, product) => {
      const brand = product.brand
      if (!find(arr, brand)) {
        arr.push(brand)
      }
      return arr
    },
    []
  )
  return Promise.all(
    map(brands, async (b) => {
      const _id = await BrandSchema.getBrandIdOrWillCreate({
        name: b.name,
        image: b.image,
      })
      return {
        ...b,
        _id,
      }
    })
  )
}

const insertProducts = async (products) => {
  const calls = await map(products, async (p) => {
    return ProductSchema.saveProduct(p)
  })

  return Promise.all(calls)
}

const fetchData = async (id, page = 0, _products = []) => {
  try {
    const { data } = await axios.get(
      `${url}${id}?currentPage=${page}&query=%3AigcBestSeller&type=Cat&pageSize=100`,
      axiosConfig
    )
    const { products, pagination } = data
    const arr = [..._products, ...parseProducts({ products, defaultCat: id })]

    if (isNumber(pagination?.totalPages) && pagination?.totalPages - 1 > page) {
      return fetchData(id, page + 1, arr)
    }

    return arr
  } catch (err) {
    console.log(err, 'fetchData')
    return []
  }
}
