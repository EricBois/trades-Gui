<template>
  <v-container>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      centered
      show-arrows
      color="white"
    >
      <v-tab>Your Listing</v-tab>
      <v-tab>Private Bidding</v-tab>
      <v-tab>Placed Bids</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="mt-8">
      <v-tab-item>
        <v-card flat color="#303030">
          <Jobs :jobs="jobs" :cities="cities" />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="#303030">
          <Jobs :jobs="jobsPrivate" :cities="citiesPrivate" />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="#303030">
          <Jobs :jobs="placedBids" :cities="citiesPlacedBids" />
        </v-card>
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
      tab: null,
      citiesPlacedBids: [],
      placedBids: []
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  watch: {
    async tab () {
      if (this.tab === 2 && this.placedBids.length <= 0) {
        this.$nuxt.$loading.start()
        await this.$axios.$get('job/get').then((res) => {
          res.forEach((obj, i) => {
            obj.bids.forEach((bid, i) => {
              if (bid.user === this.$auth.user.sub) {
                this.placedBids.push(obj)
                if (obj.location.city.length > 0) {
                  this.citiesPlacedBids.push(obj.location.city)
                }
              }
            })
            this.$nuxt.$loading.finish()
          })
        })
        if (this.jobsPrivate.length <= 0) { await this.getPrivate() }
        await this.jobsPrivate.forEach((obj, i) => {
          obj.bids.forEach((bid, i) => {
            if (bid.user === this.$auth.user.sub) {
              this.placedBids.push(obj)
              if (obj.location.city.length > 0) {
                this.citiesPlacedBids.push(obj.location.city)
              }
            }
          })
        })
      }
      if (this.tab === 1 && this.jobsPrivate.length <= 0) {
        this.getPrivate()
        if (this.profile.user_metadata && !this.profile.user_metadata.privateJobs) {
          this.$swal.fire({
            position: 'bottom-end',
            type: 'info',
            text: process.env.privateJobs,
            showConfirmButton: true,
            width: '22rem'
          }).then(() => {
            return this.$axios.$post('account/edit', { user_metadata: { privateJobs: true } })
          })
        }
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
    this.$axios.$get('job/get/user').then((res) => {
      res.forEach((obj, i) => {
        this.jobs.push(obj)
        if (obj.location.city.length > 0) {
          this.cities.push(obj.location.city)
        }
      })
    })
  },
  methods: {
    async getPrivate () {
      await this.$axios.$get('job/get/private').then((res) => {
        res.forEach((obj, i) => {
          if (obj.user !== this.$auth.user.sub) {
            this.jobsPrivate.push(obj)
            if (obj.location.city.length > 0) {
              this.citiesPrivate.push(obj.location.city)
            }
          }
        })
      })
    }
  }
}
</script>
