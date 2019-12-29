<template>
  <v-container fluid>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      centered
      show-arrows
      color="white"
    >
      <v-tab>My Profile</v-tab>
      <v-tab>Settings</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="mt-8 mb-4">
      <v-tab-item>
        <v-card flat color="#303030">
          <v-card elevation="22" max-width="844" class="mx-auto">
            <v-form
              ref="form"
              lazy-validation
            >
              <v-layout wrap>
                <v-flex xs12>
                  <v-card
                    raised
                    max-width="810"
                    class="mx-auto"
                  >
                    <v-layout wrap align-center justify-center text-center>
                      <v-flex xs12 md4 class="mt-n6 mb-2">
                        <v-avatar v-if="picture" size="200" class="mb-3 rounded" tile>
                          <v-img :src="picture" />
                        </v-avatar>
                        <image-uploader
                          :preview="false"
                          :max-width="700"
                          :class-name="['fileinput', { 'fileinput--loaded': hasImage }]"
                          capture="environment"
                          :debug="1"
                          do-not-resize="gif"
                          :auto-rotate="true"
                          output-format="blob"
                          @input="setImageLogo"
                        >
                          <label slot="upload-label" for="fileInput" class="label">
                            <v-icon> mdi-camera-plus-outline</v-icon>
                            <span class="upload-caption">"Edit / Upload"</span>
                          </label>
                        </image-uploader>
                        <v-btn v-if="photo" color="green" loading text>
                          <template v-slot:loader>
                            <v-icon>mdi-36px mdi-spin mdi-loading</v-icon>
                            <span>Loading...</span>
                          </template>
                        </v-btn>
                      </v-flex>
                      <v-flex xs12 md4 offset-md-4 class="pa-2">
                        <v-text-field v-model="info.name" prepend-inner-icon="mdi-account" :rules="nameRule" class="purple-input" label="Name" />
                        <v-text-field
                          v-model="info.user_metadata.phone"
                          class="purple-input"
                          label="Phone #"
                          prepend-inner-icon="mdi-phone"
                        />
                      </v-flex>
                    </v-layout>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-layout wrap pa-2>
                <v-flex xs12 pb-5>
                  <label for="gmap">Address</label>
                  <gmap-autocomplete
                    class="gmap v-input__slot v-text-field"
                    :value="info.user_metadata.address"
                    :select-first-on-enter="true"
                    placeholder="Project Location"
                    @place_changed="setPlace"
                  />
                </v-flex>
                <v-flex xs12 pb-5>
                  <v-text-field
                    v-model="info.user_metadata.web"
                    class="purple-input"
                    label="Website"
                    prepend-inner-icon="mdi-web"
                  />
                </v-flex>
                <v-flex xs12 md6 pb-5 pr-sm-4>
                  <v-text-field
                    v-model="info.user_metadata.facebook"
                    class="purple-input"
                    label="Facebook"
                    prepend-inner-icon="mdi-facebook-box"
                  />
                </v-flex>
                <v-flex xs12 md6 pb-5>
                  <v-text-field
                    v-model="info.user_metadata.instagram"
                    class="purple-input"
                    label="Instagram"
                    prepend-inner-icon="mdi-instagram"
                  />
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="info.user_metadata.description"
                    label="Description"
                    solo
                    outlined
                    class="purple-input"
                  />
                </v-flex>
                <v-flex xs12 md6 pr-sm-4>
                  <v-text-field
                    v-model="info.user_metadata.wcb"
                    class="purple-input"
                    label="Wcb #"
                  />
                </v-flex>
                <v-flex xs12 md6 pr-sm-4>
                  <v-text-field
                    v-model="info.user_metadata.liability"
                    class="purple-input"
                    label="Liability Insurance"
                  />
                </v-flex>
                <v-flex xs12 md6 pt-5>
                  <v-select
                    v-model="info.user_metadata.skills"
                    :items="itemSkills"
                    chips
                    label="Skills"
                    multiple
                  />
                </v-flex>
                <v-flex xs12 md6 pl-md-5 pt-5>
                  <v-select
                    v-model="info.user_metadata.tickets"
                    :items="itemTickets"
                    chips
                    label="Tickets"
                    multiple
                  />
                </v-flex>
                <v-flex xs12 md3 pr-sm-4 pt-4>
                  <v-text-field
                    v-model="info.user_metadata.hourly"
                    label="Hourly"
                    class="purple-input"
                    prefix="$"
                    type="number"
                  />
                </v-flex>
                <v-flex xs12 md4 pt-4>
                  <v-switch v-model="switch1" label="Available for work" color="green" inset />
                </v-flex>
                <v-flex xs6 class="justify-center text-center">
                  <v-btn class="ma-1" small @click="dialogPhoto = !dialogPhoto">
                    <v-icon>mdi-image</v-icon>&nbsp;
                    Photos
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn
                    v-if="profile.user_metadata && !profile.user_metadata.profileDone"
                    class="ma-1 ibm justify-center text-center"
                    color="green"
                    elevation="24"
                    small
                    @click="edit"
                  >
                    <v-icon>mdi-content-save-outline</v-icon>&nbsp;
                    Save Profile
                  </v-btn>
                  <v-btn v-else class="ma-1 ibm justify-center text-center" color="green darken-2" small @click="edit">
                    <v-icon>mdi-content-save-outline</v-icon>&nbsp;
                    Edit Profile
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-card>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="#303030">
          <v-card elevation="22" max-width="844" class="mx-auto">
            <v-card-text>
              <v-form
                ref="form"
                lazy-validation
              >
                <v-layout wrap>
                  <v-card elevation="15" text-center class="ma-10 pa-10">
                    <v-flex xs12>
                      <h2>Notifications</h2>
                      <v-switch v-model="email" label="Email" />
                      <v-switch v-model="sms" label="Sms" />
                    </v-flex>
                    <v-flex xs12 text-center>
                      <v-btn
                        class="ibm"
                        @click="edit"
                      >
                        <v-icon>mdi-content-save-outline</v-icon>&nbsp;
                        Save
                      </v-btn>
                    </v-flex>
                  </v-card>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="dialogPhoto" transition="dialog-bottom-transition" max-width="900">
      <v-card class="px-3">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogPhoto = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Photos</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <v-flex xs12 text-center>
          <image-uploader
            id="photos"
            :preview="false"
            :max-width="700"
            :class-name="['photos', { 'fileinput--loaded': hasImage }]"
            capture="environment"
            :debug="1"
            do-not-resize="gif"
            :auto-rotate="true"
            output-format="blob"
            @input="setPhoto"
          >
            <label slot="upload-label" for="photos">
              <v-icon>mdi-48px mdi-camera-plus-outline</v-icon>
              <span class="upload-caption">"Click to upload"</span>
            </label>
          </image-uploader>
        </v-flex>
        <v-divider />
        <v-container class="mx-5 photo">
          <v-layout row wrap class="pa-3">
            <v-flex
              v-for="img in photos"
              :key="img"
              xs12
              sm4
              md3
              class="pa-4"
            >
              <v-card>
                <v-btn color="orange darken-2" text @click="deleteFile(img)">
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
                <ExpandableImage class="image" :src="img" max-width="400" contain />
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style>
.gmap {
  color: white !important;
  padding-top: 16px;
  border-bottom: 2px solid grey;
  background-color: transparent;
}
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
}
.rounded {
  border-radius: 20px;
  margin-top: 10px;
}
.label {
  opacity: 50%;
}
#fileInput {
  display: none;
}
#photos {
  display: none;
}
</style>
<script>
import { mapGetters } from 'vuex'
import ExpandableImage from '../components/ExpandableImage'
export default {
  components: {
    ExpandableImage
  },
  data () {
    return {
      dialogPhoto: false,
      hasImage: false,
      photo: null,
      filename: '',
      itemSkills: [],
      itemTickets: [],
      info: {
        name: '',
        user_metadata: {
          instagram: '',
          facebook: '',
          phone: '',
          description: '',
          hourly: '',
          available: false,
          skills: [],
          tickets: [],
          wcb: '',
          liability: '',
          lat: '',
          lng: '',
          address: '',
          country: '',
          city: '',
          province: '',
          web: '',
          profileDone: true,
          smsNotification: false,
          emailNotification: true
        }
      },
      picture: null,
      switch1: false,
      photos: [],
      nameRule: [
        v => !!v || 'The name is required',
        v => (v || '').length <= 40 || 'Name should be 40 characters or less '
      ],
      tab: null,
      email: true,
      sms: false
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile',
    profilePhotos: 'profile/getPhotos'
  }),
  watch: {
    email () {
      if (this.email) {
        this.info.user_metadata.emailNotification = true
        // this.edit()
      } else {
        this.info.user_metadata.emailNotification = false
        // this.edit()
      }
    },
    sms () {
      if (this.sms) {
        this.info.user_metadata.smsNotification = true
        // this.edit()
      } else {
        this.info.user_metadata.smsNotification = false
        // this.edit()
      }
    },
    switch1 () {
      if (this.switch1) {
        this.info.user_metadata.available = true
      } else {
        this.info.user_metadata.available = false
      }
    },
    profile () {
      if (this.profile) {
        this.info.name = (!this.profile.user_metadata.welcomeProfile) ? '' : this.profile.name
        this.picture = this.profile.picture
        this.info.user_metadata.facebook = this.profile.user_metadata.facebook
        this.info.user_metadata.instagram = this.profile.user_metadata.instagram
        this.info.user_metadata.phone = this.profile.user_metadata.phone
        this.info.user_metadata.description = this.profile.user_metadata.description
        this.info.user_metadata.hourly = this.profile.user_metadata.hourly
        this.info.user_metadata.address = this.profile.user_metadata.address
        this.info.user_metadata.available = this.profile.user_metadata.available
        this.info.user_metadata.smsNotification = this.profile.user_metadata.smsNotification
        this.info.user_metadata.emailNotification = this.profile.user_metadata.emailNotification
        this.info.user_metadata.wcb = this.profile.user_metadata.wcb
        this.info.user_metadata.liability = this.profile.user_metadata.liability
        this.info.user_metadata.skills = this.profile.user_metadata.skills
        this.info.user_metadata.tickets = this.profile.user_metadata.tickets
        this.info.user_metadata.web = this.profile.user_metadata.web
        if (this.info.user_metadata.available) {
          this.switch1 = true
        }
        if (this.info.user_metadata.smsNotification) {
          this.sms = true
        }
        if (this.info.user_metadata.emailNotification) {
          this.email = true
        }
      }
    },
    profilePhotos () {
      this.photos = this.profilePhotos
    }
  },
  created () {
    // Welcome profile
    if (this.profile.user_metadata && !this.profile.user_metadata.welcomeProfile) {
      this.info.name = ''
      this.$swal.fire({
        position: 'bottom-end',
        type: 'info',
        text: process.env.welcomeProfile,
        showConfirmButton: true,
        width: '22rem'
      }).then(() => {
        return this.$axios.$post('account/edit', { user_metadata: { welcomeProfile: true } })
      })
    }
    this.itemSkills = process.env.trades.split(',')
    this.itemTickets = process.env.tickets.split(',')
    if (this.profile && this.profile.user_metadata) {
      this.info.name = this.profile.name
      this.picture = this.profile.picture
      this.info.user_metadata.facebook = this.profile.user_metadata.facebook
      this.info.user_metadata.instagram = this.profile.user_metadata.instagram
      this.info.user_metadata.phone = this.profile.user_metadata.phone
      this.info.user_metadata.description = this.profile.user_metadata.description
      this.info.user_metadata.hourly = this.profile.user_metadata.hourly
      this.info.user_metadata.available = this.profile.user_metadata.available
      this.info.user_metadata.smsNotification = this.profile.user_metadata.smsNotification
      this.info.user_metadata.emailNotification = this.profile.user_metadata.emailNotification
      this.info.user_metadata.wcb = this.profile.user_metadata.wcb
      this.info.user_metadata.address = this.profile.user_metadata.address
      this.info.user_metadata.liability = this.profile.user_metadata.liability
      this.info.user_metadata.skills = this.profile.user_metadata.skills
      this.info.user_metadata.tickets = this.profile.user_metadata.tickets
      this.info.user_metadata.web = this.profile.user_metadata.web
      if (this.profilePhotos.length > 0) {
        this.photos = this.profilePhotos
      }
      if (this.info.user_metadata.smsNotification) {
        this.sms = true
      }
      if (this.info.user_metadata.emailNotification) {
        this.email = true
      }
      if (this.info.user_metadata.available) {
        this.switch1 = true
      } else {
        this.switch1 = false
      }
    }
  },
  methods: {
    edit () {
      if (this.$refs.form.validate()) {
        this.$axios.$post('account/edit', this.info).then((res) => {
          this.$store.commit('profile/updateProfile', res) // for the profile store
          this.$auth.fetchUser() // fetch tokenID
          this.$swal.fire({
            type: 'success',
            title: 'Success',
            text: 'Successfully Updated!',
            timer: 1000
          })
        })
      }
    },
    uploadImage () {
      const formData = new FormData()
      formData.append('file', this.photo, this.filename)
      this.$axios.$post('account/edit', formData).then((res) => {
        this.photo = null
        this.hasImage = false
        this.filename = ''
        if (this.info.user_metadata.available) {
          this.switch1 = true
        } else {
          this.switch1 = false
        }
        this.$auth.fetchUser()
      })
    },
    setImageLogo (file) {
      this.hasImage = true
      this.photo = file
      const ext = '.' + this.photo.type.split('/').pop()
      this.filename = 'img' + Date.now() + ext
      if (this.picture) {
        const link = this.picture.split('/').pop()
        this.$axios.$post(`account/deleteLogo/${link}`)
      }
      this.uploadImage()
    },
    setPhoto (file) {
      this.hasImage2 = true
      this.photo2 = file
      const ext = '.' + this.photo2.type.split('/').pop()
      this.filename2 = 'img' + Date.now() + ext
      this.uploadPhoto()
    },
    uploadPhoto () {
      if (this.photos.length <= 8) {
        const formData = new FormData()
        formData.append('file', this.photo2, this.filename2)
        this.$axios.$post('account/uploadPhoto', formData).then((res) => {
          this.photos = res.photos
          this.photo2 = null
          this.hasImage2 = false
          this.filename2 = ''
        })
      }
    },
    deleteFile (file) {
      const name = file.split('/').pop()
      this.$axios.$post(`account/deletePhoto/${name}`, { file })
        .then((res) => {
          this.photos = res.photos
        })
    },
    setPlace (place) {
      this.info.user_metadata.address = place.formatted_address
      this.info.user_metadata.lat = place.geometry.location.lat()
      this.info.user_metadata.lng = place.geometry.location.lng()
      const address = place.address_components.map(address => ({ type: address.types, name: address.long_name }))
      for (const key in address) {
        const info = address[key]
        if (info.type.includes('administrative_area_level_1')) {
          this.info.user_metadata.province = info.name
        }
        if (info.type.includes('locality')) {
          this.info.user_metadata.city = info.name
        }
        if (info.type.includes('country')) {
          this.info.user_metadata.country = info.name
        }
      }
    }
  }
}
</script>
