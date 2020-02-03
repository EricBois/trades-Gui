const getDefaultState = () => { // Default state
  return {
    newMessages: [],
    readMessages: [],
    sentMessages: [],
    read: true
  }
}

export const state = () => ({
  newMessages: [],
  readMessages: [],
  sentMessages: [],
  read: true
})

export const mutations = {
  Read (state, bool) {
    state.read = bool
  },
  addNewMessage (state, message) {
    state.newMessages.push(message)
  },
  addReadMessage (state, message) {
    state.readMessages.push(message)
  },
  addSentMessage (state, message) {
    state.sentMessages.push(message)
  },
  resetState (state) { // reset the state
    Object.assign(state, getDefaultState())
  }
}

export const getters = {
  Read (state) {
    return state.read
  },
  getNewMessages (state) {
    return state.newMessages
  },
  getReadMessages (state) {
    return state.readMessages
  },
  getSentMessages (state) {
    return state.sentMessages
  }
}

export const actions = {
  getMessages ({ commit }) {
    // commit('resetState')
    this.$axios
      .$get('message/get')
      .then((res) => {
        commit('resetState')
        for (const key in res) {
          const message = res[key]
          message._id = key
          if (!message.delete.includes(this.$auth.user.sub)) {
            if (!message.read.includes(this.$auth.user.sub)) {
              commit('Read', false)
              commit('addNewMessage', message)
            } else if (message.messages.length <= 1 && message.messages[0].uid === this.$auth.user.sub) {
              commit('addSentMessage', message)
            } else {
              commit('addReadMessage', message)
            }
          }
        }
      })
  }
}
