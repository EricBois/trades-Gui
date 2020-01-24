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
      default: null
    },
    user: {
      type: Object,
      default: null
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
        messages: {
          uid: '',
          name: '',
          text: ''

        },
        names: {
          to: '',
          from: ''
        }
      }
    }
  },
  methods: {
    send () {
      if (this.message.messages.text) {
        this.message.names.from = this.$auth.user.name
        if (this.project) {
          this.message.project_name = this.project.name
          this.message.to = this.project.user
          this.message.names.to = this.project.createdBy
          this.message.messages.uid = this.$auth.user.sub
        } else {
          this.message.project_name = `Direct Message`
          this.message.to = this.user.uid
          this.message.names.to = this.user.name
          this.message.messages.uid = this.$auth.user.sub
        }
        this.message.messages.name = this.$auth.user.name
        this.$axios.$post('message/send', this.message).then((res) => {
          this.$emit('update:dialogMessage', false)
          // make sure it sends to right user
          const user = (res.to === this.$auth.user.sub) ? res.from : res.to
          this.$store.dispatch('notifications/createNotification',
            {
              senderId: this.$auth.user.sub,
              recipientId: user,
              activity: 'Message',
              activityDesc: 'You have a new message',
              link: res._id
            })
        })
      }
    }
  }
}
</script>
