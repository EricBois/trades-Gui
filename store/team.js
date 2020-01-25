export const state = () => ({
  team: []
})

export const mutations = {
  updateTeam (state, team) {
    state.team = team
  },
  addMember (state, member) {
    state.team.push(member)
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
  },
  saveTeam ({ commit, state }) {
    this.$axios.$post('team/edit', { team: state.team }).then((res) => {
      commit('updateTeam', res.team)
    })
  }
}
