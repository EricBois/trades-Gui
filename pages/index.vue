<template>
  <v-layout>
    <v-flex xs12 text-center>
      TODO Graphs and general informations
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  data () {
    return {
      profile: this.$auth.token
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
