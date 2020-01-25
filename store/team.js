export const state = () => ({
  team: []
})

export const mutations = {
  updateTeam (state, team) {
    state.team = team
  }
}

export const getters = {
  getTeam (state) {
    return state.team
  }
}

export const actions = {
  getTeam ({ commit }) {
    this.$axios
      .$get('team/fetch')
      .then((res) => {
        commit('updateTeam', res.team)
      })
  }
}
