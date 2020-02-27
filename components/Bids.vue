<template>
  <v-container>
    <v-card
      v-for="bid in bids"
      :key="bid.id"
      :color="(bid.notified && bid.user === $auth.user.sub) ? 'grey darken-2':'grey darken-3'"
      class="mt-2 pa-1 pr-4"
      raised
      outlined
      shaped
    >
      <v-layout wrap>
        <v-flex v-if="ownProject" xs1 sm1 class="mt-n5 mb-n6">
          <v-checkbox v-model="selectedBids" color="white" :value="bid" />
        </v-flex>
        <v-flex v-if="bid.notified && bid.user === $auth.user.sub" xs1 sm1>
          <v-icon color="amber darken-1">
            mdi-crown-outline
          </v-icon>
        </v-flex>
        <v-flex :xs8="!ownProject" :xs7="ownProject || bid.notified && bid.user === $auth.user.sub" sm4 class="pl-2" @click.self="open(bid)">
          <v-chip
            v-if="$vuetify.breakpoint.width >= 375"
            color="orange accent-1"
            outlined
            class="ma-1"
            small
            label
            @click="profile(bid.user)"
          >
            <v-icon color="green" small>
              mdi-information-outline
            </v-icon>&nbsp;
            {{ bid.createdBy }}
          </v-chip>
          <span v-else color="orange accent-1" @click="profile(bid.user)">
            <v-icon color="green" small>
              mdi-information-variant
            </v-icon>&nbsp;
            {{ bid.createdBy }}
          </span>
        </v-flex>
        <v-flex v-if="$vuetify.breakpoint.smAndUp" sm5 text-center @click.stop="open(bid)">
          <v-chip
            v-for="item in bid.items"
            :key="item.id"
            color="orange accent-1"
            class="ml-1 ma-1"
            outlined
            small
            label
          >
            {{ item.trade }}
          </v-chip>
        </v-flex>
        <v-flex xs4 sm2 text-center @click.stop="open(bid)">
          <v-chip

            small
            class="ma-1"
            color="orange accent-1"
            label
            outlined
          >
            <!-- ${{ bid.items[0].price.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') }} -->
            {{ price(bid.items) }}
          </v-chip>
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
          <v-flex v-if="currentBid.notes" xs12 text-center>
            <h4>Notes</h4>
            <span class="ma-2" text-left>
              {{ currentBid.notes }}
            </span>
            <v-divider class="ma-2" />
          </v-flex>
          <v-flex xs12>
            <span class="ml-12">
              <center class="mt-n4 ibm">Bid Details</center>
              <div v-for="item in currentBid.items" :key="item.id">
                <v-chip color="blue-grey darken-1" class="ml-6 mt-2" small label>
                  {{ item.trade }}
                </v-chip>
                <v-icon small class="mt-2">mdi-chevron-right</v-icon>
                <v-chip small class="mt-2" label>${{ item.price }}
                </v-chip>
                <br v-if="item.description">
                <span v-if="item.description" class="caption ml-6">{{ item.description }}</span>

              </div>
            </span>
            <v-divider class="ma-2" />
          </v-flex>
          <v-flex v-if="currentBid.items" xs12 text-center>
            <span class="ibm">Total <v-icon small>mdi-chevron-right</v-icon></span> <v-chip small label>
              {{ price(currentBid.items, dialog) }}
            </v-chip>
          </v-flex>
          <v-flex v-if="currentBid.files && currentBid.files.length >= 1" xs12>
            <v-divider class="my-2" />
            <span class="ibm"><center>Documents</center></span>
            <div v-for="file in currentBid.files" :key="file">
              <v-btn class="mb-2" color="blue-grey darken-2" :href="file" small>
                <v-icon>mdi-link-box-outline</v-icon>
                &nbsp;{{ file.split("/").pop() }}
              </v-btn>
              <v-icon
                v-if="currentBid.user === $auth.user.sub"
                class="mb-2"
                color="red"
                @click="deleteFile(file, 'file')"
              >
                mdi-close-box
              </v-icon>
            </div>
          </v-flex>
        </v-layout>

        <v-card-actions>
          <v-spacer />
          <v-btn v-if="!ownProject" color="red ligthen-3" small text @click="dialogDeleteBid = true">
            Delete
          </v-btn>
          <v-btn
            color="amber darken-3"
            text
            small
            @click="dialog = false"
          >
            Close
          </v-btn>
          <div v-if="ownProject">
            <v-btn
              v-if="!selectedBids.some(bid => bid.id === currentBid.id)"
              color="green ligthen-3"
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
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogProfile" max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Profile
          </v-toolbar-title>
          <v-btn icon dark @click="dialogProfile = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <PublicProfile :user="user" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDeleteBid"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Please Confirm
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete this bid ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="orange darken-3"
            text
            @click="dialogDeleteBid = false"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="deleteBid(currentBid.id)"
          >
            Yes, Let's Go!
          </v-btn>
        </v-card-actions>
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
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
  font-style: italic;
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
    },
    ownProject: {
      type: Boolean,
      default: false
    },
    hourly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dialogDeleteBid: false,
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
      // this.trades = this.currentBid.trade.split(', ')
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
              for (const file in bid.files) {
                this.deleteFile(bid.files[file], 'file')
              }
              this.updatedBids.splice(key, 1)
            }
          }
          this.$emit('update:bids', this.updatedBids)
          this.dialog = false
          this.dialogDeleteBid = false
        })
    },
    deleteFile (file, type) {
      this.loading = true
      if (file) {
        const name = file.split('/').pop()
        this.$axios
          .$post(`bid/deleteFile/${name}/${this.currentBid.id}/${type}`, {
            file
          })
          .then((res) => {
            this.loading = false
            this.currentBid = res
          })
          .catch((error) => {
            this.snackbarText = `${error}`
            this.snackbar = true
          })
      }
    },
    price (items, dialog) {
      if (items.length > 1 && this.hourly && !dialog) {
        return 'Prices'
      }
      let price = 0
      items.forEach((item) => {
        price += parseInt(item.price, 10)
      })
      price = '$' + price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      return price
    }
  }
}
</script>
