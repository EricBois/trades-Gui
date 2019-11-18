<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 text-center>
        <v-divider class="mb-5" />
        <v-icon>mdi-axis-x-arrow</v-icon>
        <span class="mainTitle">Your Team</span>
        <v-icon>mdi-axis-y-arrow</v-icon>
        <v-divider class="my-5" />
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
          <v-text-field
            v-model="search"
            placeholder="Search Name.."
            class="purple-input center"
            solo
            clearable
            dense
          />
          <v-btn text @click="searchDialog = !searchDialog" small class="mt-n12">Advanced search</v-btn>
        </v-card>
        <v-card v-if="users.length > 0" class="pb-3 scroll mb-5 mt-n4" height="320" :img="dragImg">
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
        <v-card v-else class="mb-5" height="270" :img="dragImg">
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
        <v-card class="scroll" height="405px" :img="dragImg">
          <draggable class="list-group" :list="team" group="team">
            <v-card v-for="user in team" :key="user.id" shaped class="bg ma-2" @click="dialog2(user)">
              {{ user.name }} <v-divider />
            </v-card>
          </draggable>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-if="jobs.length > 0" row wrap>
      <v-flex xs12 text-center>
        <v-divider class="my-5" />
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
      trades: ['Drywall', 'Taping', 'Framing', 'Labour', 'Texturing', 'Insulation'],
      cities: [],
      city: [],
      trade: [],
      dragImg: 'https://subhub01.s3.amazonaws.com/app/bg.png',
      dialogProfile: false,
      dialogTeam: false,
      team: [],
      users: [],
      currentUser: '',
      jobs: [],
      selectedJob: {}
    }
  },
  created () {
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
    }).catch(() => {
      this.$router.push('/')
    })
    this.$axios.$get('job/private').then((res) => {
      res.forEach((obj, i) => {
        this.jobs.push(obj)
      })
    })
  },
  computed: {
    filteredList () {
      let filtered = this.users
      if (this.search.length > 0) {
        filtered = this.users.filter(user => user.name.toLowerCase().includes(this.search))
      }
      if (this.city.length > 0) {
        filtered = filtered.filter(user => this.city.includes(user.metadata.city))
      }
      if (this.trade.length > 0) {
        filtered = filtered.filter(user => this.trade.some(el => user.metadata.skills.includes(el)))
      }
      return filtered
    }
  },
  methods: {
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
