<template>
  <v-layout row wrap align-center my-4>
    <v-snackbar
      v-model="snackbar"
      top
      :color="snackbarColor"
      right
    >
      {{ snackbarText }}
      <v-icon>
        mdi-check-circle-outline
      </v-icon>
    </v-snackbar>
    <v-flex xs12 text-center mb-3>
      <h2 v-if="!meeting.confirm.status">
        <u><b>Confirm a meeting date</b></u>
      </h2>
      <h2 v-else>
        <u><b>Meeting is Confirmed</b></u>
      </h2>
    </v-flex>
    <v-flex xs12 sm5 text-center justify-center>
      <v-btn color="deep-orange accent-2" icon @click="changeDate = !changeDate">
        <v-icon large>
          mdi-calendar-edit
        </v-icon>
      </v-btn>
      <br>
      <v-date-picker v-if="!changeDate" v-model="date" light :allowed-dates="allowedDates" />
      <v-date-picker v-if="changeDate" v-model="dates" light multiple />
    </v-flex>
    <v-flex xs12 sm7 text-center pr-5>
      <div>
        <v-divider class="my-4" />
        <h3 class="mb-1">
          <b><u>Bidder / Contractor</u></b>
        </h3>
        <span><v-chip>{{ selectedMeeting.createdBy }} </v-chip><v-chip>/</v-chip><v-chip>{{ selectedMeeting.contractor }}</v-chip></span>
      </div>
      <div v-if="selectedMeeting.address" class="mb-4">
        <v-divider class="my-4" />
        <h3 class="mb-1">
          <b><u>Location</u></b>
        </h3>
        <span>
          <a :href="selectedMeeting.addressUrl">{{ selectedMeeting.address }}</a>
        </span>
      </div>
      <v-divider class="my-4" />
      <div v-if="selectedMeeting.meeting.host !== $auth.user.sub">
        <h3 class="mb-5">
          <b><u>Details</u></b>
        </h3>
        {{ selectedMeeting.meeting.description }}
        <v-divider class="my-4" />
        <v-textarea
          v-model="meeting.confirm.description"
          dense
          label="Confirm Additional Details"
          class="purple-input mt-5"
          outlined
        />
      </div>
      <div v-if="selectedMeeting.meeting.host === $auth.user.sub">
        <h3 class="mb-5">
          <b><u>Details</u></b>
        </h3>
        {{ selectedMeeting.confirm.description }}
        <v-textarea
          v-model="meeting.meeting.description"
          dense
          label="Details"
          class="purple-input mt-5"
          outlined
        />
        <v-divider class="my-4" />
      </div>
    </v-flex>
    <v-flex xs12 text-center text-sm-right mt-5 mr-10>
      <v-btn v-if="!meeting.confirm.status && selectedMeeting.meeting.host !== $auth.user.sub" color="green" @click="confirmed">
        Confirm Meeting
      </v-btn>
      <v-btn v-else color="orange" @click="confirmed">
        Reschedule meeting
      </v-btn>
      <v-btn v-if="meeting.change.status && $auth.user.sub !== meeting.change.uid" color="green" @click="confirmed(true)">
        Confirm Changes
      </v-btn>
    </v-flex>
    <v-dialog v-model="dialogConfirm" persistent max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogConfirm = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="ibm">
            Confirm Meeting ?
          </v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <v-flex class="ma-6" text-center>
          The contractor will be notified, be sure to include a time and to pick a day
        </v-flex>
        <v-divider />
        <v-flex xs12 text-center>
          <v-btn color="orange darken-3" @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn v-if="!confirmedTrue" color="green darken-3" @click="confirmed('yes')">
            Confirm
          </v-btn>
          <v-btn v-else color="green darken-3" @click="confirmed(true)">
            Confirm
          </v-btn>
        </v-flex>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
export default {
  props: {
    selectedMeeting: {
      type: Object,
      required: true
    },
    dialogMeeting: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      snackbar: false,
      snackbarColor: 'green darken-3',
      snackbarText: '',
      confirmedTrue: false,
      dialogConfirm: false,
      changeDate: false,
      date: '',
      dates: [],
      meeting: {
        confirm: {
          status: false,
          date: '',
          description: ''
        },
        meeting: {
          description: '',
          dates: []
        },
        change: {
          status: false,
          uid: ''
        }
      }
    }
  },
  watch: {
    selectedMeeting () {
      this.meeting = this.selectedMeeting
      this.date = this.selectedMeeting.confirm.date
    },
    dialogMeeting () {
      this.meeting = this.selectedMeeting
      this.date = this.selectedMeeting.confirm.date
    }
  },
  created () {
    this.meeting = this.selectedMeeting
    this.date = this.selectedMeeting.confirm.date
  },
  methods: {
    allowedDates (val, arr) {
      if (this.selectedMeeting.meeting.dates.includes(val)) {
        return val
      }
    },
    confirmed (ok) {
      if (ok === true) { this.confirmedTrue = true }
      this.dialogConfirm = true
      if (ok === 'yes' || ok === true) {
        if (this.dates.length >= 1) {
          this.meeting.meeting.dates = this.dates
        }
        this.meeting.confirm.date = this.date
        if (!this.selectedMeeting.confirm.status && this.selectedMeeting.user === this.$auth.user.sub) {
          this.meeting.confirm.status = true
        }
        // confirm meeting
        if (this.selectedMeeting.change.status && ok === true) {
          this.meeting.change.status = false
          this.meeting.change.uid = ''
        // meeting changes
        } else if (this.selectedMeeting.confirm.status) {
          this.meeting.change.status = true
          this.meeting.change.uid = this.$auth.user.sub
        }
        this.$axios.$post('bid/setMeeting', { bid: [this.selectedMeeting], meeting: this.meeting }).then((res) => {
          this.$emit('update:selectedMeeting', res)
          this.$emit('update:dialogMeeting', false)
          this.changeDate = false
          this.snackbarText = 'Meeting has been Confirmed!'
          this.snackbar = true
          const user = (res.host === this.$auth.user.sub) ? res.user : res.host
          if (!res.confirm.status || res.change.status) {
            this.$store.dispatch('notifications/createNotification',
              {
                senderId: this.$auth.user.sub,
                recipientId: user,
                activity: 'Meeting',
                activityDesc: `New meeting request from ${this.$auth.user.name}`,
                link: res._id
              })
          } else if (res.confirm.status && !res.change.status) {
            this.$store.dispatch('notifications/createNotification',
              {
                senderId: this.$auth.user.sub,
                recipientId: user,
                activity: 'Meeting',
                activityDesc: `Meeting with ${this.$auth.user.name} has been confirmed!`,
                link: res._id
              })
          }
        })
      }
    }
  }
}
</script>
