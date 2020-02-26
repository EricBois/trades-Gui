<template>
  <v-container>
    <v-card flat color="#303030">
      <Jobs :jobs="jobsPublic" :cities="citiesPublic" />
    </v-card>
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
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
    if (this.profile.user_metadata && !this.profile.user_metadata.welcomeJobs) {
      this.alertText = process.env.welcomeJobs
      this.alert = true
      this.$axios.$post('account/edit', { user_metadata: { welcomeJobs: true } })
    }
    this.$axios.$get('job/get').then((res) => {
      res.forEach((obj, i) => {
        if (obj.user !== this.$auth.user.sub) {
          this.jobsPublic.push(obj)
          if (obj.location.city.length > 0) {
            this.citiesPublic.push(obj.location.city)
          }
        }
      })
      this.$nuxt.$loading.finish()
    })
  }
}
</script>
