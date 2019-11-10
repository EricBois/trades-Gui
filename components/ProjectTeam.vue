<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 text-center class="sub">
        <v-divider class="my-5" />
        <span class="mainTitle">{{ selectedJob.name }}</span>
        <v-divider class="my-5" />
      </v-flex>
      <v-flex v-if="selectedJob.skills && selectedJob.skills.length > 0" xs6 text-center>
        <div class="sub">
          Skills
          <v-divider class="mx-10 pt-1" />
        </div>
        <v-chip
          v-for="item in selectedJob.skills"
          :key="item"
          color="primary"
          small
        >
          {{ item }}
        </v-chip>
      </v-flex>
      <v-flex v-if="selectedJob.tickets && selectedJob.tickets.length > 0" xs6 text-center>
        <div class="sub">
          Tickets
          <v-divider class="mx-10 pt-1" />
        </div>
        <v-chip
          v-for="item in selectedJob.tickets"
          :key="item"
          color="green"
          small
        >
          {{ item }}
        </v-chip>
      </v-flex>
      <v-flex xs12 text-center>
        <v-card-text>
          <span class="sub">Details</span>
          <v-divider class="mb-2 sub" width="150" />
          {{ selectedJob.description }}
        </v-card-text>
      </v-flex>
      <v-flex xs12 class="pt-5" />
      <v-flex xs12 sm4 offset-sm-2 text-center>
        <v-card class="main scroll" height="200px">
          <v-divider />
          <h3 class="ibm">
            My Team
          </h3>
          <v-divider />
          <draggable v-model="list" class="list-group" group="project" @change="save">
            <v-card v-for="user in list" :key="user.id" class="bg ma-2">
              {{ user.name }} <v-divider />
            </v-card>
          </draggable>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 offset-sm-1 text-center>
        <v-card class="pb-3 main scroll" height="200px">
          <v-divider />
          <h3 class="ibm">
            Project Team
          </h3>
          <v-divider />
          <draggable class="list-group" :list="projectTeam" group="project" @change="save">
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
.mainTitle {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 2em;
  font-weight: bold;
}
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
      setTimeout(() => {
        this.$axios.$post(`job/edit/${this.selectedJob.id}`, { team: this.projectTeam }).then((res) => {
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
