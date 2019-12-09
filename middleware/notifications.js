export default function ({ store, $auth }) {
  if ($auth.loggedIn) {
    store.dispatch('notifications/getNotifications')
    setInterval(
      function () {
        store.dispatch('notifications/getNotifications')
      },
      300000
    )
  }
}
