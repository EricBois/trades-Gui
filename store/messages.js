const getDefaultState = () => { // Default state
  return {
    messages: [],
    read: true
  }
}

export const state = () => ({
  read: true,
  messages: []
})

export const mutations = {
  Read (state, bool) {
    state.read = bool
  },
  addMessage (state, message) {
    state.messages.push(message)
  },
  resetState (state) { // reset the state
    Object.assign(state, getDefaultState())
  }
}

export const getters = {
  Read (state) {
    return state.read
  },
  getMessages (state) {
    return state.messages
  }
}

export const actions = {
  getMessages ({ commit }) {
    commit('resetState')
    this.$axios
      .$get(`message/get`)
      .then((res) => {
        this.messages = []
        for (const key in res) {
          const message = res[key]
          message._id = key
          if (!message.delete.includes(this.$auth.user.sub)) {
            commit('addMessage', message)
            if (!message.read.includes(this.$auth.user.sub)) {
              commit('Read', false)
            }
          }
        }
      })
  }
}
