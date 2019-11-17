<template>
  <Jobs :jobs="jobs" :cities="cities" />
</template>
<script>

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
  mounted () {
    this.$axios.$get('job/get').then((res) => {
      res.forEach((obj, i) => {
        this.jobs.push(obj)
        if (obj.location.city.length > 0) {
          this.cities.push(obj.location.city)
        }
      })
    }).catch(() => {
      this.$router.push('/')
    })
  }
}
</script>
