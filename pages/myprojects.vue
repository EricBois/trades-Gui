<template>
  <v-container>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      centered
      next-icon="mdi-arrow-right-bold-box-outline mdi-48px"
      prev-icon="mdi-arrow-left-bold-box-outline mdi-48px"
      show-arrows
      center-active
      color="white"
    >
      <v-tab>Your Listing</v-tab>
      <v-tab>Private Bidding</v-tab>
      <v-tab>Placed Bids</v-tab>
      <v-tab>Your job listing</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="mt-8">
      <v-tab-item>
        <v-card flat color="#303030">
          <Jobs :jobs="jobs" />
          <v-flex v-if="jobs.length < 1" xs12 text-center>
            <h2>You didn't post any projects.</h2>
            <span class="ibm">*Once you post a project it will appear here so you can easily manage it.*</span>
          </v-flex>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="#303030">
          <Jobs :jobs="jobsPrivate" /><v-flex v-if="jobsPrivate.length < 1" xs12 text-center>
            <h2>No project to display yet!</h2>
            <span class="ibm">*Once you are invited to bid on a project it will be here.*</span>
          </v-flex>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="#303030">
          <Jobs :jobs="placedBids" />
          <v-flex v-if="placedBids.length < 1" xs12 text-center>
            <h2>You didn't place any bid yet!</h2>
            <span class="ibm">*Once you bid on a project it will appear here.*</span>
          </v-flex>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="#303030">
          <JobPosting :jobs.sync="jobsOffer" />
          <v-flex v-if="jobsOffer.length < 1" xs12 text-center>
            <h2>You didn't post any jobs offer!</h2>
            <span class="ibm">*Once you create a job offer it will appear here.*</span>
          </v-flex>
        </v-card>
      </v-tab-item>
    </v-tabs-items>

    <v-dialog v-model="alert" persistent max-width="500">
      <v-card>
        <v-flex xs12>
          <v-alert
            icon="mdi-information-outline"
            prominent
            transition="scale-transition"
            text
            :type="alertInfo"
          >
            {{ alertText }}
          </v-alert>
        </v-flex>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" text @click="alert = false">
            Ok !
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import Jobs from '../components/Jobs.vue'
import JobPosting from '../components/JobPosting.vue'
export default {
  components: {
    Jobs,
    JobPosting
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
      trades: [],
      tradesPrivate: [],
      tradesBids: [],
      citiesPlacedBids: [],
      placedBids: [],
      jobsOffer: []
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  watch: {
    async tab () {
      if (this.tab === 3 && this.jobsOffer.length <= 0) {
        await this.$axios.$get('hiring/get').then((res) => {
          res.forEach((offer) => {
            if (offer.user === this.$auth.user.sub) {
              this.jobsOffer.push(offer)
            }
          })
        })
      }
      if (this.tab) {
        if (this.profile.user_metadata && !this.profile.user_metadata.biddedJobs) {
          this.alertText = process.env.biddedJobs
          this.alert = true
          this.$axios.$post('account/edit', { user_metadata: { biddedJobs: true } })
        }
      }
      if (this.tab === 1) {
        if (this.profile.user_metadata && !this.profile.user_metadata.privateJobs) {
          this.alertText = process.env.privateJobs
          this.alert = true
          this.$axios.$post('account/edit', { user_metadata: { privateJobs: true } })
        }
      }
    }
  },
  async asyncData ({ $axios, $auth }) {
    const jobs = await $axios.$get('job/get/user')
    let jobPrivate = await $axios.$get('job/get/private')
    let placedBids = await $axios.$get('job/get')
    jobPrivate = jobPrivate.filter(job => job.user !== $auth.user.sub)
    placedBids = placedBids.filter(job => job.bids.some(bid => bid.user === $auth.user.sub))
    return {
      jobs,
      jobsPrivate: jobPrivate,
      placedBids
    }
  },
  mounted () {
    if (this.profile.user_metadata && !this.profile.user_metadata.ownPosting) {
      this.alertText = process.env.ownPosting
      this.alert = true
      this.$axios.$post('account/edit', { user_metadata: { ownPosting: true } })
    }
  }
}
</script>
