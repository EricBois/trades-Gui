<template>
  <v-container fluid>
    <v-layout column>
      <v-card
        elevation="22"
        max-width="850"
        class="mx-auto"
      >
        <v-card
          raised
        >
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
                  <v-flex xs10 pb-5>
                    <v-select
                      v-model="info.jobType"
                      :rules="projectRule"
                      :items="job_type"
                      :menu-props="{ top: true, offsetY: true }"
                      label="Project Type"
                    />
                  </v-flex>
                  <v-flex xs10 pb-5>
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
                  </v-flex><v-flex xs10 md5 mr-12>
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
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 md2 pt-4>
                    <v-switch v-model="switch1" label="Private" />
                  </v-flex>
                  <v-card-actions>
                    <v-btn class="ma-1" color="black" :to="job+this.$route.params.id">
                      Back
                    </v-btn>
                    <v-btn class="ma-1 font-weight-light" color="primary" @click="edit">
                      Edit Project
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
      job: '../../job/',
      nameRule: [v => !!v || 'The name is required'],
      projectRule: [v => !!v || 'The project type is required'],
      locationRule: [v => !!v || 'The location is required'],
      descRule: [v => !!v || 'The description is required'],
      tag: '',
      tags: [],
      ticket: '',
      tickets: [],
      autocompleteItems: [{
        text: 'Drywall'
      }, {
        text: 'Taping'
      }, {
        text: 'Framing'
      }, {
        text: 'Labour'
      }, {
        text: 'Texturing'
      }, {
        text: 'Insulation'
      }],
      autocompleteTickets: [{
        text: 'WHIMIS'
      }, {
        text: 'First Aid'
      }, {
        text: 'Scissor Lift'
      }, {
        text: 'Fall Arrest'
      }],
      select: { city: 'Calgary', prov: 'AB' },
      locations: ['Calgary', 'Edmonton'],
      job_type: ['Contract', 'Hourly'],
      info: {
        name: '',
        description: '',
        budget: '',
        private: false,
        skills: [],
        wcb: false,
        liability: false,
        location: '',
        jobType: ''
      },
      switch1: false,
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
    // get the job with the id
    this.$axios.$get(`job/view/${this.$route.params.id}`).then((res) => {
      this.info = res
      this.tags = this.info.skills
      this.tickets = this.info.tickets
    })
  },
  methods: {
    edit () {
      if (this.$refs.form.validate()) {
        this.$axios.$post(`job/edit/${this.$route.params.id}`, this.info).then((res) => {
          //  direct to jobs page
          this.$router.push(`../../../job/${this.$route.params.id}`)
        })
      }
    }

  }
}
</script>
