<template>
  <v-container fluid>
    <v-snackbar
      v-model="snackbar"
      bottom
      :color="snackbarColor"
    >
      {{ snackbarText }}
      <v-icon>
        mdi-check-circle-outline
      </v-icon>
    </v-snackbar>
    <v-card>
      <v-card class="pa-2">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field v-model="info.name" :rules="nameRule" class="purple-input" label="Project Title" counter="40" />
            </v-flex>
            <v-flex xs12 sm5 pb-5>
              <v-select
                v-model="info.jobType"
                :rules="projectRule"
                :items="job_type"
                :menu-props="{ top: true, offsetY: true }"
                label="Project Type"
              />
            </v-flex>
            <v-flex xs12 sm5 pb-5 pl-sm-5>
              <gmap-autocomplete
                class="gmap v-input__slot v-text-field"
                :value="info.location.address"
                :select-first-on-enter="true"
                placeholder="Project Location"
                @place_changed="setPlace"
              />
            </v-flex>
            <v-flex xs12>
              <v-textarea
                v-model="info.description"
                :rules="descRule"
                label="Project Description"
                outlined
                class="purple-input"
                counter="400"
              />
            </v-flex>
            <v-flex xs12 md6 mr-12>
              <v-checkbox
                v-model="checkWcb"
                label="Wcb Required"
                color="orange darken-3"
              />
            </v-flex>
            <v-flex xs12 md6 mr-12>
              <v-checkbox
                v-model="checkLiability"
                color="orange darken-3"
                label="Liability Insurance Required"
              />
            </v-flex>
            <v-flex xs12 md6 pt-5>
              <v-combobox
                v-model="info.skills"
                :items="itemSkills"
                chips
                dense
                label="Required Skills"
                multiple
                autocomplete
              />
            </v-flex>
            <v-flex xs12 md6 pl-md-5 pt-5>
              <v-combobox
                v-model="info.tickets"
                :items="itemTickets"
                chips
                dense
                label="Required Tickets"
                multiple
                autocomplete
              />
            </v-flex>
            <v-flex xs12 md3 pr-12 pt-4>
              <v-text-field
                v-model="info.budget"
                label="Budget"
                class="purple-input"
                prefix="$"
                :rules="budgetRule"
                type="text"
              />
            </v-flex>
            <v-flex xs6 md4 pt-4>
              <v-switch v-model="switch1" label="Assign To Team" color="white" inset />
            </v-flex>
            <v-flex xs12 md6 pt-4 pr-5>
              <v-text-field v-model="info.phone" class="purple-input" label="Contact Phone Number" />
            </v-flex>
            <v-flex xs12 md6 pt-4>
              <v-text-field v-model="info.email" class="purple-input" label="Contact Email" />
            </v-flex>
            <v-flex class="mt-6 mb-3" xs6 text-center>
              <v-btn class="mx-0 font-weight-light" outlined @click="closeDialog()">
                Cancel
              </v-btn>
            </v-flex>
            <v-flex class="mt-6 mb-3" xs6 text-center>
              <v-btn class="mx-0 font-weight-light" color="primary" @click="create">
                Create Project
              </v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
    </v-card>
  </v-container>
</template>
<style>
.gmap {
  color: white !important;
  padding-top: 16px;
  border-bottom: 2px solid grey;
  background-color: transparent;
}

</style>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    close: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      snackbar: false,
      snackbarColor: 'blue darken-3',
      snackbarText: '',
      itemSkills: [],
      itemTickets: [],
      nameRule: [
        v => !!v || 'The name is required',
        v => (v || '').length <= 40 || 'Name should be 40 characters or less '
      ],
      budgetRule: [
        v => !!v || 'Please enter a budget',
        v => /^(\d+(?:[.,]\d{2,3})?)$/.test(v) || 'Only numbers & commas allowed. ( 1000 , 1,000 , 10,34 ..)'
      ],
      projectRule: [v => !!v || 'The project type is required'],
      descRule: [
        v => !!v || 'The description is required',
        v => (v || '').length <= 400 || 'Description should be 400 characters or less '
      ],
      job_type: ['Contract', 'Hourly'],
      info: {
        name: '',
        phone: '',
        email: '',
        description: '',
        budget: '',
        private: false,
        skills: [],
        tickets: [],
        wcb: false,
        liability: false,
        location: {
          lat: '',
          lng: '',
          address: '',
          country: '',
          city: '',
          province: '',
          url: ''
        },
        jobType: '',
        createdBy: ''
      },
      switch1: false,
      checkWcb: false,
      checkLiability: false
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  watch: {
    switch1 () {
      if (this.switch1 && !this.info.private) {
        this.snackbarText = 'The project is now private and you can manage it in your team section.'
        this.snackbar = true
        this.info.private = true
      } else if (this.switch1) {
        this.info.private = true
      } else {
        this.info.private = false
        this.snackbarText = 'The project is now public.'
        this.snackbar = true
      }
    },
    checkWcb () {
      if (this.checkWcb) {
        this.info.wcb = true
      } else {
        this.info.wcb = false
      }
    },
    checkLiability () {
      if (this.checkLiability) {
        this.info.liability = true
      } else {
        this.info.liability = false
      }
    },
    profile () {
      if (this.profile.user_metadata && this.profile.user_metadata.phone) {
        this.info.phone = this.profile.user_metadata.phone
      }
      this.info.email = this.$auth.user.email
    }
  },
  created () {
    this.itemSkills = process.env.trades.split(',')
    this.itemTickets = process.env.tickets.split(',')
    if (this.profile.user_metadata && this.profile.user_metadata.phone) {
      this.info.phone = this.profile.user_metadata.phone
    }
    this.info.email = this.$auth.user.email
  },
  methods: {
    create () {
      if (this.$refs.form.validate()) {
        if (this.info.skills.length >= 1) {
          this.info.skills.forEach(function (part, index) {
            this[index] = this[index].trim().charAt(0).toUpperCase() + this[index].slice(1)
          }, this.info.skills)
        }
        if (this.info.tickets.length >= 1) {
          this.info.tickets.forEach(function (part, index) {
            this[index] = this[index].trim().charAt(0).toUpperCase() + this[index].slice(1)
          }, this.info.tickets)
        }
        this.info.createdBy = this.$auth.user.name
        this.$axios.$post('job/create', this.info).then((res) => {
          //  direct to jobs page
          if (res.private) {
            this.$router.push(`../../team`)
            this.$emit('update:close', false)
          } else {
            this.$router.push(`../../job/${res._id}`)
            this.$emit('update:close', false)
          }
        })
      }
    },
    setPlace (place) {
      this.info.location.address = place.formatted_address
      this.info.location.lat = place.geometry.location.lat()
      this.info.location.lng = place.geometry.location.lng()
      this.info.location.url = place.url
      const address = place.address_components.map(address => ({ type: address.types, name: address.long_name }))
      for (const key in address) {
        const info = address[key]
        if (info.type.includes('administrative_area_level_1')) {
          this.info.location.province = info.name
        }
        if (info.type.includes('locality')) {
          this.info.location.city = info.name
        }
        if (info.type.includes('country')) {
          this.info.location.country = info.name
        }
      }
    },
    closeDialog () {
      this.$emit('update:close', false)
    }
  }
}
</script>
