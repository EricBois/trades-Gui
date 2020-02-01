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
          <v-flex v-if="jobs.length < 1" xs12 text-center>
            <h2>You didn't post any projects.</h2>
            <span class="ibm">*Once you post a project it will appear here so you can easily manage it.*</span>
          </v-flex>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="#303030">
          <Jobs :jobs="jobsPrivate" :cities="citiesPrivate" /><v-flex v-if="jobsPrivate.length < 1" xs12 text-center>
            <h2>No project to display yet!</h2>
            <span class="ibm">*Once you are invited to bid on a project it will be here.*</span>
          </v-flex>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="#303030">
          <Jobs :jobs="placedBids" :cities="citiesPlacedBids" />
          <v-flex v-if="placedBids.length < 1" xs12 text-center>
            <h2>You didn't place any bid yet!</h2>
            <span class="ibm">*Once you bid on a project it will appear here.*</span>
          </v-flex>
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
      alert: false,
      alertInfo: 'info',
      alertText: '',
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
            if (this.profile.user_metadata && !this.profile.user_metadata.biddedJobs) {
              this.alertText = process.env.biddedJobs
              this.alert = true
              this.$axios.$post('account/edit', { user_metadata: { biddedJobs: true } })
            }
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
          this.alertText = process.env.privateJobs
          this.alert = true
          this.$axios.$post('account/edit', { user_metadata: { privateJobs: true } })
        }
      }
    }
  },
  mounted () {
    if (this.profile.user_metadata && !this.profile.user_metadata.ownPosting) {
      this.alertText = process.env.ownPosting
      this.alert = true
      this.$axios.$post('account/edit', { user_metadata: { ownPosting: true } })
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
