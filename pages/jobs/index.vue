<template>
  <v-container fluid>
    <v-card
      max-width="800"
      class="mx-auto">
      <v-layout row wrap class="mx-4 mb-5">
        <v-flex xs12 text-center class="my-n6">
          <span class="mainTitle2 grey--text"><u>Filter by</u></span>
        </v-flex>
        <v-flex xs4>
          <v-text-field placeholder="name.." v-model="search" class="mt-3">Search</v-text-field>
        </v-flex>
        <v-flex xs4 class="px-3">
          <v-select
          v-model="city"
          :items="cities"
          label="City"
          multiple
          chips
        ></v-select>
        </v-flex>
        <v-flex xs4>
          <v-select
          v-model="trade"
          :items="trades"
          label="Skills"
          multiple
          chips
        ></v-select>
        </v-flex>
      </v-layout>
    </v-card>
    <v-card
      v-for="project in filteredList"
      :key="project.id"
      raised
      ripple
      :to="job+project.id"
      max-width="600"
      class="mx-auto"
    >
      <v-layout row wrap class="pa-3">
        <v-flex xs6 sm4 text-center text-sm-left>
          <v-chip outlined small color="teal lighten-4">
            {{ $moment(project.Created).fromNow() }}
          </v-chip>
        </v-flex>
        <v-flex xs6 sm4 text-center>
          <v-chip v-if="project.budget" outlined color="green" small label>
            <b>Budget ${{ project.budget }}</b>
          </v-chip>
        </v-flex>
        <v-flex xs12 sm4 text-center text-sm-right>
          <v-chip
            color="orange"
            class="mr-2 mt-2 mt-sm-0 jobtype"
            small
            label
          >
            {{ project.jobType }}<v-icon v-if="project.jobType === 'Hourly'" right>
                mdi-clock-outline
              </v-icon>
              <v-icon v-else right>
                mdi-file-document-outline
              </v-icon>
          </v-chip>
        </v-flex>
        <v-flex xs12 text-center class="mt-2">
          <span class="mainTitle"><u>{{project.name}}</u></span>
        </v-flex>
        <v-flex xs12 text-center>
          <div class="ml-1 ibm">
            {{ project.description }}
          </div>
        </v-flex>
        <v-flex xs8 mt-2>
          <v-chip
            v-for="item in project.skills"
            :key="item"
            color="blue accent-1"
            small
            class="mt-1"
            outlined>
            {{ item }}
          </v-chip>
        </v-flex>
        <v-flex xs4 mt-2>
          <v-btn v-if="project.wcb" class="ma-1" color="green accent-4" x-small text>
            <v-icon>mdi-check-decagram</v-icon>&nbsp; Wcb
          </v-btn>
          <v-btn v-else class="ma-1" x-small color="grey" text>
            <v-icon>mdi-checkbox-blank-outline</v-icon>&nbsp; Wcb
          </v-btn>
          <v-btn v-if="project.liability" class="ma-1" color="green accent-4" x-small text>
            <v-icon>mdi-check-decagram</v-icon>&nbsp;Liability
          </v-btn>
          <v-btn v-else class="ma-1" color="grey" x-small text>
            <v-icon>mdi-checkbox-blank-outline</v-icon>&nbsp;Liability
          </v-btn>
        </v-flex>
      </v-layout>
      <v-flex mb-2 />
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
export default {
  data () {
    return {
      job: 'job/',
      search: '',
      jobs: [],
      cities: [],
      city: [],
      trades: ['Drywall', 'Taping', 'Framing', 'Labour', 'Texturing', 'Insulation'],
      trade: []
    }
  },
  mounted () {
    this.$axios.$get('job/get').then((res) => {
      res.forEach((obj, i) => {
        this.jobs.push(obj)
        if (obj.location.city.length > 0) {
          this.cities.push(obj.location.city)
        }
      })
    }).catch(() => {
      this.$router.push('/')
    })
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
      return filtered
    }
  }
}
</script>
