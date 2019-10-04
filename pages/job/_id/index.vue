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
              color="green"
              small
              @click="dialogBid = !dialogBid"
            >
              Place a Bid
            </v-btn>
            <v-btn
              v-else
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
        <h2 v-if="project.user !== this.$auth.user.sub">
          Your Placed Bids
        </h2>
        <h2 v-if="project.user === this.$auth.user.sub">
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
        <template v-slot:item.name="{ item }">
      <v-chip color="light-green lighten-5" ><b>{{ item.name }}</b></v-chip>
    </template>
    <template v-slot:item.description="{ item }">
      <v-chip color="cyan lighten-4" >{{ item.description }}</v-chip>
    </template>
    <template v-slot:item.price="{ item }">
      <v-chip color="light-green darken-2" >{{ item.price }}</v-chip>
    </template>
    <template v-slot:item.user="{ item }">
      <v-chip color="orange accent-1" >{{ item.user }}</v-chip>
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
            <v-row>
              <v-col cols="12" sm="4">
                <v-autocomplete
                  v-if="!project.oneBid"
                  v-model="infobid.trade"
                  placeholder="Pick one or many"
                  :items="trades"
                  label="Trade"
                  multiple
                ></v-autocomplete>
                <h2 v-if="project.oneBid" class="mt-5">Whole Project</h2>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="infobid.description" label="Description" placeholder="(Optional)"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="infobid.price" prepend-inner-icon="mdi-currency-usd" label="Price"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*all fields required</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialogBid = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="dialogBid = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        price: ''
      },
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
          value: 'name'
        },
        { text: 'Description', value: 'description' },
        { text: 'Price ( $ )', value: 'price' },
        { text: 'Placed By', value: 'user' }
      ],
      bids: [
        {
          _id: '34432432426',
          name: 'Framing',
          description: 'Could start whitin two weeks!',
          price: '$85987',
          user: 'EB Interiors'
        },
        {
          _id: '34432322424',
          name: 'Drywall',
          description: 'Best drywall in alberta',
          price: '$68285',
          user: 'EB Interiors'
        },
        {
          _id: '34432432424',
          name: 'Taping',
          description: 'We guarantee our work 100%',
          price: '$75383',
          user: 'EB Interiors'
        },
        {
          _id: '38732432424',
          name: 'Framing',
          description: 'Quick and reliable',
          price: '$88599',
          user: 'Catling Interiors'
        },
        {
          _id: '3443262424',
          name: 'Drywall',
          description: 'Best rates in the city',
          price: '$65790',
          user: 'Catling Interiors'
        },
        {
          _id: '8745262',
          name: 'Drywall',
          description: 'Can start ASAP',
          price: '$70450',
          user: 'STC Drywall'
        }
      ]
    }
  },
  mounted () {
    // get the job with the id
    this.$axios.$get(`job/view/${this.$route.params.id}`).then((res) => {
      this.project = res
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
    }
  }
}
</script>
