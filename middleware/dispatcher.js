export default function ({ store, $auth }) {
  if ($auth.loggedIn) {
    store.dispatch('profile/getProfile')
    store.dispatch('team/getTeam')
    store.dispatch('notifications/getNotifications')
    store.dispatch('messages/getMessages')

    setInterval(
      function () {
        store.dispatch('messages/getMessages')
        store.dispatch('notifications/getNotifications')
      },
      350000
    )
  }
}
