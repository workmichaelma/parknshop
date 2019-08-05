import client from '../api/apollo-client'
import { GET_PRODUCT } from  '../api/query/product.gql'

export const state = () => ({
  report: []
})

export const getters = {
}

export const mutations = {
}

export const actions = {
  async fetchReport({ getters, rootGetters, commit }) {
    const result = await client.query({
      query: GET_PRODUCT
    })
    console.error(result)
  },
}
