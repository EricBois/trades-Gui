<template>
  <v-container>
    <v-card max-width="844" class="mx-auto" raised>
      <v-layout row wrap class="pa-3">
        <v-flex xs12>
          <div>
            <v-chip
              class="mb-4"
              color="grey"
              outlined
            >
              Posted {{ $moment(project.Created).fromNow() }}
            </v-chip>
          </div>
          <div>
            <v-chip class="ma-2" color="orange">
              {{ project.jobType }}
              <v-icon right>
                mdi-star
              </v-icon>
            </v-chip>
            <v-chip v-if="project.budget" outlined color="green">
              <b>Budget: ${{ project.budget }}</b>
            </v-chip>
          </div>
          <div class="headline text-center">
            {{ project.name }}
            <div v-if="project.createdBy" class="caption grey--text mb-2">
              Project by:
              <u>{{ project.createdBy }}</u>
            </div>
            <div>
              <v-chip
                v-for="item in project.skills"
                :key="item"
                color="primary"
                small
              >
                {{ item }}
              </v-chip>
              <v-chip
                v-for="item in project.tickets"
                :key="item"
                color="yellow"
                small
              >
                {{ item }}
              </v-chip>
            </div>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-card-text class="text-center">
            {{ project.description }}
          </v-card-text>
        </v-flex>
        <v-flex xs12 md4 offset-md4 text-center>
          <div class="mb-4">
            <v-chip v-if="project.files && project.files.length > 0 || ownProject" color="green" ripple small @click="dialogFile = !dialogFile">
              <v-icon>mdi-file-document-box-outline</v-icon>&nbsp;Documents
            </v-chip>
            <v-chip v-if="project.photos && project.photos.length > 0 || ownProject" color="blue-grey lighten-4" small ripple @click="dialogPhoto = !dialogPhoto">
              <v-icon>mdi-camera</v-icon>&nbsp;Photos
            </v-chip>
          </div>
        </v-flex>
        <v-flex xs4 md3 offset-xs4 offset-md9>
          <v-btn v-if="project.wcb" class="ma-1" x-small text>
            <v-icon>mdi-check-decagram</v-icon>&nbsp; Wcb
          </v-btn>
          <v-btn v-if="project.liability" class="ma-1" x-small text>
            <v-icon>mdi-check-decagram</v-icon>&nbsp;Liability
          </v-btn>
        </v-flex>
        <v-flex xs12>
          <v-card-actions class="justify-center">
            <v-btn
              v-if="project.user !== this.$auth.user.sub"
              class="ma-1"
              color="teal lighten-1"
              small
              @click="dialogBid = !dialogBid"
            >
              Place a Bid
            </v-btn>
            <v-btn
              v-if="project.user === this.$auth.user.sub"
              class="blue-grey lighten-1 ma-1"
              small
              :to="job+project.id+edit"
            >
              Edit
            </v-btn>
            <v-btn
              v-if="project.user === this.$auth.user.sub"
              class="red darken-4 ma-1"
              small
              @click="deleteProject(project.id)"
            >
              Delete Project
            </v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-card>
    <v-flex class="mt-5" />
    <v-card v-if="bids.length > 0" max-width="844" class="mx-auto" raised>
      <v-flex xs12 text-center>
        <h2 v-if="!ownProject">
          Your Placed Bids
        </h2>
        <h2 v-if="ownProject">
          Project Bids / Offers
        </h2>
      </v-flex>
      <v-flex xs12>
        <v-data-table
          v-model="selected"
          item-key="_id"
          :headers="headers"
          :items="bids"
          :items-per-page="5"
          show-select
          class="elevation-1"
        >
          <template v-slot:item.trade="{ item }">
            <v-chip color="light-green lighten-5" small>
              <b>{{ item.trade }}</b>
            </v-chip>
          </template>
          <template v-slot:item.description="{ item }">
            <v-chip
              v-if="item.description"
              color="cyan lighten-4"
              outlined
              small
            >
              {{ item.description }}
            </v-chip>
          </template>
          <template v-slot:item.price="{ item }">
            <v-chip color="light-green lighten-3" small>
              <v-icon>mdi-currency-usd</v-icon>
              <b>{{ item.price }}</b>
            </v-chip>
          </template>
          <template v-slot:item.createdBy="{ item }">
            <v-chip color="orange accent-1" outlined small>
              {{ item.createdBy }}
            </v-chip>
          </template>
          <template v-if="!ownProject" v-slot:item.action="{ item }">
            <v-icon class="ml-2" color="red darken-3" @click="deleteBid(item.id)">
              mdi-close-octagon
            </v-icon>
          </template>
        </v-data-table>
      </v-flex>
    </v-card>
    <v-card v-else max-width="844" class="mx-auto" raised>
      <v-flex xs12 text-center>
        <h2>No Bids</h2>
      </v-flex>
    </v-card>
    <v-dialog v-model="dialogBid" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Place Bid</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" lazy-validation>
              <v-row>
                <v-col cols="12" sm="4">
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
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="infobid.description"
                    label="Description"
                    placeholder="(Optional)"
                  />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-if="project.jobType === 'Contract'"
                    v-model="infobid.price"
                    :rules="priceRule"
                    type="number"
                    prepend-inner-icon="mdi-currency-usd"
                    label="Price"
                  />
                  <v-text-field
                    v-else
                    v-model="infobid.price"
                    :rules="priceRule"
                    type="number"
                    prepend-inner-icon="mdi-currency-usd"
                    label="Price"
                    placeholder="Hourly"
                    append-outer-icon="mdi-clock-outline"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*all fields required</small>
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
        <v-container class="mx-5 photo">
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
          <v-toolbar-title>Bids Approval</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <BidsApproval :bids.sync="selected" />
        <v-divider />
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
.container.photo {
        background-color: rgb(70, 81, 95)
    }
