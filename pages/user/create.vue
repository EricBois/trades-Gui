<template>
  <v-container fluid>
    <v-layout column>
      <v-card
        elevation="22"
        max-width="850"
        class="mx-auto"
      >
        <v-card raised>
          <v-row
            class="mx-5"
          >
            <v-form
              ref="form"
              lazy-validation
            >
              <v-row
                class="py-4 pl-4"
              >
                <v-layout wrap>
                  <v-flex xs10>
                    <v-text-field v-model="info.name" :rules="nameRule" class="purple-input" label="Project Title" counter="40" />
                  </v-flex>
                  <v-flex xs10 sm5 pb-5>
                    <v-select
                      v-model="info.jobType"
                      :rules="projectRule"
                      :items="job_type"
                      :menu-props="{ top: true, offsetY: true }"
                      label="Project Type"
                    />
                  </v-flex>
                  <v-flex xs10 sm5 pb-5 pl-sm-5>
                    <!-- <v-select
                      v-model="info.location"
                      :rules="locationRule"
                      :items="locations"
                      :menu-props="{ top: true, offsetY: true }"
                      label="Location"
                    /> -->
                    <gmap-autocomplete
                      class="gmap v-input__slot v-text-field"
                      :value="info.location.address"
                      :select-first-on-enter="true"
                      placeholder="Project Location"
                      @place_changed="setPlace"
                    />
                  </v-flex>
                  <v-flex xs10>
                    <v-textarea
                      v-model="info.description"
                      :rules="descRule"
                      label="Project Description"
                      solo
                      outlined
                      class="purple-input"
                      counter="400"
                    />
                  </v-flex>
                  <v-flex xs10 md5 mr-12>
                    <v-checkbox
                      v-model="checkWcb"
                      label="Wcb Required"
                      color="orange darken-3"
                    />
                  </v-flex>
                  <v-flex xs10 md5 mr-12>
                    <v-checkbox
                      v-model="checkLiability"
                      color="orange darken-3"
                      label="Liability Insurance Required"
                    />
                  </v-flex>
                  <v-flex xs10 md5 pt-5>
                    <v-select
                      v-model="info.skills"
                      :items="itemSkills"
                      chips
                      label="Skills"
                      multiple
                    />
                  </v-flex>
                  <v-flex xs10 md5 pl-md-5 pt-5>
                    <v-select
                      v-model="info.tickets"
                      :items="itemTickets"
                      chips
                      label="Tickets"
                      multiple
                    />
                  </v-flex>
                  <v-flex xs10 md2 mr-12 pt-4>
                    <v-text-field
                      v-model="info.budget"
                      label="Budget"
                      class="purple-input"
                      prefix="$"
                      :rules="budgetRule"
                      type="text"
                    />
                  </v-flex>
                  <v-flex xs6 md3 pt-4>
                    <v-switch v-model="switch1" label="Assign To Team" color="white" inset />
                  </v-flex>
                  <v-flex xs6 md2 pt-4>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-switch v-model="switch2" label="Single Bid" color="white" inset v-on="on" />
                      </template>
                      <span>Only 1 bid per user will be allowed on whole project.</span>
                    </v-tooltip>
                  </v-flex>
                  <v-flex xs10 md5 pt-4 pr-5>
                    <v-text-field v-model="info.phone" class="purple-input" label="Contact Phone Number" />
                  </v-flex>
                  <v-flex xs10 md5 pt-4>
                    <v-text-field v-model="info.email" class="purple-input" label="Contact Email" />
                  </v-flex>
                  <v-card-actions>
                    <v-btn class="mx-0 font-weight-light" color="primary" @click="create">
                      Create Project
                    </v-btn>
                  </v-card-actions>
                </v-layout>
              </v-row>
            </v-form>
          </v-row>
        </v-card>
      </v-card>
    </v-layout>
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
  data () {
    return {
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
        oneBid: false,
        createdBy: ''
      },
      switch1: false,
      switch2: false,
      checkWcb: false,
      checkLiability: false
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  watch: {
    switch1 () {
      if (this.switch1) {
        this.$swal
          .fire({
            title: 'Assign project to team',
            text: 'This project wont be publicly available, you can manage it in your team section.',
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'I Understand'
          })
          .then((result) => {
            if (result.value) {
              this.info.private = true
            } else {
              this.switch1 = false
            }
          })
      } else {
        this.info.private = false
      }
    },
    switch2 () {
      if (this.switch2) {
        this.$swal
          .fire({
            title: 'Activate 1 bid',
            text: 'Only 1 bid per user will be allowed.',
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'I Understand'
          })
          .then((result) => {
            if (result.value) {
              this.info.oneBid = true
            } else {
              this.switch2 = false
            }
          })
      } else {
        this.info.oneBid = false
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
        this.info.createdBy = this.$auth.user.name
        this.$axios.$post('job/create', this.info).then((res) => {
          //  direct to jobs page
          if (res.private) {
            this.$router.push(`../../team`)
          } else {
            this.$router.push(`../../job/${res._id}`)
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
    }
  }
}
</script>
