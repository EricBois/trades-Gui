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
        <v-flex v-if="jobs.length < 1" xs12 text-center>
          <h2>No projects available at the moment.</h2>
          <span class="ibm">*Once you have created and assigned a project to team you will see it here.*</span>
        </v-flex>
      </v-layout>
    </v-card>
    <v-dialog v-model="dialogTeam" max-width="800">
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
    <v-dialog v-model="alert" persistent max-width="500">
      <v-card>
        <v-flex xs12>
          <v-alert
            icon="mdi-information-outline"
            prominent
            transition="scale-transition"
            text
            :type="alertInfo"
          >
            {{ alertText }}
          </v-alert>
        </v-flex>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" text @click="alert = false">
            Ok !
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.bg {
  background-color: #EF6C00;
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
  created () {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.tickets = process.env.tickets.split(',')
      this.$axios.$get('team/fetch').then((res) => {
        this.team = res.team
      })
      this.$axios.$get('job/private').then((res) => {
        res.forEach((obj, i) => {
          this.jobs.push(obj)
          this.$nuxt.$loading.finish()
        })
      })
      if (this.profile.user_metadata && !this.profile.user_metadata.welcomeTeamProjects) {
        this.alertText = process.env.welcomeTeamProjects
        this.alert = true
        return this.$axios.$post('account/edit', { user_metadata: { welcomeTeamProjects: true } })
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
