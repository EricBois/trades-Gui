<template>
  <v-layout row wrap align-center my-4>
    <v-flex xs12 text-center mb-3>
      <h2 v-if="!confirm.status"><u><b>Confirm a meeting date</b></u></h2>
      <h2 v-else><u><b>Meeting is Confirmed</b></u></h2>
    </v-flex>
    <v-flex xs12 sm5 text-center>
      <v-date-picker light v-model="confirm.date" :allowed-dates="allowedDates" />
    </v-flex>
    <v-flex xs12 sm7 text-center pr-5>
      <div v-if="selectedMeeting.address" class="mb-4">
        <v-divider class="my-4"></v-divider>
        <h3 class="mb-1"><b><u>Location</u></b></h3>
        <span>
          <a :href="selectedMeeting.addressUrl">{{selectedMeeting.address}}</a>
        </span>
      </div>
      <v-divider class="my-4"></v-divider>
      <div>
        <h3 class="mb-5"><b><u>Details</u></b></h3>
        {{selectedMeeting.meeting.description}}
        <v-divider class="my-4"></v-divider>
        <v-textarea
          dense
          v-model="confirm.description"
          label="Confirm Additional Details"
          class="purple-input mt-5"
          outlined
        />
      </div>
    </v-flex>
    <v-flex xs12 text-center text-sm-right mt-5 mr-10>
      <v-btn v-if="!confirm.status" color="green" @click="confirmed">Confirm Meeting</v-btn>
      <v-btn v-else color="orange" @click="confirmed">Reschedule meeting</v-btn>
    </v-flex>
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
      dates: [],
      confirm: {
        status: false,
        date: '',
        description: ''
      }
    }
  },
  watch: {
    selectedMeeting () {
      this.confirm = this.selectedMeeting.confirm
    },
    dialogMeeting () {
      this.confirm = this.selectedMeeting.confirm
    }
  },
  created () {
    this.confirm = this.selectedMeeting.confirm
  },
  methods: {
    allowedDates (val, arr) {
      if (this.selectedMeeting.meeting.dates.includes(val)) {
        return val
      }
    },
    confirmed () {
      this.confirm.status = true
      this.$axios.$post('bid/confirm', { confirm: this.confirm, bid: this.selectedMeeting }).then((res) => {
        this.$emit('update:selectedMeeting', res)
        this.$emit('update:dialogMeeting', false)
        this.$swal.fire({
          type: 'success',
          title: 'Success!',
          text: 'Meeting has been Confirmed!',
          timer: 2000
        })
      })
    }
  }
}
</script>
