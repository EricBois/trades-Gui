<template>
  <v-container>
    <v-card
      elevation="22"
      max-width="844"
      class="mx-auto"
    >
      Not Logged in ! Try Loggin in:
      <v-btn @click="login">
        Login
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  mounted () {
    console.log(this.$route)
  },
  methods: {
    login () {
      this.$auth.loginWith('auth0')
    }
  }
}
</script>
