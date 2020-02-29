<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs6 text-center>
        <v-btn color="green darken-3" small @click="create = !create">
          <v-icon class="mr-1">
            mdi-new-box
          </v-icon>
          Posting
        </v-btn>
      </v-flex>
      <v-flex xs6 text-center>
        <v-btn color="blue darken-3" small @click="dialogLfw = !dialogLfw">
          <v-icon class="mr-1">
            mdi-account-group
          </v-icon>
          Available Today
        </v-btn>
      </v-flex>
    </v-layout>
    <JobPosting :jobs.sync="jobs" />
    <v-dialog v-model="create" persistent max-width="450">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-btn icon dark @click="create = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Job Posting</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <v-form ref="form">
          <v-layout wrap class="pa-6">
            <v-flex xs12>
              <v-combobox
                v-model="posting.skills"
                :items="itemSkills"
                chips
                dense
                label="Required Skills"
                multiple
                autocomplete
              />
            </v-flex>
            <v-flex xs12>
              <v-combobox
                v-model="posting.tickets"
                :items="itemTickets"
                chips
                dense
                label="Required Tickets"
                multiple
                autocomplete
              />
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="posting.description"
                label="Job Description"
                outlined
                :rules="descRule"
                class="purple-input"
                counter="400"
              />
            </v-flex>
            <v-flex xs12 text-center>
              <v-btn color="green darken-3" @click="post()">
                Post Job Offer
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLfw" max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            People actively looking for work
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialogLfw = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <contractors-today />
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
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
}
</style>
<script>
import JobPosting from '../components/JobPosting.vue'
import ContractorsToday from '../components/ContractorsToday.vue'
export default {
  components: {
    JobPosting,
    ContractorsToday
  },
  data () {
    return {
      descRule: [
        v => !!v || 'The description is required',
        v => (v || '').length <= 400 || 'Description should be 400 characters or less '
      ],
      dialogLfw: false,
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
  created () {
    this.itemSkills = process.env.trades.split(',')
    this.itemTickets = process.env.tickets.split(',')
    this.getJobs()
  },
  methods: {
    post () {
      if (this.$refs.form.validate()) {
        this.posting.company = this.$auth.user.name
        this.$axios.$post('hiring/create', this.posting).then((res) => {
          this.getJobs()
          this.create = false
          this.posting.description = ''
          this.posting.skills = []
          this.posting.tickets = []
        })
      }
    },
    async getJobs () {
      this.jobs = []
      await this.$axios.$get('hiring/get').then((res) => {
        res.forEach((obj, i) => {
          this.jobs.push(obj)
        })
      })
    }
  }
}
</script>
