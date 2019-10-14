<template>
  <v-container>
    <image-uploader
      :preview="false"
      :max-width="700"
      :class-name="['fileinput', { 'fileinput--loaded': hasImage }]"
      capture="environment"
      :debug="1"
      do-not-resize="gif"
      :auto-rotate="true"
      output-format="blob"
      @input="setImage"
    >
      <label slot="upload-label" for="fileInput">
        <v-icon>mdi-48px mdi-camera-plus-outline</v-icon>
        <span class="upload-caption">
          "Click to upload"
        </span>
      </label>
    </image-uploader>
    <v-btn v-if="photo" color="green" loading text>
      <template v-slot:loader>
        <v-icon>mdi-36px mdi-spin mdi-loading</v-icon>
        <span>Loading...</span>
      </template>
    </v-btn>
  </v-container>
</template>

<style >
#fileInput {
  display: none;
}
</style>
<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      hasImage: false,
      photo: null,
      filename: ''
    }
  },
  methods: {
    setImage (file) {
      this.hasImage = true
      this.photo = file
      const ext = '.' + this.photo.type.split('/').pop()
      this.filename = 'img' + Date.now() + ext
      this.upload()
    },
    upload () {
      const formData = new FormData()
      formData.append('file', this.photo, this.filename)
      this.$axios.$post(`job/uploadPhoto/${this.$route.params.id}`, formData).then((res) => {
        this.$emit('update:project', res)
        this.photo = null
        this.hasImage = false
        this.filename = ''
      }).catch((error) => {
        this.$swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: `${error}`
        })
      })
    }
  }
}
</script>
