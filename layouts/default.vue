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
        <div class="text-center my-5 ibm" v-if="messages.length > 0 || meetings.length > 0">
          <v-menu>
            <template v-slot:activator="{ on: menu }">
              <v-btn
                color="green darken-3"
                dark
                v-on="{ ...menu }"
              ><v-icon>mdi-bell</v-icon>&nbsp; New Notifications !</v-btn>
            </template>
            <v-list>
              <v-list-item v-if="messages.length > 0" to="messages">
                <v-list-item-title>You have {{messages.length}} new messages</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="meetings.length > 0">
                <v-list-item-title>New activity in the meeting section</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-btn @click="clearNotifications" small>Clear</v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
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
        <v-list-item to="/team">
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                My Team
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
        <v-list-item class="mt-12 justify-center">
          <v-btn v-if="this.$auth.loggedIn" color="amber darken-4" small @click="logout">
            Logout
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left dense collapse elevate-on-scroll>
      <v-app-bar-nav-icon v-if="this.$auth.loggedIn" @click.stop="drawer = !drawer" />
      <v-btn v-if="!this.$auth.loggedIn" color="green" small label @click="login">
        <v-icon>mdi-login</v-icon> Login
      </v-btn>
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

<script>
import { mapGetters } from 'vuex'
export default {
  middleware: 'profile',
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    drawer: true,
    picture: '',
    mini: false,
    interval: null,
    notifications: [],
    messages: [],
    meetings: []
  }),
  computed: mapGetters({
    read: 'messages/Read',
    profile: 'profile/getProfile'
  }),
  watch: {
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
  created () {
    this.$vuetify.theme.dark = true
    if (this.$auth.loggedIn) {
      this.getNotifications()
      this.$OneSignal.push(() => {
        this.$OneSignal.showSlidedownPrompt()
        // TODO implement better way for this
        this.$OneSignal.setExternalUserId(this.$auth.user.sub)
        // this.$OneSignal.setEmail(this.$auth.user.email)
        // this.$OneSignal.sendTags({ key: this.$auth.user.sub })
      })
      this.picture = this.$auth.user.picture
      this.interval = setInterval(
        function () {
          this.getNotifications()
        }.bind(this),
        150000
      )
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    login () {
      this.$auth.loginWith('auth0')
    },
    logout () {
      this.$auth.logout()
      window.location.replace(
        'https://dev-2upadx1s.auth0.com/v2/logout?returnTo=http%3A%2F%2Flocalhost:3333/'
      )
    },
    getNotifications () {
      this.$axios.$get('notification/fetch').then((res) => {
        this.notifications = res
        this.messages = res.filter(notification => notification.activity === 'Message')
        this.meetings = res.filter(notification => notification.activity === 'Meeting')
      })
    },
    clearNotifications () {
      this.$axios.$delete('notification/delete').then((res) => {
        this.messages = []
        this.meetings = []
      })
    }
  }
}
</script>
