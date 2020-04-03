<template>
  <v-container>
    <v-dialog v-model="dialogAssist" class="pa-4" persistent max-width="350">
      <v-card shaped class="pb-4">
        <v-toolbar height="30" dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Help Assistant
          </v-toolbar-title>
          <v-spacer />
          <v-btn @click="assistant('home')" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-flex class="pa-4" xs12>
          <h3>{{ assistantTitle }}</h3>
        </v-flex>
        <v-flex xs12>
          <div v-if="step1">
            <v-btn @click="$emit('update:create', true) && assistant('home')" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-post
              </v-icon>
              Post a project
            </v-btn>
            <br>
            <v-btn @click="assistant('hire')" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-account-hard-hat
              </v-icon>
              Hire tradesman
            </v-btn>
            <br>
            <v-btn @click="assistant('team')" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-account-group
              </v-icon>
              Manage my team
            </v-btn>
            <br>
            <v-btn @click="assistant('job')" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-file-find
              </v-icon>
              Find a job
            </v-btn>
          </div>
          <!-- <div v-if="step2 && contractor">
            <v-btn @click="$emit('update:create', true) && assistant('home')" class="ma-2 ml-12" color="light-blue darken-3" small>
              Get bids on my project
            </v-btn>
            <br>
            <v-btn @click="dialogLfw = !dialogLfw" class="ma-2 ml-12" color="cyan darken-3" small>
              I'm out of time i need someone TODAY
            </v-btn>
            <br>
            <v-btn @click="assistant('back')" class="ma-2 ml-12" small>
              go back
            </v-btn>
          </div> -->
          <div v-if="step2 && hireTradesman">
            <v-btn @click="dialogLfw = !dialogLfw" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-radar
              </v-icon>
              Request Someone today
            </v-btn>
            <br>
            <v-btn @click="assistant('post')" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-text-box-plus
              </v-icon>
              post a job offer
            </v-btn>
          </div>
          <div v-if="step2 && team">
            <v-btn @click="assistant('members')" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-account-multiple-plus
              </v-icon>
              Add or edit members
            </v-btn>
            <br>
            <v-btn @click="assistant('projects')" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-account-group
              </v-icon>
              manage my team projects
            </v-btn>
          </div>
          <div v-if="step2 && job">
            <v-btn @click="assistant('bid')" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-text-box-plus
              </v-icon>
              place some bids
            </v-btn>
            <v-btn @click="assistant('profile')" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-account-cog
              </v-icon>
              Make myself available to work
            </v-btn>
            <br>
            <v-btn @click="assistant('listings')" class="ma-2 ml-12" color="blue-grey darken-1" small>
              <v-icon class="mr-2">
                mdi-file-eye
              </v-icon>
              look at the job listings
            </v-btn>
          </div>
        </v-flex>
        <v-divider class="my-2" />
        <v-flex v-if="!step1" text-center>
          <v-btn @click="assistant('back')" color="teal" small>
            go back
          </v-btn>
        </v-flex>
        <v-flex class="mt-n2 mb-n8">
          <v-checkbox v-model="startup" class="pl-1" color="green" label="Show on startup" />
        </v-flex>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogLfw" max-width="600">
      <v-card>
        <v-toolbar height="30" dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Tradesman available today
          </v-toolbar-title>
          <v-spacer />
          <v-btn @click="dialogLfw = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <contractors-today />
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-model="sheet" persistent>
      <v-sheet class="text-center" height="200px">
        <h2>{{ sheetTitle }}</h2>
        <div class="ma-2">
          {{ welcomeText }}
        </div>
        <v-btn
          @click="sheet = false"
          class="mt-6"
          color="blue lighten-3"
          large
          outlined
        >
          Ok !
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    ContractorsToday: () => import('../components/ContractorsToday.vue')
  },
  props: {
    dialogAssist: {
      type: Boolean,
      default: false
    },
    create: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      startup: true,
      dialogLfw: false,
      assistantTitle: 'I want to ..',
      job: false,
      team: false,
      hireTradesman: false,
      contractor: false,
      step1: true,
      step2: false,
      step3: false,
      sheet: false,
      sheetTitle: 'Welcome to Sub-Hub !',
      welcomeText: ''
    }
  },
  computed: {
    ...mapGetters({
      profile: 'profile/getProfile'
    })
  },
  watch: {
    profile () {
      if (this.profile.user_metadata && this.profile.user_metadata.startup) {
        this.startup = true
      } else {
        this.startup = false
      }
    },
    startup () {
      // if startup
      if (!this.startup && this.profile.user_metadata && this.profile.user_metadata.startup) {
        this.$axios.$post('account/edit', { user_metadata: { startup: false } }).then((res) => {
          this.$store.commit('profile/updateProfile', res) // for the profile store
          this.$auth.fetchUser()
          this.startup = false
        })
        // if starup is true
      } else if (this.startup && this.profile.user_metadata && !this.profile.user_metadata.startup) {
        this.$axios.$post('account/edit', { user_metadata: { startup: true } }).then((res) => {
          this.$store.commit('profile/updateProfile', res) // for the profile store
          this.$auth.fetchUser()
          this.startup = true
        })
      }
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
          this.$emit('update:dialogAssist', false)
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
          this.$emit('update:dialogAssist', false)
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
          this.$emit('update:dialogAssist', false)
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
          this.$emit('update:dialogAssist', false)
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
          this.$emit('update:dialogAssist', false)
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
          this.$emit('update:dialogAssist', false)
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
          this.$emit('update:dialogAssist', false)
          this.sheetTitle = 'Get working today !'
          this.welcomeText = 'Complete your profile and click on the tab labeled "Employment" at the top to make yourself available to companies for 48 hours.'
          this.sheet = true
          break
        }
      }
    }
  }
}
</script>
