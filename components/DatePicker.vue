<template>
  <v-layout row wrap align-center my-4>
    <v-flex xs12 text-center mb-3>
      <h2><u><b>Confirm a meeting date</b></u></h2>
    </v-flex>
    <v-flex xs12 sm6 text-center>
      <v-date-picker light v-model="date" :allowed-dates="allowedDates" />
    </v-flex>
    <v-flex xs12 sm6 text-center pr-5>
      <h3 class="mb-5"><b><u>Details</u></b></h3>
      {{selectedMeeting.meeting.description}}
      <v-textarea
        v-model="description"
        label="Reply"
        solo
        outlined
        class="purple-input mt-5"
      />
    </v-flex>
    <v-flex xs12 text-center mt-5>
      <v-btn color="green">Confirm Meeting</v-btn>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  props: {
    selectedMeeting: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      date: '',
      dates: []
    }
  },
  methods: {
    allowedDates (val, arr) {
      if (this.selectedMeeting.meeting.dates.includes(val)) {
        return val
      }
    }
  }
}
</script>
