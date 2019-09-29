<template>
  <v-app id="inspire">
    <v-navigation-drawer v-if="this.$auth.loggedIn" v-model="drawer" :mini-variant.sync="mini" app clipped>
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="picture"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>{{this.$auth.user.name}}</v-list-item-title>

      </v-list-item>
      <v-list-item>
              <v-btn small v-if="this.$auth.loggedIn" @click="logout">
                Logout
              </v-btn>
            </v-list-item>

      <v-divider></v-divider>
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group
        prepend-icon="account_circle"
        value="true"
      >
        <template v-slot:activator>
          <v-list-item-title>Project</v-list-item-title>
        </template>
          <v-list-item to="/jobs">
          <v-list-item-action>
            <v-icon>mdi-post</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Listings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/job/create">
          <v-list-item-action>
            <v-icon>mdi-post</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Post</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
        <v-list-item to="/team">
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Team</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/profile">
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
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
export default {
  props: {
    source: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    drawer: true,
    picture: '',
    mini: false
  }),
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
      this.$router.push('/home')
    }
  }
}
</script>
