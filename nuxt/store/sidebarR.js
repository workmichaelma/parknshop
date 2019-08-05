export const state = () => ({
  active: true
})

export const getters = {
  isActive: state => state.active
}

export const actions = {
  turnOn({ getters, rootGetters, commit }, v) {
    console.error(v)
    commit('setActive', v)
  },
}

export const mutations = {
  setActive(state, v) {
    state.active = v
  }
}
