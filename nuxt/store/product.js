import client from '../api/apollo-client'
import { GET_PRODUCT } from '../api/query/product.gql'

import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

export const state = () => ({
})

export const getters = {
  getProduct: (state, getters, rootState, rootGetters) => code => {
    return state[code] || {}
  },
}

export const actions = {
  async fetchProducts({ getters, rootGetters, commit }) {
    const products = await client.query({
      query: GET_PRODUCT
    })
    if (get(products, 'data.product')) {
      (products.data.product || []).forEach(p => {
        commit('saveProduct', {code: p.code, product: p})
      })
    }
  },
  async fetchProduct({ getters, rootGetters, commit }, { code }) {
    const exist = getters.getProduct(code)
    if (isEmpty(exist)) {
      const products = await client.query({
        query: GET_PRODUCT,
        variables: {
          code
        },
      })
      if (get(products, 'data.product[0].code')) {
        const p = products.data.product[0]
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
