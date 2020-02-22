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
      <div>
        <h3 class="mb-n4">
          <b><u>Time</u></b>
        </h3>
        <v-dialog
          ref="dialog"
          v-model="dialogTime"
          :return-value.sync="meeting.meeting.time"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="meeting.meeting.time"
              label="Pick a time"
              prepend-icon="access_time"
              readonly
              v-on="on"
            />
          </template>
          <v-time-picker
            v-if="dialogTime"
            v-model="meeting.meeting.time"
            full-width
          >
            <v-spacer />
            <v-btn text color="primary" @click="dialogTime = false">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="$refs.dialog.save(meeting.meeting.time)">
              OK
            </v-btn>
          </v-time-picker>
        </v-dialog>
      </div>
      <v-divider class="mb-4" />
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
      <v-btn v-if="$auth.user.sub === selectedMeeting.meeting.host" color="red darken-3" @click="dialogDelMeeting = true">
        Delete Meeting
      </v-btn>
      <v-btn v-if="!meeting.confirm.status && selectedMeeting.meeting.host !== $auth.user.sub" color="green" @click="confirmed">
        Confirm Meeting
      </v-btn>
      <v-btn v-else color="orange" @click="confirmed">
        Reschedule meeting
      </v-btn>
      <v-btn v-if="meeting.change.status && $auth.user.sub !== meeting.change.uid" color="green" @click="confirmed('done')">
        Confirm Changes
      </v-btn>
    </v-flex>
    <v-dialog v-model="dialogConfirm" max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Confirm Meeting ?
          </v-toolbar-title>
          <v-btn icon dark @click="dialogConfirm = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-flex class="ma-6" text-center>
          The contractor will be notified, be sure to include a time and to pick a day
        </v-flex>
        <v-divider />
        <v-flex xs12 text-center>
          <v-btn color="orange darken-3" @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn v-if="!confirmedTrue" color="green darken-3" @click="confirmed('change')">
            Confirm
          </v-btn>
          <v-btn v-else color="green darken-3" @click="confirmed('confirm')">
            Confirm
          </v-btn>
        </v-flex>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelMeeting"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Please Confirm
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete this meeting ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="orange darken-3"
            text
            @click="dialogDelMeeting = false"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="deleteMeeting()"
          >
            Yes, Let's Go!
          </v-btn>
        </v-card-actions>
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
      dialogTime: false,
      time: '',
      dialogDelMeeting: false,
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
          dates: [],
          time: ''
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
    deleteMeeting () {
      this.$axios.$post('bid/delMeeting', { id: this.selectedMeeting.id }).then((res) => {
        this.$emit('update:selectedMeeting', res)
        this.$emit('update:dialogMeeting', false)
      })
    },
    confirmed (status) {
      // Set it ready to be confirmed
      if (status === 'done') { this.confirmedTrue = true }
      // dialog
      this.dialogConfirm = true
      // check any of 2 option
      if (status === 'change' || status === 'confirm') {
        // check if dates provided
        if (this.dates.length >= 1) {
          this.meeting.meeting.dates = this.dates
        }
        this.meeting.confirm.date = this.date
        // first step to confirm meeting, change confirm status to true
        if (!this.selectedMeeting.confirm.status && this.selectedMeeting.user === this.$auth.user.sub) {
          this.meeting.confirm.status = true
        }
        // confirm meeting set change status false if confirm status is true and confirm btn pressed
        if (this.selectedMeeting.change.status && status === 'confirm') {
          this.meeting.change.status = false
          this.meeting.change.uid = ''
        // meeting changes requested, change status to true and uid to user
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
