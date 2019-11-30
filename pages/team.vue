<template>
  <v-container>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      centered
      show-arrows
      color="white"
    >
      <v-tab>Your Team</v-tab>
      <v-tab>Team Projects</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" touchless class="mt-8">
      <v-tab-item>
        <v-card flat color="#303030">
          <v-layout row wrap>
            <v-flex xs12 text-center>
              <v-divider class="mb-5" />
              <v-icon>mdi-axis-x-arrow</v-icon>
              <span class="mainTitle">Your Team</span>
              <v-icon>mdi-axis-y-arrow</v-icon>
              <v-divider class="my-5" />
            </v-flex>
            <v-flex xs12 sm6 offset-sm-3 text-center>
              <v-text-field
                v-model="search"
                placeholder="Search by Name.."
                class="purple-input center"
                solo
                clearable
                dense
              />
              <v-btn
                v-if="search.length > 0 || city.length > 0 || trade.length > 0 || wcb || liability || ticket.length > 0"
                small
                rounded
                class="mt-n12"
                color="orange darken-4"
                @click="clearFilters"
              >
                Clear filters
              </v-btn>
              <v-btn rounded color="teal darken-4" small class="mt-n12" @click="searchDialog = !searchDialog">
                Advanced search
              </v-btn>
            </v-flex>
            <v-flex
              xs6
              sm3
              offset-sm-2
              offset-xl-3
              xl2
              class="pr-3"
              text-center
            >
              <v-card color="blue-grey darken-1">
                <v-divider />
                <h3>Available users</h3>
                <v-divider />
              </v-card>
              <v-card v-if="users.length > 0" class="pb-3 scroll mb-5" height="320">
                <draggable class="list-group" :list="users" group="team" @change="save">
                  <v-card
                    v-for="user in filteredList"
                    :key="user.id"
                    flat
                    outlined
                    shaped
                    class="bg ma-2"
                    @click="dialog2(user)"
                  >
                    {{ user.name }} <v-divider />
                  </v-card>
                </draggable>
              </v-card>
              <v-card v-else class="mb-5" height="320">
                <draggable class="list-group" :list="users" group="team" @change="save" />
                No users available
              </v-card>
            </v-flex>
            <v-flex xs6 sm3 offset-sm-2 xl2 text-center>
              <v-card color="blue-grey darken-1">
                <v-divider />
                <h3>My Team</h3>
                <v-divider />
              </v-card>
              <v-card class="scroll" height="320px">
                <draggable class="list-group" :list="team" group="team">
                  <v-card v-for="user in filteredTeam" :key="user.id" shaped class="bg ma-2" @click="dialog2(user)">
                    {{ user.name }} <v-divider />
                  </v-card>
                </draggable>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="#303030">
          <v-layout v-if="jobs.length > 0" row wrap>
            <v-flex xs12 text-center>
              <v-divider class="mb-5" />
              <v-icon>mdi-axis-x-arrow</v-icon>
              <span class="mainTitle">Your Projects</span>
              <v-icon>mdi-axis-y-arrow</v-icon>
              <v-divider class="my-5" />
            </v-flex>
            <v-flex
              v-for="project in jobs"
              :key="project.id"
              xs6
              sm6
              md3
              xl2
              class="pr-3"
              @click="dialog(project)"
            >
              <v-card
                raised
                ripple
                min-height="200"
              >
                <v-layout row wrap>
                  <v-flex xs12 text-center class="pa-3">
                    <v-chip
                      color="teal lighten-4"
                      label
                      class="mx-2"
                      large
                      outlined
                    >
                      <span class="ibm">{{ project.name }}</span>
                    </v-chip>
                  </v-flex>
                  <v-flex xs12 class="pa-3" text-center>
                    <v-card raised>
                      <span class="caption">Team</span>
                      <v-divider />
                      <v-card v-for="user in project.team" :key="user.id" class=" bg text-center ma-2">
                        {{ user.name }} <v-divider />
                      </v-card>
                    </v-card>
                  </v-flex>
                </v-layout>
                <v-flex mb-3 />
              </v-card>
            </v-flex>
          </v-layout>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="dialogTeam" persistent max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogTeam = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="ibm">
            Project Team
          </v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <project-team :selected-job.sync="selectedJob" :team="team" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogProfile" persistent max-width="800">
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
    <v-dialog v-model="searchDialog" persistent max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="searchDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Search By</v-toolbar-title>
        </v-toolbar>
        <v-layout row wrap class="mx-4 mb-5">
          <v-flex xs6 class="pr-3">
            <v-select
              v-model="city"
              :items="cities"
              label="City"
              multiple
              chips
            />
          </v-flex>
          <v-flex xs6>
            <v-select
              v-model="trade"
              :items="trades"
              label="Skills"
              multiple
              chips
            />
          </v-flex>
          <v-flex xs6>
            <v-select
              v-model="ticket"
              :items="tickets"
              label="Tickets"
              class="pr-8"
              multiple
              chips
            />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              v-model="liability"
              label="Liability"
              background-color="grey darken-2"
            />
            <v-checkbox
              v-model="wcb"
              label="Wcb"
              background-color="grey darken-2"
              class="mt-n5"
            />
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.bg {
  background-color: #00897B;
}
.scroll {
  overflow-y: auto;
}
.mainTitle {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 2em;
  font-weight: bold;
}
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
}
</style>
<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import ProjectTeam from '../components/ProjectTeam.vue'
import PublicProfile from '../components/PublicProfile.vue'
export default {
  components: {
    draggable,
    ProjectTeam,
    PublicProfile
  },
  data () {
    return {
      searchDialog: false,
      search: '',
      trades: [],
      tickets: [],
      ticket: [],
      cities: [],
      city: [],
      trade: [],
      wcb: false,
      liability: false,
      dialogProfile: false,
      dialogTeam: false,
      team: [],
      users: [],
      currentUser: '',
      jobs: [],
      selectedJob: {},
      tab: null
    }
  },
  computed: {
    ...mapGetters({
      profile: 'profile/getProfile'
    }),
    filteredList () {
      let filtered = this.users
      if (this.search.length > 0) {
        filtered = this.users.filter(user => user.name.toLowerCase().includes(this.search))
      }
      if (this.city.length > 0) {
        filtered = filtered.filter(user => this.city.includes(user.metadata.city))
      }
      if (this.wcb) {
        filtered = filtered.filter(user => user.metadata.wcb && user.metadata.wcb.length > 0)
      }
      if (this.liability) {
        filtered = filtered.filter(user => user.metadata.liability && user.metadata.liability.length > 0)
      }
      if (this.trade.length > 0) {
        filtered = filtered.filter(user => this.trade.some(el => user.metadata.skills && user.metadata.skills.includes(el)))
      }
      if (this.ticket.length > 0) {
        filtered = filtered.filter(user => this.ticket.some(el => user.metadata.tickets && user.metadata.tickets.includes(el)))
      }
      return filtered
    },
    filteredTeam () {
      let filtered = this.team
      if (this.search.length > 0) {
        filtered = this.team.filter(user => user.name.toLowerCase().includes(this.search))
      }
      if (this.city.length > 0) {
        filtered = filtered.filter(user => this.city.includes(user.metadata.city))
      }
      if (this.wcb) {
        filtered = filtered.filter(user => user.metadata.wcb && user.metadata.wcb.length > 0)
      }
      if (this.liability) {
        filtered = filtered.filter(user => user.metadata.liability && user.metadata.liability.length > 0)
      }
      if (this.trade.length > 0) {
        filtered = filtered.filter(user => this.trade.some(el => user.metadata.skills && user.metadata.skills.includes(el)))
      }
      if (this.ticket.length > 0) {
        filtered = filtered.filter(user => this.ticket.some(el => user.metadata.tickets && user.metadata.tickets.includes(el)))
      }
      return filtered
    }
  },
  created () {
    this.trades = process.env.trades.split(',')
    this.tickets = process.env.tickets.split(',')
    this.$axios.$get('team/fetch').then((res) => {
      this.team = res.team
      this.$axios
        .$get('account/public').then((res) => {
          const arr = res
          // filter users and team for duplicates and remove ourself
          this.users = arr.filter(val => !this.team.find(({ uid }) => val.uid === uid) && val.uid !== this.$auth.user.sub)
          arr.forEach((obj, i) => {
            if (obj.metadata.city && obj.metadata.city.length > 0) {
              this.cities.push(obj.metadata.city)
            }
          })
        })
    })
    this.$axios.$get('job/private').then((res) => {
      res.forEach((obj, i) => {
        this.jobs.push(obj)
      })
    })
    if (this.profile.user_metadata && !this.profile.user_metadata.welcomeTeam) {
      this.$swal.fire({
        position: 'bottom-end',
        type: 'info',
        text: process.env.welcomeTeam,
        showConfirmButton: true,
        width: '22rem'
      }).then(() => {
        return this.$axios.$post('account/edit', { user_metadata: { welcomeTeam: true } })
      })
    }
  },
  methods: {
    clearFilters () {
      this.city = []
      this.search = ''
      this.trade = []
      this.ticket = []
      this.wcb = false
      this.liability = false
    },
    dialog (item) {
      this.selectedJob = item
      this.dialogTeam = !this.dialogTeam
    },
    dialog2 (item) {
      this.currentUser = item
      this.dialogProfile = !this.dialogProfile
    },
    save () {
      setTimeout(() => {
        this.$axios.$post('team/edit', { team: this.team }).then((res) => {
          this.$swal
            .fire({
              text: 'Successfully Updated!',
              type: 'success',
              toast: true,
              showConfirmButton: false,
              position: 'top-end',
              timer: 1500
            })
        })
      }, 1000)
    }
  }
}
</script>
