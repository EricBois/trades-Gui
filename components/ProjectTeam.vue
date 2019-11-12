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
      <v-flex xs5 sm4 text-center ml-sm-12>
        <v-card class="main scroll" min-height="200px" max-height="400">
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
      <v-layout column justify-center>
        <v-icon x-large @click="addWhole">
          mdi-swap-horizontal-bold
        </v-icon>
      </v-layout>
      <v-flex xs5 sm4 text-center mr-sm-12>
        <v-card class="pb-3 main scroll" min-height="200px" max-height="400">
          <v-divider />
          <h3 class="ibm">
            Project Team
          </h3>
          <v-divider />
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
      </v-flex>
      <v-flex v-if="projectTeam.length > 0" xs12 text-center mt-2>
        <v-divider class="my-1" />
        <span class="controls">Controls</span>
        <v-divider class="my-1" />
        <v-btn color="orange" small @click="reset">
          Reset Team
        </v-btn>
        <v-btn color="primary" small @click="dialogMessage = !dialogMessage">
          <v-icon>mdi-message-text</v-icon>&nbsp; Project Team
        </v-btn>
        <v-btn color="green" small>
          Request for bids
        </v-btn>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogMessage" persistent max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogMessage = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Message Project Team</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <v-form ref="form" lazy-validation class="mt-5">
          <v-textarea
            v-model="message.messages.text"
            label="Message"
            solo
            outlined
            clearable
            class="purple-input"
            auto-grow
          />
        </v-form>
        <v-btn @click="send">
          Send
        </v-btn>
        <v-divider />
      </v-card>
    </v-dialog>
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
.controls {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 1.3em;
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
      dialogMessage: false,
      dialog: false,
      projectTeam: [],
      list: [],
      message: {
        to: '',
        senders: [],
        project_name: '',
        messages: {
          text: '',
          name: ''
        }
      }
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
    reset () {
      if (this.projectTeam.length <= 0) { return }
      this.projectTeam = []
      this.save()
      this.list = this.team
    },
    addWhole () {
      if (this.list.length <= 0) { return }
      this.list.forEach((obj, i) => {
        this.projectTeam.push(obj)
      })
      this.save()
      this.list = []
    },
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
    },
    async send () {
      if (this.message.messages.text) {
        this.message.senders = [this.$auth.user.name]
        this.message.project_name = `${this.selectedJob.name} Project Team`
        this.message.messages.name = this.$auth.user.name
        for (const key in this.projectTeam) {
          const user = this.projectTeam[key]
          this.message.to = user.uid
          await this.$axios.$post('message/send', this.message).then((res) => {
            this.$swal
              .fire({
                text: 'Successfully sent!',
                type: 'success',
                toast: true,
                showConfirmButton: false,
                position: 'top-end'
              })
          })
        }
        this.dialogMessage = false
        this.message.messages.text = ''
      }
    }
  }
}
</script>
