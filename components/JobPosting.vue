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
          <v-flex v-if="job.user === $auth.user.sub" xs12 class="mt-2" text-center>
            <v-btn
              class="ma-2"
              small
              color="blue-grey darken-2"
              @click="applications(job)"
            >
              <v-icon small class="mr-1">
                mdi-account-group
              </v-icon>
              Applications
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
    <v-dialog v-model="dialogApplications" max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Applications
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialogApplications = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card>
          <v-flex xs12 class="mt-4">
            <v-card
              v-if="currentJob.applicants && currentJob.applicants.length < 1"
              outlined
              max-width="800"
              class="mx-auto mt-2 ma-2"
            >
              <v-flex class="ibm body-2" text-center>
                No one applied at the moment
              </v-flex>
            </v-card>
            <v-card
              v-for="applicant in currentJob.applicants"
              :key="applicant.id"
              outlined
              max-width="800"
              class="mx-auto mt-2 ma-2"
            >
              <v-layout wrap>
                <v-flex xs8 class="pa-1">
                  <v-chip small color="blue lighten-3" label outlined @click="showProfile(applicant.uid)">
                    <v-icon small class="mr-1">
                      mdi-information-outline
                    </v-icon>
                    {{ applicant.name }}
                  </v-chip>
                </v-flex>
                <v-flex xs4 class="pa-1">
                  <v-btn color="blue lighten-3" outlined small @click="showDetails(applicant)">
                    Details
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-card>
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogApplied" max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            User details
          </v-toolbar-title>
          <v-btn icon dark @click="dialogApplied = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout class="pa-2" wrap>
          <v-flex xs12 text-center>
            <v-chip large outlined label @click="showProfile(currentUser.uid)">
              <v-icon color="green accent-2" small class="mr-1">
                mdi-information-outline
              </v-icon>
              {{ currentUser.name }}
            </v-chip>
          </v-flex>
          <v-flex v-if="currentUser.wage" xs12>
            Expected wage: <v-chip class="ma-1" label small>
              {{ currentUser.wage }}
            </v-chip>
          </v-flex>
          <v-flex v-if="currentUser.experience" xs12>
            Experience: &nbsp;
            {{ currentUser.experience }}
          </v-flex>
          <v-flex v-if="currentUser.references" xs12>
            References: &nbsp;
            {{ currentUser.references }}
          </v-flex>
          <v-flex xs12>
            Skills:
            <v-chip v-for="loc in currentUser.skills" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>
          <v-flex xs12>
            Tickets:
            <v-chip v-for="loc in currentUser.tickets" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>
          <v-flex class="mt-3 ma-1 " xs12 text-right>
            <v-btn small color="blue-grey darken-2" @click="askInfo(currentUser)">
              Contact info
            </v-btn>
            <v-btn small color="blue darken-3">
              Request a call
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogProfile" max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
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
        <v-toolbar dark color="blue darken-3">
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
        <v-toolbar dark color="blue darken-3">
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
              <h3>Your contact info</h3>
              <small>*Will be shared with the other party. </small>
              <v-divider />
              <v-text-field
                v-model="application.contact.phone"
                label="Phone number"
                class="purple-input"
                type="text"
              />
              <v-text-field
                v-model="application.contact.email"
                label="Email"
                class="purple-input"
                type="text"
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
    <v-dialog
      v-model="dialogInfo"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Contact Info
        </v-card-title>

        <v-flex v-if="currentUser.contact && currentUser.contact.phone" text-center xs12>
          Phone: <a :href="'tel:'+currentUser.contact.phone">{{ currentUser.contact.phone }}</a>
        </v-flex>
        <v-flex v-if="currentUser.contact && currentUser.contact.email" text-center xs12>
          Email: <a :href="'mailto:'+currentUser.contact.email">{{ currentUser.contact.email }}</a>
        </v-flex>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="blue darken-3"
            text
            @click="dialogInfo = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
a:link {
  color: darkgray;
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
      dialogApplications: false,
      dialogApplied: false,
      dialogInfo: false,
      currentJob: {},
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
        tickets: [],
        contact: {
          phone: '',
          email: ''
        }
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
    askInfo (user) {
      this.currentUser = user
      this.dialogInfo = true
    },
    applications (job) {
      this.currentJob = job
      this.dialogApplications = true
    },
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
      if (this.profile.user_metadata && this.profile.user_metadata.phone) {
        this.application.contact.phone = this.profile.user_metadata.phone
      }
      if (this.profile.email) {
        this.application.contact.email = this.profile.email
      }
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
    },
    showDetails (contractor) {
      this.currentUser = contractor
      this.dialogApplied = true
    }
  }
}
</script>
