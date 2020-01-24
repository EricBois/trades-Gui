<template>
  <v-container>
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
    <v-card flat color="#303030">
      <Jobs :jobs="jobsPublic" :cities="citiesPublic" />
    </v-card>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import Jobs from '../components/Jobs.vue'
export default {
  components: {
    Jobs
  },
  data () {
    return {
      alert: false,
      alertInfo: 'info',
      alertText: '',
      jobsPublic: [],
      citiesPublic: []
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  mounted () {
    if (this.profile.user_metadata && !this.profile.user_metadata.welcomeJobs) {
      this.alertText = process.env.welcomeJobs
      this.alert = true
      this.$axios.$post('account/edit', { user_metadata: { welcomeJobs: true } })
    }
    this.$axios.$get('job/get').then((res) => {
      res.forEach((obj, i) => {
        this.jobsPublic.push(obj)
        if (obj.location.city.length > 0) {
          this.citiesPublic.push(obj.location.city)
        }
      })
    })
  }
}
</script>
