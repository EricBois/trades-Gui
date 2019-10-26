<template>
  <v-app id="inspire">
    <v-navigation-drawer v-if="this.$auth.loggedIn" v-model="drawer" :mini-variant.sync="mini" app clipped>
      <v-list-item to="/profile">
        <v-list-item-avatar>
          <v-img :src="picture" />
        </v-list-item-avatar>

        <v-list-item-title>{{ this.$auth.user.name }} <v-chip color="green" small class="ml-4" /></v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title><v-chip outlined>Dashboard</v-chip></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/jobs">
          <v-list-item-action>
            <v-icon>mdi-post</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title><v-chip outlined>Listings</v-chip></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/team">
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title><v-chip outlined>Team</v-chip></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-5" />
        <v-list-group
          prepend-icon="mdi-alpha-p-box"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title><v-chip outlined>My Projects</v-chip></v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/user/projects">
            <v-list-item-content>
              <v-list-item-title><v-chip outlined><v-icon>mdi-view-list</v-icon> &nbsp; Your Listing</v-chip></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/user/create">
            <v-list-item-content>
              <v-list-item-title><v-chip outlined><v-icon>mdi-post</v-icon>&nbsp; Post Project</v-chip></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item to="/messages">
          <v-list-item-action>
            <v-icon>mdi-message</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip v-if="!read" color="green"><v-icon>mdi-star</v-icon>&nbsp;New Message(s) </v-chip>
              <v-chip v-else outlined>Messages</v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/profile">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title><v-chip outlined>Settings</v-chip></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item class="mt-5">
          <v-btn v-if="this.$auth.loggedIn" small @click="logout">
            Logout
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left dense>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn v-if="!this.$auth.loggedIn" @click="login">
        Login
      </v-btn>
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  computed: mapGetters({
    read: 'read/get'
  }),
  data: () => ({
    drawer: true,
    picture: '',
    mini: false,
    unread: false
  }),
  watch: {
    $route () {
      this.getMsg()
    }
  },
  created () {
    this.$vuetify.theme.dark = true
    if (this.$auth.user) {
      this.picture = this.$auth.user.picture
    }
  },
  methods: {
    login () {
      this.$auth.loginWith('auth0')
    },
    logout () {
      this.$auth.logout()
      window.location.replace('https://dev-2upadx1s.auth0.com/v2/logout?returnTo=http%3A%2F%2Flocalhost:3333/')
    },
    getMsg () {
      this.$axios
        .$get(`message/get`)
        .then((res) => {
          for (const key in res) {
            const message = res[key]
            message._id = key
            if (!message.read.includes(this.$auth.user.sub)) {
              this.$store.commit('read/add', false)
            } else {
              this.$store.commit('read/add', true)
            }
          }
        })
    }
  }
}
</script>
