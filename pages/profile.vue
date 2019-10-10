<template>
  <v-container fluid>
    <v-card
      elevation="22"
      max-width="844"
      class="mx-auto"
    >
      <v-card-text>
        <v-row
          class="py-4 pl-4"
        >
          <v-form>
            <v-flex class="mb-4">
              <image-input v-model="file">
                <div slot="activator">
                  <v-avatar v-if="!avatar" v-ripple size="200px" class="grey lighten-3 mb-3" elevation="8">
                    <span>Click to add avatar</span>
                  </v-avatar>
                  <v-avatar
                    v-else
                    v-ripple
                    size="200px"
                    class="mb-3"
                    elevation="18"
                  >
                    <img v-if="file.imageURL" :src="file.imageURL" alt="avatar">
                    <img v-else :src="avatar" alt="avatar">
                  </v-avatar>
                </div>
              </image-input>
              <v-slide-x-transition>
                <div v-if="file.imageURL && saved == false">
                  <v-btn class="primary" :loading="saving" @click="uploadImage">
                    Save Avatar
                  </v-btn>
                </div>
              </v-slide-x-transition>
            </v-flex>
            <v-row
              class="py-4 pl-4"
            >
              <v-layout wrap>
                <v-flex xs10 md5 mr-12>
                  <v-text-field v-model="info.name" class="purple-input" label="Name" />
                </v-flex>
                <v-flex xs10 md5>
                  <v-text-field v-model="info.phone" class="purple-input" label="Phone #" />
                </v-flex>
                <v-flex xs10 pb-5>
                  <gmap-autocomplete
                    class="v-input__slot gmap"
                    :value="info.location.address"
                    :select-first-on-enter="true"
                    placeholder="Address"
                    @place_changed="setPlace"
                  />
                </v-flex>
                <v-flex xs10>
                  <v-textarea v-model="info.description" label="Description" solo outlined class="purple-input" />
                </v-flex><v-flex xs10 md5 mr-12>
                  <v-text-field v-model="info.wcb" class="purple-input" label="Wcb #" />
                </v-flex>
                <v-flex xs10 md5 mr-12>
                  <v-text-field v-model="info.liability" class="purple-input" label="Liability Insurance" />
                </v-flex>
                <v-flex xs10 md5 pt-5>
                  <vue-tags-input
                    v-model="tag"
                    :tags="tags"
                    :autocomplete-items="filteredItems"
                    placeholder="Add Skill"
                    :add-only-from-autocomplete="true"
                    @tags-changed="newTags => tags = newTags"
                  />
                </v-flex>
                <v-flex xs10 md5 pl-md-5 pt-5>
                  <vue-tags-input
                    v-model="ticket"
                    :tags="tickets"
                    :autocomplete-items="filteredTickets"
                    placeholder="Add Ticket"
                    :add-only-from-autocomplete="true"
                    @tags-changed="newTags => tickets = newTags"
                  />
                </v-flex>
                <v-flex xs10 md2 mr-12 pt-4>
                  <v-text-field
                    v-model="info.hourly"
                    label="Hourly"
                    class="purple-input"
                    prefix="$"
                    type="number"
                  />
                </v-flex>
                <v-flex xs12 md2 pt-4>
                  <v-switch v-model="switch1" label="Available" />
                </v-flex>
                <v-card-actions>
                  <v-btn class="mx-0 font-weight-light" color="primary" @click="edit">
                    Update Profile
                  </v-btn>
                </v-card-actions>
              </v-layout>
            </v-row>
          </v-form>
        </v-row>
      </v-card-text>
    </v-card>
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
import ImageInput from '../components/ImageInput.vue'
export default {
  components: {
    ImageInput
  },
  data () {
    return {
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
      info: {
        name: '',
        phone: '',
        description: '',
        hourly: '',
        available: false,
        skills: [],
        wcb: '',
        liability: '',
        location: {
          lat: '',
          lng: '',
          address: ''
        }
      },
      saving: false,
      saved: false,
      avatar: null,
      switch1: false,
      file: {}
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
    avatar: {
      handler () {
        this.saved = false
      },
      deep: true
    },
    switch1 () {
      if (this.switch1) {
        this.info.available = true
      } else {
        this.info.available = false
      }
      this.edit()
    }
  },
  mounted () {
    this.$axios.$get('account/get').then((res) => {
      this.info.name = res.account.name
      this.info.phone = res.account.phone
      this.avatar = res.account.avatar
      this.info.description = res.account.description
      this.info.hourly = res.account.hourly
      this.info.available = res.account.available
      this.info.wcb = res.account.wcb
      this.info.liability = res.account.liability
      this.tags = res.account.skills
      this.tickets = res.account.tickets
      this.info.location = res.account.location
      if (this.info.available) {
        this.switch1 = true
      } else {
        this.switch1 = false
      }
    })
  },
  methods: {
    edit () {
      this.info.skills = this.tags
      this.info.tickets = this.tickets
      this.$axios.$post('account/edit', this.info).then((res) => {
        this.info.name = res.name
        this.info.phone = res.phone
        this.avatar = res.avatar
        this.info.description = res.description
        this.info.hourly = res.hourly
        this.info.available = res.available
        this.info.wcb = res.wcb
        this.info.liability = res.liability
        this.tags = res.skills
        this.tickets = res.tickets
        this.info.location = res.location
        if (this.info.available) {
          this.switch1 = true
        } else {
          this.switch1 = false
        }
      })
    },
    uploadImage () {
      this.saving = true
      this.$axios.$post('account/edit', this.file.formData).then((res) => {
        this.info.name = res.name
        this.info.phone = res.phone
        this.avatar = res.avatar
        this.info.description = res.description
        this.info.hourly = res.hourly
        this.info.available = res.available
        this.tags = res.skills
        this.info.wcb = res.wcb
        this.info.liability = res.liability
        this.tickets = res.tickets
        if (this.info.available) {
          this.switch1 = true
        } else {
          this.switch1 = false
        }
      })
      setTimeout(() => this.savedAvatar(), 1000)
    },
    savedAvatar () {
      this.saving = false
      this.saved = true
    },
    setPlace (place) {
      this.info.location.address = place.formatted_address
      this.info.location.lat = place.geometry.location.lat()
      this.info.location.lng = place.geometry.location.lng()
    }
  }
}
</script>
