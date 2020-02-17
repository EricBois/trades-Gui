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
      <v-card max-width="650" class="mx-auto mt-4" outlined>
        <v-layout wrap>
          <v-flex xs9 text-left class="pa-1">
            <v-chip small color="amber lighten-3" outlined label>
              Posted {{ fromNow(job.created) }}
            </v-chip>
          </v-flex>
          <v-flex v-if="job.user === $auth.user.sub" xs3 text-right>
            <v-btn color="yellow darken-3" small icon @click="askEdit(job)">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 text-center>
            <v-chip
              large
              class="mt-1"
              color="blue-grey lighten-5"
              outlined
              label
              @click="showProfile(job.profile)"
            >
              <v-icon class="mr-2">
                mdi-information-outline
              </v-icon>
              {{ job.company }}
            </v-chip>
          </v-flex>
          <v-flex class="mt-2" xs12 text-center>
            <v-card class="pa-2" elevation="4" tile>
              <span>{{ job.description }}</span>
            </v-card>
          </v-flex>
          <v-flex v-if="job.skills.length > 0" xs6 text-center class="pa-2">
            <div class="sub">
              Looking for
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
          <v-flex v-if="job.tickets.length > 0" xs6 text-center class="pa-2">
            <div class="sub">
              With
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

          <v-flex xs12 class="mt-2" text-center>
            <v-btn
              class="ma-2"
              small
              color="blue-grey darken-2
"
              @click="showProfile(job.profile)"
            >
              <v-icon small class="mr-1">
                mdi-account-box
              </v-icon>
              Information
            </v-btn>
          </v-flex>
          <v-flex xs8 class="pa-2">
            <span class="caption mr-2">Still hiring?</span>
            <span v-if="job.hired">
              {{ job.hired.length }}
            </span>
            <v-icon v-if="!job.hired.includes($auth.user.sub)" class="mr-2" small color="green" @click="hired(job._id, true)">
              mdi-thumb-up
            </v-icon>
            <v-icon v-else class="mr-2" small color="green">
              mdi-thumb-up
            </v-icon>
            <span v-if="job.notHired">
              {{ job.notHired.length }}
            </span>
            <v-icon v-if="!job.notHired.includes($auth.user.sub)" small color="red" @click="hired(job._id, false)">
              mdi-thumb-down
            </v-icon>
            <v-icon v-else small color="red">
              mdi-thumb-down
            </v-icon>
          </v-flex>
          <v-flex v-if="job.user === $auth.user.sub" xs4 text-right>
            <v-btn color="red darken-3" class="mr-2 mt-2" small @click="askDelete(job._id)">
              <v-icon class="mr-1" small>
                mdi-alert
              </v-icon>
              delete
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
        <v-form ref="form">
          <v-layout wrap class="pa-6">
            <v-flex xs12>
              <v-select
                v-model="posting.skills"
                :items="itemSkills"
                chips
                dense
                label="Required Skills"
                multiple
              />
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="posting.tickets"
                :items="itemTickets"
                chips
                dense
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
    <v-dialog v-model="dialogProfile" max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogProfile = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Profile</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <PublicProfile :user="currentUser" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Please Confirm
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete this posting ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="orange darken-3"
            text
            @click="dialogDelete = false"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="del(currentId)"
          >
            Yes, Let's Go!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogEdit" persistent max-width="450">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogEdit = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Edit Job Posting</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <v-form ref="form">
          <v-layout wrap class="pa-6">
            <v-flex xs12>
              <v-select
                v-model="posting.skills"
                :items="itemSkills"
                chips
                dense
                label="Required Skills"
                multiple
              />
            </v-flex>
            <v-flex xs12>
              <v-select
                v-model="posting.tickets"
                :items="itemTickets"
                chips
                dense
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
                :rules="descRule"
                class="purple-input"
                counter="400"
              />
            </v-flex>
            <v-flex xs12 text-center>
              <v-btn color="green darken-3" @click="edit(currentId)">
                Edit Job Offer
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
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
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
}
</style>
<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PublicProfile from '../components/PublicProfile.vue'
export default {
  components: {
    PublicProfile
  },
  data () {
    return {
      descRule: [
        v => !!v || 'The description is required',
        v => (v || '').length <= 400 || 'Description should be 400 characters or less '
      ],
      dialogDelete: false,
      dialogProfile: false,
      dialogEdit: false,
      currentUser: {},
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
  watch: {
    currentUser () {
      if (this.currentUser.user_metadata && this.currentUser.user_metadata.phone) {
        this.phone = `tel:${this.currentUser.user_metadata.phone}`
      }
    }
  },
  created () {
    this.itemSkills = process.env.trades.split(',')
    this.itemTickets = process.env.tickets.split(',')
    this.getJobs()
    dayjs.extend(relativeTime)
  },
  methods: {
    showProfile (currentprofile) {
      this.currentUser = currentprofile
      this.dialogProfile = true
    },
    askDelete (id) {
      this.currentId = id
      this.dialogDelete = true
    },
    askEdit (job) {
      this.currentId = job._id
      this.posting.description = job.description
      this.posting.skills = job.skills
      this.posting.tickets = job.tickets
      this.dialogEdit = true
    },
    post () {
      if (this.$refs.form.validate()) {
        this.posting.company = this.$auth.user.name
        this.posting.profile = this.profile
        this.$axios.$post('hiring/create', this.posting).then((res) => {
          this.getJobs()
          this.create = false
          this.posting.description = ''
          this.posting.skills = []
          this.posting.tickets = []
        })
      }
    },
    getJobs () {
      this.$axios.$get('hiring/get').then((res) => {
        this.jobs = []
        res.forEach((obj, i) => {
          this.jobs.push(obj)
        })
      })
    },
    fromNow (date) {
      return dayjs(date).fromNow()
    },
    // set uid in hired or not hired
    hired (id, status) {
      this.$axios.$post(`hiring/status/${id}`, { status }).then((res) => {
        this.getJobs()
        this.create = false
      })
    },
    // Delete posting
    del (id) {
      this.$axios.$post(`hiring/delete/${id}`).then((res) => {
        this.getJobs()
        this.dialogDelete = false
      })
    },
    edit (id) {
      if (this.$refs.form.validate()) {
        this.posting.company = this.$auth.user.name
        this.posting.profile = this.profile
        this.$axios.$post(`hiring/edit/${id}`, this.posting).then((res) => {
          this.getJobs()
          this.create = false
        })
      }
    }
  }
}
</script>
