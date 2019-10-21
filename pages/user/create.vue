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
                    <v-text-field v-model="info.name" :rules="nameRule" class="purple-input" label="Project Title" />
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
                    <v-select
                      v-model="info.location"
                      :rules="locationRule"
                      :items="locations"
                      :menu-props="{ top: true, offsetY: true }"
                      label="Location"
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
                  <v-flex xs10 md3 pt-4 pr-5>
                    <v-text-field v-model="info.phone" class="purple-input" label="Contact Phone Number" />
                  </v-flex>
                  <v-flex xs10 md2 mr-12 pt-4>
                    <v-text-field
                      v-model="info.budget"
                      label="Budget"
                      class="purple-input"
                      prefix="$"
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs6 md2 pt-4>
                    <v-switch v-model="switch1" label="Private" />
                  </v-flex>
                  <v-flex xs6 md2 pt-4>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-switch v-model="switch2" label="Single Bid" v-on="on" />
                      </template>
                      <span>Only 1 bid per user will be allowed on whole project.</span>
                    </v-tooltip>
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
<script>
export default {
  data () {
    return {
      itemSkills: ['Drywall', 'Taping', 'Framing', 'Labour', 'Texturing', 'Insulation'],
      itemTickets: ['WHIMIS', 'First Aid', 'Scissor Lift', 'Fall Arrest'],
      nameRule: [v => !!v || 'The name is required'],
      projectRule: [v => !!v || 'The project type is required'],
      locationRule: [v => !!v || 'The location is required'],
      descRule: [v => !!v || 'The description is required'],
      select: { city: 'Calgary', prov: 'AB' },
      locations: ['Calgary', 'Edmonton'],
      job_type: ['Contract', 'Hourly'],
      info: {
        name: '',
        phone: '',
        description: '',
        budget: '',
        private: false,
        skills: [],
        tickets: [],
        wcb: false,
        liability: false,
        location: '',
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
  watch: {
    switch1 () {
      if (this.switch1) {
        this.info.private = true
      } else {
        this.info.private = false
      }
    },
    switch2 () {
      if (this.switch2) {
        this.info.oneBid = true
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
    }
  },
  created () {
    if (this.$auth.user['https://subhub.com/user_metadata'].phone) {
      this.info.phone = this.$auth.user['https://subhub.com/user_metadata'].phone
    }
  },
  methods: {
    create () {
      if (this.$refs.form.validate()) {
        this.info.createdBy = this.$auth.user.name
        this.$axios.$post('job/create', this.info).then((res) => {
          //  direct to jobs page
          this.$router.push(`../../job/${res._id}`)
        })
      }
    }
  }
}
</script>
