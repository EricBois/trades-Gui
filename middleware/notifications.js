export default function ({ store, $auth }) {
  if ($auth.loggedIn) {
    store.dispatch('notifications/getNotifications')
    store.dispatch('messages/getMessages')
    setInterval(
      function () {
        store.dispatch('messages/getMessages')
        store.dispatch('notifications/getNotifications')
      },
      300000
    )
  }
}
