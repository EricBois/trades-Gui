<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <v-form>
          <v-container py-0>
            <image-input v-model="file">
              <div slot="activator">
                <v-avatar v-if="!avatar" v-ripple size="150px" class="grey lighten-3 mb-3">
                  <span>Click to add avatar</span>
                </v-avatar>
                <v-avatar v-else v-ripple size="150px" class="mb-3">
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
              <v-flex xs12 md6>
                <v-text-field v-model="info.name" class="purple-input" label="Name" />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field v-model="info.phone" class="purple-input" label="Phone #" />
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="info.description" label="Description" class="purple-input" />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="info.hourly"
                  label="Hourly"
                  class="purple-input"
                  prefix="$"
                  type="number"
                />
              </v-flex>
              <v-flex xs12 md6>
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
              <v-flex xs12 text-xs-right>
                <v-btn
                  class="mx-0 font-weight-light"
                  ceditolor="success"
                  @click="edit"
                >
                  Update Profile
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ImageInput from '../components/ImageInput.vue'
export default {
  components: {
    ImageInput
  },
  data () {
    return {
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
