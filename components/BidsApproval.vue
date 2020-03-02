<template>
  <v-container>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      vertical
    >
      {{ snackbarText }}
      <v-icon>
        mdi-check-circle-outline
      </v-icon>
    </v-snackbar>
    <v-layout row wrap class="pa-3">
      <v-flex xs12>
        <v-data-table
          v-model="selectedBids"
          :headers="headers"
          :items="bids"
          item-key="_id"
          show-select
          class="elevation-1"
          hide-default-footer
          dense
        >
          <template v-slot:item.trade="{ item }">
            <v-btn x-small text>
              <b>{{ item.trade }}</b>
            </v-btn>
          </template>
          <template v-slot:item.price="{ item }">
            <v-btn color="orange accent-1" x-small text>
              <v-icon>mdi-currency-usd</v-icon>
              <b>{{ item.price }}</b>
            </v-btn>
          </template>
          <template v-slot:item.createdBy="{ item }">
            <v-btn color="orange accent-1" outlined x-small text>
              {{ item.createdBy }}
            </v-btn>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex v-if="emails.length > 0 || phones.length > 0" class="mt-3" xs12 text-center>
        <v-btn v-if="selectedBids.some(bid => !bid.meetingRequested)" color="blue darken-2" class="mt-3 ml-2 mt-sm-0" small @click="dialogMeeting = !dialogMeeting">
          <v-icon>mdi-account-group</v-icon>&nbsp; Request Onsite meeting
        </v-btn>
        <v-btn v-else color="blue darken-2" class="mt-3 ml-2 mt-sm-0" small disabled>
          <v-icon>mdi-account-group</v-icon>&nbsp; Request Onsite meeting
        </v-btn>
        <!-- v-if some() to check if any need to be notified -->
        <v-btn v-if="selectedBids.some(bid => !bid.notified)" color="green darken-3" class="mt-3 ml-2 mt-sm-0" small @click="notify">
          <v-icon>mdi-check-decagram</v-icon>&nbsp; Approve bid(s)
        </v-btn>
        <v-btn v-else color="green darken-3" class="mt-3 ml-2 mt-sm-0" small disabled>
          <v-icon>
            mdi-check-decagram
          </v-icon>&nbsp; Bid(s) Approved
        </v-btn>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogMeeting" max-width="400">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Schedule a Meeting
          </v-toolbar-title>
          <v-btn icon dark @click="dialogMeeting = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-flex xs12 text-center class="desc">
          <h1><b>Your Availability</b></h1>
          <v-date-picker v-model="meeting.dates" light full-width multiple />
        </v-flex>
        <v-flex xs12 text-center>
          <v-textarea
            v-model="meeting.description"
            label="Additional Details"
            class="desc"
          />
        </v-flex>
        <v-divider />
        <v-flex xs12 text-center>
          <v-btn color="orange" large class="my-5" @click="meeting.dates = []">
            Clear
          </v-btn>
          <v-btn color="green" large class="my-5" @click="setMeeting">
            Submit
          </v-btn>
        </v-flex>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.desc {
  background-color: #01579B
}
</style>
<script>
export default {
  props: {
    bids: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      snackbar: false,
      snackbarColor: 'green darken-3',
      snackbarText: '',
      dialogMeeting: false,
      phones: [],
      emails: [],
      selectedBids: [],
      meeting: {
        dates: [],
        host: '',
        description: ''
      },
      headers: [
        {
          text: 'Bidder',
          align: 'left',
          value: 'createdBy'
        },
        { text: 'Trade', sortable: false, value: 'trade' },
        { text: 'Price', sortable: false, value: 'price' }
      ]
    }
  },
  watch: {
    selectedBids () {
      // make a list of email and phone number of selected bids
      this.emails = []
      this.phones = []
      this.selectedBids.forEach((bid) => {
        if (!this.emails.includes(bid.email)) {
          this.emails.push(bid.email)
        }
        if (bid.phone) {
          if (!this.phones.includes(bid.phone)) {
            this.phones.push(bid.phone)
          }
        }
      })
    },
    bids () {
      // select all bids automatically on update/open
      this.bids.forEach((bid) => {
        this.selectedBids.push(bid)
      })
    }
  },
  created () {
    // select all bids automatically on create
    this.bids.forEach((bid) => {
      this.selectedBids.push(bid)
    })
  },
  methods: {
    notify () {
      this.selectedBids.forEach((bid) => {
        if (!bid.notified) {
          // create notification
          this.$store.dispatch('notifications/createNotification',
            {
              senderId: this.$auth.user.sub,
              recipientId: bid.user,
              activity: 'Bid',
              activityDesc: 'You have won a bid!',
              link: bid.project
            })
          // set bid as notified
          this.$axios.$post('bid/notified', {
            bid
          }).then((res) => {
            this.snackbarText = 'Contractor(s) have been notified and will be in touch shortly.'
            this.snackbar = true
            bid.notified = true
          })
        }
      })
      //  turn off bidding
      this.$axios.$post(`job/edit/${this.$route.params.id}`, { bidding: false })
    },
    setMeeting () {
      this.meeting.host = this.$auth.user.sub
      this.$axios.$post('bid/setMeeting', {
        bid: this.selectedBids,
        meeting: {
          request: true,
          contractor: this.$auth.user.name,
          meeting: this.meeting,
          bid: this.selectedBids,
          host: this.$auth.user.sub,
          confirm: { status: false }
        }
      }).then((res) => {
        this.meeting.dates = []
        this.meeting.description = ''
        this.dialogMeeting = false
        this.snackbarText = 'Meeting request has been sent!'
        this.snackbar = true
        const user = (res.host === this.$auth.user.sub) ? res.user : res.host
        this.$store.dispatch('notifications/createNotification',
          {
            senderId: this.$auth.user.sub,
            recipientId: user,
            activity: 'Meeting',
            activityDesc: 'new meeting request',
            link: res._id
          })
        this.selectedBids.forEach((bid) => {
          this.$axios.$post('bid/notified', {
            bid,
            meetingRequested: true
          }).then(
            bid.meetingRequested = true
          )
        })
      })
    }
  }
}
</script>
