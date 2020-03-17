<template>
  <v-app id="inspire">
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
    >
      {{ snackbarText }}
      <v-icon v-if="snackbarColor.includes('red')">
        mdi-alert-outline
      </v-icon>
      <v-icon v-else>
        mdi-check-circle-outline
      </v-icon>
    </v-snackbar>
    <v-navigation-drawer
      v-if="$auth.loggedIn"
      v-model="drawer"
      app
      floating
      clipped
    >
      <v-list-item>
        <v-img
          :src="require('../assets/logo.png')"
          contain
          height="100"
          lazy-src
        />
      </v-list-item>
      <v-divider />
      <v-list-item to="/profile">
        <v-list-item-avatar tile size="50">
          <v-img :src="picture" class="rounded mt-n1" />
        </v-list-item-avatar>

        <v-list-item-title class="ml-n1">
          <v-chip class="ibm pl-2" label>
            {{ this.$auth.user.name }}
            <v-icon color="green" class="pl-2">
              mdi-tune
            </v-icon>
          </v-chip>
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n4">
            <v-list-item-title>
              <v-chip outlined label>
                Home
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item v-ripple>
          <v-list-item-action @click="$router.push('/projects')">
            <v-icon color="yellow lighten-1">
              mdi-gavel
            </v-icon>
          </v-list-item-action>
          <v-list-item-content @click="$router.push('/projects')" class="ml-n4">
            <v-list-item-title>
              <v-chip color="yellow lighten-1" outlined label>
                Projects Bidding
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
          <v-divider class="mr-n2" vertical />
          <v-list-item-icon @click="create = !create">
            <v-icon color="green darken-2" large>
              mdi-file-document-box-plus-outline
            </v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider />
        <v-list-item @click="dialogAssist = !dialogAssist">
          <v-list-item-action>
            <v-icon color="teal accent-3">
              mdi-auto-fix
            </v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n4">
            <v-list-item-title>
              <v-chip color="teal accent-3" outlined label>
                Your Assistant
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item to="/myprojects">
          <v-list-item-action>
            <v-icon>mdi-alpha-m-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                Manage Listings
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/messages">
          <v-list-item-action>
            <v-badge
              color="green darken-3"
              overlap
              right
            >
              <template v-slot:badge>
                <span v-if="newMessages.length > 0">{{ newMessages.length }}</span>
              </template>
              <v-icon>
                mdi-message
              </v-icon>
            </v-badge>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                My Messages
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/meetings">
          <v-list-item-action>
            <v-badge
              color="green darken-3"
              overlap
              right
            >
              <template v-slot:badge>
                <span v-if="notifMeetings.length > 0">{{ notifMeetings.length }}</span>
              </template>
              <v-icon>
                mdi-handshake
              </v-icon>
            </v-badge>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                My Meetings
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group prepend-icon="mdi-account-group" no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  My Team
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/team/manage">
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  <v-icon class="mr-2">
                    mdi-account-multiple-plus
                  </v-icon>
                  <span>Manage Team</span>
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/team/projects">
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  <v-icon class="mr-2">
                    mdi-pencil-outline
                  </v-icon>
                  <span>Manage Projects</span>
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-divider v-if="admin" class="my-3" />
        <v-list-item v-if="admin" to="/management">
          <v-list-item-action>
            <v-icon>mdi-alpha-p-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                Manage invite Codes
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item to="/hiring">
          <v-list-item-action>
            <v-icon color="cyan accent-3">
              mdi-help-circle
            </v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n4">
            <v-list-item-title>
              <v-chip color="cyan accent-3" outlined label>
                Who's Hiring Now
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <!-- <v-list-item class=" mt-5 justify-center">
          <v-switch v-model="switchAvailable" label="Looking for work" color="green" inset />
        </v-list-item> -->
        <v-list-item class="mt-10 justify-center">
          <v-btn v-if="this.$auth.loggedIn" @click="logout" text color="amber darken-4" large>
            <v-icon class="mr-1">
              mdi-logout
            </v-icon>
            Logout
          </v-btn>
          <v-btn :style="{'display': addBtnShow}" @click="addToPage" class="addBtn ml-3" small>
            <v-icon>mdi-tablet-cellphone</v-icon>&nbsp;
            Install App
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar

      app
      height="35"
      elevate-on-scroll
    >
      <v-app-bar-nav-icon v-if="this.$auth.loggedIn" @click.stop="drawer = !drawer" />
      <v-btn
        v-if="!this.$auth.loggedIn && !mobile"
        @click="login"
        color="green"
        class="mr-2"
        small
        label
      >
        <v-icon>mdi-login</v-icon> Login
      </v-btn>
      <v-btn v-if="!this.$auth.loggedIn && !mobile" @click="registerDialog = !registerDialog" color="blue darken-3" small label>
        <v-icon>mdi-content-save</v-icon> Register
      </v-btn>
      <v-spacer />
      <v-menu
        v-if="this.$auth.loggedIn"
        :close-on-content-click="contentClick"
        :offset-overflow="overflow"
        transition="scale-transition"
        class="mx-1 scroll"
        offset-x
        max-height="400"
      >
        <template v-slot:activator="{ on: menu }">
          <v-btn
            :color="notificationColor"
            v-on="{ ...menu }"
            dark
            x-small
          >
            <v-badge
              :color="notificationColor"
              left
            >
              <template v-slot:badge>
                <span v-if="notifications.length > 0">{{ notifications.length }}</span>
              </template>
              <v-icon small>
                mdi-bell
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-list v-if="notifications.length > 0" class="pa-4">
          <v-list-item v-if="notifMessages.length > 0" to="../messages">
            <v-list-item-action>
              <v-badge
                color="primary"
              >
                <template v-slot:badge>
                  <span v-if="notifMessages.length > 0">{{ notifMessages.length }}</span>
                </template>
                <v-icon>mdi-message</v-icon>
              </v-badge>
            </v-list-item-action>
            <v-list-item-title class="ibm">
              New message(s)
            </v-list-item-title>
          </v-list-item>
          <v-flex v-if="notifMessages.length > 0" xs12 my-2>
            <v-divider />
          </v-flex>
          <v-list-item v-if="notifMeetings.length > 0" to="../meetings">
            <v-list-item-action>
              <v-badge
                color="primary"
              >
                <template v-slot:badge>
                  <span v-if="notifMeetings.length > 0">{{ notifMeetings.length }}</span>
                </template>
                <v-icon>mdi-account-group</v-icon>
              </v-badge>
            </v-list-item-action>
            <v-list-item-title> New meeting activity</v-list-item-title>
          </v-list-item>
          <v-flex v-if="notifMeetings.length > 0" xs12 my-2>
            <v-divider />
          </v-flex>
          <v-flex v-if="notifBids.length > 0" xs12 class="ibm my-2" text-center>
            <v-chip label>
              Bids Received
            </v-chip>
            <v-divider my-2 />
          </v-flex>
          <v-layout v-for="bid in notifBids" :key="bid._id" wrap>
            <v-flex v-if="$vuetify.breakpoint.smAndUp" xs1 px-sm-1>
              <v-icon>mdi-beaker-plus</v-icon>
            </v-flex>
            <v-flex class="pl-4 ibm" xs11>
              <span @click="redirect(bid.link)">
                {{ bid.activityDesc }}
              </span>
            </v-flex>
            <v-flex xs12 my-2>
              <v-divider />
            </v-flex>
          </v-layout>
          <v-flex v-if="notifReviews.length > 0" xs12 class="ibm my-2" text-center>
            <v-chip label>
              Reviews
            </v-chip>
            <v-divider my-2 />
          </v-flex>
          <v-layout v-for="review in notifReviews" :key="review._id" wrap>
            <v-flex v-if="$vuetify.breakpoint.smAndUp" xs1 px-sm-1>
              <v-icon>mdi-star-circle</v-icon>
            </v-flex>
            <v-flex class="pl-4 ibm" xs11>
              <span @click="openProfile(review.link)">
                {{ review.activityDesc }}
              </span>
            </v-flex>
            <v-flex xs12 my-2>
              <v-divider />
            </v-flex>
          </v-layout>
          <v-flex v-if="notifBidRequest.length > 0" xs12 class="ibm" text-center>
            <v-chip label>
              Bids Invite
            </v-chip>
            <v-divider my-2 />
          </v-flex>
          <v-layout v-for="bid in notifBidRequest" :key="bid._id" wrap>
            <v-flex v-if="$vuetify.breakpoint.smAndUp" xs1 px-sm-1>
              <v-icon>mdi-lightbulb-group</v-icon>
            </v-flex>
            <v-flex class="px-2 ibm" xs11>
              <span @click="redirect(bid.link)">
                {{ bid.activityDesc }}
              </span>
            </v-flex>
            <v-flex xs12 my-2>
              <v-divider />
            </v-flex>
          </v-layout>

          <v-btn
            v-if="notifications.length > 0"
            @click="clearNotifications"
            top
            right
            absolute
            class="mt-6"
            small
            color="red darken-3"
            fab
          >
            <v-icon large>
              mdi-delete-circle-outline
            </v-icon>
          </v-btn>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-action>
              <v-icon>mdi-bell-off</v-icon>
            </v-list-item-action>
            <v-list-item-title> No new notification(s)</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <template v-slot:extension>
        <v-tabs height="40" centered>
          <v-tab to="/projects">
            <v-icon>mdi-gavel</v-icon>
          </v-tab>
          <v-tab to="/myprojects">
            <v-icon>mdi-alpha-m-box</v-icon>
          </v-tab>
          <v-tab to="/team/manage">
            <v-icon>mdi-account-group</v-icon>
          </v-tab>
          <v-tab @click="dialogAssist = !dialogAssist">
            <v-icon>mdi-auto-fix</v-icon>
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-dialog v-model="registerDialog" max-width="800" persistent transition="dialog-bottom-transition">
      <v-card class="px-3">
        <v-toolbar height="50" dark color="blue">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Apply for an account
          </v-toolbar-title>
          <v-btn @click="registerDialog = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <Register :register-dialog.sync="registerDialog" :snackbar.sync="snackbar" :snackbar-text.sync="snackbarText" :snackbar-color.sync="snackbarColor" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="sheet" persistent>
      <v-sheet class="text-center" height="200px">
        <h2>{{ sheetTitle }}</h2>
        <div class="ma-2">
          {{ welcomeText }}
        </div>
        <v-btn
          @click="letsGo()"
          class="mt-6"
          color="blue lighten-3"
          large
          outlined
        >
          Ok !
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>
    <v-dialog v-model="create" persistent fullscreen max-width="850">
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Create Project
          </v-toolbar-title>
          <v-spacer />
          <v-btn @click="create = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <CreateProject :close.sync="create" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogProfile" max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Profile
          </v-toolbar-title>
          <v-btn @click="dialogProfile = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <PublicProfile :user="profile" />
        <v-divider />
      </v-card>
    </v-dialog>
    <Assistant v-if="$auth.loggedIn" :dialogAssist.sync="dialogAssist" :create.sync="create" />
  </v-app>
