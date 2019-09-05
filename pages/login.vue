<template>
  <h2>
    Not Logged in ! Try Loggin in:
    <v-btn @click="login">
      Login
    </v-btn>
  </h2>
</template>

<script>
export default {
  methods: {
    login () {
      this.$auth.loginWith('auth0')
    }
  }
}
</script>
