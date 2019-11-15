import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400i,700i&display=swap' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/googleMap'},
    { src: '~/plugins/sweetalert2'},
    { src: '~/plugins/vue-image-resize'},
    { src: '~/plugins/axios'}
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/onesignal',
    '@nuxtjs/pwa',
    'nuxt-material-design-icons'
  ],
  oneSignal: {
    init: {
      appId: '1cd2a39c-cc2f-4d4e-9677-8035dc40db92',
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
          disable: false
      },
      autoResubscribe: true,
      cdn: true,
      notifyButton: {
        enable: true,
        size: 'small'
      }
    }
  },
  auth: {
    resetOnError: true,
    strategies: {
      auth0: {
        domain: 'dev-2upadx1s.auth0.com',
        client_id: 'EAOoS6JqaznqTqMk7dDUtdQBydcRellw',
        audience: 'https://dev-2upadx1s.auth0.com/api/v2/'
        //audience: 'https://subhub.ca'
      }
    },
    redirect: {
      login: '/login',
      logout: '/logout',
      callback: '/login',
      home: '/'
    }
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: "http://localhost:3000/v1/"
  },
  router: {
    middleware: ['auth']
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  }
}
