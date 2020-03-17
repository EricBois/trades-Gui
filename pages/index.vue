<template>
  <v-layout wrap>
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
    <v-flex xs12>
      <v-alert
        v-model="alert"
        :type="alertInfo"
        icon="mdi-information-outline"
        prominent
        dense
        dismissible
        transition="scale-transition"
        text
      >
        {{ alertText }}
      </v-alert>
    </v-flex>
    <v-flex xs12 text-center>
      <v-card max-width="450" class="mx-auto pa-6">
        <v-layout wrap>
          <v-flex xs12 text-left>
            <h1 class="sub">
              Welcome to
            </h1>
          </v-flex>
          <v-flex xs12>
            <v-card max-width="200" min-height="100" class="mx-auto" elevation="20" shaped>
              <v-img
                :src="require('../assets/logo.png')"
                lazy-src
                class="ma-4"
              />
            </v-card>
            <v-divider />
          </v-flex>

          <v-flex xs6 class="mt-5">
            <v-btn
              v-if="!this.$auth.loggedIn"
              @click="registerDialog = !registerDialog"
              color="blue-grey lighten-4"
              x-large
              outlined
              label
            >
              <v-icon class="mr-1">
                mdi-account
              </v-icon>
              Register
            </v-btn>
          </v-flex>
          <v-flex class="mt-5" xs6 text-center>
            <v-btn
              v-if="!this.$auth.loggedIn"
              @click="login"
              color="green darken-3"
              x-large
              class="mb-2"
              label
            >
              <v-icon class="mr-1">
                mdi-login
              </v-icon> Log-in
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
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
  </v-layout>
</template>
<style scoped>
.sub {
  font-family: 'IBM Plex Sans', sans-serif;
  font-style: italic;
  font-display: swap;
}
</style>
<script>

export default {
  components: {
    Register: () => import('../components/Register.vue')

  },
  data () {
    return {
      mobile: true,
      registerDialog: false,
      alert: false,
      alertInfo: 'warning',
      alertText: '',
      snackbar: false,
      snackbarColor: 'green darken-3',
      snackbarText: '',
      profile: this.$auth.token
    }
  },
  created () {
    if (this.$vuetify.breakpoint.smAndUp) {
      this.mobile = false
    }
    if (
      this.$route.hash.includes(
        '#error=unauthorized&error_description=Please%20verify%20your%20email%20before%20logging%20in'
      )
    ) {
      this.alertText = 'Please verify your email to confirm your account before login.'
      this.alert = true
    }
  },
  methods: {
    login () {
      this.$auth.loginWith('auth0')
    },
    logout () {
      this.$auth.logout()
      this.$router.push('/')
    }
  }
}
</script>
