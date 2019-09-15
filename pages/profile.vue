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
                  <v-flex xs10>
                    <vue-tags-input
                      v-model="tag"
                      :tags="tags"
                      :autocomplete-items="filteredItems"
                      placeholder="Add a Skill"
                      :add-only-from-autocomplete="true"
                      @tags-changed="newTags => tags = newTags"
                    />
                  </v-flex>
                  <v-flex xs10 md2 mr-12>
                    <v-text-field
                      v-model="info.hourly"
                      label="Hourly"
                      class="purple-input"
                      prefix="$"
                      type="number"
                    />
                  </v-flex>
                  <v-flex xs12 md2>
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
      }],
      info: {
        name: '',
        phone: '',
        description: '',
        hourly: '',
        available: false
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
      if (this.info.available) {
        this.switch1 = true
      } else {
        this.switch1 = false
      }
    })
  },
  methods: {
    edit () {
      console.log(this.tags)
      this.$axios.$post('account/edit', this.info).then((res) => {
        this.info.name = res.name
        this.info.phone = res.phone
        this.avatar = res.avatar
        this.info.description = res.description
        this.info.hourly = res.hourly
        this.info.available = res.available
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
