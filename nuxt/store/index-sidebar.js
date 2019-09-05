export const state = () => ({
  active: true,
  addProductPopup: false
})

export const getters = {
  isActive: state => state.active,
  showAddProductPopup: state => state.addProductPopup
}

export const actions = {
  setActive({ getters, rootGetters, commit }, v) {
    commit('setActive', v)
  },
  setAddProductPopup({ getters, rootGetters, commit }, v) {
    commit('setAddProductPopup', v)
  },
}

export const mutations = {
  setActive(state, v) {
    state.active = v
  },
  setAddProductPopup(state, v) {
    state.addProductPopup = v
  }
}
