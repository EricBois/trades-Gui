<template>
  <v-app id="inspire">
    <v-snackbar
      v-model="snackbar"
      bottom
      :color="snackbarColor"
    >
      {{ snackbarText }}
      <v-icon v-if="snackbarColor.includes('red')">
        mdi-alert-outline
      </v-icon>
      <v-icon v-else>
        mdi-check-circle-outline
      </v-icon>
    </v-snackbar>
    <v-navigation-drawer
      v-if="this.$auth.loggedIn"
      v-model="drawer"
      app
      floating
      clipped
    >
      <v-list-item>
        <v-img :src="require('../assets/logo.png')" />
      </v-list-item>
      <v-divider />
      <v-list-item to="/profile">
        <v-list-item-avatar tile size="50">
          <v-img class="rounded mt-n1" :src="picture" />
        </v-list-item-avatar>

        <v-list-item-title class="ml-n1">
          <v-chip class="ibm pl-2" label>
            {{ this.$auth.user.name }}
            <v-icon color="green" class="pl-2">
              mdi-tune
            </v-icon>
          </v-chip>
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n4">
            <v-list-item-title>
              <v-chip outlined label>
                Home
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item v-ripple>
          <v-list-item-action @click="$router.push('/projects')">
            <v-icon color="yellow lighten-1">
              mdi-currency-usd
            </v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n4" @click="$router.push('/projects')">
            <v-list-item-title>
              <v-chip color="yellow lighten-1" outlined label>
                Projects Bidding
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
          <v-divider class="mr-n2" vertical />
          <v-list-item-icon @click="create = !create">
            <v-icon color="green darken-2" large>
              mdi-file-document-box-plus-outline
            </v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-divider />
        <v-list-item @click="dialogAssist = !dialogAssist">
          <v-list-item-action>
            <v-icon color="teal accent-3">
              mdi-auto-fix
            </v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n4">
            <v-list-item-title>
              <v-chip color="teal accent-3" outlined label>
                Your Assistant
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item to="/myprojects">
          <v-list-item-action>
            <v-icon>mdi-alpha-m-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                Manage Listings
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/messages">
          <v-list-item-action>
            <v-badge
              color="green darken-3"
              overlap
              right
            >
              <template v-slot:badge>
                <span v-if="newMessages.length > 0">{{ newMessages.length }}</span>
              </template>
              <v-icon>
                mdi-message
              </v-icon>
            </v-badge>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                My Messages
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="/meetings">
          <v-list-item-action>
            <v-badge
              color="green darken-3"
              overlap
              right
            >
              <template v-slot:badge>
                <span v-if="notifMeetings.length > 0">{{ notifMeetings.length }}</span>
              </template>
              <v-icon>
                mdi-handshake
              </v-icon>
            </v-badge>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                My Meetings
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group prepend-icon="mdi-account-group" no-action>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  My Team
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item to="/team/manage">
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  <v-icon class="mr-2">
                    mdi-account-multiple-plus
                  </v-icon>
                  <span>Manage Team</span>
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item to="/team/projects">
            <v-list-item-content>
              <v-list-item-title>
                <v-chip outlined>
                  <v-icon class="mr-2">
                    mdi-pencil-outline
                  </v-icon>
                  <span>Manage Projects</span>
                </v-chip>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-divider v-if="admin" class="my-3" />
        <v-list-item v-if="admin" to="/management">
          <v-list-item-action>
            <v-icon>mdi-alpha-p-box</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              <v-chip outlined>
                Manage invite Codes
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item to="/hiring">
          <v-list-item-action>
            <v-icon color="cyan accent-3">
              mdi-help-circle
            </v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n4">
            <v-list-item-title>
              <v-chip color="cyan accent-3" outlined label>
                Who's Hiring Now
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="my-2" />
        <!-- <v-list-item class=" mt-5 justify-center">
          <v-switch v-model="switchAvailable" label="Looking for work" color="green" inset />
        </v-list-item> -->
        <v-list-item class="mt-5 justify-center">
          <v-btn v-if="this.$auth.loggedIn" color="amber darken-4" small @click="logout">
            <v-icon class="mr-1">
              mdi-logout
            </v-icon>
            Logout
          </v-btn>
          <v-btn :style="{'display': addBtnShow}" class="addBtn ml-3" small @click="addToPage">
            <v-icon>mdi-tablet-cellphone</v-icon>&nbsp;
            Install App
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :max-width="barLength"
      app
      clipped-left
      dense
      collapse
      elevate-on-scroll
    >
      <v-app-bar-nav-icon v-if="this.$auth.loggedIn" @click.stop="drawer = !drawer" />
      <v-btn
        v-if="!this.$auth.loggedIn && !mobile"
        color="green"
        class="mr-2"
        small
        label
        @click="login"
      >
        <v-icon>mdi-login</v-icon> Login
      </v-btn>
      <v-btn v-if="!this.$auth.loggedIn && !mobile" color="blue darken-3" small label @click="registerDialog = !registerDialog">
        <v-icon>mdi-content-save</v-icon> Register
      </v-btn>
      <v-menu
        v-if="this.$auth.loggedIn"
        transition="scale-transition"
        class="mx-1 scroll"
        :close-on-content-click="contentClick"
        offset-x
        :offset-overflow="overflow"
        max-height="400"
      >
        <template v-slot:activator="{ on: menu }">
          <v-btn
            :color="notificationColor"
            dark
            x-small
            v-on="{ ...menu }"
          >
            <v-badge
              :color="notificationColor"
              left
            >
              <template v-slot:badge>
                <span v-if="notifications.length > 0">{{ notifications.length }}</span>
              </template>
              <v-icon small>
                mdi-bell
              </v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-list v-if="notifications.length > 0" class="pa-4">
          <v-list-item v-if="notifMessages.length > 0" to="../messages">
            <v-list-item-action>
              <v-badge
                color="primary"
              >
                <template v-slot:badge>
                  <span v-if="notifMessages.length > 0">{{ notifMessages.length }}</span>
                </template>
                <v-icon>mdi-message</v-icon>
              </v-badge>
            </v-list-item-action>
            <v-list-item-title class="ibm">
              New message(s)
            </v-list-item-title>
          </v-list-item>
          <v-flex v-if="notifMessages.length > 0" xs12 my-2>
            <v-divider />
          </v-flex>
          <v-list-item v-if="notifMeetings.length > 0" to="../meetings">
            <v-list-item-action>
              <v-badge
                color="primary"
              >
                <template v-slot:badge>
                  <span v-if="notifMeetings.length > 0">{{ notifMeetings.length }}</span>
                </template>
                <v-icon>mdi-account-group</v-icon>
              </v-badge>
            </v-list-item-action>
            <v-list-item-title> New meeting activity</v-list-item-title>
          </v-list-item>
          <v-flex v-if="notifMeetings.length > 0" xs12 my-2>
            <v-divider />
          </v-flex>
          <v-flex v-if="notifBids.length > 0" xs12 class="ibm my-2" text-center>
            <v-chip label>
              Bids Received
            </v-chip>
            <v-divider my-2 />
          </v-flex>
          <v-layout v-for="bid in notifBids" :key="bid._id" wrap>
            <v-flex v-if="$vuetify.breakpoint.smAndUp" xs1 px-sm-1>
              <v-icon>mdi-beaker-plus</v-icon>
            </v-flex>
            <v-flex class="pl-4 ibm" xs11>
              <span @click="redirect(bid.link)">
                {{ bid.activityDesc }}
              </span>
            </v-flex>
            <v-flex xs12 my-2>
              <v-divider />
            </v-flex>
          </v-layout>
          <v-flex v-if="notifBidRequest.length > 0" xs12 class="ibm" text-center>
            <v-chip label>
              Bids Invite
            </v-chip>
            <v-divider my-2 />
          </v-flex>
          <v-layout v-for="bid in notifBidRequest" :key="bid._id" wrap>
            <v-flex v-if="$vuetify.breakpoint.smAndUp" xs1 px-sm-1>
              <v-icon>mdi-lightbulb-group</v-icon>
            </v-flex>
            <v-flex class="px-2 ibm" xs11>
              <span @click="redirect(bid.link)">
                {{ bid.activityDesc }}
              </span>
            </v-flex>
            <v-flex xs12 my-2>
              <v-divider />
            </v-flex>
          </v-layout>

          <v-btn
            v-if="notifications.length > 0"
            top
            right
            absolute
            class="mt-6"
            small
            color="red darken-3"
            fab
            @click="clearNotifications"
          >
            <v-icon large>
              mdi-delete-circle-outline
            </v-icon>
          </v-btn>
        </v-list>
        <v-list v-else>
          <v-list-item>
            <v-list-item-action>
              <v-icon>mdi-bell-off</v-icon>
            </v-list-item-action>
            <v-list-item-title> No new notification(s)</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-bottom-navigation
      v-if="this.$auth.loggedIn && !drawer"
      dark
      app
    >
      <v-btn :to="btn1.link">
        <span>{{ btn1.name }}</span>
        <v-icon>{{ btn1.icon }}</v-icon>
      </v-btn>

      <v-btn v-if="btn2.link" :to="btn2.link">
        <span>{{ btn2.name }}</span>
        <v-icon>{{ btn2.icon }}</v-icon>
      </v-btn>

      <v-btn v-else @click="clicker()">
        <span>{{ btn2.name }}</span>
        <v-icon>{{ btn2.icon }}</v-icon>
      </v-btn>

      <v-btn :to="btn3.link">
        <span>{{ btn3.name }}</span>
        <v-icon>{{ btn3.icon }}</v-icon>
      </v-btn>

      <v-btn @click="dialogAssist = !dialogAssist">
        <span>{{ btn4.name }}</span>
        <v-icon>{{ btn4.icon }}</v-icon>
      </v-btn>
    </v-bottom-navigation>
    <v-dialog v-model="registerDialog" max-width="800" persistent transition="dialog-bottom-transition">
      <v-card class="px-3">
        <v-toolbar height="50" dark color="blue">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Apply for an account
          </v-toolbar-title>
          <v-btn icon dark @click="registerDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <Register :register-dialog.sync="registerDialog" :snackbar.sync="snackbar" :snackbar-text.sync="snackbarText" :snackbar-color.sync="snackbarColor" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="sheet" persistent>
      <v-sheet class="text-center" height="200px">
        <h2>{{ sheetTitle }}</h2>
        <div class="ma-2">
          {{ welcomeText }}
        </div>
        <v-btn
          class="mt-6"
          color="blue lighten-3"
          large
          outlined
          @click="letsGo()"
        >
          Ok !
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>
    <v-dialog v-model="create" persistent fullscreen max-width="850">
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Create Project
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="create = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <CreateProject :close.sync="create" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogAssist" persistent max-width="350">
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Your Assistant
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="assistant('home')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-flex class="pa-4" xs12>
          <h3>{{ assistantTitle }}</h3>
        </v-flex>
        <v-flex xs12>
          <div v-if="step1">
            <v-btn class="ma-2 ml-12" color="light-blue darken-3" small @click="assistant('find')">
              Find contractors for my project
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" color="cyan darken-3" small @click="assistant('hire')">
              Hire tradesman
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" color="teal darken-3" small @click="assistant('team')">
              Manage my team
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" color="light-blue darken-3" small @click="assistant('job')">
              Find a job
            </v-btn>
          </div>
          <div v-if="step2 && contractor">
            <v-btn class="ma-2 ml-12" color="light-blue darken-3" small @click="create = !create">
              Get bids on my project
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" color="cyan darken-3" small @click="dialogLfw = !dialogLfw">
              I'm out of time i need someone TODAY
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" small @click="assistant('back')">
              go back
            </v-btn>
          </div>
          <div v-if="step2 && hireTradesman">
            <v-btn class="ma-2 ml-12" color="light-blue darken-3" small @click="assistant('post')">
              post an ads
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" color="cyan darken-3" small @click="dialogLfw = !dialogLfw">
              see who's available today
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" small @click="assistant('back')">
              go back
            </v-btn>
          </div>
          <div v-if="step2 && team">
            <v-btn class="ma-2 ml-12" color="light-blue darken-3" small @click="assistant('members')">
              Add or edit members
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" color="cyan darken-3" small @click="assistant('projects')">
              manage my team projects
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" small @click="assistant('back')">
              go back
            </v-btn>
          </div>
          <div v-if="step2 && job">
            <v-btn class="ma-2 ml-12" color="cyan darken-3" small @click="assistant('bid')">
              place some bids
            </v-btn>
            <v-btn class="ma-2 ml-12" color="light-blue darken-3" small @click="assistant('profile')">
              Make myself available to work
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" color="teal darken-3" small @click="assistant('listings')">
              look at the job listing
            </v-btn>
            <br>
            <v-btn class="ma-2 ml-12" small @click="assistant('back')">
              go back
            </v-btn>
          </div>
        </v-flex>
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLfw" max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Tradesman available today
          </v-toolbar-title>
          <v-spacer />
          <v-btn icon dark @click="dialogLfw = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <contractors-today />
      </v-card>
    </v-dialog>
  </v-app>
