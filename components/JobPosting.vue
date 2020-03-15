<template>
  <v-container>
    <v-card
      max-width="650"
      class="mx-auto"
    >
      <v-layout row wrap class="mx-4 mb-5">
        <v-flex xs12 text-center class="my-n6">
          <span class="mainTitle2 grey--text"><u>Filter by</u></span>
        </v-flex>
        <v-flex xs4>
          <v-text-field v-model="search" placeholder="name.." class="mt-3">
            Search
          </v-text-field>
        </v-flex>
        <v-flex xs4 class="px-3">
          <v-combobox
            v-model="city"
            :items="cities"
            chips
            dense
            label="City"
            multiple
            autocomplete
          />
        </v-flex>
        <v-flex xs4>
          <v-combobox
            v-model="trade"
            :items="trades"
            chips
            dense
            label="Skills"
            multiple
            autocomplete
          />
        </v-flex>
      </v-layout>
    </v-card>
    <v-flex v-for="job in filteredList" :key="job.id" xs12 my-2>
      <v-card max-width="650" class="mx-auto mt-4" outlined>
        <v-layout wrap>
          <v-flex xs9 text-left class="pa-1">
            <v-chip small color="amber lighten-3" outlined label>
              Posted {{ fromNow(job.created) }}
            </v-chip>
          </v-flex>
          <v-flex v-if="job.user === $auth.user.sub" xs3 text-right>
            <v-btn @click="askEdit(job)" color="yellow darken-3" small icon>
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>
          </v-flex>
          <v-flex v-else xs3 class="pa-1" text-right>
            <v-chip v-if="job.location && job.location.city" color="amber lighten-3" small label outlined>
              <v-icon class="mr-1">
                mdi-city
              </v-icon>
              {{ job.location.city }}
            </v-chip>
          </v-flex>
          <v-flex xs12 text-center>
            <v-chip
              @click="showProfile(job.user)"
              large
              class="mt-1 mr-2"
              color="blue-grey lighten-5"
              outlined
              label
            >
              <v-icon class="mr-2">
                mdi-information-outline
              </v-icon>
              {{ job.company }}
            </v-chip>
            <span v-if="job.location && job.location.url && job.location.url.length >= 1">
              <a :href="job.location.url" rel="noreferrer" target="_blank"><v-icon>mdi-google-maps</v-icon></a>
            </span>
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
              @click="askWithdraw(job)"
              class="ma-2"
              small
              color="orange darken-2"
            >
              <v-icon small class="mr-1">
                mdi-cancel
              </v-icon>
              Withdraw Application
            </v-btn>
            <v-btn
              v-else
              @click="askApply(job)"
              class="ma-2"
              small
              color="green darken-3"
            >
              <v-icon small class="mr-1">
                mdi-account-box
              </v-icon>
              Apply
            </v-btn>
          </v-flex>
          <v-flex v-if="job.user === $auth.user.sub" xs12 class="mt-2" text-center>
            <v-btn
              v-if="job.applicants && job.applicants.length >= 1"
              @click="applications(job)"
              class="ma-2"
              small
              color="blue-grey darken-2"
            >
              <v-icon small class="mr-1">
                mdi-account-group
              </v-icon>
              {{ job.applicants.length }}
              <span v-if="job.applicants.length <= 1">
                Application
              </span>
              <span v-else>
                Applications
              </span>
            </v-btn>
            <v-btn v-else outlined disabled>
              <v-icon small class="mr-1">
                mdi-account-group
              </v-icon>
              No applications
            </v-btn>
          </v-flex>
          <v-flex xs8 class="pa-2">
            <span class="caption mr-2">Still hiring?</span>
            <span v-if="job.hired">
              {{ job.hired.length }}
            </span>
            <v-icon v-if="!job.hired.includes($auth.user.sub)" @click="hired(job._id, true)" class="mr-2" small color="green">
              mdi-thumb-up
            </v-icon>
            <v-icon v-else class="mr-2" small color="green">
              mdi-thumb-up
            </v-icon>
            <span v-if="job.notHired">
              {{ job.notHired.length }}
            </span>
            <v-icon v-if="!job.notHired.includes($auth.user.sub)" @click="hired(job._id, false)" small color="red">
              mdi-thumb-down
            </v-icon>
            <v-icon v-else small color="red">
              mdi-thumb-down
            </v-icon>
          </v-flex>
          <v-flex v-if="job.user === $auth.user.sub" xs4 text-right>
            <v-btn @click="askDelete(job._id)" color="red darken-3" class="mr-2 mt-2" small>
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
          <v-btn @click="dialogApplications = false" icon dark>
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
                  <v-chip @click="showProfile(applicant.uid)" small color="blue lighten-3" label outlined>
                    <v-icon small class="mr-1">
                      mdi-information-outline
                    </v-icon>
                    {{ applicant.name }}
                  </v-chip>
                </v-flex>
                <v-flex xs4 class="pa-1">
                  <v-btn @click="showDetails(applicant)" color="blue lighten-3" outlined small>
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
          <v-btn @click="dialogApplied = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout class="pa-2" wrap>
          <v-flex xs12 text-center>
            <v-chip @click="showProfile(currentUser.uid)" large outlined label>
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
            <v-btn @click="askInfo(currentUser)" small color="blue-grey darken-2">
              Contact info
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
          <v-btn @click="dialogProfile = false" icon dark>
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
            @click="dialogDelete = false"
            color="orange darken-3"
            text
          >
            No
          </v-btn>

          <v-btn
            @click="del(currentId)"
            color="green darken-1"
            text
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
          <v-btn @click="dialogEdit = false" icon dark>
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
            <v-flex class="mb-4" xs12>
              <gmap-autocomplete
                :value="posting.location.address"
                :select-first-on-enter="true"
                @place_changed="setPlace"
                class="gmap v-input__slot v-text-field"
                placeholder="Location"
              />
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="posting.description"
                :rules="descRule"
                label="Job Description"
                outlined
                class="purple-input"
                counter="400"
              />
            </v-flex>
            <v-flex xs12 text-center>
              <v-btn @click="edit(currentId)" color="green darken-3">
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
          <v-btn @click="dialogApply = false" icon dark>
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
                :rules="descRule"
                label="What's your experience?"
                outlined
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
              <v-btn @click="apply(currentId)" color="green darken-3">
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
            @click="dialogWithdraw = false"
            color="orange darken-3"
            text
          >
            No
          </v-btn>

          <v-btn
            @click="withdraw(currentId)"
            color="green darken-1"
            text
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
            @click="dialogInfo = false"
            color="blue darken-3"
            text
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card
      v-if="pages > 1"
      max-width="650"
      class="mx-auto mt-4"
    >
      <v-pagination
        v-model="page"
        :length="pages"
      />
    </v-card>
  </v-container>
