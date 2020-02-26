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
        <v-btn color="blue darken-3" small @click="getContractors()">
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
        <v-toolbar dark color="blue">
          <v-spacer />
          <v-toolbar-title class="body-1">
            People actively looking for work
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialogLfw = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card>
          <v-flex xs12 class="mt-4">
            <v-card
              v-if="contractors.length < 1"
              outlined
              max-width="800"
              class="mx-auto mt-2 ma-2"
            >
              <v-flex class="ibm body-2" text-center>
                No one is looking for work at the moment
              </v-flex>
            </v-card>
            <v-card
              v-for="contractor in contractors"
              :key="contractor.id"
              outlined
              max-width="800"
              class="mx-auto mt-2 ma-2"
            >
              <v-layout wrap>
                <v-flex xs8 class="pa-1">
                  <v-chip small color="blue lighten-3" label outlined @click="showProfile(contractor.user)">
                    <v-icon small class="mr-1">
                      mdi-information-outline
                    </v-icon>
                    {{ contractor.name }}
                  </v-chip>
                </v-flex>
                <v-flex xs4 class="pa-1">
                  <v-btn color="blue lighten-3" outlined small @click="showDetails(contractor)">
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
    <v-dialog v-model="dialogUser" max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-spacer />
          <v-toolbar-title class="body-1">
            User details
          </v-toolbar-title>
          <v-btn icon dark @click="dialogUser = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout class="pa-2" wrap>
          <v-flex xs12 text-center>
            <v-chip large outlined label>
              {{ currentUser.name }}
            </v-chip>
          </v-flex>
          <v-flex xs12>
            Expected wage: <v-chip class="ma-1" label small>
              {{ currentUser.hourly }}
            </v-chip>
          </v-flex>
          <v-flex xs12>
            Looking for work in:
            <v-chip v-for="loc in currentUser.location" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>
          <v-flex xs12>
            Employment type:
            <v-chip v-for="loc in currentUser.employment" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>
          <v-flex xs12>
            Experience: &nbsp;
            {{ currentUser.experience }}
          </v-flex>
          <v-flex xs12>
            References: &nbsp;
            {{ currentUser.reference }}
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
        </v-layout>
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
export default {
  components: {
    JobPosting
  },
  data () {
    return {
      descRule: [
        v => !!v || 'The description is required',
        v => (v || '').length <= 400 || 'Description should be 400 characters or less '
      ],
      dialogProfile: false,
      dialogLfw: false,
      dialogUser: false,
      currentUser: {},
      jobs: [],
      create: false,
      itemSkills: [],
      itemTickets: [],
      contractors: [],
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
    },
    async getContractors () {
      await this.$axios.$get('hiring/getContractors').then((res) => {
        this.contractors = res
      })
      this.dialogLfw = true
    },
    showDetails (contractor) {
      this.currentUser = contractor
      this.dialogUser = true
    }
  }
}
</script>
