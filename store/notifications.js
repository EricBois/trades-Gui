const getDefaultState = () => { // Default state
  return {
    notifications: []
  }
}

export const state = () => ({
  notifications: []
})

export const mutations = {
  addNewNotification (state, message) {
    state.notifications.push(message)
  },
  resetState (state) { // reset the state
    Object.assign(state, getDefaultState())
  }
}

export const getters = {
  getNotifications (state) {
    return state.notifications
  }
}

export const actions = {
  getNotifications ({ commit }) {
    this.$axios
      .$get('notification/fetch')
      .then((res) => {
        commit('resetState')
        res.forEach((message) => {
          commit('addNewNotification', message)
        })
      })
  },
  createNotification ({ commit }, payload) {
    this.$axios.$post('notification/create', payload)
  },
  deleteBulkNotification ({ commit, dispatch }, payload) {
    this.$axios.$post('notification/bulk', { links: payload }).then(
      dispatch('getNotifications')
    )
  },
  clearNotifications ({ commit }) {
    this.$axios.$delete('notification/delete').then(
      commit('resetState')
    )
  }
}
