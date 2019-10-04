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
                    <vue-tags-input
                      v-model="tag"
                      :tags="tags"
                      :autocomplete-items="filteredItems"
                      placeholder="Skills Required"
                      :add-only-from-autocomplete="true"
                      @tags-changed="newTags => tags = newTags"
                    />
                  </v-flex>
                  <v-flex xs10 md5 pl-md-5 pt-5>
                    <vue-tags-input
                      v-model="ticket"
                      :tags="tickets"
                      :autocomplete-items="filteredTickets"
                      placeholder="Tickets Required"
                      :add-only-from-autocomplete="true"
                      @tags-changed="newTags => tickets = newTags"
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
                  <v-flex xs12 md4 pt-4>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-switch v-on="on" v-model="switch2" label="1 bid per user" />
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
<style scoped>
  .gmap {
    color:black;
    background-color: rgb(206, 227, 245)

  }
  /* style the background and the text color of the input ... */
  .vue-tags-input {
    background: #324652;
  }

  .vue-tags-input .ti-new-tag-input {
    background: transparent;
    color: #b7c4c9;
  }

  .vue-tags-input .ti-input {
    padding: 4px 10px;
    transition: border-bottom 200ms ease;
  }

  /* we cange the border color if the user focuses the input */
  .vue-tags-input.ti-focus .ti-input {
    border: 1px solid #ebde6e;
  }

  /* some stylings for the autocomplete layer */
  .vue-tags-input .ti-autocomplete {
    background: #283944;
    border: 1px solid #8b9396;
    border-top: none;
  }

  /* the selected item in the autocomplete layer, should be highlighted */
  .vue-tags-input .ti-item.ti-selected-item {
    background: #ebde6e;
    color: #283944;
  }

  /* style the placeholders color across all browser */
  .vue-tags-input ::-webkit-input-placeholder {
    color: #a4b1b6;
  }

  .vue-tags-input ::-moz-placeholder {
    color: #a4b1b6;
  }

  .vue-tags-input :-ms-input-placeholder {
    color: #a4b1b6;
  }

  .vue-tags-input :-moz-placeholder {
    color: #a4b1b6;
  }

  /* default styles for all the tags */
  .vue-tags-input .ti-tag {
    position: relative;
    background: #ebde6e;
    color: #283944;
  }

  /* we defined a custom css class in the data model, now we are using it to style the tag */
  .vue-tags-input .ti-tag.custom-class {
    background: transparent;
    border: 1px solid #ebde6e;
    color: #ebde6e;
    margin-right: 4px;
    border-radius: 0px;
    font-size: 13px;
  }

  /* the styles if a tag is invalid */
  .vue-tags-input .ti-tag.ti-invalid {
    background-color: #e88a74;
  }

  /* if the user input is invalid, the input color should be red */
  .vue-tags-input .ti-new-tag-input.ti-invalid {
    color: #e88a74;
  }

  /* if a tag or the user input is a duplicate, it should be crossed out */
  .vue-tags-input .ti-duplicate span,
  .vue-tags-input .ti-new-tag-input.ti-duplicate {
    text-decoration: line-through;
  }

  /* if the user presses backspace, the complete tag should be crossed out, to mark it for deletion */
  .vue-tags-input .ti-tag:after {
    transition: transform .2s;
    position: absolute;
    content: '';
    height: 2px;
    width: 108%;
    left: -4%;
    top: calc(50% - 1px);
    background-color: #000;
    transform: scaleX(0);
  }

  .vue-tags-input .ti-deletion-mark:after {
    transform: scaleX(1);
  }
</style>
<script>
export default {
  data () {
    return {
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
      switch2: false,
      checkWcb: false,
      checkLiability: false
    }
  },
  computed: {
    filteredItems () {
      return this.autocompleteItems.filter((i) => {
        return i.text.toLowerCase().includes(this.tag.toLowerCase())
      })
    },
    filteredTickets () {
      return this.autocompleteTickets.filter((i) => {
        return i.text.toLowerCase().includes(this.ticket.toLowerCase())
      })
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
  methods: {
    create () {
      this.info.skills = this.tags
      this.info.tickets = this.tickets
      if (this.$refs.form.validate()) {
        this.$axios.$post('job/create', this.info).then((res) => {
          //  direct to jobs page
          this.$router.push('/jobs')
        })
      }
    }

  }
}
</script>
