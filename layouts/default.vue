<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/jobs">
          <v-list-item-action>
            <v-icon>mdi-post</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Jobs</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/team">
          <v-list-item-action>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Team</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-settings</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Application</v-toolbar-title>
      <v-spacer />
      <v-menu
        v-if="this.$auth.loggedIn"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
      >
        <template v-slot:activator="{ on }">
          <v-avatar elevation="14" v-on="on">
            <img :src="picture">
          </v-avatar>
        </template>

        <v-card>
          <nuxt-link to="/profile">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <img :src="picture">
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ this.$auth.user.name }}</v-list-item-title>
                  <v-list-item-subtitle>is logged-in</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </nuxt-link>

          <v-divider />

          <v-list>
            <v-list-item>
              <v-btn v-if="this.$auth.loggedIn" color="primary" to="/profile">
                Profile
              </v-btn>
              <v-spacer />
              <v-btn v-if="this.$auth.loggedIn" @click="logout">
                Logout
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
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
    drawer: null,
    picture: ''
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
