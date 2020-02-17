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
        <v-flex xs12 sm6 offset-sm-3 text-center>
          <v-text-field
            v-model="search"
            placeholder="Search by Name.."
            class="purple-input center"
            solo
            clearable
            dense
          />
          <v-btn
            v-if="search.length > 0 || city.length > 0 || trade.length > 0 || wcb || liability || ticket.length > 0"
            small
            rounded
            class="mt-n12"
            color="orange darken-4"
            @click="clearFilters"
          >
            Clear filters
          </v-btn>
          <v-btn rounded color="teal darken-4" small class="mt-n12" @click="searchDialog = !searchDialog">
            Advanced search
          </v-btn>
        </v-flex>
        <v-flex xs12 text-center>
          <span class="caption">*Drag & Drop name as close to the top as possible</span>
        </v-flex>
        <v-flex
          xs6
          sm3
          offset-sm-2
          offset-xl-3
          xl2
          class="pr-3"
          text-center
        >
          <v-card color="blue-grey darken-1">
            <v-divider />
            <h3>Users</h3>
            <v-divider />
          </v-card>
          <v-card v-if="users.length > 0" class="pb-3 scroll mb-5" height="320">
            <draggable class="list-group" :list="users" group="team" @change="save">
              <v-card
                v-for="user in filteredList"
                :key="user.id"
                flat
                outlined
                shaped
                class="bg ma-2"
                @click="dialog2(user)"
              >
                {{ user.name }} <v-divider />
              </v-card>
            </draggable>
          </v-card>
          <v-card v-else class="mb-5" height="320">
            <draggable class="list-group" :list="users" group="team" @change="save" />
            No users available
          </v-card>
        </v-flex>
        <v-flex xs6 sm3 offset-sm-2 xl2 text-center>
          <v-card color="blue-grey darken-1">
            <v-divider />
            <h3>My Team</h3>
            <v-divider />
          </v-card>
          <v-card class="scroll" height="320px">
            <draggable class="list-group" :list="team" group="team">
              <v-card v-for="user in filteredTeam" :key="user.id" shaped class="bg ma-2" @click="dialog2(user)">
                {{ user.name }} <v-divider />
              </v-card>
            </draggable>
          </v-card>
          <v-btn color="primary" class="mt-n5" small fab @click="dialogMessage = !dialogMessage">
            <v-icon>mdi-message-text</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card>
    <v-dialog v-model="dialogProfile" max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogProfile = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Profile</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <PublicProfile :user="currentUser" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="searchDialog" max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="searchDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Search By</v-toolbar-title>
        </v-toolbar>
        <v-layout row wrap class="mx-4 mb-5">
          <v-flex xs6 class="pr-3">
            <v-select
              v-model="city"
              :items="cities"
              label="City"
              multiple
              chips
            />
          </v-flex>
          <v-flex xs6>
            <v-select
              v-model="trade"
              :items="trades"
              label="Skills"
              multiple
              chips
            />
          </v-flex>
          <v-flex xs6>
            <v-select
              v-model="ticket"
              :items="tickets"
              label="Tickets"
              class="pr-8"
              multiple
              chips
            />
          </v-flex>
          <v-flex xs6>
            <v-checkbox
              v-model="liability"
              label="Liability"
              background-color="grey darken-2"
            />
            <v-checkbox
              v-model="wcb"
              label="Wcb"
              background-color="grey darken-2"
              class="mt-n5"
            />
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogMessage" max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogMessage = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Message Team</v-toolbar-title>
          <div class="flex-grow-1" />
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
  </v-container>
</template>
<style scoped>
.bg {
  background-color: #EF6C00;
}
.scroll {
  overflow-y: auto;
}
.mainTitle {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 2em;
  font-weight: bold;
}
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
}
</style>
<script>
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import PublicProfile from '../../components/PublicProfile.vue'
export default {
  components: {
    draggable,
    PublicProfile
  },
  data () {
    return {
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
      users: [],
      currentUser: ''
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
    }
  },
  created () {
    this.trades = process.env.trades.split(',')
    this.tickets = process.env.tickets.split(',')
    this.$axios.$get('team/fetch').then((res) => {
      this.team = res.team
      this.$axios
        .$post('account/public', { name: '*' }).then((res) => {
          const arr = res
          // filter users and team for duplicates and remove ourself
          this.users = arr.filter(val => !this.team.find(({ uid }) => val.uid === uid) && val.uid !== this.$auth.user.sub)
          arr.forEach((obj, i) => {
            if (obj.metadata.city && obj.metadata.city.length > 0) {
              this.cities.push(obj.metadata.city)
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
    clearFilters () {
      this.city = []
      this.search = ''
      this.trade = []
      this.ticket = []
      this.wcb = false
      this.liability = false
    },
    dialog2 (item) {
      this.currentUser = item
      this.dialogProfile = !this.dialogProfile
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
