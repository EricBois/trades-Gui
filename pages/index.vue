<template>
  <v-layout wrap>
    <v-flex xs12 text-center>
      <h2 v-if="error">
        {{ error }}
      </h2>
    </v-flex>
    <v-flex xs12 text-center>
      <v-card max-width="650" class="mx-auto pa-6">
        <v-card max-width="600" min-height="100" class="mx-auto" elevation="15" shaped>
          <h1>Sub Hub community</h1>
          <span class="sub">Where contractors meet</span>
        </v-card>
      </v-card>
    </v-flex>
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
  data () {
    return {
      profile: this.$auth.token,
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
      this.$swal.fire({
        type: 'info',
        title: 'Verify Your Email',
        text: 'Please verify your email address.',
        footer: 'Look in your email'
      })
    }
  },
  methods: {
    logout () {
      this.$auth.logout()
      this.$router.push('/')
    }
  }
}
</script>
