<template>
  <v-container>
    <v-card>
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
          v-for="contractor in contractors"
          :key="contractor.id"
          outlined
          max-width="800"
          class="mx-auto mt-2 ma-2"
        >
          <v-layout wrap>
            <v-flex xs8 class="pa-1">
              <v-chip small color="blue lighten-3" label outlined @click="showProfile(contractor.user)">
                <v-icon small class="mr-1">
                  mdi-information-outline
                </v-icon>
                {{ contractor.name }}
              </v-chip>
            </v-flex>
            <v-flex xs4 class="pa-1">
              <v-btn color="blue lighten-3" outlined small @click="showDetails(contractor)">
                Details
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-card>
    <v-divider />
    <v-dialog v-model="dialogUser" max-width="600">
      <v-card class="px-3">
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
          <v-flex xs12 text-center>
            <v-chip large outlined label>
              {{ currentUser.name }}
            </v-chip>
          </v-flex>
          <v-flex xs12>
            Expected wage: <v-chip class="ma-1" label small>
              {{ currentUser.hourly }}
            </v-chip>
          </v-flex>
          <v-flex xs12>
            Looking for work in:
            <v-chip v-for="loc in currentUser.location" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>
          <v-flex xs12>
            Employment type:
            <v-chip v-for="loc in currentUser.employment" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>
          <v-flex xs12>
            Experience: &nbsp;
            {{ currentUser.experience }}
          </v-flex>
          <v-flex xs12>
            References: &nbsp;
            {{ currentUser.reference }}
          </v-flex>
          <v-flex xs12>
            Skills:
            <v-chip v-for="loc in currentUser.skills" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
          </v-flex>
          <v-flex xs12>
            Tickets:
            <v-chip v-for="loc in currentUser.tickets" :key="loc.id" small class="ma-1" label>
              {{ loc }}
            </v-chip>
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
  </v-container>
</template>
<script>
export default {
  components: {
    PublicProfile: () => import('../components/PublicProfile.vue')
  },
  data () {
    return {
      contractors: [],
      dialogUser: false,
      currentUser: {},
      dialogProfile: false

    }
  },
  created () {
    this.$axios.$get('hiring/getContractors').then((res) => {
      this.contractors = res
    })
  },
  methods: {
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
