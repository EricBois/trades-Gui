export default function ({ $axios, redirect, error }) {
  // $axios.onRequest((config) => {
  //   console.log('Making request to ' + config.url)
  // })

  $axios.onError((err) => {
    const code = parseInt(err.response && err.response.status)
    if (code === 401) {
      $axios.$get('https://dev-2upadx1s.auth0.com/v2/logout?returnTo=https%3A%2F%2Fwww.sub-hub.ca/')
      window.location.reload(true)
      redirect('/')
    }
  })
  $axios.onResponseError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      $axios.$get('https://dev-2upadx1s.auth0.com/v2/logout?returnTo=https%3A%2F%2Fwww.sub-hub.ca/')
      window.location.reload(true)
      redirect('/')
    }
  })
}
