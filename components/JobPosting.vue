<template>
  <v-container>
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
              @click="showProfile(job.user)"
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
          <v-flex v-if="job.user !== $auth.user.sub" xs12 class="mt-2" text-center>
            <v-btn
              v-if="job.applicants.map(applicant => applicant.uid).includes($auth.user.sub)"
              class="ma-2"
              small
              color="orange darken-2"
              @click="askWithdraw(job)"
            >
              <v-icon small class="mr-1">
                mdi-cancel
              </v-icon>
              Withdraw Application
            </v-btn>
            <v-btn
              v-else
              class="ma-2"
              small
              color="green darken-3"
              @click="askApply(job)"
            >
              <v-icon small class="mr-1">
                mdi-account-box
              </v-icon>
              Apply
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
    <v-dialog v-model="dialogProfile" max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Profile
          </v-toolbar-title>
          <v-btn icon dark @click="dialogProfile = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
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
          <v-spacer />
          <v-toolbar-title class="body-1">
            Edit Job Posting
          </v-toolbar-title>
          <v-btn icon dark @click="dialogEdit = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
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

    <v-dialog v-model="dialogApply" persistent max-width="450">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Application Form
          </v-toolbar-title>
          <v-btn icon dark @click="dialogApply = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form ref="form">
          <v-layout wrap class="pa-6">
            <v-flex xs12>
              <v-combobox
                v-model="application.skills"
                :items="itemSkills"
                chips
                dense
                label="Your Skills"
                multiple
                autocomplete
              />
            </v-flex>
            <v-flex xs12>
              <v-combobox
                v-model="application.tickets"
                :items="itemTickets"
                chips
                dense
                label="Your Tickets"
                multiple
                autocomplete
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="application.wage"
                label="Wage expectation"
                placeholder="*optional"
                class="purple-input"
                prefix="$"
                type="text"
              />
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="application.experience"
                label="What's your experience?"
                outlined
                :rules="descRule"
                class="purple-input"
                counter="400"
              />
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="application.references"
                label="List any references"
                outlined
                class="purple-input"
              />
            </v-flex>
            <v-flex xs12 text-center>
              <v-btn color="green darken-3" @click="apply(currentId)">
                Apply
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogWithdraw"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Please Confirm
        </v-card-title>

        <v-card-text>
          Are you sure you want to withdraw your application ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="orange darken-3"
            text
            @click="dialogWithdraw = false"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="withdraw(currentId)"
          >
            Yes!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PublicProfile from '../components/PublicProfile.vue'
export default {
  components: {
    PublicProfile
  },
  props: {
    jobs: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      descRule: [
        v => !!v || 'The description is required',
        v => (v || '').length <= 400 || 'Description should be 400 characters or less '
      ],
      dialogWithdraw: false,
      dialogApply: false,
      dialogDelete: false,
      dialogProfile: false,
      dialogEdit: false,
      currentUser: {},
      itemSkills: [],
      itemTickets: [],
      contractors: [],
      newJobs: [],
      posting: {
        company: '',
        description: '',
        skills: [],
        tickets: [],
        profile: {}
      },
      application: {
        name: '',
        experience: '',
        references: '',
        wage: '',
        skills: [],
        tickets: []
      }
    }
  },
  computed: {
    ...mapGetters({
      profile: 'profile/getProfile'
    })
  },
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
    dayjs.extend(relativeTime)
  },
  methods: {
    withdraw (id) {
      this.$axios.$post(`hiring/withdraw/${id}`).then((res) => {
        this.getJobs()
        this.dialogWithdraw = false
      })
    },
    apply (id) {
      if (this.$refs.form.validate()) {
        this.application.name = this.$auth.user.name
        this.$axios.$post(`hiring/apply/${id}`, this.application).then((res) => {
          this.experience = ''
          this.references = ''
          this.wage = ''
          this.getJobs()
          this.dialogApply = false
        })
      }
    },
    showProfile (id) {
      this.$axios.$get(`account/getProfile/${id}`).then((res) => {
        this.currentUser = res
        if (!this.currentUser.photos) {
          this.currentUser.photos = []
        }
      }).then(() => {
        this.dialogProfile = true
      })
    },
    askDelete (id) {
      this.currentId = id
      this.dialogDelete = true
    },
    askWithdraw (job) {
      this.currentId = job._id
      this.dialogWithdraw = true
    },
    askApply (job) {
      this.currentId = job._id
      this.application.skills = this.profile.user_metadata.skills
      this.application.tickets = this.profile.user_metadata.tickets
      this.dialogApply = true
    },
    askEdit (job) {
      this.currentId = job._id
      this.posting.description = job.description
      this.posting.skills = job.skills
      this.posting.tickets = job.tickets
      this.dialogEdit = true
    },
    async getJobs () {
      this.newJobs = []
      await this.$axios.$get('hiring/get').then((res) => {
        this.$emit('update:jobs', res)
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
        this.$axios.$post(`hiring/edit/${id}`, this.posting).then((res) => {
          this.dialogEdit = false
          this.getJobs()
        })
      }
    }
  }
}
</script>
