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
  env: {
    trades: "Drywall, Taping, Framing, Labour, Texturing, Insulation",
    tickets: "WHIMIS, First Aid, Scissor Lift, Fall Arrest",
    welcome: "Few things to get started, Let's start with building your profile!",
    welcomeProfile: "Make sure to fill in your name and add as much information as possible for the prospect clients / bidders to see. If you'd like to make some change at a later date you can always access this page from the left menu on the top ( your name )",
    welcomeJob: "Here you can place a bid, direct message or lookup the contractor and get all available details about the project ( photos, files ) ...",
    welcomeJobs: "Here's all the available public, private and your own posted project listings awaiting bidding, click on them for more info and to place a bid.",
    privateJobs: "The projects in this section are invite to bid on private projects or your own private posting.",
    welcomeTeam: "Here you can manage your team and assign members to your private projects for bidding.",
    welcomeMsg: "Here's all your messages, if you swipe to the left or click on My Meeting on the top, you will be in the meeting section where you get all the invites and see the status of your sent request.",
    projectTeam: "Drag and Drop members from team in the project team tab and request bids, a notification will be sent to them. You can also send a group message to them, see the blue msg button on project team tab."
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
        enable: false,
        size: 'small',
        offset: {
          bottom: '25px',
          right: '5px' /* Only applied if bottom-right */
        }
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
