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
          <v-chip color="green" small class="ml-4" />
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
        <v-list-item to="/jobs">
          <v-list-item-action>
            <v-icon>mdi-post</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                Projects
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/team">
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                Team
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-5" />
        <v-list-group prepend-icon="mdi-alpha-p-box" no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  My Projects
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/user/projects">
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  <v-icon>mdi-view-list</v-icon>&nbsp; Your Listing
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/user/private">
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  <v-icon>mdi-book-lock</v-icon>&nbsp; Private Listing
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/user/create">
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  <v-icon>mdi-post</v-icon>&nbsp; Post Project
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
              <v-chip v-if="!read" color="green">
                <v-icon>mdi-star</v-icon>&nbsp;New Message(s)
              </v-chip>
              <v-chip v-else outlined>
                Messages
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/profile">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                Settings
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
      <v-btn to="/jobs">
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
    interval: null
  }),
  computed: mapGetters({
    read: 'messages/Read',
    profile: 'profile/getProfile'
  }),
  watch: {
    profile () {
      if (!this.profile.user_metadata.welcome) {
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
      // this.$store.dispatch('profile/getProfile')
      this.picture = this.$auth.user.picture
      this.$store.dispatch('messages/getMessages')
      this.interval = setInterval(
        function () {
          this.$store.dispatch('messages/getMessages')
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
    }
  }
}
</script>
