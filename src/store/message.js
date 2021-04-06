export default {
  namespaced: true,
  state: () => ({
    msg: 'Hello Vuex??'
  }),
  getters: {},
  mutations: {
    updateState(state, payload) {
      state.msg = payload
    }
  },
  actions: {
    changeMessage(context, payload) {
      const { state, getters, commit } = context
      commit('updateState', payload)
      console.log(state.msg)
    }
  }
}
