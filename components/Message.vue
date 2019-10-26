<template>
  <v-container>
    <v-form ref="form" lazy-validation class="mt-5">
      <v-textarea
        v-model="message.messages.text"
        label="Message"
        solo
        outlined
        clearable
        class="purple-input"
        auto-grow
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
      messages: [],
      message: {
        project: '',
        project_name: '',
        to: '',
        senders: [],
        messages: {
          name: '',
          text: ''

        }
      }
    }
  },
  methods: {
    send () {
      if (this.message.messages.text) {
        this.message.senders = [this.$auth.user.name]
        this.message.project_name = this.project.name
        this.message.project = this.project.id
        this.message.to = this.project.user
        this.message.messages.name = this.$auth.user.name
        this.$axios.$post('message/send', this.message).then((res) => {
          this.$emit('update:dialogMessage', false)
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