</template>
<style scoped>
a:link {
  color: darkgray;
}
.mainTitle2 {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 1.7em;
      font-weight: bold;
      font-style: italic;
      font-display: swap;
    }
</style>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
export default {
  components: {
    PublicProfile: () => import('../components/PublicProfile.vue')
  },
  props: {
    jobs: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      city: '',
      cities: [],
      trade: '',
      trades: [],
      search: '',
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
        profile: {},
        location: {
          lat: '',
          lng: '',
          address: '',
          country: '',
          city: '',
          province: '',
          url: ''
        }
      },
      page: 1,
      perPage: 10,
      pages: [],
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
    }),
    filteredList () {
      let filtered = this.jobs
      if (this.search.length > 0) {
        filtered = this.jobs.filter(job => job.company.toLowerCase().includes(this.search))
      }
      if (this.city.length > 0) {
        filtered = filtered.filter(job => this.city.includes(job.location.city))
      }
      if (this.trade.length > 0) {
        // filtered = filtered.filter(job => new RegExp(job.skills.join('|')).test(this.trade))
        filtered = filtered.filter(job => this.trade.some(el => job.skills.includes(el)))
      }
      return this.paginate(filtered)
    }
  },
  watch: {
    currentUser () {
      if (this.currentUser.user_metadata && this.currentUser.user_metadata.phone) {
        this.phone = `tel:${this.currentUser.user_metadata.phone}`
      }
    },
    filteredList () {
      this.setPages()
    },
    jobs () {
      this.jobs.forEach((job) => {
        if (!this.cities.includes(job.location.city)) {
          this.cities.push(job.location.city)
        }
        job.skills.forEach((skill) => {
          if (!this.trades.includes(skill)) {
            this.trades.push(skill)
          }
        })
      })
    }
  },
  created () {
    this.itemSkills = process.env.trades.split(',')
    this.itemTickets = process.env.tickets.split(',')
    dayjs.extend(relativeTime)
  },
  methods: {
    setPages () {
      this.pages = Math.ceil(this.jobs.length / this.perPage)
    },
    paginate (jobs) {
      const page = this.page
      const perPage = this.perPage
      const from = (page * perPage) - perPage
      const to = (page * perPage)
      return jobs.slice(from, to)
    },
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
      this.posting.location = job.location
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
    },
    setPlace (place) {
      this.posting.location.address = place.formatted_address
      this.posting.location.lat = place.geometry.location.lat()
      this.posting.location.lng = place.geometry.location.lng()
      this.posting.location.url = place.url
      const address = place.address_components.map(address => ({ type: address.types, name: address.long_name }))
      for (const key in address) {
        const posting = address[key]
        if (posting.type.includes('administrative_area_level_1')) {
          this.posting.location.province = posting.name
        }
        if (posting.type.includes('locality')) {
          this.posting.location.city = posting.name
        }
        if (posting.type.includes('country')) {
          this.posting.location.country = posting.name
        }
      }
    }
  }
}
</script>
