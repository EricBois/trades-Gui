<template>
  <v-container>
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
      <v-flex v-if="emails.length > 0" xs12 sm6 pt-3>
        <v-btn color="blue darken-2" small @click="email">
          <v-icon>mdi-email</v-icon>&nbsp; Notify by email
        </v-btn>
      </v-flex>
      <v-flex v-if="phones.length > 0" xs12 sm6 pt-3>
        <v-btn color="blue darken-2" small>
          <v-icon>mdi-message-text</v-icon>&nbsp; Notify by text message
        </v-btn>
      </v-flex>
      <v-flex v-if="emails.length > 0 || phones.length > 0" xs12 sm6 pt-3>
        <v-btn color="blue darken-2" small>
          <v-icon>mdi-phone</v-icon>&nbsp; Request Call back
        </v-btn>
      </v-flex>
      <v-flex v-if="emails.length > 0 || phones.length > 0" xs12 sm6 pt-3>
        <v-btn color="blue darken-2" small>
          <v-icon>mdi-account-group</v-icon>&nbsp; Request Onsite meeting
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
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
      phones: [],
      emails: [],
      selectedBids: [],
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
      this.emails = []
      this.phones = []
      for (const key in this.selectedBids) {
        const bid = this.selectedBids[key]
        if (!this.emails.includes(bid.email)) {
          this.emails.push(bid.email)
        }
        if (bid.phone) {
          if (!this.phones.includes(bid.phone)) {
            this.phones.push(bid.phone)
          }
        }
      }
    }
  },
  methods: {
    email () {
    }
  }
}
</script>
