<template>
  <v-container>
    <v-alert
      v-model="alert"
      icon="mdi-information-outline"
      prominent
      dense
      dismissible
      transition="scale-transition"
      text
      :type="alertInfo"
    >
      {{ alertText }}
    </v-alert>
    <v-snackbar
      v-model="snackbar"
      bottom
      :color="snackbarColor"
    >
      {{ snackbarText }}
      <v-icon>
        mdi-check-circle-outline
      </v-icon>
    </v-snackbar>

    <v-layout row wrap>
      <v-flex xs12 text-center class="sub">
        <v-divider class="my-5" />
        <span class="mainTitle">{{ selectedJob.name }}</span>
        <v-divider class="my-5" />
      </v-flex>
      <v-flex
        v-if="selectedJob.tickets && selectedJob.tickets.length > 0"
        :xs6="selectedJob.tickets.length > 0 && $vuetify.breakpoint.width >= 400"
        :xs12="selectedJob.tickets.length < 1 || $vuetify.breakpoint.width < 400"
        text-center
      >
        <v-flex class="sub" xs12 text-center>
          <u>Skills</u>
        </v-flex>
        <v-chip
          v-for="item in selectedJob.skills"
          :key="item"
          color="cyan lighten-4"
          x-small
          class="ibm ma-1"
          outlined
          label
        >
          {{ item }}
        </v-chip>
      </v-flex>
      <v-flex
        v-if="selectedJob.tickets && selectedJob.tickets.length > 0"
        :xs6="selectedJob.skills.length > 0 && $vuetify.breakpoint.width >= 400"
        :xs12="selectedJob.skills.length < 1 || $vuetify.breakpoint.width < 400"
        text-center
      >
        <v-flex class="sub" xs12 text-center>
          <u>Tickets</u>
        </v-flex>
        <v-chip
          v-for="item in selectedJob.tickets"
          :key="item"
          color="orange lighten-3"
          x-small
          class="ibm ma-1"
          outlined
          label
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
      <v-flex
        xs6
        sm4
        text-center
        mx-auto
        ml-sm-12
        pr-2
      >
        <v-card class="main scroll" min-height="200px" max-height="600">
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
        <v-btn color="blue darken-3" fab small class="mt-n5" @click="addWhole">
          <v-icon large>
            mdi-arrow-right-circle
          </v-icon>
        </v-btn>
      </v-flex>

      <v-flex
        xs6
        sm4
        text-center
        mx-auto
        mr-sm-12
        pl-2
      >
        <v-card class="pb-3 main scroll" min-height="200px" max-height="600">
          <v-divider />
          <h3 class="ibm">
            Project Team
          </h3>
          <v-divider />
          <draggable class="list-group" :list="projectTeam" group="project">
            <v-card
              v-for="user in projectTeam"
              :key="user.id"
              class="bg ma-2"
            >
              {{ user.name }} <v-divider />
            </v-card>
          </draggable>
        </v-card>
        <v-btn color="red darken-3" small width="35" class="mt-n5" @click="reset">
          Reset
        </v-btn>
        <v-btn color="primary" class="mt-n5" small fab @click="dialogMessage = !dialogMessage">
          <v-icon>mdi-message-text</v-icon>
        </v-btn>
      </v-flex>
      <v-flex v-if="projectTeam.length > 0" xs12 text-center mt-2>
        <v-divider class="my-1" />
        <span class="controls">Controls</span>
        <v-divider class="my-1" />
        <v-btn color="primary" class="mt-2" :href="job" small>
          Go to Project
        </v-btn>
        <v-btn v-if="projectTeam.some(user => !user.notified)" class="mt-2" small @click="requestBids">
          Request for bids
        </v-btn>
        <v-btn v-else small disabled>
          Requested for bids
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
  font-size: 1.7em;
  font-style: italic;
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
import { mapGetters } from 'vuex'
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
      snackbar: false,
      snackbarColor: 'green darken-3',
      snackbarText: '',
      alert: false,
      alertInfo: 'info',
      alertText: '',
      job: '',
      dialogMessage: false,
      dialog: false,
      projectTeam: [],
      list: [],
      message: {
        to: '',
        names: {
          to: '',
          from: ''
        },
        project_name: '',
        messages: {
          text: '',
          name: ''
        }
      }
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  watch: {
    selectedJob () {
      this.job = `/job/${this.selectedJob.id}`
      this.list = this.team
      this.projectTeam = this.selectedJob.team
      this.list = this.list.filter(val => !this.projectTeam.find(({ uid }) => val.uid === uid) && val.uid !== this.$auth.user.sub)
    }
  },
  created () {
    this.job = `/job/${this.selectedJob.id}`
    this.list = this.team
    this.projectTeam = this.selectedJob.team
    this.list = this.list.filter(val => !this.projectTeam.find(({ uid }) => val.uid === uid) && val.uid !== this.$auth.user.sub)
    if (this.profile.user_metadata && !this.profile.user_metadata.projectTeam) {
      this.alertText = process.env.projectTeam
      this.alert = true
      return this.$axios.$post('account/edit', { user_metadata: { projectTeam: true } })
    }
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
          this.snackbarText = 'Successfully Updated!'
          this.snackbar = true
        })
      }, 1000)
    },
    async send () {
      if (this.message.messages.text) {
        this.message.project_name = `${this.selectedJob.name} Project Team`
        this.message.messages.name = this.$auth.user.name
        this.message.messages.uid = this.$auth.user.sub
        this.message.names.from = this.$auth.user.name
        for (const key in this.projectTeam) {
          const user = this.projectTeam[key]
          this.message.names.to = user.name
          this.message.to = user.uid
          await this.$axios.$post('message/send', this.message).then((res) => {
            this.snackbarText = 'Successfully Sent!'
            this.snackbar = true
            this.$store.dispatch('notifications/createNotification',
              {
                senderId: this.$auth.user.sub,
                recipientId: user.uid,
                activity: 'Message',
                activityDesc: 'You have a new message',
                link: res._id
              })
          })
        }
        this.dialogMessage = false
        this.message.messages.text = ''
      }
    },
    async requestBids () {
      await this.projectTeam.forEach((user) => {
        if (!user.notified) {
          user.notified = true
          this.$store.dispatch('notifications/createNotification',
            {
              senderId: this.$auth.user.sub,
              recipientId: user.uid,
              activity: 'bidRequest',
              activityDesc: `${this.$auth.user.name}'s requesting a bid.`,
              link: this.selectedJob.id
            })
          this.$axios.$post(`job/edit/${this.selectedJob.id}`, { team: this.projectTeam })
        }
      })
    }
  }
}
</script>
