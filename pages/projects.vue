<template>
  <v-container>
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
      jobsPublic: [],
      citiesPublic: []
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  mounted () {
    if (this.profile.user_metadata && !this.profile.user_metadata.welcomeJobs) {
      this.$swal.fire({
        position: 'bottom-end',
        type: 'info',
        text: process.env.welcomeJobs,
        showConfirmButton: true,
        width: '22rem'
      }).then(() => {
        return this.$axios.$post('account/edit', { user_metadata: { welcomeJobs: true } })
      })
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
