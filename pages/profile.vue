<template>
  <v-container fluid>
    <v-card elevation="22" max-width="844" class="mx-auto">
      <v-card-text>
        <v-row class="py-4 pl-4">
          <v-form>
            <v-flex class="mb-4">
              <v-avatar v-if="picture" size="164" class="mb-3">
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
                <label slot="upload-label" for="fileInput">
                  <v-icon>mdi-48px mdi-camera-plus-outline</v-icon>
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
            <v-row class="py-4 pl-4">
              <v-layout wrap>
                <v-flex xs10 md5 mr-12>
                  <v-text-field v-model="info.name" class="purple-input" label="Name" />
                </v-flex>
                <v-flex xs10 md5>
                  <v-text-field
                    v-model="info.user_metadata.phone"
                    class="purple-input"
                    label="Phone #"
                  />
                </v-flex>
                <v-flex xs10 pb-5>
                  <v-text-field
                    v-model="info.user_metadata.address"
                    class="purple-input"
                    label="Address"
                  />
                </v-flex>
                <v-flex xs10>
                  <v-textarea
                    v-model="info.user_metadata.description"
                    label="Description"
                    solo
                    outlined
                    class="purple-input"
                  />
                </v-flex>
                <v-flex xs10 md5 mr-12>
                  <v-text-field
                    v-model="info.user_metadata.wcb"
                    class="purple-input"
                    label="Wcb #"
                  />
                </v-flex>
                <v-flex xs10 md5 mr-12>
                  <v-text-field
                    v-model="info.user_metadata.liability"
                    class="purple-input"
                    label="Liability Insurance"
                  />
                </v-flex>
                <v-flex xs10 md5 pt-5>
                  <v-select
                    v-model="info.user_metadata.skills"
                    :items="itemSkills"
                    chips
                    label="Skills"
                    multiple
                  />
                </v-flex>
                <v-flex xs10 md5 pl-md-5 pt-5>
                  <v-select
                    v-model="info.user_metadata.tickets"
                    :items="itemTickets"
                    chips
                    label="Tickets"
                    multiple
                  />
                </v-flex>
                <v-flex xs10 md2 mr-12 pt-4>
                  <v-text-field
                    v-model="info.user_metadata.hourly"
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
                  <v-btn @click="dialogPhoto = !dialogPhoto">
                    Photos
                  </v-btn>
                  <v-btn class="mx-3 font-weight-light" color="primary" @click="edit">
                    Update Profile
                  </v-btn>
                </v-card-actions>
              </v-layout>
            </v-row>
          </v-form>
        </v-row>
      </v-card-text>
    </v-card>
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
  color: black;
  background-color: rgb(206, 227, 245);
}
#fileInput {
  display: none;
}
#photos {
  display: none;
}
</style>
<script>
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
      itemSkills: [
        'Drywall',
        'Taping',
        'Framing',
        'Labour',
        'Texturing',
        'Insulation'
      ],
      itemTickets: ['WHIMIS', 'First Aid', 'Scissor Lift', 'Fall Arrest'],
      info: {
        name: '',
        user_metadata: {
          phone: '',
          description: '',
          hourly: '',
          available: false,
          skills: [],
          tickets: [],
          wcb: '',
          liability: '',
          address: ''
        }
      },
      picture: null,
      switch1: false,
      photos: []
    }
  },
  watch: {
    switch1 () {
      if (this.switch1) {
        this.info.user_metadata.available = true
      } else {
        this.info.user_metadata.available = false
      }
      this.edit()
    }
  },
  mounted () {
    this.$axios
      .$get('account/get')
      .then((res) => {
        this.info.name = res.user.name
        this.info.user_metadata = res.user.user_metadata
        this.picture = res.user.picture
        this.info.user_metadata.phone = res.user.user_metadata.phone
        this.info.user_metadata.description = res.user.user_metadata.description
        this.info.user_metadata.hourly = res.user.user_metadata.hourly
        this.info.user_metadata.available = res.user.user_metadata.available
        this.info.user_metadata.wcb = res.user.user_metadata.wcb
        this.info.user_metadata.liability = res.user.user_metadata.liability
        this.info.user_metadata.skills = res.user.user_metadata.skills
        this.info.user_metadata.tickets = res.user.user_metadata.tickets
        this.info.user_metadata.location = res.user.user_metadata.location
        if (res.photos) {
          this.photos = res.photos.photos
        }
        if (this.info.user_metadata.available) {
          this.switch1 = true
        } else {
          this.switch1 = false
        }
      })
      .catch(() => {
        this.$router.push('/')
      })
  },
  methods: {
    edit () {
      this.$axios.$post('account/edit', this.info).then((res) => {
        this.info.name = res.name
        this.info.user_metadata.phone = res.user_metadata.phone
        this.picture = res.picture
        this.info.user_metadata.description = res.user_metadata.description
        this.info.user_metadata.hourly = res.user_metadata.hourly
        this.info.user_metadata.available = res.user_metadata.available
        this.info.user_metadata.wcb = res.user_metadata.wcb
        this.info.user_metadata.liability = res.user_metadata.liability
        this.info.user_metadata.skills = res.user_metadata.skills
        this.info.user_metadata.tickets = res.user_metadata.tickets
        this.info.user_metadata.location = res.user_metadata.location
        if (this.info.user_metadata.available) {
          this.switch1 = true
        } else {
          this.switch1 = false
        }
        this.$auth.fetchUser()
      })
    },
    uploadImage () {
      const formData = new FormData()
      formData.append('file', this.photo, this.filename)
      this.$axios.$post('account/edit', formData).then((res) => {
        this.info.name = res.name
        this.info.user_metadata.phone = res.user_metadata.phone
        this.picture = res.picture
        this.info.user_metadata.description = res.user_metadata.description
        this.info.user_metadata.hourly = res.user_metadata.hourly
        this.info.user_metadata.available = res.user_metadata.available
        this.info.user_metadata.wcb = res.user_metadata.wcb
        this.info.user_metadata.liability = res.user_metadata.liability
        this.info.user_metadata.skills = res.user_metadata.skills
        this.info.user_metadata.tickets = res.user_metadata.tickets
        this.info.user_metadata.location = res.user_metadata.location
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
    }
  }
}
</script>
