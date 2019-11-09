<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 text-center>
        <v-divider class="my-5" />
        <h1>{{selectedJob.name}}</h1>
        <v-divider class="my-5" />
      </v-flex>
      <v-flex xs12 sm4 offset-sm-2 class="pl-2" text-center>
        <v-card class="main scroll" height="200px">
          <h3>My Team</h3>
          <v-divider class="mt-2" />
          <draggable class="list-group" v-model="list" group="project">
            <v-card v-for="user in list" :key="user.id" class="bg ma-2">
              {{ user.name }} <v-divider />
            </v-card>
          </draggable>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 offset-sm-1 text-center>
        <v-card class="pb-3 main scroll" height="200px">
          <h3>Project Team</h3>
          <v-divider class="mt-2" />
          <draggable class="list-group" :list="projectTeam" group="project">
            <v-card
            v-for="user in projectTeam"
            :key="user.id"
            flat
            outlined
            class="bg ma-2"
          >
              {{ user.name }} <v-divider />
            </v-card>
          </draggable>
        </v-card>
        <v-btn color="green" large @click="save">
          Save
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style scoped>
.scroll {
  overflow-y: auto;
}
.bg {
  background-color: #455A64;
}
.main {
  background-color: #37474F;
}
</style>
<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    team: {
      type: Array,
      required: true
    },
    selectedJob: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      projectTeam: [],
      list: []
    }
  },
  watch: {
    selectedJob () {
      this.list = this.team
      this.projectTeam = this.selectedJob.team
      this.list = this.list.filter(val => !this.projectTeam.find(({ uid }) => val.uid === uid) && val.uid !== this.$auth.user.sub)
    }
  },
  created () {
    this.list = this.team
    this.projectTeam = this.selectedJob.team
    this.list = this.list.filter(val => !this.projectTeam.find(({ uid }) => val.uid === uid) && val.uid !== this.$auth.user.sub)
  },
  methods: {
    save () {
      this.$axios.$post(`job/edit/${this.selectedJob.id}`, { team: this.projectTeam }).then((res) => {
        // this.team = res.team
      })
    }
  }
}
</script>
