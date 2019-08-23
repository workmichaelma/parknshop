export const state = () => ({
  active: true
})

export const getters = {
  isActive: state => state.active
}

export const actions = {
  setActive({ getters, rootGetters, commit }, v) {
    commit('setActive', v)
  },
}

export const mutations = {
  setActive(state, v) {
    state.active = v
  }
}
