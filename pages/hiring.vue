<template>
  <v-container>
    <v-card
      color="grey darken-3"
      flat
      max-width="650"
      class="mx-auto"
      tile
    >
      <v-layout wrap>
        <v-flex class="ma-2" xs12 text-center>
          <v-btn color="green darken-3" small @click="create = !create">
            <v-icon class="mr-1">
              mdi-new-box
            </v-icon>
            Posting
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>

    <v-flex v-for="job in jobs" :key="job.id" xs12 my-2>
      <v-card ripple max-width="650" class="mx-auto" outlined>
        <v-layout wrap>
          <v-flex xs12 text-left class="pa-1">
            <v-chip small color="amber lighten-3" outlined label>
              Posted {{ fromNow(job.Created) }}
            </v-chip>
          </v-flex>
          <v-flex xs12 text-center>
            <v-chip large class="mt-1" outlined label>
              {{ job.company }}
            </v-chip>
          </v-flex>
          <v-flex class="mt-2" xs12 text-center>
            <span>{{ job.description }}</span>
          </v-flex>
          <v-flex xs6 text-center class="pa-2">
            <div class="sub">
              Skills
              <v-divider class="mx-10 pt-1" />
            </div>
            <v-chip
              v-for="item in job.skills"
              :key="item"
              color="cyan lighten-4"
              x-small
              class="mt-1 mr-1"
              outlined
              label
            >
              {{ item }}
            </v-chip>
          </v-flex>
          <v-flex xs6 text-center class="pa-2">
            <div class="sub">
              Tickets
              <v-divider class="mx-10 pt-1" />
            </div>
            <v-chip
              v-for="item in job.tickets"
              :key="item"
              color="cyan lighten-4"
              x-small
              class="mt-1 mr-1"
              outlined
              label
            >
              {{ item }}
            </v-chip>
          </v-flex>
          <v-flex xs12 class="pa-2">
            <span class="caption mr-2">Got hired?</span>
            2
            <v-icon class="mr-2" small color="green">
              mdi-thumb-up
            </v-icon>
            1
            <v-icon small color="red">
              mdi-thumb-down
            </v-icon>
          </v-flex>
          <v-flex xs12 text-center>
            <v-btn class="ma-2" small color="blue darken-3">
              Apply
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <v-dialog v-model="create" persistent max-width="450">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="create = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Job Posting</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <v-layout wrap class="pa-6">
          <form ref="form">
            <v-flex xs12>
              <v-select
                v-model="posting.skills"
                :items="itemSkills"
                chips
                label="Required Skills"
                multiple
              />
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="posting.tickets"
                :items="itemTickets"
                chips
                label="Required Tickets"
                multiple
              />
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="posting.description"
                label="Job Description"
                solo
                outlined
                class="purple-input"
                counter="400"
              />
            </v-flex>
          </form>
          <v-flex xs12 text-center>
            <v-btn color="green darken-3" @click="post()">
              Post Job Offer
            </v-btn>
          </v-flex>
        </v-layout>
        <v-divider />
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.sub {
  transform: rotate(359deg);
  margin: 0 auto;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: bold;
}
</style>
<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
export default {
  data () {
    return {
      jobs: [],
      create: false,
      itemSkills: [],
      itemTickets: [],
      posting: {
        company: '',
        description: '',
        skills: [],
        tickets: [],
        profile: {}
      }
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  created () {
    this.itemSkills = process.env.trades.split(',')
    this.itemTickets = process.env.tickets.split(',')
    this.getJobs()
    dayjs.extend(relativeTime)
  },
  methods: {
    post () {
      this.posting.company = this.$auth.user.name
      this.posting.profile = this.profile
      this.$axios.$post('hiring/create', this.posting).then((res) => {
        //  direct to jobs page
        this.getJobs()
        this.create = false
      })
    },
    getJobs () {
      this.$axios.$get('hiring/get').then((res) => {
        res.forEach((obj, i) => {
          this.jobs.push(obj)
        })
      })
    },
    fromNow (date) {
      return dayjs(date).fromNow()
    }
  }
}
</script>
