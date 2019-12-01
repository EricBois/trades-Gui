const getDefaultState = () => { // Default state
  return {
    newMessages: [],
    readMessages: [],
    read: true
  }
}

export const state = () => ({
  newMessages: [],
  readMessages: [],
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
  }
}

export const actions = {
  getMessages ({ commit }) {
    commit('resetState')
    this.$axios
      .$get(`message/get`)
      .then((res) => {
        for (const key in res) {
          const message = res[key]
          message._id = key
          if (!message.delete.includes(this.$auth.user.sub)) {
            if (!message.read.includes(this.$auth.user.sub)) {
              commit('Read', false)
              commit('addNewMessage', message)
              // if (!message.notified.includes(this.$auth.user.sub)) {
              //   this.$OneSignal.push(() => {
              //     // this.$OneSignal.log.setLevel('trace')
              //     this.$OneSignal.sendSelfNotification(
              //       'New message!',
              //       'You have a new message'
              //     )
              //   })
              //   this.$axios.$get(`message/notified/${message.id}`) // set to notified
              // }
            } else {
              commit('addReadMessage', message)
            }
          }
        }
      })
  }
}