</style>
<script>
import BidsApproval from '../../../components/BidsApproval'
import ExpandableImage from '../../../components/ExpandableImage'
import photoUpload from '../../../components/PhotoUpload.vue'
export default {
  components: {
    photoUpload,
    ExpandableImage,
    BidsApproval
  },
  data () {
    return {
      metdata: 'https://subhub.com/user_metadata',
      dialogBidApproval: false,
      dialogPhoto: false,
      dialogFile: false,
      loading: false,
      doc: null,
      priceRule: [v => !!v || 'The price is required'],
      infobid: {
        phone: '',
        email: '',
        trade: [],
        description: '',
        price: '',
        project: '',
        createdBy: ''
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
      bids: []
    }
  },
  mounted () {
    // get the job with the id
    this.$axios
      .$get(`job/view/${this.$route.params.id}`)
      .then((res) => {
        this.project = res
        if (this.project.user === this.$auth.user.sub) {
          this.ownProject = true
        }
        this.merged = this.trades.concat(res.skills)
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
        this.$swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: `${error}`
        })
      })
  },
  methods: {
    deleteProject (id) {
      this.$swal
        .fire({
          title: 'Delete this project ?',
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        })
        .then((result) => {
          if (result.value) {
            this.$axios
              .$post(`job/delete/${id}`)
              .then((res) => {
                //  direct to jobs page
                this.$router.push(`../../user/projects`)
                this.$swal.fire('Success!', 'Deleted Successfully.', 'success')
              })
              .catch((error) => {
                this.$swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                  footer: `${error}`
                })
              })
          }
        })
    },
    postBid () {
      if (this.$refs.form.validate()) {
        this.infobid.createdBy = this.$auth.user.name
        if (this.$auth.user['https://subhub.com/user_metadata'].phone) {
          this.infobid.phone = this.$auth.user['https://subhub.com/user_metadata'].phone
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
        this.$axios
          .$post('bid/create', this.infobid)
          .then((res) => {
            // make a sweetalert2
            res.trade = res.trade.toString().replace(/,/g, ', ')
            this.bids.push(res)
            this.dialogBid = false
            this.infobid.trade = []
            this.infobid.price = ''
            this.infobid.description = ''
          })
          .catch((error) => {
            this.$swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              footer: `${error}`
            })
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
          this.$swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: `${error}`
          })
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
            this.$swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
              footer: `${error}`
            })
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
          this.$swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: `${error}`
          })
          this.loading = false
        })
    }
  }
}
</script>
