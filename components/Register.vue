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
            <v-flex xs12>
              <span class="caption"><span class="blue--text mr-1 underline">Got an invite code ?</span> Enter it for instant approval!</span>
              <v-text-field v-model="code" class="purple-input" label="Your invite Code" />
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="info.name" :rules="nameRule" class="purple-input" label="Your Name*" />
            </v-flex>
            <v-flex xs12 text-center>
              <v-text-field v-model="info.email" :rules="emailRules" class="purple-input" label="Your Email*" />
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="info.user_metadata.phone" class="purple-input" label="Your phone number" />
            </v-flex>
            <v-flex v-if="passwd" xs12>
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
            <v-flex v-if="passwd" xs12>
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
            <v-flex xs12 text-center>
              <v-btn color="green darken-3" @click="register()">
                Register!
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
    }
  },
  data () {
    return {
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
      passwd: false,
      code: '',
      repeatPassword: '',
      info: {
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
  watch: {
    code () {
      this.passwd = false
      // implement verify code from db
      if (this.code === '1234') {
        this.passwd = true
      }
    }
  },
  methods: {
    register () {
      // TODO
      // if code is good and form validate, send to api for instant registration
      if (this.code === '1234' && this.$refs.form.validate()) {
        this.$axios.$post('account/create', this.info).then((res) => {
          // TODO snackbar to wait for email confirmation
          this.$emit('update:snackbar', true)
          this.$emit('update:snackbarColor', 'green darken-3')
          this.$emit('update:snackbarText', 'Please verify your email to confirm your account before login.')
          this.$emit('update:registerDialog', false)
        })
      }
      // else if code is not good, send application in db for further processing
    }
  }
}
</script>
