import client from '../api/apollo-client'
import { GET_PRODUCT } from '../api/query/index.gql'
import { GET_BRAND } from '~/api/query/brand.gql'

import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import { preprocessProduct } from '~/util/Product'

export const state = () => { }

export const getters = {
  getAllProduct: (state) => brand => {
    return get(state, `[${brand}].products`)
  }
}

export const actions = {
  async fetchProducts({ getters, rootGetters, commit, state }, { page, title }) {
    page = page || 0
    let _id = ''
    if (!get(state, `[${title}]._id`)) {
      const brand = await client.query({
        query: GET_BRAND,
        variables: {
          title
        }
      })
      _id = get(brand, 'data.brand[0]._id')
    } else {
      _id = state[title]._id
    }
    if (_id) {
      const products = await client.query({
        query: GET_PRODUCT,
        variables: {
          page,
          day: 7,
          ProductFilter: {
            brand: [_id],
            category: []
          }
        }
      })
      if (get(products, 'data.product')) {
        (products.data.product || []).forEach(p => {
          preprocessProduct(p)
          commit('saveProduct', { title, _id, product: p })
        })
      }
    }
  }
}

export const mutations = {
  saveProduct(state, { title, _id, product }) {
    if (state[title]) {
      state[title].products.push(product)
    } else {
      state[title] = {
        _id,
        products: [product]
      }
    }
  }
}
