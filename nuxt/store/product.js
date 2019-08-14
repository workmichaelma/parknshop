import client from '../api/apollo-client'
import { GET_PRODUCT } from '../api/query/product.gql'

import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import { preprocessProduct } from '~/util/Product'

export const state = () => ({
})

export const getters = {
  getProduct: (state, getters, rootState, rootGetters) => code => {
    return state[code] || {}
  },
  getAllProduct: (state) => {
    return state
  }
}

export const actions = {
  async fetchProducts({ getters, rootGetters, commit }, { page, day }) {
    page = page || 0
    day = day || 7
    const products = await client.query({
      query: GET_PRODUCT,
      variables: {
        page
      }
    })
    if (get(products, 'data.product')) {
      (products.data.product || []).forEach(p => {
        preprocessProduct(p)
        commit('saveProduct', {code: p.code, product: p})
      })
    }
  },
  async fetchProduct({ getters, rootGetters, commit }, { code, day }) {
    const exist = getters.getProduct(code)
    if (isEmpty(exist)) {
      day = day || 7
      const products = await client.query({
        query: GET_PRODUCT,
        variables: {
          code
        },
      })
      if (get(products, 'data.product[0].code')) {
        const p = products.data.product[0]
        preprocessProduct(p)
        commit('saveProduct', { code: p.code, product: p })
      }
    }
  },
}

export const mutations = {
  saveProduct(state, { code, product }) {
    state[code] = product
  }
}
