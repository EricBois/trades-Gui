<template>
  <v-container>
    <v-card
      max-width="844"
      class="mx-auto"
      raised
    >
      <v-layout row wrap class="pa-3">
        <v-flex xs12>
          <div>
            <v-chip
              class="mb-4"
              color="grey"
              outlined
            >
              Posted  {{ $moment(project.Created).fromNow() }}
            </v-chip>
          </div>
          <div>
            <v-chip
              class="ma-2"
              color="orange"
            >
              {{ project.jobType }}<v-icon right>
                mdi-star
              </v-icon>
            </v-chip><v-chip v-if="project.budget" outlined color="green">
              <b>Budget: ${{ project.budget }}</b>
            </v-chip>
          </div>
          <div class="headline text-center">
            {{ project.name }}
            <div v-if="project.createdBy" class="caption grey--text mb-2">
              Project by: <u>{{ project.createdBy }}</u>
            </div>
            <div>
              <v-chip v-for="item in project.skills" :key="item._id" color="primary" small>
                {{ item.text }}
              </v-chip><v-chip v-for="item in project.tickets" :key="item._id" color="yellow" small>
                {{ item.text }}
              </v-chip>
            </div>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-card-text class="text-center">
            {{ project.description }}
          </v-card-text>
        </v-flex>
        <v-flex xs4 md3 offset-xs4 offset-md9>
          <v-btn v-if="project.wcb" class="ma-1" x-small text>
            <v-icon>mdi-check-decagram</v-icon>&nbsp; Wcb
          </v-btn><v-btn v-if="project.liability" class="ma-1" x-small text>
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
              class="ma-1"
              color="green"
              small
              @click="bid = !bid"
            >
              View Bids
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
              Delete
            </v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-card>
    <v-flex class="mt-5" />
    <v-card
      v-show="bid"
      max-width="844"
      class="mx-auto"
      raised
    >
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
            <v-chip color="cyan lighten-4" outlined small>
              {{ item.description }}
            </v-chip>
          </template>
          <template v-slot:item.price="{ item }">
            <v-chip color="light-green lighten-3" small>
              <v-icon>mdi-currency-usd</v-icon> {{ item.price }}
            </v-chip>
          </template>
          <template v-slot:item.createdBy="{ item }">
            <v-chip color="orange accent-1" outlined small>
              {{ item.createdBy }}
            </v-chip>
          </template>
          <template v-if="!ownProject" v-slot:item.action="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteBid(item.id)"
            >
              delete
            </v-icon>
          </template>
        </v-data-table>
      </v-flex>
    </v-card>
    <v-dialog v-model="dialogBid" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Place Bid</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form
              ref="form"
              lazy-validation
            >
              <v-row>
                <v-col cols="12" sm="4">
                  <v-autocomplete
                    v-if="!project.oneBid"
                    v-model="infobid.trade"
                    placeholder="Pick one or many"
                    :items="trades"
                    label="Trade"
                    multiple
                  />
                  <h2 v-if="project.oneBid" class="mt-5">
                    Whole Project
                  </h2>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field v-model="infobid.description" label="Description" placeholder="(Optional)" />
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field v-model="infobid.price" prepend-inner-icon="mdi-currency-usd" label="Price" />
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
    <v-flex v-show="bid" xs12 text-center class="mt-5">
      <v-btn color="light-green darken-3">
        Accept Bid(s)
      </v-btn>
    </v-flex>
  </v-container>
</template>
<style scoped>
    .v-chip {
        margin-left: 5px;
        color: black
    }
</style>
<script>
export default {
  data () {
    return {
      infobid: {
        trade: [],
        description: '',
        price: '',
        project: ''
      },
      ownProject: false,
      dialogBid: false,
      trades: ['Whole Project', 'Framing', 'Drywall', 'Taping'],
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
        { text: 'Actions', value: 'action', sortable: false }
      ],
      bids: []
    }
  },
  mounted () {
    // get the job with the id
    this.$axios.$get(`job/view/${this.$route.params.id}`).then((res) => {
      this.project = res
      if (this.project.user === this.$auth.user.sub) {
        this.ownProject = true
      }
      this.$axios.$get(`bid/get/${this.$route.params.id}`).then((res) => {
        const data = res
        for (const key in data) {
          const bid = data[key]
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
    }).catch(() => {
      // handle this error here
      this.$router.push(`../jobs`)
    })
  },
  methods: {
    deleteProject (id) {
      this.$swal.fire({
        title: 'Delete this project ?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.$axios.$post(`job/delete/${id}`).then((res) => {
            //  direct to jobs page
            this.$router.push(`../../user/projects`)
            this.$swal.fire(
              'Success!',
              'Deleted Successfully.',
              'success'
            )
          })
        }
      })
    },
    postBid () {
      if (this.$refs.form.validate()) {
        if (this.project.oneBid) {
          this.infobid.trade = 'Whole Project'
        }
        this.infobid.project = this.project.id
        console.log(this.project)
        this.$axios.$post('bid/create', this.infobid).then((res) => {
          // make a sweetalert2
          res.trade = res.trade.toString().replace(/,/g, ', ')
          this.bids.push(res)
          this.dialogBid = false
          this.infobid.trade = []
          this.infobid.price = ''
          this.infobid.description = ''
        })
      }
    },
    deleteBid (id) {
      this.$axios.$post('bid/delete', { id }).then((res) => {
        this.$axios.$get(`bid/get/${this.$route.params.id}`).then((res) => {
          const data = res
          this.bids = []
          for (const key in data) {
            const bid = data[key]
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
      }).catch(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>
