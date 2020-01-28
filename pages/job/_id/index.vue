<template>
  <v-container>
    <v-alert
      v-model="alert"
      icon="mdi-information-outline"
      prominent
      dense
      dismissible
      transition="scale-transition"
      text
      :type="alertInfo"
    >
      {{ alertText }}
    </v-alert>
    <v-snackbar
      v-model="snackbar"
      top
      :color="snackbarColor"
      right
    >
      {{ snackbarText }}
      <v-icon v-if="snackbarColor.includes('red')">
        mdi-alert-outline
      </v-icon>
      <v-icon v-else>
        mdi-check-circle-outline
      </v-icon>
    </v-snackbar>
    <v-card max-width="844" class="mx-auto" raised>
      <v-layout wrap>
        <v-flex xs6 class="mt-1" text-left>
          <v-chip v-if="project.budget" small color="amber lighten-3" outlined label>
            <b>Budget: ${{ project.budget }}</b>
          </v-chip>
        </v-flex>
        <v-flex
          xs6
          text-right
          class="pr-2 mt-1"
          label
        >
          <v-chip color="amber lighten-3" outlined small label>
            {{ project.jobType }}
            <v-icon right>
              mdi-star
            </v-icon>
          </v-chip>
        </v-flex>
        <v-flex xs12>
          <v-divider class="mt-2" />
        </v-flex>
        <v-flex xs12>
          <div class="main my-6 text-center">
            {{ project.name }} &nbsp; <a :href="url" target="_blank"><v-icon v-if="url !== ''">mdi-google-maps</v-icon></a>
            <div v-if="project.createdBy" class="caption grey--text">
              Project by:
              <v-chip color="blue-grey lighten-4" class="ibm" outlined x-small @click="profile(project.user)">
                {{ project.createdBy }}
              </v-chip>
            </div>
          </div>
        </v-flex>
        <v-flex :xs6="$vuetify.breakpoint.width <450" :xs4="$vuetify.breakpoint.width >450" :offset-4="$vuetify.breakpoint.width >450" :offset-3="$vuetify.breakpoint.width <450" text-center>
          <v-card class="mb-4">
            <v-btn
              v-if="project.files && project.files.length > 0 || ownProject"
              color="amber lighten-5"
              ripple
              icon
              large
              @click="dialogFile = !dialogFile"
            >
              <v-icon>
                mdi-file-document-box-outline
              </v-icon>
            </v-btn>
            <v-btn
              v-if="project.photos && project.photos.length > 0 || ownProject"
              color="amber lighten-5"
              icon
              large
              ripple
              @click="dialogPhoto = !dialogPhoto"
            >
              <v-icon>
                mdi-camera-outline
              </v-icon>
            </v-btn>
          </v-card>
        </v-flex>
        <v-flex xs12>
          <v-divider class="mb-2" />
        </v-flex>
        <v-flex v-if="project.skills && project.skills.length > 0" :xs6="project.tickets.length > 0" :xs12="project.tickets.length < 1" text-center>
          <div class="sub">
            <u>Skills</u>
          </div>
          <v-chip
            v-for="item in project.skills"
            :key="item"
            color="green lighten-2"
            x-small
            class="ibm"
            label
          >
            {{ item }}
          </v-chip>
        </v-flex>
        <v-flex v-if="project.tickets && project.tickets.length > 0" :xs6="project.skills.length > 0" :xs12="project.skills.length < 1" text-center>
          <div class="sub">
            <u>Tickets</u>
          </div>
          <v-chip
            v-for="item in project.tickets"
            :key="item"
            color="orange lighten-3"
            x-small
            class="ibm"
            label
          >
            {{ item }}
          </v-chip>
        </v-flex>
        <v-flex xs12>
          <v-divider class="my-2" />
        </v-flex>
        <v-flex xs12 text-center>
          <v-card tile class="pa-4 my-2">
            {{ project.description }}
          </v-card>
        </v-flex>
        <v-flex xs12 text-center>
          <span class="font-weight-black ibm"><u>Requirements</u></span></br>
          <v-btn v-if="project.wcb" class="ma-1" color="green accent-4" x-small text>
            <v-icon small>
              mdi-check-decagram
            </v-icon>&nbsp; Wcb
          </v-btn>
          <v-btn v-else class="ma-1" x-small color="grey" text>
            <v-icon small>
              mdi-checkbox-blank-outline
            </v-icon>&nbsp; Wcb
          </v-btn>
          <v-btn v-if="project.liability" class="ma-1" color="green accent-4" x-small text>
            <v-icon small>
              mdi-check-decagram
            </v-icon>&nbsp;Liability
          </v-btn>
          <v-btn v-else class="ma-1" color="grey" x-small text>
            <v-icon small>
              mdi-checkbox-blank-outline
            </v-icon>&nbsp;Liability
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>
    <v-flex xs12>
      <v-card-actions class="justify-center">
        <v-btn
          v-if="project.user !== this.$auth.user.sub"
          class="ma-1"
          color="blue darken-3"
          small
          @click="dialogMessage = !dialogMessage"
        >
          <v-icon>
            mdi-android-messages
          </v-icon>
        </v-btn>
        <v-btn
          v-if="project.user !== this.$auth.user.sub && bidding"
          class="ma-1"
          color="green darken-1"
          small
          @click="dialogBid = !dialogBid"
        >
          <v-icon class="mr-1">
            mdi-domain-plus
          </v-icon>
          Bid
        </v-btn>
        <v-btn
          v-else-if="project.user !== this.$auth.user.sub && !bidding"
          class="ma-1"
          color="teal lighten-1"
          small
          disabled
        >
          <v-icon class="mr-1">
            mdi-domain-plus
          </v-icon>
          Bid
        </v-btn>
        <v-btn
          v-if="project.user === this.$auth.user.sub"
          class="teal darken-2 ma-1"
          icon
          large
          :to="job+project.id+edit"
        >
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn
          v-if="project.user === this.$auth.user.sub"
          class="red darken-4 ma-1"
          icon
          large
          @click="dialogDeleteProject =!dialogDeleteProject"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-card-actions>
      <v-flex v-if="project.user !== this.$auth.user.sub && !bidding" xs12 text-center>
        <small class="red--text">*Bids have been disabled</small>
      </v-flex>
    </v-flex>
    <v-flex class="mt-5" />
    <v-card v-if="bids.length > 0" max-width="844" class="mx-auto" raised>
      <v-flex xs12 text-right>
        <v-chip color="blue-grey lighten-5" class="subBid mr-2 mt-2" outlined label small>
          Bids: {{ bidsTotal }}
        </v-chip><br>
      </v-flex>
      <v-flex xs12 class="mt-n6 ml-2">
        <div v-if="ownProject" class="mb-4">
          <v-btn v-if="bidding" color="deep-orange darken-3" small @click="bidsToggle">
            <v-icon left>
              mdi-alert
            </v-icon>Bidding off
          </v-btn>
          <v-btn v-else color="blue darken-3" small @click="bidsToggle">
            <v-icon left>
              mdi-star-three-points
            </v-icon>Bidding on
          </v-btn>
        </div>
      </v-flex>
      <v-flex xs12 text-center>
        <h2 v-if="!ownProject" class="mb-n4">
          Your Placed Bids
        </h2>
        <h2 v-if="ownProject" class="mb-n4">
          Project Bids / Offers
        </h2>
      </v-flex>
      <v-flex xs12>
        <Bids :bids.sync="bids" :selected.sync="selected" />
      </v-flex>
    </v-card>
    <v-card v-else max-width="844" class="mx-auto" raised>
      <v-flex xs12 text-center>
        <h2>No Bids</h2>
      </v-flex>
      <div v-if="ownProject">
        <v-btn v-if="bidding" color="deep-orange darken-3" small @click="bidsToggle">
          <v-icon left>
            mdi-alert
          </v-icon>Turn Bidding off
        </v-btn>
        <v-btn v-else color="light-green darken-4" small @click="bidsToggle">
          <v-icon left>
            mdi-star-three-points
          </v-icon>Turn Bidding on
        </v-btn>
      </div>
    </v-card>
    <v-dialog v-model="dialogBid" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Place Bid</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation>
              <v-layout wrap>
                <v-flex xs12 sm4 class="pr-5">
                  <v-autocomplete
                    v-if="!project.oneBid"
                    v-model="infobid.trade"
                    placeholder="Pick one or many"
                    :items="merged"
                    label="Trade"
                    multiple
                  />
                  <h2 v-if="project.oneBid" class="mt-5">
                    Whole Project
                  </h2>
                </v-flex>
                <v-flex xs12 sm4 class="pr-5 pt-2">
                  <v-text-field
                    v-model="infobid.description"
                    label="Description"
                    placeholder="(Optional)"
                  />
                </v-flex>
                <v-flex xs12 sm4 class="pr-5 pt-2">
                  <v-text-field
                    v-if="project.jobType === 'Contract'"
                    v-model="infobid.price"
                    :rules="priceRule"
                    type="text"
                    prepend-inner-icon="mdi-currency-usd"
                    label="Price"
                  />
                  <v-text-field
                    v-else
                    v-model="infobid.price"
                    :rules="priceRule"
                    type="text"
                    prepend-inner-icon="mdi-currency-usd"
                    label="Price"
                    placeholder="Hourly"
                    append-outer-icon="mdi-clock-outline"
                  />
                </v-flex>
                <v-flex xs12 sm6 class="pr-5 pt-2">
                  <v-text-field
                    v-model="phone"
                    type="text"
                    clearable
                    prepend-inner-icon="mdi-phone"
                    label="Phone  *Optional*"
                    placeholder="Phone ( Optional )"
                  />
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn color="blue darken-1" text @click="dialogBid = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="postBid()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogFile" persistent max-width="600px" transition="dialog-bottom-transition">
      <v-card>
        <v-card-title>
          <span class="headline">Files</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row v-if="ownProject">
              <v-col cols="12">
                <v-file-input v-model="doc" accept="application/pdf" :loading="loading" show-size label="Document Upload" />
                <v-btn v-if="doc && !loading" small @click="upload()">
                  Upload
                </v-btn>
              </v-col>
            </v-row>
            <v-divider />
            <v-row>
              <v-col>
                <div v-for="file in project.files" :key="file">
                  <v-btn class="mb-2" color="blue-grey darken-2" :href="file" small>
                    <v-icon>mdi-link-box-outline</v-icon>
              &nbsp;{{ file.split("/").pop() }}
                  </v-btn>
                  <v-icon
                    v-if="ownProject"
                    class="mb-2"
                    color="red"
                    @click="deleteFile(file, 'file')"
                  >
                    mdi-close-box
                  </v-icon>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn color="blue darken-1" text @click="dialogFile = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogPhoto" transition="dialog-bottom-transition" max-width="900">
      <v-card class="px-3">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogPhoto = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Photos</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <v-flex v-if="ownProject" xs12 text-center>
          <photoUpload :project.sync="project" />
        </v-flex>
        <v-divider />
        <v-container class="mx-5">
          <v-layout row wrap class="pa-3">
            <v-flex
              v-for="img in project.photos"
              :key="img"
              xs12
              sm4
              md3
              class="pa-4"
            >
              <v-card>
                <v-btn
                  v-if="ownProject"
                  color="orange darken-2
