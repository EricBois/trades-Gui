<template>
  <v-container>
    <v-card
      v-for="bid in bids"
      :key="bid.id"
      color="grey darken-2"
      class="mt-2 pa-1 pr-4"
      raised
      shaped
    >
      <v-layout wrap>
        <v-flex xs1 sm1 class="mt-n5 mb-n6">
          <v-checkbox v-model="selectedBids" :value="bid" />
        </v-flex>
        <v-flex xs6 sm3 class="pl-2">
          <v-chip color="orange accent-1" outlined label @click="profile(bid.user)">
            <v-icon color="green" small>
              mdi-information-variant
            </v-icon>&nbsp;
            {{ bid.createdBy }}
          </v-chip>
        </v-flex>
        <v-flex v-if="$vuetify.breakpoint.smAndUp" sm4 text-center @click.stop="open(bid)">
          <v-chip
            v-for="trade in bid.trade.split(', ')"
            :key="trade.id"
            color="grey darken-3"
            class="ml-1 ma-1"
            small
            label
          >
            {{ trade }}
          </v-chip>
        </v-flex>
        <v-flex xs4 sm3 text-center @click.stop="open(bid)">
          <v-chip color="amber ligthen-4" outlined label>
            ${{ bid.price }}
          </v-chip>
        </v-flex>
        <v-flex xs1>
          <v-icon large color="red darken-3" @click="deleteBid(bid.id)">
            mdi-close-octagon
          </v-icon>
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
            <span class="name">
              {{ currentBid.createdBy }}
            </span>
            <v-divider class="mt-2" />
          </v-flex>
          <v-flex xs12>
            <span class="ml-12">
              Bid On: <v-chip
                v-for="trade in trades"
                :key="trade.id"
                color="grey darken-2"
                class="ml-1"
                x-small
                label
              >{{ trade }}</v-chip>
            </span>
            <v-divider class="ma-2" />
          </v-flex>
          <v-flex xs12>
            <span class="ml-12">
              Price: <v-chip color="amber ligthen-4" class="ml-6" small outlined label>
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
    <v-dialog v-model="dialogProfile" persistent max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogProfile = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Profile</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <PublicProfile :user="user" />
        <v-divider />
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.name {
  font-family: 'IBM Plex Sans', sans-serif;
  font-style: italic;
  font-weight: bold;
  font-size: 1.0em;
}
</style>
<script>
import PublicProfile from './PublicProfile.vue'
export default {
  components: {
    PublicProfile
  },
  props: {
    bids: {
      type: Array,
      required: true
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dialogProfile: false,
      currentBid: {},
      dialog: false,
      selectedBids: [],
      trades: [],
      user: {}
    }
  },
  watch: {
    selectedBids () {
      this.$emit('update:selected', this.selectedBids)
    },
    currentBid () {
      this.trades = this.currentBid.trade.split(', ')
    }
  },
  created () {
    this.selectedBids = this.selected
  },
  methods: {
    profile (id) {
      this.$axios.$get(`account/getProfile/${id}`).then((res) => {
        this.user = res
        if (!this.user.photos) {
          this.user.photos = []
        }
      }).then(() => {
        this.dialogProfile = !this.dialogProfile
      })
    },
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
    },
    deleteBid (id) {
      this.updatedBids = this.bids
      this.$axios
        .$post('bid/delete', { id })
        .then((res) => {
          for (const key in this.bids) {
            const bid = this.bids[key]
            if (id === bid.id) {
              this.updatedBids.splice(key, 1)
            }
          }
          this.$emit('update:bids', this.updatedBids)
        })
        .catch((error) => {
          this.snackbarText = `${error}`
          this.snackbar = true
        })
    }
  }
}
</script>
