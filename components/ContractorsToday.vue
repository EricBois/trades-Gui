<template>
  <v-container>
    <v-card>
      <v-card
        class="mt-4"
      >
        <v-container bg fill-height grid-list-md text-xs-center>
          <v-layout row wrap align-center>
            <v-flex v-if="!next" xs9>
              <v-combobox
                v-model="city"
                :items="cities"
                :rules="comboBoxCity"
                chips
                dense
                label="Where are you located?"
                autocomplete
              />
            </v-flex>
            <v-flex v-if="next" xs9>
              <v-combobox
                v-model="trade"
                :items="trades"
                :rules="comboBoxSkill"
                chips
                dense
                label="Which service do you need ?"
                multiple
                autocomplete
              />
            </v-flex>
            <v-flex xs3 text-center>
              <v-btn v-if="!next" @click="next = !next " small>
                next
              </v-btn>
              <v-btn v-if="next" @click="next = !next " small>
                back
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <v-flex xs12 class="mt-4">
        <v-card
          v-if="contractors.length < 1"
          outlined
          max-width="800"
          class="mx-auto mt-2 ma-2"
        >
          <v-flex class="ibm body-2" text-center>
            No one is available at the moment.
          </v-flex>
        </v-card>
        <v-card
          v-if="filteredList.length < 1 && contractors.length > 1"
          outlined
          max-width="800"
          class="mx-auto mt-2 ma-2"
        >
          <v-flex class="ibm body-2" text-center>
            Please update your search criteria.
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
            <v-flex xs12 class="pa-1">
              <v-chip @click="showProfile(contractor.user)" color="amber darken-1" label outlined>
                <v-icon class="mr-1">
                  mdi-information-outline
                </v-icon>
                {{ contractor.name }}
              </v-chip>
            </v-flex>
            <v-flex xs12 class="pa-1 mt-n2" text-right>
              <v-btn @click="showDetails(contractor)" class="ma-1" color="cyan lighten-4" outlined small>
                <v-icon>mdi-card-account-details-star</v-icon>
              </v-btn>
              <v-btn @click="notify(contractor)" class="ma-1" color="cyan lighten-4" outlined small>
                Request <v-icon class="ml-1" small>
                  mdi-phone
                </v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-card>
    <v-divider />
    <v-dialog v-model="dialogUser" max-width="600">
      <v-card>
        <v-toolbar height="30" dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            User details
          </v-toolbar-title>
          <v-btn @click="dialogUser = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout class="pa-2" wrap>
          <v-flex class="pa-1" xs12 text-center>
            <v-chip @click="showProfile(currentUser.user)" large color="teal lighten-3" label outlined>
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
            <v-btn :href="'mailto:'+currentUser.contact.email" small color="teal darken-3">
              <v-icon class="mr-2">
                mdi-email
              </v-icon>
              {{ currentUser.contact.email }}
            </v-btn>
          </v-flex>
          <v-flex v-if="currentUser.contact && currentUser.contact.phone" class="pa-2" xs12 sm6 text-center>
            <v-btn :href="'tel:'+currentUser.contact.phone" small color="teal darken-3">
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
        <PublicProfile :user="profileUser" />
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
      font-display: swap;
    }
</style>
<script>
export default {
  components: {
    PublicProfile: () => import('../components/PublicProfile.vue')
  },
  data () {
    return {
      comboBoxCity: [
        v => !!v || 'Choose an available city'
      ],
      comboBoxSkill: [
        v => !!v || 'Choose a service'
      ],
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
      profileUser: {},
      dialogProfile: false,
      next: false

    }
  },
  computed: {
    filteredList () {
      let filtered = []
      if (this.city && this.trade.length > 0) {
        filtered = this.contractors.filter(job => job.location.includes(this.city.trim().charAt(0).toUpperCase() + this.city.slice(1)))
        filtered = this.contractors.filter(job => this.trade.some(el => job.skills.includes(el.trim().charAt(0).toUpperCase() + el.slice(1))))
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
    notify (user) {
      // TODO socket io ? notification ? how to handle notification and connect users ?
      console.log(user)
    },
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
        this.profileUser = res
        if (!this.profileUser.photos) {
          this.profileUser.photos = []
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
