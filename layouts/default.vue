<template>
  <v-app id="inspire">
    <v-snackbar
      v-model="snackbar"
      bottom
      :color="snackbarColor"
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
      v-if="this.$auth.loggedIn"
      v-model="drawer"
      app
      floating
      clipped
    >
      <v-list-item to="/profile">
        <v-list-item-avatar tile>
          <v-img class="rounded" :src="picture" />
        </v-list-item-avatar>

        <v-list-item-title>
          {{ this.$auth.user.name }}
          <v-icon color="green" class="ml-1">
            mdi-tune
          </v-icon>
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n4">
            <v-list-item-title>
              <v-chip outlined label>
                Dashboard
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item v-ripple>
          <v-list-item-action @click="$router.push('/projects')">
            <v-icon color="amber lighten-3">
              mdi-currency-usd
            </v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n4" @click="$router.push('/projects')">
            <v-list-item-title>
              <v-chip color="amber lighten-3" outlined label>
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

        <!-- <v-list-group prepend-icon="mdi-alpha-p-box" no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  Projects
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/projects">
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  <v-icon>mdi-post</v-icon>&nbsp;Project Listings
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/user/create">
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  <v-icon>mdi-plus-box-outline</v-icon>&nbsp; Create Project
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group> -->
        <v-divider class="my-2" />
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
        <v-list-item to="/myprojects">
          <v-list-item-action>
            <v-icon>mdi-alpha-p-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                My Projects
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
        <v-divider v-if="admin" class="my-6" />
        <v-list-item v-if="admin" to="/management">
          <v-list-item-action>
            <v-icon>mdi-alpha-p-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                Manage Codes
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item to="/hiring">
          <v-list-item-action>
            <v-icon color="deep-orange accent-2">
              mdi-help-circle
            </v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n4">
            <v-list-item-title>
              <v-chip color="deep-orange accent-2" outlined label>
                Who's Hiring Now
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <!-- <v-list-item class=" mt-5 justify-center">
          <v-switch v-model="switchAvailable" label="Looking for work" color="green" inset />
        </v-list-item> -->
        <v-list-item class="mt-5 justify-center">
          <v-btn v-if="this.$auth.loggedIn" color="amber darken-4" small @click="logout">
            <v-icon class="mr-1">
              mdi-logout
            </v-icon>
            Logout
          </v-btn>
          <v-btn :style="{'display': addBtnShow}" class="addBtn ml-3" small @click="addToPage">
            <v-icon>mdi-tablet-cellphone</v-icon>&nbsp;
            Install App
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :max-width="(this.$auth.loggedIn)?'':'250'"
      app
      clipped-left
      dense
      collapse
      elevate-on-scroll
    >
      <v-app-bar-nav-icon v-if="this.$auth.loggedIn" @click.stop="drawer = !drawer" />
      <v-btn
        v-if="!this.$auth.loggedIn"
        color="green"
        class="mr-2"
        small
        label
        @click="login"
      >
        <v-icon>mdi-login</v-icon> Login
      </v-btn>
      <v-btn v-if="!this.$auth.loggedIn" color="blue darken-3" small label @click="registerDialog = !registerDialog">
        <v-icon>mdi-content-save</v-icon> Register
      </v-btn>
      <v-menu
        v-if="this.$auth.loggedIn"
        transition="scale-transition"
        class="mx-1 scroll"
        :close-on-content-click="contentClick"
        offset-x
        :offset-overflow="overflow"
        max-height="400"
      >
        <template v-slot:activator="{ on: menu }">
          <v-btn
            :color="notificationColor"
            dark
            x-small
            v-on="{ ...menu }"
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
            top
            right
            absolute
            class="mt-6"
            small
            color="red darken-3"
            fab
            @click="clearNotifications"
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
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-bottom-navigation
      v-if="this.$auth.loggedIn && !drawer"
      dark
      app
    >
      <v-btn :to="btn1.link">
        <span>{{ btn1.name }}</span>
        <v-icon>{{ btn1.icon }}</v-icon>
      </v-btn>

      <v-btn v-if="btn2.link" :to="btn2.link">
        <span>{{ btn2.name }}</span>
        <v-icon>{{ btn2.icon }}</v-icon>
      </v-btn>

      <v-btn v-else @click="clicker()">
        <span>{{ btn2.name }}</span>
        <v-icon>{{ btn2.icon }}</v-icon>
      </v-btn>

      <v-btn :to="btn3.link">
        <span>{{ btn3.name }}</span>
        <v-icon>{{ btn3.icon }}</v-icon>
      </v-btn>

      <v-btn :to="btn4.link">
        <span>{{ btn4.name }}</span>
        <v-icon>{{ btn4.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-dialog v-model="registerDialog" max-width="800" persistent transition="dialog-bottom-transition">
      <v-card class="px-3">
        <v-toolbar height="50" dark color="blue">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Apply for an account
          </v-toolbar-title>
          <v-btn icon dark @click="registerDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <Register :register-dialog.sync="registerDialog" :snackbar.sync="snackbar" :snackbar-text.sync="snackbarText" :snackbar-color.sync="snackbarColor" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="sheet" persistent>
      <v-sheet class="text-center" height="200px">
        <h2>Welcome to Sub-Hub !</h2>
        <div class="ma-2">
          {{ welcomeText }}
        </div>
        <v-btn
          class="mt-6"
          flat
          color="error"
          @click="letsGo()"
        >
          Go !
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>
    <v-dialog v-model="create" persistent fullscreen max-width="850">
      <v-card>
        <v-toolbar dark color="blue">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Create Project
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="create = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <CreateProject :close.sync="create" />
        <v-divider />
      </v-card>
    </v-dialog>
  </v-app>
</template>
<style scoped>
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
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
import Register from '../components/Register'
import CreateProject from '../components/CreateProject'
export default {
  middleware: ['profile', 'notifications'],
  components: {
    Register,
    CreateProject
  },
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    btn1: {
      name: 'Listings',
      link: '/projects',
      icon: 'mdi-post'
    },
    btn2: {
      name: 'Team Projects',
      link: '/team/projects',
      icon: 'mdi-account-group'
    },
    btn3: {
      name: 'My Projects',
      link: '/myprojects',
      icon: 'mdi-alpha-p-box'
    },
    btn4: {
      name: 'Hiring',
      link: '/hiring',
      icon: 'mdi-help-circle'
    },
    create: false,
    admin: false,
    snackbar: false,
    snackbarColor: 'green darken-3',
    snackbarText: '',
    sheet: false,
    welcomeText: '',
    switchAvailable: false,
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
    deferredPrompt: '',
    registerDialog: false
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
    // Dynamic bottom menu
    $route (to, from) {
      switch (to.name) {
        case 'home':
          this.btn1.icon = 'mdi-post'
          this.btn1.name = 'Listings'
          this.btn1.link = '/projects'
          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Team'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-alpha-p-box'
          this.btn3.name = 'My Projects'
          this.btn3.link = '/myprojects'
          break
        case 'projects':
          this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
          this.btn1.name = 'Back'
          this.btn1.link = '/home'
          this.btn2.icon = 'mdi-file-document-box-plus-outline'
          this.btn2.name = 'Create'
          this.btn2.link = ''
          break
        case 'team-projects':
          this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
          this.btn1.name = 'Back'
          this.btn1.link = '/home'
          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Projects'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-account-multiple-plus'
          this.btn3.name = 'Manage Team'
          this.btn3.link = '/team/manage'
          break
        case 'job-id':
          this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
          this.btn1.name = 'Back'
          this.btn1.link = from.path
          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Team'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-alpha-p-box'
          this.btn3.name = 'My Projects'
          this.btn3.link = '/myprojects'
          break
        case 'hiring':
          this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
          this.btn1.name = 'Back'
          this.btn1.link = '/home'
          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Team'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-alpha-p-box'
          this.btn3.name = 'My Projects'
          this.btn3.link = '/myprojects'
          break
        case 'myprojects':
          this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
          this.btn1.name = 'Back'
          this.btn1.link = '/home'
          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Team'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-alpha-p-box'
          this.btn3.name = 'My Projects'
          this.btn3.link = '/myprojects'
          break
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
    },
    profile () {
      this.switchAvailable = this.profile.user_metadata.available
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
    if (this.$vuetify.breakpoint.mdAndUp) {
      this.drawer = true
    }
    this.$vuetify.theme.dark = true
    if (this.$auth.loggedIn) {
      // Notifications onesignal
      this.$OneSignal.push(() => {
        /* In milliseconds, time to wait before prompting user. This time is relative to right after the user presses <ENTER> on the address bar and navigates to your page */
        const notificationPromptDelay = 30000
        /* Use navigation timing to find out when the page actually loaded instead of using setTimeout() only which can be delayed by script execution */
        const navigationStart = window.performance.timing.navigationStart
        /* Get current time */
        const timeNow = Date.now()
        /* Prompt the user if enough time has elapsed */
        setTimeout(this.promptAndSubscribeUser, Math.max(notificationPromptDelay - (timeNow - navigationStart), 0))
      })

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
  methods: {
    clicker () {
      this.create = true
    },
    promptAndSubscribeUser () {
      this.$OneSignal.isPushNotificationsEnabled(function (isEnabled) {
        if (!isEnabled) {
          // show prompt
          this.$OneSignal.showSlidedownPrompt()
          // set userId
          this.$OneSignal.setExternalUserId(this.$auth.user.sub)
        }
      })
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
    }
  }
}
</script>
