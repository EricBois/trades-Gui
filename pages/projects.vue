<template>
  <v-container>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      centered
      show-arrows
    >
      <v-tab>Public Listing</v-tab>
      <v-tab>Private Listing</v-tab>
      <v-tab>Your Listing</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="mt-5">
      <v-tab-item>
        <Jobs class="pa-n12" :jobs="jobsPublic" :cities="citiesPublic" />
      </v-tab-item>
      <v-tab-item>
        <Jobs :jobs="jobsPrivate" :cities="citiesPrivate" />
      </v-tab-item>
      <v-tab-item>
        <Jobs :jobs="jobs" :cities="cities" />
      </v-tab-item>
    </v-tabs-items>
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
      jobs: [],
      cities: [],
      jobsPrivate: [],
      citiesPrivate: [],
      jobsPublic: [],
      citiesPublic: [],
      tab: null
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  watch: {
    tab () {
      if (this.tab === 2 && this.jobs.length <= 0) {
        this.$axios.$get('job/get/user').then((res) => {
          res.forEach((obj, i) => {
            this.jobs.push(obj)
            if (obj.location.city.length > 0) {
              this.cities.push(obj.location.city)
            }
          })
        })
      }
      if (this.tab === 1 && this.jobsPrivate.length <= 0) {
        this.$axios.$get('job/get/private').then((res) => {
          res.forEach((obj, i) => {
            this.jobsPrivate.push(obj)
            if (obj.location.city.length > 0) {
              this.citiesPrivate.push(obj.location.city)
            }
          })
        })
      }
    }
  },
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
