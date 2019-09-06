import client from '../api/apollo-client'
import { SEARCH_PRODUCT } from '~/api/query/search.gql'

import get from 'lodash/get'

import { preprocessProduct } from '~/util/Product'
export const state = () => {}

export const getters = {
  getSearchResult: (state) => keywords => {
    return state[keywords]
  }
}

export const actions = {
  async fetchSearchResult({ getters, rootGetters, commit }, { keywords, page }) {
    page = page || 0
    const products = await client.query({
      query: SEARCH_PRODUCT,
      variables: {
        keywords,
        page
      },
    })
    if (get(products, 'data.product')) {
      (products.data.product || []).forEach(p => {
        preprocessProduct(p)
        commit('saveProduct', { keywords, product: p })
      })
      return products
    }
    return null
  }
}

export const mutations = {
  saveProduct(state, { keywords, product }) {
    if (state[keywords]) {
      state[keywords].push(product)
    } else {
      state[keywords] = [product]
    }
  }
}
