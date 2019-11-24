export const state = () => ({
  profile: {},
  photos: []
})

export const mutations = {
  updateProfile (state, profile) {
    state.profile = profile
  },
  updatePhotos (state, photos) {
    state.photos = photos
  }
}

export const getters = {
  getProfile (state) {
    return state.profile
  },
  getPhotos (state) {
    return state.photos
  }
}

export const actions = {
  getProfile ({ commit }) {
    this.$axios
      .$get('account/get')
      .then((profile) => {
        commit('updateProfile', profile.user)
        if (profile.photos) {
          commit('updatePhotos', profile.photos.photos)
        }
      })
  }
}
