<template>
  <v-layout wrap>
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
    <v-flex xs12>
      <v-alert
        v-model="alert"
        icon="mdi-information-outline"
        prominent
        dense
        dismissible
        transition="scale-transition"
        text
        :type="alertInfo"
      >
        {{ alertText }}
      </v-alert>
    </v-flex>
    <v-flex xs12 text-center>
      <v-card max-width="450" class="mx-auto pa-6">
        <h1 class="sub">
          Welcome to
        </h1>
        <v-divider />
        <v-card max-width="400" min-height="100" class="mx-auto" elevation="20" shaped>
          <v-img class="ma-4" :src="require('../assets/logo.png')" />
        </v-card>

        <v-flex v-if="mobile" class="mt-5" xs12 text-center>
          <v-btn
            v-if="!this.$auth.loggedIn"
            color="green"
            x-large
            class="mb-2"
            label
            @click="login"
          >
            <v-icon>mdi-login</v-icon> Login
          </v-btn>
          <br>
          <v-card ripple class="mx-auto pa-1 mt-4" outlined width="180">
            <small class="amber--text" color="blue darken-3" @click="registerDialog = !registerDialog"><v-icon class="mr-2 mt-n1">mdi-account-circle</v-icon>Not registered yet ?</small>
          </v-card>

          <!-- <v-btn v-if="!this.$auth.loggedIn" color="blue darken-3" x-large label @click="registerDialog = !registerDialog">
             Register
          </v-btn> -->
        </v-flex>
      </v-card>
    </v-flex>
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
  </v-layout>
</template>
<style scoped>
.sub {
  font-family: 'IBM Plex Sans', sans-serif;
  font-style: italic;
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