</template>
<style scoped>
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
}
a {
  text-decoration: none;
  color: #CFD8DC !important;
}
.addBtn {
  display: none;
}
.rounded {
  border-radius: 10px;
}
.scroll {
  overflow-y: auto;
}
</style>
<script>
import { mapGetters } from 'vuex'
export default {
  middleware: ['profile', 'notifications'],
  components: {
    Register: () => import('../components/Register.vue'),
    CreateProject: () => import('../components/CreateProject.vue'),
    ContractorsToday: () => import('../components/ContractorsToday.vue')
  },
  props: {
    source: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    dialogLfw: false,
    assistantTitle: 'I want to ..',
    job: false,
    team: false,
    hireTradesman: false,
    contractor: false,
    step1: true,
    step2: false,
    step3: false,
    dialogAssist: false,
    btn1: {
      name: 'Listings',
      link: '/projects',
      icon: 'mdi-post'
    },
    btn2: {
      name: 'Team Projects',
      link: '/team/projects',
      icon: 'mdi-account-group'
    },
    btn3: {
      name: 'My Projects',
      link: '/myprojects',
      icon: 'mdi-alpha-p-box'
    },
    btn4: {
      name: 'Assistant',
      icon: 'mdi-auto-fix'
    },
    create: false,
    admin: false,
    snackbar: false,
    barLength: '0',
    snackbarColor: 'green darken-3',
    snackbarText: '',
    sheet: false,
    sheetTitle: 'Welcome to Sub-Hub !',
    welcomeText: '',
    switchAvailable: false,
    addBtnShow: 'none',
    overflow: true,
    contentClick: true,
    drawer: false,
    picture: '',
    mini: false,
    notificationColor: 'blue-grey darken-1',
    notifMessages: [],
    notifMeetings: [],
    notifBidRequest: [],
    notifBids: [],
    deferredPrompt: '',
    registerDialog: false,
    mobile: true
  }),
  computed: {
    ...mapGetters({
      read: 'messages/Read',
      profile: 'profile/getProfile',
      notifications: 'notifications/getNotifications',
      newMessages: 'messages/getNewMessages'
    })
  },
  watch: {
    // Dynamic bottom menu
    $route (to, from) {
      switch (to.name) {
        case 'home':
          this.btn1.icon = 'mdi-post'
          this.btn1.name = 'Listings'
          this.btn1.link = '/projects'
          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Team'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-alpha-p-box'
          this.btn3.name = 'My Projects'
          this.btn3.link = '/myprojects'
          break
        case 'profile':
          this.btn1.icon = 'mdi-post'
          this.btn1.name = 'Listings'
          this.btn1.link = '/projects'
          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Team'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-alpha-p-box'
          this.btn3.name = 'My Projects'
          this.btn3.link = '/myprojects'
          break
        case 'projects':
          this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
          this.btn1.name = 'Back'
          this.btn1.link = '/home'
          this.btn2.icon = 'mdi-file-document-box-plus-outline'
          this.btn2.name = 'Create'
          this.btn2.link = ''
          break
        case 'team-projects':
          this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
          this.btn1.name = 'Back'
          this.btn1.link = '/home'
          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Projects'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-account-multiple-plus'
          this.btn3.name = 'Manage Team'
          this.btn3.link = '/team/manage'
          break
        case 'job-id':
          if (from.name !== 'job-id-edit') {
            this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
            this.btn1.name = 'Back'
            this.btn1.link = from.path
          } else {
            this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
            this.btn1.name = 'Back'
            this.btn1.link = '/projects'
          }

          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Team'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-alpha-p-box'
          this.btn3.name = 'My Projects'
          this.btn3.link = '/myprojects'
          break
        case 'hiring':
          this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
          this.btn1.name = 'Back'
          this.btn1.link = '/home'
          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Team'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-alpha-p-box'
          this.btn3.name = 'My Projects'
          this.btn3.link = '/myprojects'
          break
        case 'myprojects':
          this.btn1.icon = 'mdi-arrow-left-bold-box-outline'
          this.btn1.name = 'Back'
          this.btn1.link = '/home'
          this.btn2.icon = 'mdi-account-group'
          this.btn2.name = 'Team'
          this.btn2.link = '/team/projects'
          this.btn3.icon = 'mdi-alpha-p-box'
          this.btn3.name = 'My Projects'
          this.btn3.link = '/myprojects'
          break
      }
    },
    create () {
      // close dialog when create pronect is open
      if (this.dialogAssist === true) {
        this.dialogAssist = false
      }
    },
    notifications () {
      if (this.notifications.length > 0) {
        this.notificationColor = 'green darken-3'
      } else {
        this.notificationColor = 'blue-grey darken-1'
      }
      this.notifMessages = this.notifications.filter(notification => notification.activity === 'Message')
      this.notifMeetings = this.notifications.filter(notification => notification.activity === 'Meeting')
      this.notifBids = this.notifications.filter(notification => notification.activity === 'Bid')
      this.notifBidRequest = this.notifications.filter(notification => notification.activity === 'bidRequest')
    },
    profile () {
      this.switchAvailable = this.profile.user_metadata.available
      if (this.profile && this.profile.app_metadata && this.profile.app_metadata.admin === true) {
        this.admin = true
      }
      if (this.profile.user_metadata && !this.profile.user_metadata.welcome) {
        this.welcomeText = process.env.welcome
        this.sheet = true
      }
    }
  },
  mounted () {
    if (this.$vuetify.breakpoint.smAndUp) {
      this.drawer = true
      this.mobile = false
      if (!this.$auth.loggedIn) {
        this.barLength = '250'
      }
    }
    this.$vuetify.theme.dark = true
    if (this.$auth.loggedIn) {
      this.barLength = ''
      // Notifications onesignal
      this.$OneSignal.push(() => {
        /* In milliseconds, time to wait before prompting user. This time is relative to right after the user presses <ENTER> on the address bar and navigates to your page */
        const notificationPromptDelay = 30000
        /* Use navigation timing to find out when the page actually loaded instead of using setTimeout() only which can be delayed by script execution */
        const navigationStart = window.performance.timing.navigationStart
        /* Get current time */
        const timeNow = Date.now()
        /* Prompt the user if enough time has elapsed */
        setTimeout(this.promptAndSubscribeUser, Math.max(notificationPromptDelay - (timeNow - navigationStart), 0))
      })

      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault()
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e
        // Update UI to notify the user they can add to home screen
        this.addBtnShow = 'block'
      })
      this.picture = this.$auth.user.picture
    }
  },
  methods: {
    assistant (status) {
      switch (status) {
        // step 1 ( main )
        case 'home': {
          this.assistantTitle = 'I want to ..'
          this.step1 = true
          this.step2 = false
          this.contractor = false
          this.hireTradesman = false
          this.team = false
          this.job = false
          this.dialogAssist = false
          break
        }
        case 'back': {
          this.assistantTitle = 'I want to ..'
          this.step1 = true
          this.step2 = false
          this.contractor = false
          this.hireTradesman = false
          this.job = false
          this.team = false
          break
        }
        case 'find': {
          this.step1 = false
          this.step2 = true
          this.contractor = true
          break
        }
        case 'hire': {
          this.step1 = false
          this.step2 = true
          this.hireTradesman = true
          break
        }
        case 'post': {
          this.$router.push('../hiring')
          this.step1 = true
          this.step2 = false
          this.contractor = false
          this.hireTradesman = false
          this.team = false
          this.job = false
          this.dialogAssist = false
          break
        }
        case 'team': {
          this.step1 = false
          this.step2 = true
          this.team = true
          break
        }
        case 'members': {
          this.$router.push('../team/manage')
          this.step1 = true
          this.step2 = false
          this.contractor = false
          this.hireTradesman = false
          this.team = false
          this.job = false
          this.dialogAssist = false
          break
        }
        case 'projects': {
          this.$router.push('../team/projects')
          this.step1 = true
          this.step2 = false
          this.contractor = false
          this.hireTradesman = false
          this.team = false
          this.job = false
          this.dialogAssist = false
          break
        }
        case 'job': {
          this.step1 = false
          this.step2 = true
          this.job = true
          break
        }
        case 'bid': {
          this.$router.push('../projects')
          this.step1 = true
          this.step2 = false
          this.contractor = false
          this.hireTradesman = false
          this.team = false
          this.job = false
          this.dialogAssist = false
          break
        }
        case 'listings': {
          this.$router.push('../hiring')
          this.step1 = true
          this.step2 = false
          this.contractor = false
          this.hireTradesman = false
          this.team = false
          this.job = false
          this.dialogAssist = false
          break
        }
        case 'profile': {
          this.$router.push('../profile')
          this.step1 = true
          this.step2 = false
          this.contractor = false
          this.hireTradesman = false
          this.team = false
          this.job = false
          this.dialogAssist = false
          this.sheetTitle = 'Get working today !'
          this.welcomeText = 'Complete your profile and click on the tab labeled "Employment" at the top to make yourself available to companies for 48 hours.'
          this.sheet = true
          break
        }
      }
    },
    clicker () {
      this.create = true
    },
    promptAndSubscribeUser () {
      this.$OneSignal.isPushNotificationsEnabled(function (isEnabled) {
        if (!isEnabled) {
          // show prompt
          this.$OneSignal.showSlidedownPrompt()
          // set userId
          this.$OneSignal.setExternalUserId(this.$auth.user.sub)
        }
      })
    },
    addToPage () {
      // hide our user interface that shows our A2HS button
      this.addBtnShow = 'none'
      // Show the prompt
      this.deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        this.deferredPrompt = null
      })
    },
    letsGo () {
      this.sheet = false
      this.$axios.$post('account/edit', { user_metadata: { welcome: true } }).then(() => {
        this.$router.push('profile')
      })
    },
    login () {
      this.$auth.loginWith('auth0')
    },
    logout () {
      this.$auth.logout()
      window.location.replace(
        'https://dev-2upadx1s.auth0.com/v2/logout?returnTo=https%3A%2F%2Fwww.sub-hub.ca/'
      )
    },
    clearNotifications () {
      this.$store.dispatch('notifications/clearNotifications')
    },
    async redirect (bid) {
      await this.$store.dispatch('notifications/deleteBulkNotification', [bid])
      await this.$router.push(`/job/${bid}`)
    }
  }
}
</script>
