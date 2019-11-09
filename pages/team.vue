<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 text-center>
        <v-divider class="mb-5" />
        <span class="mainTitle">Your Team</span>
        <v-divider class="my-5" />
      </v-flex>
      <v-flex xs12 sm3 offset-sm-2 text-center>
        <v-card tile>
          <v-divider />
          <h3>Available users</h3>
          <v-divider />
          <v-text-field
            v-model="name"
            placeholder="Search Name"
            class="purple-input center"
            solo
            clearable
            dense
          />
          <v-divider />
        </v-card>
        <v-card v-if="users.length > 0" class="pb-3 scroll mb-5" height="270px">
          <draggable class="list-group" :list="users" group="team">
            <v-card
            v-for="user in users"
            :key="user.id"
            flat
            outlined
            class="bg ma-2"
          >
              {{ user.name }} <v-divider />
            </v-card>
          </draggable>
        </v-card>
        <v-card v-else class="mb-5" height="270px">
          <draggable class="list-group" :list="users" group="team">
          </draggable>
          No users available
        </v-card>
      </v-flex>
      <v-flex xs12 sm3 offset-sm-2 text-center>
        <v-card tile>
          <v-divider />
           <h3>My Team</h3>
          <v-divider />
        </v-card>
        <v-card class="scroll" height="300px">
          <draggable class="list-group" :list="team" group="team">
            <v-card v-for="user in team" :key="user.id" class="bg ma-2">
              {{ user.name }} <v-divider />
            </v-card>
          </draggable>
        </v-card>
        <v-card tile>
          <v-btn color="green darken-3" large @click="save" rounded>
            Save
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="pt-5">
      <v-flex xs12 text-center>
        <v-divider class="my-5" />
        <span class="mainTitle">Your Projects</span>
        <v-divider class="my-5" />
      </v-flex>
      <v-flex
        v-for="project in jobs"
        :key="project.id"
        xs12
        sm6
        md2
        class="pr-3"
        @click="dialog(project)"
      >
        <v-card
          raised
          ripple
        >
          <v-layout row wrap >
            <v-flex xs12 text-center class="pa-3">
              <v-chip
                color="blue-grey lighten-4"
                label
                class="mx-2"
                large
                outlined
              ><span class="ibm">{{ project.name }}</span></v-chip>
            </v-flex>
            <v-flex xs12 class="pa-3" text-center>
              <v-card raised>
                <span class="caption">Team</span>
                <v-divider></v-divider>
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
          <v-toolbar-title class="ibm">Project Team</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <project-team :selectedJob.sync="selectedJob" :team="team"/>
        <v-divider />
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.bg {
  background-color: #455A64;
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
export default {
  components: {
    draggable,
    ProjectTeam
  },
  data () {
    return {
      dialogTeam: false,
      name: '',
      team: [],
      users: [],
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
  methods: {
    dialog (item) {
      this.selectedJob = item
      this.dialogTeam = !this.dialogTeam
    },
    save () {
      this.$axios.$post('team/edit', { team: this.team }).then((res) => {
        // this.team = res.team
      })
    }
  }
}
</script>