</template>
<style scoped>
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
  font-display: swap;
}
a {
  text-decoration: none;
  color: #CFD8DC !important;
}
.addBtn {
  display: none;
}
.rounded {
  border-radius: 10px;
}
.scroll {
  overflow-y: auto;
}
</style>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    PublicProfile: () => import('../components/PublicProfile.vue'),
    Register: () => import('../components/Register.vue'),
    CreateProject: () => import('../components/CreateProject.vue'),
    Assistant: () => import('../components/Assistant.vue')
  },
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    dialogProfile: false,
    dialogAssist: false,
    create: false,
    admin: false,
    snackbar: false,
    barLength: '0',
    snackbarColor: 'green darken-3',
    snackbarText: '',
    sheet: false,
    sheetTitle: 'Welcome to Sub-Hub !',
    welcomeText: '',
    addBtnShow: 'none',
    overflow: true,
    contentClick: true,
    drawer: false,
    picture: '',
    mini: false,
    notificationColor: 'blue-grey darken-1',
    notifMessages: [],
    notifMeetings: [],
    notifBidRequest: [],
    notifBids: [],
    notifReviews: [],
    deferredPrompt: '',
    registerDialog: false,
    mobile: true,
    polling: null
  }),
  computed: {
    ...mapGetters({
      read: 'messages/Read',
      profile: 'profile/getProfile',
      notifications: 'notifications/getNotifications',
      newMessages: 'messages/getNewMessages'
    })
  },
  watch: {
    create () {
      // close dialog when create pronect is open
      if (this.dialogAssist === true) {
        this.dialogAssist = false
      }
    },
    notifications () {
      if (this.notifications.length > 0) {
        this.notificationColor = 'green darken-3'
      } else {
        this.notificationColor = 'blue-grey darken-1'
      }
      this.notifMessages = this.notifications.filter(notification => notification.activity === 'Message')
      this.notifMeetings = this.notifications.filter(notification => notification.activity === 'Meeting')
      this.notifBids = this.notifications.filter(notification => notification.activity === 'Bid')
      this.notifBidRequest = this.notifications.filter(notification => notification.activity === 'bidRequest')
      this.notifReviews = this.notifications.filter(notification => notification.activity === 'Review')
    },
    profile () {
      if (this.profile && this.profile.app_metadata && this.profile.app_metadata.admin === true) {
        this.admin = true
      }
      if (this.profile.user_metadata && !this.profile.user_metadata.welcome) {
        this.welcomeText = process.env.welcome
        this.sheet = true
      }
    }
  },
  mounted () {
    if (this.$vuetify.breakpoint.smAndUp) {
      this.drawer = true
      this.mobile = false
      if (!this.$auth.loggedIn) {
        this.barLength = '250'
      }
    }
    this.$vuetify.theme.dark = true
    if (this.$auth.loggedIn) {
      this.pollData()
      this.barLength = ''
      // Notifications onesignal
      this.$OneSignal.push(() => {
        /* In milliseconds, time to wait before prompting user. This time is relative to right after the user presses <ENTER> on the address bar and navigates to your page */
        const notificationPromptDelay = 30000
        /* Use navigation timing to find out when the page actually loaded instead of using setTimeout() only which can be delayed by script execution */
        const navigationStart = window.performance.timing.navigationStart
        /* Get current time */
        const timeNow = Date.now()
        /* Prompt the user if enough time has elapsed */
        setTimeout(promptAndSubscribeUser, Math.max(notificationPromptDelay - (timeNow - navigationStart), 0))
      })
      const promptAndSubscribeUser = () => {
        this.$OneSignal.isPushNotificationsEnabled(function (isEnabled) {
          if (!isEnabled) {
            // show prompt
            this.$OneSignal.showSlidedownPrompt()
            // set userId
            this.$OneSignal.setExternalUserId(this.$auth.user.sub)
          }
        })
      }
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault()
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e
        // Update UI to notify the user they can add to home screen
        this.addBtnShow = 'block'
      })
      this.picture = this.$auth.user.picture
    }
  },
  beforeDestroy () {
    clearInterval(this.polling)
  },
  methods: {
    pollData () {
      // dispatch data
      this.$store.dispatch('team/getTeam')
      this.$store.dispatch('profile/getProfile')
      this.$store.dispatch('notifications/getNotifications')
      this.$store.dispatch('messages/getMessages')
      this.polling = setInterval(() => {
        this.$store.dispatch('messages/getMessages')
        this.$store.dispatch('notifications/getNotifications')
      }, 350000)
    },

    clicker () {
      this.create = true
    },
    addToPage () {
      // hide our user interface that shows our A2HS button
      this.addBtnShow = 'none'
      // Show the prompt
      this.deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        this.deferredPrompt = null
      })
    },
    letsGo () {
      this.sheet = false
      this.$axios.$post('account/edit', { user_metadata: { welcome: true } }).then(() => {
        this.$router.push('profile')
      })
    },
    login () {
      this.$auth.loginWith('auth0')
    },
    logout () {
      this.$auth.logout()
      window.location.replace(
        'https://dev-2upadx1s.auth0.com/v2/logout?returnTo=https%3A%2F%2Fwww.sub-hub.ca/'
      )
    },
    clearNotifications () {
      this.$store.dispatch('notifications/clearNotifications')
    },
    async redirect (bid) {
      await this.$store.dispatch('notifications/deleteBulkNotification', [bid])
      await this.$router.push(`/job/${bid}`)
    },
    async openProfile (bid) {
      await this.$store.dispatch('notifications/deleteBulkNotification', [bid])
      this.dialogProfile = true
    }
  }
}
</script>
