<template>
  <v-container fluid>
    <v-card
      max-width="800"
      class="mx-auto"
    >
      <v-layout row wrap class="mx-4 mb-5">
        <v-flex xs12 text-center class="my-n6">
          <span class="mainTitle2 grey--text"><u>Filter by</u></span>
        </v-flex>
        <v-flex xs4>
          <v-text-field v-model="search" placeholder="name.." class="mt-3">
            Search
          </v-text-field>
        </v-flex>
        <v-flex xs4 class="px-3">
          <v-select
            v-model="city"
            :items="cities"
            label="City"
            multiple
            chips
          />
        </v-flex>
        <v-flex xs4>
          <v-select
            v-model="trade"
            :items="trades"
            label="Skills"
            multiple
            chips
          />
        </v-flex>
      </v-layout>
    </v-card>
    <v-card
      v-for="project in filteredList"
      :key="project.id"
      outlined
      ripple
      hover
      :to="job+project.id"
      max-width="800"
      class="mx-auto mt-5"
    >
      <v-layout wrap>
        <v-flex v-if="$vuetify.breakpoint.width >= 370" class="mb-n6" xs12 text-center>
          <v-chip
            v-if="project.budget"
            color="amber lighten-3"
            x-small
            outlined
            label
          >
            <v-icon small class="ml-n3">
              mdi-currency-usd
            </v-icon>
            <b>{{ project.budget.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') }}</b>
          </v-chip>
        </v-flex>
        <v-flex :xs6="$vuetify.breakpoint.width >370" text-left>
          <v-chip x-small color="amber lighten-3" outlined label>
            {{ fromNow(project.Created) }}
          </v-chip>
        </v-flex>
        <v-flex :xs6="$vuetify.breakpoint.width >370" text-right>
          <v-chip
            color="amber lighten-3"
            class=" mr-2 jobtype"
            x-small
            outlined
            label
          >
            {{ project.jobType }}<v-icon v-if="project.jobType === 'Hourly'" small right>
              mdi-clock-outline
            </v-icon>
            <v-icon v-else small right>
              mdi-file-document-outline
            </v-icon>
          </v-chip>
        </v-flex>
        <v-flex xs12>
          <v-card tile ripple class="pa-3 mx-auto">
            <v-flex xs12 text-center class="mt-n1">
              <span class="mainTitle"><u>{{ project.name }}</u></span><br>
            </v-flex>
            <v-flex xs12 text-center>
              <div class="pa-2 description">
                {{ project.description }}
              </div>
            </v-flex>
          </v-card>
          <v-flex v-if="wonBid(project.bids)" xs12 text-center>
            <v-btn class="mt-2" x-small color="green darken-3">
              <v-icon small class="mr-2">
                mdi-party-popper
              </v-icon>
              You Won the bid !
            </v-btn>
          </v-flex>
          <v-flex v-if="!project.bidding" xs12 text-center>
            <v-btn class="mt-2" x-small color="orange darken-4">
              <v-icon small class="mr-2">
                mdi-alert-octagon-outline
              </v-icon>
              Bidding is over
            </v-btn>
          </v-flex>
        </v-flex>
        <v-flex xs12 mt-3>
          <v-chip
            v-for="item in project.skills"
            :key="item"
            color="cyan lighten-4"
            x-small
            class="mt-1"
            outlined
            label
          >
            {{ item }}
          </v-chip>
        </v-flex>
        <v-flex xs12 mt-3 text-center>
          <span class="font-weight-black ibm2"><u>Requirements</u></span></br>
          <v-card class="mb-n2">
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
          </v-card>
        </v-flex>
      </v-layout>
      <v-flex mb-2 />
    </v-card>
    <v-card
      v-if="pages > 1"
      max-width="600"
      class="mx-auto mt-4"
    >
      <v-pagination
        v-model="page"
        :length="pages"
      />
    </v-card>
  </v-container>
</template>
<style scoped>
    .flexit {
        background-color: rgb(192, 192, 192)
    }
    .mainTitle {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 1.4em;
      font-weight: bold;
      font-style: italic;
    }
    .mainTitle2 {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 1.7em;
      font-weight: bold;
      font-style: italic;
    }
    .ibm {
      font-family: 'IBM Plex Sans', sans-serif;
    }
    .ibm2 {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.8em;
    }
    .description {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.8em;
      font-style: semi-bold;
    }
    .jobtype {
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: bold;
    }
    /* .container {
        background-color: rgb(94, 104, 117)
    } */
    .v-chip {
        margin-left: 5px;
        color: black
    }
    .v-divider {
    display: block !important;
    flex: 1 1 0px !important;
    max-width: 100% !important;
    border: solid !important;
    border-width: thin 0 0 0 !important;
}
</style>
<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
export default {
  props: {
    jobs: {
      type: Array,
      default: null
    },
    cities: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      job: '../job/',
      search: '',
      city: [],
      trades: [],
      trade: [],
      page: 1,
      perPage: 4,
      pages: []
    }
  },
  computed: {
    filteredList () {
      let filtered = this.jobs
      if (this.search.length > 0) {
        filtered = this.jobs.filter(job => job.name.toLowerCase().includes(this.search))
      }
      if (this.city.length > 0) {
        filtered = filtered.filter(job => this.city.includes(job.location.city))
      }
      if (this.trade.length > 0) {
        // filtered = filtered.filter(job => new RegExp(job.skills.join('|')).test(this.trade))
        filtered = filtered.filter(job => this.trade.some(el => job.skills.includes(el)))
      }
      return this.paginate(filtered)
    }
  },
  watch: {
    filteredList () {
      this.setPages()
    }
  },
  created () {
    dayjs.extend(relativeTime)
    this.trades = process.env.trades.split(',')
  },
  methods: {
    wonBid (bids) {
      let won = false
      bids.forEach((bid) => {
        if (bid.user === this.$auth.user.sub && bid.notified) {
          won = true
        }
      })
      return won
    },
    setPages () {
      this.pages = Math.ceil(this.jobs.length / this.perPage)
    },
    paginate (jobs) {
      const page = this.page
      const perPage = this.perPage
      const from = (page * perPage) - perPage
      const to = (page * perPage)
      return jobs.slice(from, to)
    },
    fromNow (date) {
      return dayjs(date).fromNow()
    }
  }
}
</script>
