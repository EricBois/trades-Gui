<template>
  <v-container>
    <v-card class="mx-auto my-1" max-width="550" elevation="22">
      <v-flex class="py-2" xs12 text-center>
        <h2>Register an account</h2>
        <span class="caption">*Registration is by invite only at the moment.*</span>
      </v-flex>
      <v-card class="mx-auto pa-5" max-width="400" tile>
        <v-form
          ref="form"
          laz
        >
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-model="info.code" :rules="nameRule" class="purple-input" label="Your invite Code*" />
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="info.companyName" :rules="companyNameRule" class="purple-input" label="Company Name" />
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="info.name" :rules="nameRule" class="purple-input" label="Your Name*" />
            </v-flex>
            <v-flex xs12 text-center>
              <span class="caption">Email will be verified *</span>
              <v-text-field v-model="info.email" class="purple-input mt-n5" label="Your Email*" />
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="info.phone" :rules="nameRule" class="purple-input" label="Your phone number" />
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="info.password" :rules="password" class="purple-input" label="Password*" />
            </v-flex>
            <v-flex xs12>
              <v-text-field v-model="info.repeatPassword" class="purple-input" label="Repeat Password*" />
            </v-flex>
            <v-flex xs12 text-center>
              <v-btn color="green darken-3">
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
  data () {
    return {
      nameRule: [
        v => !!v || 'The name is required',
        v => (v || '').length <= 40 || 'Name should be 40 characters or less '
      ],
      companyNameRule: [v => (v || '').length <= 40 || 'Name should be 40 characters or less '],
      info: {
        code: '',
        companyName: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        repeatPassword: ''
      }
    }
  }
}
</script>
