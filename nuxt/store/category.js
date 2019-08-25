import client from '../api/apollo-client'
import { GET_CATEGORY } from '../api/query/category.gql'
import { GET_PRODUCT } from '../api/query/product.gql'

import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import find from 'lodash/find'

import { preprocessProduct } from '~/util/Product'

export const state = () => []

export const getters = {
  getCategory: (state, getters, rootState, rootGetters) => ({ _id, code, title }) => {
    const query = code ? { code } : title ? { title } : _id ? { _id } : false
    return query ? find(state, query) : false
  },
  getAllCategory: (state) => {
    return state
  }
}

export const actions = {
  async fetchProducts({ getters, rootGetters, commit, dispatch }, { code, title, _id, page = 0 }) {
    await dispatch('fetchCategory', { title, _id })
    const category = getters.getCategory({ code, title, _id })
    if (category) {
      const ProductFilter = { brand: [], category: [category._id] }
      const products = await client.query({
        query: GET_PRODUCT,
        variables: {
          ProductFilter,
          page
        }
      })
      if (get(products, 'data.product')) {
        (products.data.product || []).forEach(p => {
          preprocessProduct(p)
          commit('product/saveProduct', { code: p.code, product: p }, { root: true })
          commit('updateCategory', { code: category.code, product: p.code })
        })
      }
    }
  },
  async fetchCategory({ getters, rootGetters, commit }, { title, _id }) {
    const exist = getters.getCategory({ title, _id })
    if (!exist) {
      const category = await client.query({
        query: GET_CATEGORY,
        variables: {
          title
        }
      })
      if (get(category, 'data.category[0]')) {
        commit('saveCategory', { profile: category.data.category[0] })
      }      
    }
  },
}

export const mutations = {
  saveCategory(state, profile) {
    if (!find(state, { code: profile.code })) {
      state.push({
        ...profile,
        products: []
      })
    }
  },
  updateCategory(state, { code, product }) {
    const index = findIndex(state, { code })
    state[index].products.push(product)
  }
}
