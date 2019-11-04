export default function ({ $axios, redirect }) {
  // $axios.onRequest((config) => {
  //   console.log('Making request to ' + config.url)
  // })

  $axios.onError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      redirect('/login')
    }
  })

  $axios.onResponseError((error) => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      window.location.replace('https://dev-2upadx1s.auth0.com/v2/logout?returnTo=http%3A%2F%2Flocalhost:3333/')
      redirect('/login')
    }
  })
}
