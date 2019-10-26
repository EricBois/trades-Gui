export const state = () => ({
  read: true
})

export const mutations = {
  add (state, bool) {
    state.read = bool
  }
}

export const getters = {
  get (state) {
    return state.read
  }
}
