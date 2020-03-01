<template>
  <v-container>
    <v-card>
      <v-card
        class="mt-4"
      >
        <v-layout wrap class="mx-2 mb-5">
          <v-flex xs12 text-center class="my-n6">
            <span class="mainTitle2 grey--text"><u>Filter by</u></span>
          </v-flex>
          <v-flex xs6 class="px-3">
            <v-combobox
              v-model="city"
              :items="cities"
              chips
              dense
              label="City"
              multiple
              autocomplete
            />
          </v-flex>
          <v-flex xs6>
            <v-combobox
              v-model="trade"
              :items="trades"
              chips
              dense
              label="Skills"
              multiple
              autocomplete
            />
          </v-flex>
        </v-layout>
      </v-card>
      <v-flex xs12 class="mt-4">
        <v-card
          v-if="contractors.length < 1"
          outlined
          max-width="800"
          class="mx-auto mt-2 ma-2"
        >
          <v-flex class="ibm body-2" text-center>
            No one is looking for work at the moment
          </v-flex>
        </v-card>
        <v-card
          v-for="contractor in filteredList"
          :key="contractor.id"
          outlined
          max-width="800"
          class="mx-auto mt-2 ma-2"
        >
          <v-layout wrap>
            <v-flex xs8 class="pa-1">
              <v-chip small color="cyan lighten-3" label outlined @click="showProfile(contractor.user)">
                <v-icon small class="mr-1">
                  mdi-information-outline
                </v-icon>
                {{ contractor.name }}
              </v-chip>
            </v-flex>
            <v-flex xs4 class="pa-1">
              <v-btn color="cyan lighten-3" outlined small @click="showDetails(contractor)">
                Details
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-card>
    <v-divider />
    <v-dialog v-model="dialogUser" max-width="600">
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            User details
          </v-toolbar-title>
          <v-btn icon dark @click="dialogUser = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout class="pa-2" wrap>
          <v-flex class="pa-1" xs12 text-center>
            <v-chip large color="teal lighten-3" label outlined @click="showProfile(currentUser.user)">
              <v-icon small class="mr-1">
                mdi-information-outline
              </v-icon>
              {{ currentUser.name }}
            </v-chip>
          </v-flex>
          <v-flex class="pa-1" xs12>
            Expected wage: <v-chip class="ma-1" label small>
              {{ currentUser.hourly }}
            </v-chip>
          </v-flex>
          <v-flex class="pa-1" xs12>
            Looking for work in:
            <v-chip v-for="loc in currentUser.location" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>
          <v-flex class="pa-1" xs12>
            Employment type:
            <v-chip v-for="loc in currentUser.employment" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>
          <v-flex class="pa-1" xs12>
            <v-divider class="mb-2" />
            <v-card class="pa-2" shaped>
              <center><u><b>Experience</b></u><br></center>
              {{ currentUser.experience }}
            </v-card>
            <v-divider class="mt-2" />
          </v-flex>
          <v-flex class="pa-1" xs12>
            <v-divider class="mb-2" />
            <v-card class="pa-2" shaped>
              <center><u><b>References</b></u><br></center>
              {{ currentUser.reference }}
            </v-card>

            <v-divider class="mt-2" />
          </v-flex>
          <v-flex class="pa-1" xs12>
            Skills:
            <v-chip v-for="loc in currentUser.skills" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>
          <v-flex class="mb-4 pa-1" xs12>
            Tickets:
            <v-chip v-for="loc in currentUser.tickets" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>

          <v-flex v-if="currentUser.contact && currentUser.contact.email" class="pa-2" xs12 sm6 text-center>
            <v-btn :href="'mailto:'+currentUser.contact.email" target="_blank" small color="teal darken-3">
              <v-icon class="mr-2">
                mdi-email
              </v-icon>
              {{ currentUser.contact.email }}
            </v-btn>
          </v-flex>
          <v-flex v-if="currentUser.contact && currentUser.contact.phone" class="pa-2" xs12 sm6 text-center>
            <v-btn :href="'tel:'+currentUser.contact.phone" target="_blank" small color="teal darken-3">
              <v-icon class="mr-2">
                mdi-phone
              </v-icon>
              {{ currentUser.contact.phone }}
            </v-btn>
          </v-flex>
        </v-layout>
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
        <PublicProfile :user="currentUser" />
        <v-divider />
      </v-card>
    </v-dialog>
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
.mainTitle2 {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 1.7em;
      font-weight: bold;
      font-style: italic;
    }
</style>
<script>
export default {
  components: {
    PublicProfile: () => import('../components/PublicProfile.vue')
  },
  data () {
    return {
      city: '',
      cities: [],
      trade: '',
      trades: [],
      page: 1,
      perPage: 10,
      pages: [],
      contractors: [],
      dialogUser: false,
      currentUser: {},
      dialogProfile: false

    }
  },
  computed: {
    filteredList () {
      let filtered = this.contractors
      if (this.city.length > 0) {
        filtered = filtered.filter(job => this.city.some(el => job.location.includes(el.trim().charAt(0).toUpperCase() + el.slice(1))))
      }
      if (this.trade.length > 0) {
        // filtered = filtered.filter(job => new RegExp(job.skills.join('|')).test(this.trade))
        filtered = filtered.filter(job => this.trade.some(el => job.skills.includes(el.trim().charAt(0).toUpperCase() + el.slice(1))))
      }
      return this.paginate(filtered)
    }
  },
  watch: {
    filteredList () {
      this.setPages()
    },
    contractors () {
      this.contractors.forEach((job) => {
        job.location.forEach((city) => {
          if (!this.cities.includes(city)) {
            this.cities.push(city)
          }
        })

        job.skills.forEach((skill) => {
          if (!this.trades.includes(skill)) {
            this.trades.push(skill)
          }
        })
      })
    }
  },
  created () {
    this.$axios.$get('hiring/getContractors').then((res) => {
      this.contractors = res
    })
  },
  methods: {
    setPages () {
      this.pages = Math.ceil(this.contractors.length / this.perPage)
    },
    paginate (contractors) {
      const page = this.page
      const perPage = this.perPage
      const from = (page * perPage) - perPage
      const to = (page * perPage)
      return contractors.slice(from, to)
    },
    showProfile (id) {
      this.$axios.$get(`account/getProfile/${id}`).then((res) => {
        this.currentUser = res
        if (!this.currentUser.photos) {
          this.currentUser.photos = []
        }
      }).then(() => {
        this.dialogProfile = true
      })
    },
    showDetails (contractor) {
      this.currentUser = contractor
      this.dialogUser = true
    }
  }
}
</script>
