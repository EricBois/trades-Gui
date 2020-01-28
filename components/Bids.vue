<template>
  <v-container>
    <v-card
      v-for="bid in bids"
      :key="bid.id"
      color="grey darken-2"
      class="mt-2 pa-1"
      raised
      shaped
    >
      <v-layout wrap>
        <v-flex xs1 sm1 class="mt-n5 mb-n6">
          <v-checkbox v-model="selectedBids" :value="bid" />
        </v-flex>
        <v-flex xs7 sm4 class="pl-4" @click.stop="open(bid)">
          {{ bid.createdBy }}
        </v-flex>
        <v-flex v-if="$vuetify.breakpoint.smAndUp" sm4 text-center @click.stop="open(bid)">
          {{ bid.trade }}
        </v-flex>
        <v-flex xs4 sm3 text-center @click.stop="open(bid)">
          ${{ bid.price }}
        </v-flex>
      </v-layout>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-layout wrap>
          <v-flex class="headline ma-2" xs12 text-center>
            <v-chip label large>
              {{ currentBid.createdBy }}
            </v-chip>
            <v-divider class="mt-2" />
          </v-flex>
          <v-flex xs12>
            <span class="ml-12">
              Bid On: <v-chip class="ml-3" small label>{{ currentBid.trade }}</v-chip>
            </span>
            <v-divider class="ma-2" />
          </v-flex>
          <v-flex xs12>
            <span class="ml-12">
              Price: <v-chip class="ml-6" small label>
                ${{ currentBid.price }}
              </v-chip>
            </span>
            <v-divider class="ma-2" />
          </v-flex>
          <v-flex v-if="currentBid.description" xs12 text-center>
            <h4>Description</h4>
            <span class="ma-2" text-left>
              {{ currentBid.description }}
            </span>
            <v-divider class="ma-2" />
          </v-flex>
        </v-layout>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green darken-1"
            text
            small
            @click="dialog = false"
          >
            Close
          </v-btn>

          <v-btn
            v-if="!selectedBids.some(bid => bid.id === currentBid.id)"
            color="green darken-1"
            text
            small
            @click="selectBid()"
          >
            Select Quote
          </v-btn>
          <v-btn
            v-else
            color="green darken-1"
            text
            small
            @click="unselectBid()"
          >
            Unselect
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  props: {
    bids: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      currentBid: {},
      dialog: false,
      selectedBids: []
    }
  },
  watch: {
    selectedBids () {
      this.$emit('update:selected', this.selectedBids)
    }
  },
  created () {
    this.selectedBids = this.selected
  },
  methods: {
    open (bid) {
      this.currentBid = bid
      this.dialog = true
    },
    selectBid () {
      this.selectedBids.push(this.currentBid)
    },
    unselectBid () {
      // TODO polyfill indexOf needed ?
      const index = this.selectedBids.indexOf(this.currentBid)
      this.selectedBids.splice(index, 1)
    }
  }
}
</script>
