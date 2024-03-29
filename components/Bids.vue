<template>
  <v-container>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
    >
      {{ snackbarText }}
      <v-icon v-if="snackbarColor.includes('red')">
        mdi-alert-outline
      </v-icon>
      <v-icon v-else>
        mdi-check-circle-outline
      </v-icon>
    </v-snackbar>
    <v-card
      v-for="bid in bids"
      :key="bid.id"
      :color="(bid.notified && bid.user !== $auth.user.sub) ? 'teal darken-3':'grey darken-3'"
      class="mt-2 pa-1 pr-4"
      raised
      outlined
      shaped
    >
      <v-layout wrap>
        <v-flex v-if="ownProject" xs1 sm1 class="mt-n5 mb-n6">
          <v-checkbox v-model="selectedBids" :value="bid" color="white" />
        </v-flex>
        <v-flex :xs12="!ownProject" :xs11="ownProject" @click.self="open(bid)" sm4 class="pl-2">
          <v-chip
            :color="(bid.notified && bid.user === $auth.user.sub) ? 'orange accent-1':'grey lighten-4'"
            @click="profile(bid.user)"
            outlined
            class="my-1"
            small
            label
          >
            <v-icon v-if="bid.notified " class="mr-1" small color="amber darken-1">
              mdi-crown-outline
            </v-icon>
            <v-icon color="green" small>
              mdi-information-outline
            </v-icon>&nbsp;
            {{ bid.createdBy }}
          </v-chip>
        </v-flex>
        <v-flex v-if="$vuetify.breakpoint.smAndUp" @click="open(bid)" sm5 text-center>
          <v-chip
            v-for="item in bid.items"
            :key="item.id"
            :color="(bid.notified && bid.user === $auth.user.sub) ? 'orange accent-1':'grey lighten-4'"
            class="ml-1 my-1"
            outlined
            small
            label
          >
            {{ item.trade }}
          </v-chip>
        </v-flex>
        <v-flex :class="($vuetify.breakpoint.width >= 375)? 'mt-n8 mr-6' : 'mr-6'" @click="open(bid)" xs12 text-right>
          <v-chip

            :color="(bid.notified && bid.user === $auth.user.sub) ? 'orange accent-1':'grey lighten-4'"
            small
            class="my-1"
            label
            outlined
          >
            <!-- ${{ bid.items[0].price.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') }} -->
            {{ price(bid.items) }}
          </v-chip>
        </v-flex>
        <v-flex v-if="bid.notified && bid.user !== $auth.user.sub" xs2 offset-10 class="mt-n8" text-right>
          <v-btn
            v-if="!bid.reviewed"
            @click="askReview(bid)"
            color="orange darken-3"
            fab
            class="mr-n10"
            small
          >
            <v-icon large>
              mdi-star-circle
            </v-icon>
          </v-btn>
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
              <v-btn :href="file" class="mb-2" color="blue-grey darken-2" small>
                <v-icon>mdi-link-box-outline</v-icon>
                &nbsp;{{ file.split("/").pop() }}
              </v-btn>
              <v-icon
                v-if="currentBid.user === $auth.user.sub"
                @click="deleteFile(file, 'file')"
                class="mb-2"
                color="red"
              >
                mdi-close-box
              </v-icon>
            </div>
          </v-flex>
        </v-layout>

        <v-card-actions>
          <v-spacer />
          <!-- Can't delete bid if won -->
          <v-btn v-if="!ownProject && !currentBid.notified" @click="dialogDeleteBid = true" color="red ligthen-3" small text>
            Delete
          </v-btn>
          <v-btn
            @click="dialog = false"
            color="amber darken-3"
            text
            small
          >
            Close
          </v-btn>
          <div v-if="ownProject">
            <v-btn
              v-if="!selectedBids.some(bid => bid.id === currentBid.id)"
              @click="selectBid()"
              color="green ligthen-3"
              text
              small
            >
              Select Quote
            </v-btn>
            <v-btn
              v-else
              @click="unselectBid()"
              color="green darken-1"
              text
              small
            >
              Unselect
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogProfile" max-width="800">
      <v-card>
        <v-toolbar height="30" dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Profile
          </v-toolbar-title>
          <v-btn @click="dialogProfile = false" icon dark>
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
            @click="dialogDeleteBid = false"
            color="orange darken-3"
            text
          >
            No
          </v-btn>

          <v-btn
            @click="deleteBid(currentBid.id)"
            color="green darken-1"
            text
          >
            Yes, Let's Go!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogReview"
      max-width="400"
    >
      <v-card>
        <v-flex xs12 class="pa-3" text-center>
          <h3 class="ibm">
            Please review <span class="green--text"><u>{{ currentBid.createdBy }}</u></span>
          </h3>
          <v-divider />
        </v-flex>
        <v-card shaped class="ma-2">
          <v-form
            ref="form"
            lazy-validation
          >
            <v-layout wrap>
              <v-flex xs12 text-center>
                <span class="ratings">Quality of work</span>
                <v-divider />
                <v-rating
                  v-model="review.ratingA"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="mdi-star-outline"
                  hover
                />
              </v-flex>
              <v-flex xs12 text-center>
                <span class="ratings">Timeliness</span>
                <v-divider />
                <v-rating
                  v-model="review.ratingB"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="mdi-star-outline"
                  hover
                />
              </v-flex>
              <v-flex xs12 text-center>
                <span class="ratings">Cleanliness</span>
                <v-divider />
                <v-rating
                  v-model="review.ratingC"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="mdi-star-outline"
                  hover
                />
              </v-flex>
              <v-flex xs12 text-center>
                <span class="ratings">Budget</span>
                <v-divider />
                <v-rating
                  v-model="review.ratingD"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="mdi-star-outline"
                  hover
                />
              </v-flex>
              <v-flex xs12 text-center>
                <span class="ratings">Reliability</span>
                <v-divider />
                <v-rating
                  v-model="review.ratingE"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="mdi-star-outline"
                  hover
                />
                <v-divider class="my-2" />
              </v-flex>
              <v-flex class="ma-2" xs12>
                <v-textarea
                  v-model="review.description"
                  :rules="descRule"
                  label="How was your experience ?"
                  outlined
                  class="purple-input"
                  counter="400"
                />
              </v-flex>
              <v-flex class="my-4" text-right>
                <v-btn
                  @click="dialogReview = false"
                  color="orange darken-3"
                  text
                >
                  Cancel
                </v-btn>

                <v-btn
                  @click="saveReview()"
                  color="green darken-1"
                  text
                >
                  Save!
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card>
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
  font-display: swap;
}
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
  font-style: italic;
  font-display: swap;
}
.ratings {
  font-family: 'IBM Plex Sans', sans-serif;
  font-style: italic;
  font-size: 1em;
  font-display: swap;
}
</style>
<script>
export default {
  components: {
    PublicProfile: () => import('../components/PublicProfile.vue')
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
      snackbar: false,
      snackbarColor: 'green darken-3',
      snackbarText: '',
      descRule: [
        v => !!v || 'The description is required',
        v => (v || '').length <= 400 || 'Description should be 400 characters or less '
      ],
      review: {
        ratingA: 1,
        ratingB: 1,
        ratingC: 1,
        ratingD: 1,
        ratingE: 1,
        description: ''
      },
      dialogReview: false,
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
    }
  },
  created () {
    this.selectedBids = this.selected
  },
  methods: {
    askReview (bid) {
      this.currentBid = bid
      this.dialogReview = true
    },
    saveReview () {
      if (this.$refs.form.validate()) {
        this.review.reviewerName = this.$auth.user.name
        this.review.user = this.currentBid.user
        this.review.project = this.currentBid.project
        this.review.bid = this.currentBid.id
        this.review.projectName = this.currentBid.projectName
        this.$axios.$post(`review/create`, this.review).then((res) => {
          // update bids
          const index = this.bids.indexOf(this.currentBid)
          const newBids = this.bids
          newBids.splice(index, 1)
          newBids.unshift(res)
          this.$emit('updated:bids', newBids)
          // bug whitout it because of the watch
          this.selectedBids = []
          this.dialogReview = false
          this.snackbarText = `Successfully reviewed ${this.currentBid.createdBy}`
          this.snackbar = true
          this.$store.dispatch('notifications/createNotification',
            {
              senderId: this.$auth.user.sub,
              recipientId: this.currentBid.user,
              activity: 'Review',
              activityDesc: `${this.$auth.user.name} left a review for ${this.currentBid.projectName}`,
              link: this.currentBid.id
            })
        })
      }
    },
    profile (id) {
      this.$axios.$get(`account/getProfile/${id}`).then((res) => {
        this.dialog = false
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
      this.dialog = false
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
      }
    },
    price (items, dialog) {
      if (items && items.length > 1 && this.hourly && !dialog) {
        return 'Prices'
      }
      let price = 0
      if (items) {
        items.forEach((item) => {
          price += parseInt(item.price, 10)
        })
        price = '$' + price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
      }

      return price
    }
  }
}
</script>
