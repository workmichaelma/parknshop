import client from '../api/apollo-client'
import { GET_PRODUCT } from '../api/query/index.gql'

import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import { preprocessProduct } from '~/util/Product'

export const state = () => []

export const getters = {
  getAllProduct: (state) => {
    return state
  }
}

export const actions = {
  async fetchProducts({ getters, rootGetters, commit }, { page }) {
    page = page || 0
    const products = await client.query({
      query: GET_PRODUCT,
      variables: {
        page,
        day: 7,
      }
    })
    if (get(products, 'data.product')) {
      (products.data.product || []).forEach(p => {
        preprocessProduct(p)
        commit('saveProduct', { code: p.code, product: p })
      })
    }
  }
}

export const mutations = {
  saveProduct(state, { code, product }) {
    const index = findIndex(state, { code })
    if (index < 0) {
      state.push(product)
    } else {
      state[index] = product
    }
  }
}
