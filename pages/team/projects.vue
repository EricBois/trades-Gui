<template>
  <v-container>
    <v-card flat color="#303030">
      <v-layout row wrap>
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
          @click="dialog(project)"
          xs6
          sm6
          md3
          xl2
          class="pr-3"
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
        <v-flex v-if="jobs.length < 1" xs12 text-center>
          <h2>No projects available at the moment.</h2>
          <span class="ibm">*Once you have created and assigned a project to team you will see it here.*</span>
        </v-flex>
      </v-layout>
    </v-card>
    <v-dialog v-model="dialogTeam" max-width="800">
      <v-card>
        <v-toolbar height="30" dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Project Team
          </v-toolbar-title>
          <v-btn @click="dialogTeam = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <project-team :selected-job.sync="selectedJob" :team="team" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="alert" persistent max-width="500">
      <v-card>
        <v-flex xs12>
          <v-alert
            :type="alertInfo"
            icon="mdi-information-outline"
            prominent
            transition="scale-transition"
            text
          >
            {{ alertText }}
          </v-alert>
        </v-flex>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="alert = false" color="green darken-1" text>
            Ok !
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.bg {
  background-color: darkslategray;
}
.scroll {
  overflow-y: auto;
}
.mainTitle {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 2em;
  font-weight: bold;
  font-display: swap;
}
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
  font-display: swap;
}
</style>
<script>
import { mapGetters } from 'vuex'
import ProjectTeam from '../../components/ProjectTeam.vue'
export default {
  components: {
    ProjectTeam
  },
  data () {
    return {
      alert: false,
      alertInfo: 'info',
      alertText: '',
      dialogTeam: false,
      team: [],
      jobs: [],
      selectedJob: {}
    }
  },
  computed: {
    ...mapGetters({
      profile: 'profile/getProfile'
    })
  },
  async asyncData ({ $axios, $auth }) {
    let jobs = await $axios.$get('job/get')
    const team = await $axios.$get('team/fetch')
    jobs = jobs.filter(job => job.user === $auth.user.sub && job.private)
    return {
      jobs,
      team: team.team
    }
  },
  created () {
    this.$nextTick(() => {
      this.tickets = process.env.tickets.split(',')
      if (this.profile.user_metadata && !this.profile.user_metadata.welcomeTeamProjects) {
        this.alertText = process.env.welcomeTeamProjects
        this.alert = true
        return this.$axios.$post('account/edit', { user_metadata: { welcomeTeamProjects: true } }).then((res) => {
          this.$store.commit('profile/updateProfile', res) // for the profile store
          this.$auth.fetchUser()
        })
      }
    })
  },
  methods: {
    dialog (item) {
      this.selectedJob = item
      this.dialogTeam = !this.dialogTeam
    }
  }
}
</script>
