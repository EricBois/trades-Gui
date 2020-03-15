<template>
  <v-container>
    <v-dialog v-model="dialogAssist" persistent max-width="350">
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Your Assistant
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
            <v-btn @click="assistant('find')" class="ma-2 ml-12" color="light-blue darken-3" small>
              Find contractors for my project
            </v-btn>
            <br>
            <v-btn @click="assistant('hire')" class="ma-2 ml-12" color="cyan darken-3" small>
              Hire tradesman
            </v-btn>
            <br>
            <v-btn @click="assistant('team')" class="ma-2 ml-12" color="teal darken-3" small>
              Manage my team
            </v-btn>
            <br>
            <v-btn @click="assistant('job')" class="ma-2 ml-12" color="light-blue darken-3" small>
              Find a job
            </v-btn>
          </div>
          <div v-if="step2 && contractor">
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
          </div>
          <div v-if="step2 && hireTradesman">
            <v-btn @click="assistant('post')" class="ma-2 ml-12" color="light-blue darken-3" small>
              post an ads
            </v-btn>
            <br>
            <v-btn @click="dialogLfw = !dialogLfw" class="ma-2 ml-12" color="cyan darken-3" small>
              see who's available today
            </v-btn>
            <br>
            <v-btn @click="assistant('back')" class="ma-2 ml-12" small>
              go back
            </v-btn>
          </div>
          <div v-if="step2 && team">
            <v-btn @click="assistant('members')" class="ma-2 ml-12" color="light-blue darken-3" small>
              Add or edit members
            </v-btn>
            <br>
            <v-btn @click="assistant('projects')" class="ma-2 ml-12" color="cyan darken-3" small>
              manage my team projects
            </v-btn>
            <br>
            <v-btn @click="assistant('back')" class="ma-2 ml-12" small>
              go back
            </v-btn>
          </div>
          <div v-if="step2 && job">
            <v-btn @click="assistant('bid')" class="ma-2 ml-12" color="cyan darken-3" small>
              place some bids
            </v-btn>
            <v-btn @click="assistant('profile')" class="ma-2 ml-12" color="light-blue darken-3" small>
              Make myself available to work
            </v-btn>
            <br>
            <v-btn @click="assistant('listings')" class="ma-2 ml-12" color="teal darken-3" small>
              look at the job listing
            </v-btn>
            <br>
            <v-btn @click="assistant('back')" class="ma-2 ml-12" small>
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
