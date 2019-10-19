<template>
  <v-container>
    <v-card elevation="22" max-width="844" height="300" class="mx-auto">
      <v-flex text-center xs12 class="pt-5">
        <h2 v-if="error">
          {{ error }}
        </h2>
        <h2 v-else>
          <v-icon>mdi-arrow-down-box</v-icon>Please Login
          <v-icon>mdi-arrow-down-box</v-icon>
        </h2>
      </v-flex>
      <v-flex text-center xs12 class="pt-5">
        <v-btn color="green" x-large ripple @click="login">
          <v-icon>mdi-login</v-icon>Login
        </v-btn>
      </v-flex>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      error: ''
    }
  },
  created () {
    if (
      this.$route.hash.includes(
        '#error=unauthorized&error_description=Please%20verify%20your%20email%20before%20logging%20in'
      )
    ) {
      this.error = 'Please verify your email before logging in'
    }
  },
  methods: {
    login () {
      this.$auth.loginWith('auth0')
    }
  }
}
</script>