"
                  text
                  @click="deleteFile(img,'image')"
                >
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
                <expandable-image
                  class="image"
                  :src="img"
                  max-width="400"
                  contain
                />
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogBidApproval" persistent max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="green">
          <v-btn icon dark @click="dialogBidApproval = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Select user(s) and option</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <BidsApproval :bids.sync="selected" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogMessage" persistent max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogMessage = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Messages</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <Message :dialog-message.sync="dialogMessage" :project="project" :snackbar.sync="snackbar" :snackbar-color.sync="snackbarColor" :snackbar-text.sync="snackbarText" />
        <v-divider />
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
    <v-dialog
      v-model="dialogDeleteProject"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Please Confirm
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete this project ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="orange darken-3"
            text
            @click="dialogDeleteProject = false"
          >
            No
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="deleteProject(project.id)"
          >
            Yes, Let's Go!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-flex v-if="ownProject" xs12 text-center class="mt-5">
      <v-btn v-if="selected.length > 0" color="light-green darken-3" @click="dialogBidApproval = !dialogBidApproval">
        Accept Bid(s)
      </v-btn>
    </v-flex>
  </v-container>
</template>
<style scoped>
.v-chip {
  margin-left: 5px;
  color: black;
}
.main {
  font-family: 'IBM Plex Sans', sans-serif;
  font-style: italic;
  font-weight: bold;
  font-size: 1.5em;
}
.sub {
  transform: rotate(359deg);
  margin: 0 auto;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: bold;
}
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: bold;
}
.subBid {
  font-family: 'IBM Plex Sans', sans-serif;
  font-style: italic;
  font-weight: bold;
  font-size: 0.7em;
}
</style>
<script>
import { mapGetters } from 'vuex'
import BidsApproval from '../../../components/BidsApproval'
import ExpandableImage from '../../../components/ExpandableImage'
import photoUpload from '../../../components/PhotoUpload.vue'
import Message from '../../../components/Message.vue'
import PublicProfile from '../../../components/PublicProfile.vue'
import Bids from '../../../components/Bids.vue'
export default {
  components: {
    photoUpload,
    ExpandableImage,
    BidsApproval,
    Message,
    PublicProfile,
    Bids
  },
  data () {
    return {
      snackbar: false,
      snackbarColor: 'red darken-3',
      snackbarText: '',
      alert: false,
      alertInfo: 'info',
      alertText: '',
      dialogDeleteProject: false,
      bidding: true,
      url: '',
      dialogProfile: false,
      user: {},
      phone: '',
      metdata: 'https://subhub.com/user_metadata',
      dialogMessage: false,
      dialogBidApproval: false,
      dialogPhoto: false,
      dialogFile: false,
      loading: false,
      doc: null,
      priceRule: [
        v => !!v || 'The price is required',
        v => /^(\d+(?:[.,]\d{2,3})?)$/.test(v) || 'Only numbers & commas allowed. ( 1000 , 1,000 , 10,34 ..)'
      ],
      infobid: {
        phone: '',
        email: '',
        trade: [],
        description: '',
        price: '',
        project: '',
        createdBy: '',
        projectName: '',
        address: '',
        addressUrl: ''
      },
      ownProject: false,
      dialogBid: false,
      merged: [],
      trades: ['Whole Project'],
      selected: [],
      bid: false,
      project: {},
      job: '../job/',
      edit: '/edit',
      headers: [
        {
          text: 'Bid',
          align: 'left',
          sortable: false,
          value: 'trade'
        },
        { text: 'Description', value: 'description' },
        { text: 'Price ( $ )', value: 'price' },
        { text: 'Placed By', value: 'createdBy' },
        { text: 'Action', value: 'action', sortable: false }
      ],
      bids: [],
      bidsTotal: 0
    }
  },
  computed: mapGetters({
    myProfile: 'profile/getProfile'
  }),
  mounted () {
    if (this.myProfile.user_metadata && !this.myProfile.user_metadata.welcomeJob) {
      this.alertText = process.env.welcomeJob
      this.alert = true
      return this.$axios.$post('account/edit', { user_metadata: { welcomeJob: true } })
    }
    // get the job with the id
    this.$axios
      .$get(`job/view/${this.$route.params.id}`)
      .then((res) => {
        this.project = res
        this.phone = this.$auth.user['https://subhub.com/user_metadata'].phone
        if (this.project.location.url) {
          this.url = this.project.location.url
        }
        if (this.project.bidding) {
          this.bidding = true
        } else {
          this.bidding = false
        }
        if (this.project.user === this.$auth.user.sub) {
          this.ownProject = true
        }
        this.merged = this.trades.concat(res.skills) // merge project required for trade with whole project
        this.bidsTotal = res.bids.length // return total of bids on project
        for (const key in res.bids) {
          const bid = res.bids[key]
          bid._id = key
          bid.trade = bid.trade.toString().replace(/,/g, ', ')
          if (!this.ownProject) {
            if (bid.user === this.$auth.user.sub) {
              this.bids.push(bid)
            }
          } else {
            this.bids.push(bid)
          }
        }
      })
      .catch((error) => {
        // handle this error here
        this.snackbarText = `${error}`
        this.snackbar = true
      })
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
    deleteProject (id) {
      this.$axios
        .$post(`job/delete/${id}`)
        .then((res) => {
          //  direct to jobs page
          this.dialogDeleteProject = false
          this.$router.push(`../projects`)
        })
        .catch((error) => {
          this.snackbarText = `${error}`
          this.snackbar = true
        })
    },
    postBid () {
      if (this.$refs.form.validate()) {
        this.infobid.createdBy = this.$auth.user.name
        if (this.phone) {
          this.infobid.phone = this.phone
        }
        if (this.$auth.user.email) {
          this.infobid.email = this.$auth.user.email
        }
        if (this.project.oneBid) {
          this.infobid.trade = 'Whole Project'
        }
        if (!this.infobid.trade.length > 0) {
          this.infobid.trade = 'Whole Project'
        }
        this.infobid.project = this.project.id
        this.infobid.projectName = this.project.name
        if (this.project.location.address) {
          this.infobid.address = this.project.location.address
          this.infobid.addressUrl = this.project.location.url
        }
        this.$axios
          .$post('bid/create', this.infobid)
          .then((res) => {
            this.bidsTotal = this.bidsTotal + 1
            // make a sweetalert2
            res.trade = res.trade.toString().replace(/,/g, ', ')
            this.bids.push(res)
            this.dialogBid = false
            this.infobid.trade = []
            this.infobid.price = ''
            this.infobid.description = ''
            // notify owner of project of new bid
            this.$store.dispatch('notifications/createNotification',
              {
                senderId: this.$auth.user.sub,
                recipientId: this.project.user,
                activity: 'Bid',
                activityDesc: `${this.$auth.user.name} placed a bid on ${this.project.name}`,
                link: this.project.id
              })
          })
          .catch((error) => {
            this.snackbarText = `${error}`
            this.snackbar = true
          })
      }
    },
    deleteBid (id) {
      this.$axios
        .$post('bid/delete', { id })
        .then((res) => {
          for (const key in this.bids) {
            const bid = this.bids[key]
            if (id === bid.id) {
              this.bids.splice(key, 1)
            }
          }
        })
        .catch((error) => {
          this.snackbarText = `${error}`
          this.snackbar = true
        })
    },
    deleteFile (file, type) {
      this.loading = true
      if (file) {
        const name = file.split('/').pop()
        this.$axios
          .$post(`job/deleteFile/${name}/${this.$route.params.id}/${type}`, {
            file
          })
          .then((res) => {
            this.loading = false
            this.project = res
          })
          .catch((error) => {
            this.snackbarText = `${error}`
            this.snackbar = true
          })
      }
    },
    upload () {
      this.loading = true
      const formData = new FormData()
      formData.append('file', this.doc)
      this.$axios
        .$post(`job/upload/${this.$route.params.id}`, formData)
        .then((res) => {
          //  direct to jobs page
          this.project = res
          this.loading = false
        })
        .catch((error) => {
          this.snackbarText = `${error}`
          this.snackbar = true
          this.loading = false
        })
      this.loading = false
    },
    bidsToggle () {
      if (this.bidding) {
        this.bidding = false
      } else {
        this.bidding = true
      }
      this.$axios.$post(`job/edit/${this.$route.params.id}`, { bidding: this.bidding })
    }
  }
}
</script>
