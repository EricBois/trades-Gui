<template>
  <v-container>
    <v-row>
      <v-col xs12 sm4 cols="3">
        <v-card>
          <v-card v-for="user in users" :key="user.id" pl-2>{{user.name}} <v-divider/> </v-card>
        </v-card>
      </v-col>
      <v-col xs12 sm6>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      team: [],
      users: []
    }
  },
  created () {
    this.$axios.$get('team/fetch').then((res) => {
      this.team = res
    })
    this.$axios
      .$get('account/public').then((res) => {
        this.users = res
      })
  }
}
</script>
