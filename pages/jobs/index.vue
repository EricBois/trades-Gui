<template>
  <Jobs :jobs="jobs" :cities="cities" />
</template>
<script>
import { mapGetters } from 'vuex'
import Jobs from '../../components/Jobs.vue'
export default {
  components: {
    Jobs
  },
  data () {
    return {
      jobs: [],
      cities: []
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
        this.jobs.push(obj)
        if (obj.location.city.length > 0) {
          this.cities.push(obj.location.city)
        }
      })
    })
  }
}
</script>
