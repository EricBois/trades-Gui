<template>
  <v-container>
    <v-form ref="form" lazy-validation>
      <v-textarea
        v-model="message.messages.text"
        label="Message"
        solo
        outlined
        class="purple-input"
        :rules="messageRule"
      />
    </v-form>
    <v-btn @click="send">
      Send
    </v-btn>
  </v-container>
</template>
<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    dialogMessage: {
      type: Boolean
    }
  },
  data () {
    return {
      messageRule: [v => !!v || 'Message is required'],
      message: {
        project: '',
        to: '',
        messages: {
          name: '',
          text: ''

        }
      }
    }
  },
  methods: {
    send () {
      if (this.$refs.form.validate()) {
        this.message.project = this.project.id
        this.message.to = this.project.user
        this.message.messages.name = this.$auth.user.name
        this.$axios.$post('message/send', this.message).then((res) => {
          this.$emit('update:dialogMessage', false)
          this.message.messages.text = ''
          this.$swal.fire({
            type: 'success',
            title: 'Success',
            text: 'Message Sent!',
            timer: 1500
          })
        })
      }
    }
  }
}
</script>
