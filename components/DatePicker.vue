<template>
  <v-layout row wrap align-center my-4>
    <v-flex xs12 text-center mb-3>
      <h2><u><b>Confirm a meeting date</b></u></h2>
    </v-flex>
    <v-flex xs12 sm5 text-center>
      <v-date-picker light v-model="date" :allowed-dates="allowedDates" />
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
        <v-textarea
          v-model="description"
          label="Confirm Additional Details"
          class="purple-input mt-5"
          outlined
        />
      </div>
    </v-flex>
    <v-flex xs12 text-center text-sm-right mt-5 mr-10>
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
