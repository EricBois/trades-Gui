<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-if="this.$auth.loggedIn"
      v-model="drawer"
      app
      clipped
    >
      <v-list-item to="/profile">
        <v-list-item-avatar>
          <v-img :src="picture" />
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
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                Dashboard
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-group prepend-icon="mdi-alpha-p-box" no-action>
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
        </v-list-group>
        <v-divider class="my-5" />
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
                  <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
                  <span>Manage Team</span>
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/team/projects">
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  <v-icon class="mr-2">mdi-pencil-outline</v-icon>
                  <span>Manage Projects</span>
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item to="/messages">
          <v-list-item-action>
            <v-icon>mdi-message</v-icon>
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
            <v-icon>mdi-handshake</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                My Meetings
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="mt-12 justify-center">
          <v-btn v-if="this.$auth.loggedIn" color="amber darken-4" small @click="logout">
            Logout
          </v-btn>
          <v-btn :style="{'display': addBtnShow}" class="addBtn ml-3" small @click="addToPage">
            <v-icon>mdi-tablet-cellphone</v-icon>&nbsp;
            Install App
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left dense collapse elevate-on-scroll>
      <v-app-bar-nav-icon v-if="this.$auth.loggedIn" @click.stop="drawer = !drawer" />
      <v-btn v-if="!this.$auth.loggedIn" color="green" small label @click="login">
        <v-icon>mdi-login</v-icon> Login
      </v-btn>
      <v-menu
        v-if="this.$auth.loggedIn"
        transition="scale-transition"
        class="mx-1"
        :close-on-content-click="contentClick"
        offset-x
        :offset-overflow="overflow"
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
        <v-list v-if="notifications.length > 0">
          <v-list-item v-if="notifMessages.length > 0" to="messages">
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
          <v-flex v-if="notifBids.length > 0" xs12 class="ibm" text-center>
            <v-chip label>
              Bids Received
            </v-chip>
            <v-divider my-2 />
          </v-flex>
          <v-layout v-for="bid in notifBids" :key="bid._id" wrap>
            <v-flex v-if="$vuetify.breakpoint.smAndUp" xs1 px-sm-1>
              <v-icon>mdi-beaker-plus</v-icon>
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
          <v-flex class="my-3" text-center>
            <v-btn v-if="notifications.length > 0" small @click="clearNotifications">
              Clear
            </v-btn>
          </v-flex>
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
      shift
      app
    >
      <v-btn to="/projects">
        <span>Listings</span>
        <v-icon>mdi-post</v-icon>
      </v-btn>

      <v-btn to="/team">
        <span>Team</span>
        <v-icon>mdi-account-group</v-icon>
      </v-btn>

      <v-btn to="/user/create">
        <span>Post</span>
        <v-icon>mdi-clipboard-plus</v-icon>
      </v-btn>

      <v-btn to="/messages">
        <span>Messages</span>
        <v-icon>mdi-message</v-icon>
      </v-btn>
    </v-bottom-navigation>
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
</style>
<script>
import { mapGetters } from 'vuex'
export default {
  middleware: ['profile', 'notifications'],
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    addBtnShow: 'none',
    overflow: true,
    contentClick: true,
    drawer: true,
    picture: '',
    mini: false,
    notificationColor: 'blue-grey darken-1',
    notifMessages: [],
    notifMeetings: [],
    notifBidRequest: [],
    notifBids: [],
    deferredPrompt: ''
  }),
  computed: mapGetters({
    read: 'messages/Read',
    profile: 'profile/getProfile',
    notifications: 'notifications/getNotifications'
  }),
  watch: {
    notifications () {
      if (this.notifications.length > 0) {
        this.notifMessages = this.notifications.filter(notification => notification.activity === 'Message')
        this.notifMeetings = this.notifications.filter(notification => notification.activity === 'Meeting')
        this.notifBids = this.notifications.filter(notification => notification.activity === 'Bid')
        this.notifBidRequest = this.notifications.filter(notification => notification.activity === 'bidRequest')
        this.notificationColor = 'green darken-3'
      } else {
        this.notificationColor = 'blue-grey darken-1'
      }
    },
    profile () {
      if (this.profile.user_metadata && !this.profile.user_metadata.welcome) {
        this.$swal.fire({
          title: 'Welcome to SubHub',
          text: process.env.welcome,
          confirmButtonText: 'Lets Go'
        }).then(() => {
          return this.$axios.$post('account/edit', { user_metadata: { welcome: true } }).then(() => {
            this.$router.push('profile')
          })
        })
      }
    }
  },
  mounted () {
    this.$vuetify.theme.dark = true
    if (this.$auth.loggedIn) {
      // Notifications onesignal
      this.$OneSignal.push(() => {
        this.$OneSignal.showSlidedownPrompt()
        // TODO implement better way for this
        this.$OneSignal.setExternalUserId(this.$auth.user.sub)
        // this.$OneSignal.setEmail(this.$auth.user.email)
        // this.$OneSignal.sendTags({ key: this.$auth.user.sub })
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
    addToPage () {
      // hide our user interface that shows our A2HS button
      this.addBtnShow = 'none'
      // Show the prompt
      this.deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt')
        } else {
          console.log('User dismissed the A2HS prompt')
        }
        this.deferredPrompt = null
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
