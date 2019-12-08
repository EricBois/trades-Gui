const getDefaultState = () => { // Default state
  return {
    messages: [],
    meetings: []
  }
}

export const state = () => ({
  messages: [],
  meetings: []
})

export const mutations = {
  addNewNotification (state, message) {
    if (message.activity === 'Message') {
      state.messages.push(message)
    }
    if (message.activity === 'Meeting') {
      state.meetings.push(message)
    }
  },
  resetState (state) { // reset the state
    Object.assign(state, getDefaultState())
  }
}

export const getters = {
  getNotifMessages (state) {
    return state.messages
  },
  getNotifMeetings (state) {
    return state.meetings
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
  clearNotifications ({ commit }) {
    this.$axios.$delete('notification/delete').then(
      commit('resetState')
    )
  }
}
