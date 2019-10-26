<template>
  <v-container>
    <v-flex xs12 sm8 offset-sm-2>
      <v-list subheader dense color="grey darken-3">
        <v-subheader>New Messages</v-subheader>
        <v-flex
          v-for="item in messages"
          :key="item._id"
        >
          <v-list-item
            v-if="!item.read.includes($auth.user.sub)"
          >
            <v-list-item-icon v-if="!item.read.includes($auth.user.sub)">
              <v-icon @click="deleteMessage(item.id)" color="red">
                mdi-close-box
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content  @click="dialog(item)">
              <v-list-item-title>
                <v-chip v-if="!item.read.includes($auth.user.sub)" color="green lighten-1" outlined>
                  {{ item.project_name }}
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle class="pl-3">
                <small><b> From: <u>{{item.messages[item.messages.length - 1].name}} </u></b></small></br>
                <small v-if="item.messages[item.messages.length - 1].text.length <= 60">{{item.messages[item.messages.length - 1].text}}</small>
                <small v-else>{{item.messages[item.messages.length - 1].text.substring(0,60)+"..."}}</small>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-icon v-if="!item.read.includes($auth.user.sub)">
              <v-icon color="blue">
                chat_bubble
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-flex>
      </v-list>
      <v-divider class="my-5"></v-divider>
      <v-list subheader dense color="grey darken-3">
        <v-subheader>Read & Sent</v-subheader>
        <v-flex
          v-for="item in messages"
          :key="item._id"
        >
          <v-list-item
            v-if="item.read.includes($auth.user.sub)"
          >
          <v-list-item-icon v-if="item.read.includes($auth.user.sub)">
              <v-icon @click="deleteMessage(item.id)" color="red">
                mdi-close-box
              </v-icon>
          </v-list-item-icon>
          <v-list-item-content @click="dialog(item)">
            <v-list-item-title>
              <v-chip v-if="!read" color="green lighten-1"  outlined>
                {{ item.project_name }}
              </v-chip>
              <v-chip v-else color="grey blue lighten-1" outlined>
                {{ item.project_name }}
              </v-chip>
            </v-list-item-title>
            <v-list-item-subtitle class="pl-3">
              <small><b>From: <u>{{item.messages[item.messages.length - 1].name}} </u></b></small></br>
              <small v-if="item.messages[item.messages.length - 1].text.length <= 60">{{item.messages[item.messages.length - 1].text}}</small>
              <small v-else>{{item.messages[item.messages.length - 1].text.substring(0,60)+"..."}}</small>
            </v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon color="blue">
              chat_bubble
            </v-icon>
          </v-list-item-icon>
        </v-list-item>
        </v-flex>
      </v-list>
    </v-flex>
    <v-dialog v-model="dialogMessage" persistent max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogMessage = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Messages</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <v-container fluid>
          <v-layout>
            <v-flex xs12>
              <v-card class="scroll" height="400">
                <v-flex v-for="message in selectedMessage.messages" :key="message.id" px-3>
                  <v-chip v-if="message.name === $auth.user.name" color="teal lighten-4" outlined class="mb-2 mr-5">
                    {{ message.name }}
                  </v-chip>
                  <v-chip v-else color="orange accent-1" outlined class="mb-2 mr-5">
                    {{ message.name }}
                  </v-chip> {{ message.text }}
                  <v-divider class="pt-3" />
                </v-flex>
              </v-card>
            </v-flex>
          </v-layout>
          <v-form ref="form" lazy-validation class="mt-5">
            <v-textarea
              v-model="newMessage.text"
              label="Message"
              solo
              outlined
              clearable
              class="purple-input"
              auto-grow
            />
            <v-btn @click="send()">
              Send
            </v-btn>
          </v-form>
        </v-container>
        <v-divider />
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.scroll {
      overflow-y: auto;
    }
</style>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: mapGetters({
    read: 'read/get'
  }),
  data () {
    return {
      userColor: 'amber lighten-4',
      selectedMessage: {},
      messages: [],
      dialogMessage: false,
      newMessage: {
        name: '',
        text: ''
      }
    }
  },
  created () {
    this.$axios
      .$get(`message/get`)
      .then((res) => {
        for (const key in res) {
          const message = res[key]
          message._id = key
          if (!message.delete.includes(this.$auth.user.sub)) {
            this.messages.push(message)
            if (message.read.includes(this.$auth.user.sub)) {
              this.$store.commit('read/add', true)
            }
          }
        }
      })
  },
  methods: {
    deleteMessage (id) {
      this.$axios.$post(`message/delete/${id}`).then((res) => {
        for (const key in this.messages) {
          const message = this.messages[key]
          if (id === message.id) {
            this.messages.splice(key, 1)
          }
        }
      })
    },
    dialog (item) {
      this.selectedMessage = item
      this.dialogMessage = !this.dialogMessage
      if (this.dialogMessage) {
        if (!this.dialogMessage.read) {
          if (!item.read.includes(this.$auth.user.sub)) {
            this.$axios.$get(`message/read/${this.selectedMessage.id}`).then((res) => {
              this.$store.commit('read/add', true)
              for (const key in this.messages) {
                const message = this.messages[key]
                if (res._id === message.id) {
                  this.messages.splice(key, 1)
                  this.messages.push(res)
                }
              }
            })
          }
        }
      }
    },
    send () {
      if (this.newMessage.text) {
        this.newMessage.name = this.$auth.user.name
        this.$axios.$post(`message/send/${this.selectedMessage.id}`, { name: this.$auth.user.name, message: this.newMessage }).then((res) => {
          this.selectedMessage = res
          this.newMessage.text = ''
          this.messages = []
          this.$axios
            .$get(`message/get`)
            .then((res) => {
              for (const key in res) {
                const message = res[key]
                message._id = key
                this.messages.push(message)
              }
            })
        })
      }
    }
  }

}
</script>
