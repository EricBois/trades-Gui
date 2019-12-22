import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: 'Sub-Hub',
    title: 'Sub-Hub',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Contractors platform' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600&display=swap' },
      { href:"splashscreens/iphone5_splash.png", media:"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)", rel:"apple-touch-startup-image" },
      { href:"splashscreens/iphone6_splash.png", media:"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)", rel:"apple-touch-startup-image" },
      { href:"splashscreens/iphoneplus_splash.png", media:"(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)", rel:"apple-touch-startup-image" },
      { href:"splashscreens/iphonex_splash.png", media:"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)", rel:"apple-touch-startup-image" },
      { href:"splashscreens/iphonexr_splash.png", media:"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)", rel:"apple-touch-startup-image" },
      { href:"splashscreens/iphonexsmax_splash.png", media:"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)", rel:"apple-touch-startup-image" },
      { href:"splashscreens/ipad_splash.png", media:"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)", rel:"apple-touch-startup-image" },
      { href:"splashscreens/ipadpro1_splash.png", media:"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)", rel:"apple-touch-startup-image" },
      { href:"splashscreens/ipadpro3_splash.png", media:"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)", rel:"apple-touch-startup-image" },
      { href:"splashscreens/ipadpro2_splash.png", media:"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)", rel:"apple-touch-startup-image" }

    ]
  },
  env: {
    trades: "Drywall,Taping,Framing,Labour,Texturing,Insulation,T-bar,Ceiling tiles",
    tickets: "WHIMIS,First Aid,Scissor Lift,Fall Arrest",
    welcome: "Few things to get started, Let's start with building your profile!",
    welcomeProfile: "Make sure to fill in your name and add as much information as possible for the prospect clients / bidders to see. If you'd like to make some change at a later date you can always access this page from the left menu on the top ( your name )",
    welcomeJob: "Here you can place a bid, direct message or lookup the contractor and get all available details about the project ( photos, files ) ...",
    welcomeJobs: "Here's all the available public, private and your own posted project listings awaiting bidding, click on them for more info and to place a bid.",
    privateJobs: "The projects in this section are invite to bid on private projects or your own private posting.",
    welcomeTeam: "Here you can manage your team, add/remove member and see their profile. The available user list is generated by last logged in and ready to work.",
    welcomeMsg: "Here's all your sent and received messages.",
    welcomeMeeting: "Here's all your meeting related information. You can CONFIRM or RESCHEDULE meeting here.",
    projectTeam: "Drag and Drop members from team in the project team tab and request bids, a notification will be sent to them. You can also send a group message to them, see the blue msg button on project team tab.",
    welcomeTeamProjects: "Here you can manage all your team projects."
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
    // { src: '~/plugins/sweetalert2'},
    { src: '~/plugins/vue-image-resize'},
    { src: '~/plugins/axios'}
  ],
  /*
  ** Nuxt.js modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/eslint-module'
  ],
  eslint: {
    /* module options */
    fix: true
  },
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/vuetify',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'vue-sweetalert2/nuxt',
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
        size: 'small',
        offset: {
          bottom: '25px',
          right: '5px' /* Only applied if bottom-right */
        }
      }
    }
  },
  pwa: {
    manifest: {
      name: 'Sub-Hub',
      lang: 'en-US'
    },
    meta: {
      name: 'Sub-Hub',
      viewport: 'width=device-width, initial-scale=1, user-scalable=no',
      mobileAppIOS: true
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
    /* baseURL: "http://localhost:3000/v1/" */
    baseURL: "https://sub-hub.ca/api/"
  },
  router: {
    middleware: ['auth']
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  build: {
    transpile: [/^vue2-google-maps($|\/)/]
  },
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
