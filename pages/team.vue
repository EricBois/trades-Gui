<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 text-center>
        <v-divider class="mb-5" />
        <h1>Your Team</h1>
        <v-divider class="my-5" />
      </v-flex>
      <v-flex xs12 sm4 offset-sm-1 text-center>
        <v-card class="pb-3 scroll" height="300px">
          <h3>Available users</h3>
          <v-text-field
            v-model="name"
            placeholder="Search Name"
            class="purple-input center"
            solo
            clearable
            dense
          />
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
      </v-flex>
      <v-flex xs12 sm4 offset-sm-2 class="pl-2" text-center>
        <v-card class="scroll" height="300px">
          <h3>My Team</h3>
          <v-divider class="mt-2" />
          <draggable class="list-group" :list="team" group="team">
            <v-card v-for="user in team" :key="user.id" class="bg ma-2">
              {{ user.name }} <v-divider />
            </v-card>
          </draggable>
        </v-card>
        <v-btn color="green darken-3" large @click="save">
          Save
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="pt-5">
      <v-flex xs12 text-center>
        <v-divider class="my-5" />
        <h1>Your Projects</h1>
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
              >{{ project.name }}</v-chip>
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
          <v-toolbar-title>Project Team</v-toolbar-title>
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
    })
    this.$axios.$get('job/private').then((res) => {
      const data = res
      for (const key in data) {
        const job = data[key]
        job._id = key
        this.jobs.push(job)
      }
    }).catch((error) => {
      console.log(error)
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
