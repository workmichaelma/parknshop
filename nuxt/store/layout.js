export const state = () => ({
  sidebar: {
    active: true
  }
})

export const getters = {
  isSidebarActive: state => state.sidebar.active
}

export const actions = {
  setSidebarActive({ getters, rootGetters, commit }, v) {
    commit('setSidebarActive', v)
  },
}

export const mutations = {
  setSidebarActive(state, v) {
    state.sidebar.active = v
  }
}
