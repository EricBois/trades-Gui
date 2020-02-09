<template>
  <v-container>
    <v-card class="mx-auto my-1" max-width="550" elevation="22">
      <v-flex class="py-2" xs12 text-center>
        <h2>Application form</h2>
        <v-card class="mx-auto pa-5" max-width="450">
          <span class="caption">
            Sub-Hub only accept the best tradesmans who have years of experience and quality work. You will gain access
            to a network of top employers and featured projects for bidding.
          </span>
        </v-card>
      </v-flex>
      <v-card class="mx-auto pa-5" max-width="400" tile>
        <v-form
          ref="form"
          laz
        >
          <v-layout wrap>
            <v-flex v-if="alert" xs12>
              <v-alert
                v-model="alert"
                icon="mdi-information-outline"
                prominent
                dense
                dismissible
                transition="scale-transition"
                text
                type="error"
              >
                {{ errorMsg }}
              </v-alert>
            </v-flex>
            <v-flex xs12 text-center>
              <span class="caption"><span class="blue--text mr-1 underline">Got an invite code ?</span> Enter it for instant approval!</span>
              <v-text-field v-model="info.code" class="purple-input" label="Your invite Code" @change="verify()">
                <template v-slot:append>
                  <v-btn
                    v-if="validated"
                    large
                    icon
                    color="green darken-3"
                    class="ma-0"
                  >
                    <v-icon>mdi-check-circle</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="info.name" :rules="nameRule" class="purple-input" placeholder="Business or personal name" label="Your Name*" />
            </v-flex>
            <v-flex xs12 text-center>
              <v-text-field v-model="info.email" :rules="emailRules" class="purple-input" label="Your Email*" />
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="info.user_metadata.phone" class="purple-input" label="Your phone number" />
            </v-flex>
            <v-flex v-if="!validated" xs12>
              <v-select
                :items="employment"
                filled
                label="You are"
                dense
              />
            </v-flex>
            <v-flex v-if="!validated" xs12>
              <v-textarea
                v-model="experience"
                name="input-7-1"
                filled
                label="Tell us about your experience"
                auto-grow
              />
            </v-flex>
            <v-flex v-if="!validated" xs12>
              <v-textarea
                v-model="skills"
                name="input-7-1"
                filled
                label="What is your skills set?"
                auto-grow
              />
            </v-flex><v-flex v-if="!validated" xs12>
              <v-textarea
                v-model="references"
                name="input-7-1"
                filled
                label="Any references ?"
                auto-grow
              />
            </v-flex>
            <v-flex v-if="validated" xs12>
              <v-text-field
                v-model="info.password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRule"
                :type="show ? 'text' : 'password'"
                name="input-10-1"
                label="Password"
                hint="At least 8 characters"
                counter
                @click:append="show = !show"
              />
            </v-flex>
            <v-flex v-if="validated" xs12>
              <v-text-field
                v-model="repeatPassword"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                name="input-10-1"
                :rules="verifyPasswd"
                label="Repeat password"
                hint="Enter password again"
                counter
                @click:append="show = !show"
              />
            </v-flex>
            <v-flex v-if="!validated" class="mb-4 mt-n2" xs12>
              <span class="caption">*Please fill as much information as possible, our representant will get back to you shortly.</span>
            </v-flex>
            <v-flex xs12 text-center>
              <v-btn v-if="validated" color="green darken-3" @click="register()">
                Register!
              </v-btn>
              <v-btn v-else color="blue darken-3">
                Apply
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
    </v-card>
  </v-container>
</template>
<script>
export default {
  props: {
    registerDialog: {
      type: Boolean,
      default: true
    },
    snackbar: {
      type: Boolean
    },
    snackbarText: {
      type: String,
      default: ''
    },
    snackbarColor: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      employment: ['Employed', 'Self Employed', 'Contractor', 'Company 5+ employee', 'Company 50+ employee'],
      experience: '',
      skills: '',
      references: '',
      alert: false,
      errorMsg: '',
      validated: false,
      show: false,
      nameRule: [
        v => !!v || 'The name is required',
        v => (v || '').length <= 40 || 'Name should be 40 characters or less '
      ],
      emailRules: [
        v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      passwordRule: [
        value => !!value || 'Required.',
        v => v.length >= 8 || 'Minimum 8 characters',
        v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
        v => /(?=.*\d)/.test(v) || 'Must have one number',
        v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
      ],
      verifyPasswd: [
        v => (v === this.info.password) || 'Password does not match  '
      ],
      companyNameRule: [v => (v || '').length <= 40 || 'Name should be 40 characters or less '],
      repeatPassword: '',
      info: {
        code: '',
        user_metadata: {
          phone: ''

        },
        connection: 'Username-Password-Authentication',
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    register () {
      this.alert = false
      this.errorMsg = ''
      // if code is good and form validate, send to api for instant registration
      if (this.validated && this.$refs.form.validate()) {
        this.$axios.$post('account/create', this.info).then((res) => {
          if (res.statusCode === 409) {
            this.alert = true
            this.errorMsg = res.message
          } else {
            this.$emit('update:snackbar', true)
            this.$emit('update:snackbarColor', 'green darken-3')
            this.$emit('update:snackbarText', 'Please verify your email to confirm your account before login.')
            this.$emit('update:registerDialog', false)
            this.info.code = ''
            this.info.name = ''
            this.info.email = ''
            this.info.password = ''
            this.repeatPassword = ''
          }
        })
      }
      // else if code is not good, send application to email for further processing
    },
    verify () {
      this.alert = false
      this.validated = false
      this.info.code = this.info.code.toLowerCase()
      this.$axios.$post('account/verifyCode', { code: this.info.code }).then((res) => {
        this.validated = true
      }).catch((e) => {
        if (e.response.data.code === 404) {
          this.alert = true
          this.errorMsg = 'Code is Invalid'
        }
      })
    }
  }
}
</script>
