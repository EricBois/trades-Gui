<template>
  <v-container fluid>
    <v-layout column>
      <v-card elevation="22">
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
                  <!-- <v-flex v-if="info.avatar" xs12 text-xs-center>
                <v-btn ripple icon>
                  <v-icon color="red" large>
                    mdi-delete-circle
                  </v-icon>
                </v-btn>
                <v-avatar tile size="150">
                  <v-img :src="info.avatar" />
                </v-avatar>
          </v-flex>-->
                  <!-- <v-flex v-else xs12 pt-5 text-xs-center /> -->
                  <v-flex xs10 md5 mr-12>
                    <v-text-field v-model="info.name" class="purple-input" label="Name" />
                  </v-flex>
                  <v-flex xs10 md5>
                    <v-text-field v-model="info.phone" class="purple-input" label="Phone #" />
                  </v-flex>
                  <v-flex xs10>
                    <v-textarea v-model="info.description" label="Description" solo outlined class="purple-input" />
                  </v-flex>
                  <v-flex xs11 md6 pt-5>
                    <vue-tags-input
                      v-model="tag"
                      :tags="tags"
                      :autocomplete-items="filteredItems"
                      placeholder="Add Skill"
                      :add-only-from-autocomplete="true"
                      @tags-changed="newTags => tags = newTags"
                    />
                  </v-flex>
                  <v-flex xs11 md6 pt-5>
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
                  <!-- <v-flex xs12 md12>
                  <gmap-autocomplete
                    class="v-input__slot theme--light"
                    :value="info.location.address"
                    :select-first-on-enter="true"
                    @place_changed="setPlace"
                  />
          </v-flex>-->
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
    </v-layout>
  </v-container>
</template>
<style scoped>
  .vue-tags-input {
    background: #CDCCCC;
    color:#283944
  }
  .vue-tags-input .ti-new-tag-input {
    background: transparent;
    color: #b7c4c9;
  }
  .vue-tags-input .ti-autocomplete {
    background: #283944;
    border: 1px solid #8b9396;
    border-top: none;
  }
  .vue-tags-input .ti-tag {
    position: relative;
    background: #ebde6e;
    color: #283944;
  }
  .vue-tags-input .ti-item.ti-selected-item {
    background: #ebde6e;
    color: #283944;
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
        skills: []
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
      this.tags = res.account.skills
      this.tickets = res.account.tickets
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
        this.tags = res.skills
        this.tickets = res.tickets
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
    }
  }
}
</script>
