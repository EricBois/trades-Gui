<template>
  <v-container>
    <v-alert
      v-model="alert"
      :type="alertInfo"
      icon="mdi-information-outline"
      prominent
      dense
      dismissible
      transition="scale-transition"
      text
    >
      {{ alertText }}
    </v-alert>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
      right
    >
      {{ snackbarText }}
      <v-icon>
        mdi-check-circle-outline
      </v-icon>
    </v-snackbar>
    <v-card flat color="#303030">
      <v-layout row wrap>
        <v-flex xs12 text-center>
          <v-divider class="mb-5" />
          <v-icon>mdi-axis-x-arrow</v-icon>
          <span class="mainTitle">Your Team</span>
          <v-icon>mdi-axis-y-arrow</v-icon>
          <v-divider class="my-5" />
        </v-flex>

        <v-flex xs12 text-center>
          <v-card max-width="400" class="mx-auto mb-n4" color="blue-grey darken-1">
            <h3>My Team</h3>
            <v-text-field
              v-model="search"
              placeholder="Search by Name.."
              class="purple-input center"
              solo
              dense
            />
            <v-btn
              v-if="search.length > 0 || city.length > 0 || trade.length > 0 || wcb || liability || ticket.length > 0"
              @click="clearFilters"
              small
              rounded
              class="mt-n12"
              color="orange darken-4"
            >
              Clear filters
            </v-btn>
            <v-btn @click="searchDialog = !searchDialog" rounded color="teal darken-4" small class="mt-n12">
              Advanced search
            </v-btn>
          </v-card>
          <v-card max-width="400" class="scroll mx-auto" max-height="800px">
            <!-- <draggable class="list-group" :list="team" group="team"> -->
            <v-card v-for="user in filteredTeam" :key="user.id" shaped class="bg ma-2">
              <v-layout wrap>
                <v-flex xs8 text-left class="pa-1">
                  <v-chip @click="showProfile(user.uid)" small color="grey lighten-3" label outlined>
                    <v-icon color="green accent-2" small class="mr-1">
                      mdi-information-outline
                    </v-icon>
                    {{ user.name }}
                  </v-chip>
                </v-flex>
                <v-flex class="pa-1" xs2>
                  <v-btn @click="userSetting(user)" color="blue-grey lighten-5" fab outlined x-small>
                    <v-icon>
                      mdi-account-cog-outline
                    </v-icon>
                  </v-btn>
                </v-flex>
                <v-flex class="pa-1" xs2>
                  <v-btn
                    @click="askDelete(user)"
                    ripple
                    color="red darken-1"
                    class="pa-1"
                    icon
                    outlined
                    x-small
                  >
                    <v-icon large>
                      mdi-delete-circle
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card>
            <!-- </draggable> -->
          </v-card>
          <div :class="(team.length >= 1)? '':'mt-4'">
            <v-btn @click="dialogUsers = !dialogUsers" small color="green darken-3" fab class="mt-n5">
              <v-icon>mdi-account-multiple-plus</v-icon>
            </v-btn>
            <v-btn @click="dialogMessage = !dialogMessage" color="primary" class="mt-n5" small fab>
              <v-icon>mdi-message-text</v-icon>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-card>
    <v-dialog v-model="dialogUsers" fullscreen>
      <v-card class="px-3" color="grey darken-4">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Search Users
          </v-toolbar-title>
          <v-spacer />
          <v-btn @click="dialogUsers = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-flex xs12 text-center>
          <v-divider class="mb-5" />
          <v-icon>mdi-axis-x-arrow</v-icon>
          <span class="mainTitle">Search Users</span>
          <v-icon>mdi-axis-y-arrow</v-icon>
          <v-divider class="my-5" />
        </v-flex>
        <v-flex
          xs12
          class="mt-5"
          text-center
        >
          <v-card max-width="400" class="mx-auto mb-n4" color="blue-grey darken-1">
            <v-divider />
            <h3>Users</h3>
            <v-divider />
            <v-text-field
              v-model="search"
              placeholder="Search by Name.."
              class="purple-input center"
              solo
              dense
            />
            <v-btn
              v-if="search.length > 0 || city.length > 0 || trade.length > 0 || wcb || liability || ticket.length > 0"
              @click="clearFilters"
              small
              rounded
              class="mt-n12"
              color="orange darken-4"
            >
              Clear filters
            </v-btn>
            <v-btn @click="searchDialog = !searchDialog" rounded color="teal darken-4" small class="mt-n12">
              Advanced search
            </v-btn>
          </v-card>
          <v-card v-if="users.length > 0" max-width="400" class="pb-3 mx-auto scroll mb-5">
            <!-- <draggable class="list-group" :list="users" group="team" @change="save"> -->
            <v-card
              v-for="user in filteredList"
              :key="user.id"
              flat
              outlined
              shaped
              class="bg ma-2"
            >
              <v-layout wrap>
                <v-flex xs9 text-left class="pa-1">
                  <v-chip @click="showProfile(user.uid)" small color="grey lighten-3" label outlined>
                    <v-icon color="green accent-2" small class="mr-1">
                      mdi-information-outline
                    </v-icon>
                    {{ user.name }}
                  </v-chip>
                </v-flex>
                <v-flex class="pa-1" xs3>
                  <v-btn @click="addToTeam(user)" color="blue-grey lighten-4" fab outlined x-small>
                    <v-icon>
                      mdi-account-multiple-plus
                    </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card>
            <!-- </draggable> -->
          </v-card>
          <v-card v-else max-width="400" class="mb-5" max-height="800">
            <!-- <draggable class="list-group" :list="users" group="team" @change="save" /> -->
            No users available
          </v-card>
        </v-flex>
        <v-divider />
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogProfile" max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Profile
          </v-toolbar-title>
          <v-btn @click="dialogProfile = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <PublicProfile :user="currentUser" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="searchDialog" max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Filter users
          </v-toolbar-title>
          <v-spacer />
          <v-btn @click="searchDialog = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout row wrap class="mx-4 mb-5">
          <v-flex xs12 sm6>
            <v-select
              v-model="city"
              :items="cities"
              :class="($vuetify.breakpoint.smAndUp)? 'pr-8': ''"
              label="City"
              multiple
              chips
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              v-model="trade"
              :items="trades"
              label="Skills"
              multiple
              chips
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-select
              v-model="ticket"
              :items="tickets"
              :class="($vuetify.breakpoint.smAndUp)? 'pr-8': ''"
              label="Tickets"
              multiple
              chips
            />
          </v-flex>
          <v-flex v-if="!dialogUsers" xs12 sm6>
            <v-select
              v-model="tag"
              :items="currentTags"

              label="Tags"
              multiple
              chips
            />
          </v-flex>
          <v-flex v-else xs12 sm6 />

          <v-flex xs12 sm6>
            <v-checkbox
              v-model="liability"
              current-tags
              label="Liability Insured"
              background-color="grey darken-2"
              class="mt-n2"
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-checkbox
              v-model="wcb"
              label="Worker Compensation insured"
              background-color="grey darken-2"
              class="mt-n2"
            />
          </v-flex>
          <v-flex xs12 sm6>
            <v-checkbox
              v-model="featuredUsers"
              label="Featured Users Only"
              background-color="grey darken-2"
              class="mt-n2"
            />
          </v-flex>
          <v-flex xs12 class="mt-4 mb-2" text-right>
            <v-btn @click="searchDialog = false" color="blue darken-3">
              ok
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogMessage" max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Message Team
          </v-toolbar-title>
          <v-btn @click="dialogMessage = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-form ref="form" lazy-validation class="mt-5">
          <v-textarea
            v-model="message.messages.text"
            label="Message"
            solo
            outlined
            clearable
            class="purple-input"
            auto-grow
          />
        </v-form>
        <v-btn @click="send">
          Send
        </v-btn>
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Please Confirm
        </v-card-title>

        <v-card-text>
          Delete this user from your team ?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            @click="dialogDelete = false"
            color="orange darken-3"
            text
          >
            No
          </v-btn>

          <v-btn
            @click="deleteMember(currentId)"
            color="green darken-1"
            text
          >
            Yes!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogSetting" max-width="500">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Settings for {{ currentUser.name }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn @click="dialogSetting = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-layout wrap>
          <v-flex xs12 sm6 class="pa-2" text-center>
            <v-switch v-model="featured" label="Featured" color="green darken-3" inset />
          </v-flex>
          <v-flex xs12 sm6>
            <v-combobox
              v-model="tags"
              :items="trades"
              chips
              dense
              label="Tags"
              multiple
              autocomplete
            />
          </v-flex>
          <v-flex class="pa-2 mb-6" xs12>
            <v-textarea
              v-model="notes"
              label="Notes"
              outlined
              class="purple-input"
            />
          </v-flex>
          <v-flex xs12 text-right class="ma-2">
            <v-btn @click="saveUser()" large color="blue darken-3">
              save
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.bg {
  background-color: darkslategray;
}
.scroll {
  overflow-y: auto;
}
.mainTitle {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 2em;
  font-weight: bold;
  font-display: swap;
}
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
  font-display: swap;
}
</style>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    PublicProfile: () => import('../../components/PublicProfile.vue')
  },
  data () {
    return {
      featuredUsers: false,
      featured: false,
      notes: '',
      dialogSetting: false,
      dialogDelete: false,
      dialogUsers: false,
      dialogMessage: false,
      message: {
        to: '',
        names: {
          to: '',
          from: ''
        },
        project_name: '',
        messages: {
          text: '',
          name: ''
        }
      },
      currentTags: [],
      tags: [],
      tag: [],
      currentUser: {},
      currentId: '',
      snackbar: false,
      snackbarColor: 'green darken-3',
      snackbarText: '',
      alert: false,
      alertInfo: 'info',
      alertText: '',
      searchDialog: false,
      search: '',
      trades: [],
      tickets: [],
      ticket: [],
      cities: [],
      city: [],
      trade: [],
      wcb: false,
      liability: false,
      dialogProfile: false,
      team: [],
      users: []
    }
  },
  computed: {
    ...mapGetters({
      profile: 'profile/getProfile'
    }),
    filteredList () {
      let filtered = this.users
      if (this.search.length > 0) {
        filtered = this.users.filter(user => user.name.toLowerCase().includes(this.search))
      }
      if (this.city.length > 0) {
        filtered = filtered.filter(user => this.city.includes(user.metadata.city))
      }
      if (this.wcb) {
        filtered = filtered.filter(user => user.metadata.wcb && user.metadata.wcb.length > 0)
      }
      if (this.liability) {
        filtered = filtered.filter(user => user.metadata.liability && user.metadata.liability.length > 0)
      }
      if (this.trade.length > 0) {
        filtered = filtered.filter(user => this.trade.some(el => user.metadata.skills && user.metadata.skills.includes(el)))
      }
      if (this.ticket.length > 0) {
        filtered = filtered.filter(user => this.ticket.some(el => user.metadata.tickets && user.metadata.tickets.includes(el)))
      }
      return filtered
    },
    filteredTeam () {
      let filtered = this.team
      if (this.search.length > 0) {
        filtered = this.team.filter(user => user.name.toLowerCase().includes(this.search))
      }
      if (this.city.length > 0) {
        filtered = filtered.filter(user => this.city.includes(user.metadata.city))
      }
      if (this.wcb) {
        filtered = filtered.filter(user => user.metadata.wcb && user.metadata.wcb.length > 0)
      }
      if (this.tag.length > 0) {
        filtered = filtered.filter(user => this.tag.some(el => user.tags && user.tags.includes(el)))
      }
      if (this.featuredUsers) {
        filtered = filtered.filter(user => user.featured)
      }
      if (this.liability) {
        filtered = filtered.filter(user => user.metadata.liability && user.metadata.liability.length > 0)
      }
      if (this.trade.length > 0) {
        filtered = filtered.filter(user => this.trade.some(el => user.metadata.skills && user.metadata.skills.includes(el)))
      }
      if (this.ticket.length > 0) {
        filtered = filtered.filter(user => this.ticket.some(el => user.metadata.tickets && user.metadata.tickets.includes(el)))
      }
      return filtered.sort((x, y) => y.featured - x.featured)
    }
  },
  watch: {
    dialogUsers () {
      this.search = ''
    },
    featured () {
      if (this.featured) {
        this.featured = true
      } else {
        this.featured = false
      }
    },
    team () {
      // get all the current tags and store in currentTags
      this.team.forEach((user) => {
        if (user.tags && user.tags.length >= 1) {
          user.tags.forEach((tag) => {
            if (!this.currentTags.includes(tag)) {
              this.currentTags.push(tag)
            }
          })
        }
      })
    }
  },
  created () {
    this.$axios.$get('team/fetch').then((res) => {
      this.team = res.team
      this.$axios
        .$post('account/public', { name: '*' }).then((res) => {
          const arr = res
          // filter users and team for duplicates and remove ourself
          this.users = arr.filter(val => !this.team.find(({ uid }) => val.uid === uid) && val.uid !== this.$auth.user.sub)
          arr.forEach((obj) => {
            if (obj.metadata.city && obj.metadata.city.length > 0) {
              this.cities.push(obj.metadata.city)
            }
            if (obj.metadata.skills && obj.metadata.skills.length > 0) {
              obj.metadata.skills.forEach((skill) => {
                if (!this.trades.includes(skill)) {
                  this.trades.push(skill)
                }
              })
            }
            if (obj.metadata.tickets && obj.metadata.tickets.length > 0) {
              obj.metadata.tickets.forEach((ticket) => {
                if (!this.tickets.includes(ticket)) {
                  this.tickets.push(ticket)
                }
              })
            }
          })
        })
    })
    if (this.profile.user_metadata && !this.profile.user_metadata.welcomeTeam) {
      this.alertText = process.env.welcomeTeam
      this.alert = true
      return this.$axios.$post('account/edit', { user_metadata: { welcomeTeam: true } })
    }
  },
  methods: {
    userSetting (user) {
      this.currentUser = user
      this.tags = user.tags
      this.notes = user.notes
      this.featured = user.featured
      this.dialogSetting = true
    },
    saveUser () {
      this.currentUser.tags = this.tags
      this.currentUser.notes = this.notes
      this.currentUser.featured = this.featured
      this.team.splice(this.team.indexOf(this.currentUser), 1)
      this.team.push(this.currentUser)
      this.team.sort((x, y) => y.featured - x.featured)
      this.dialogSetting = false
      this.save()
    },
    addToTeam (user) {
      this.team.push(user)
      const index = this.users.indexOf(user)
      this.users.splice(index, 1)
      this.save()
    },
    askDelete (user) {
      this.currentId = this.team.indexOf(user)
      this.currentUser = user
      this.dialogDelete = true
    },
    deleteMember (id) {
      this.team.splice(id, 1)
      this.users.push(this.currentUser)
      this.dialogDelete = false
      this.save()
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
    clearFilters () {
      this.city = []
      this.search = ''
      this.trade = []
      this.ticket = []
      this.wcb = false
      this.liability = false
    },
    save () {
      setTimeout(() => {
        this.$axios.$post('team/edit', { team: this.team }).then((res) => {
          this.snackbarText = 'Successfully Updated!'
          this.snackbar = true
          this.$store.commit('team/updateTeam', res.team) // update team store
        })
      }, 1000)
    },
    async send () {
      if (this.message.messages.text) {
        this.message.project_name = this.$auth.user.name
        this.message.messages.name = this.$auth.user.name
        this.message.messages.uid = this.$auth.user.sub
        this.message.names.from = this.$auth.user.name
        for (const key in this.filteredTeam) {
          const user = this.filteredTeam[key]
          this.message.names.to = user.name
          this.message.to = user.uid
          await this.$axios.$post('message/send', this.message).then((res) => {
            this.snackbarText = 'Successfully Sent!'
            this.snackbar = true
            this.$store.dispatch('notifications/createNotification',
              {
                senderId: this.$auth.user.sub,
                recipientId: user.uid,
                activity: 'Message',
                activityDesc: 'You have a new message',
                link: res._id
              })
          })
        }
        this.dialogMessage = false
        this.message.messages.text = ''
      }
    }
  }
}
</script>
