<template>
  <v-container fluid>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
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
                :value="info.location.address"
                :select-first-on-enter="true"
                @place_changed="setPlace"
                class="gmap v-input__slot v-text-field"
                placeholder="Project Location"
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
                label="Workers Compensation Required"
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
                :rules="budgetRule"
                label="Budget"
                class="purple-input"
                prefix="$"
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
            <v-flex xs6 text-center>
              <v-btn :to="job+this.$route.params.id" class="ma-1" outlined>
                Back
              </v-btn>
            </v-flex>
            <v-flex xs6 text-center>
              <v-btn @click="edit" class="ma-1 font-weight-light" color="green darken-3">
                Save Changes
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
export default {
  data () {
    return {
      snackbar: false,
      snackbarColor: 'blue darken-3',
      snackbarText: '',
      job: '../../job/',
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
      select: { city: 'Calgary', prov: 'AB' },
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
    }
  },
  mounted () {
    this.itemSkills = process.env.trades.split(',')
    this.itemTickets = process.env.tickets.split(',')
    // get the job with the id
    this.$axios.$get(`job/view/${this.$route.params.id}`).then((res) => {
      this.info = res
      if (res.liability) {
        this.checkLiability = true
      }
      if (res.wcb) {
        this.checkWcb = true
      }
      if (res.private) {
        this.switch1 = true
      }
    })
  },
  methods: {
    edit () {
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
        this.$axios.$post(`job/edit/${this.$route.params.id}`, this.info).then((res) => {
          //  direct to jobs page
          this.$router.push(`../../../job/${this.$route.params.id}`)
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
    }
  }
}
</script>
