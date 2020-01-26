<template>
  <v-container>
    <v-alert
      v-model="alert"
      icon="mdi-information-outline"
      prominent
      dense
      dismissible
      transition="scale-transition"
      text
      :type="alertInfo"
    >
      {{ alertText }}
    </v-alert>
    <v-card flat color="#303030">
      <v-flex
        v-if="team.length >= 1"
        class="my-6"
        xs12
        sm8
        offset-sm-2
        justify="space-around"
      >
        <v-flex class="mb-n5" xs12>
          <v-text-field
            v-model="search"
            label="Search by Name.."
            class="purple-input center"
            rounded
            clearable
            prepend-inner-icon="mdi-magnify"
            dense
            @change="show = true"
          />
        </v-flex>
        <v-card subheader dense color="grey darken-3">
          <v-subheader class="justify-center sub">
            <v-flex xs1 text-left>
              <v-btn
                icon
                @click="show = !show"
              >
                <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs11 class="mr-6" text-center>
              <b class="justify-center">Direct messaging</b><br>
            </v-flex>
          </v-subheader>
          <v-expand-transition>
            <div v-show="show">
              <v-flex v-if="selectUser.length >= 1" class=" mb-2">
                <v-btn v-if="selectUser.length >= 1" color="orange darken-3" small class="mt-n12 ml-2 mb-4" @click="selectUser = []">
                  <v-icon class="mr-2" small>
                    mdi-autorenew
                  </v-icon>
                  reset
                </v-btn>
              </v-flex>
              <v-flex v-if="selectUser.length >= 1" class="mt-n8 mb-2" text-right>
                <v-btn color="primary" class="mt-n12 mr-2 mb-4" small @click="dialogMassMessage = !dialogMassMessage">
                  <v-icon class="mr-2" small>
                    mdi-send
                  </v-icon>
                  Message
                </v-btn>
              </v-flex>
              <v-sheet elevation="10" class="py-4 px-1">
                <v-chip-group
                  v-model="selectUser"
                  multiple
                  column
                  active-class="amber--text"
                >
                  <v-chip
                    v-for="user in filteredList"
                    :key="user.uid"
                    color="grey darken-1"
                    :value="user"
                    small
                  >
                    {{ user.name }}
                  </v-chip>
                </v-chip-group>
              </v-sheet>
            </div>
          </v-expand-transition>
        </v-card>
      </v-flex>
      <v-flex v-if="newMessages.length >= 1" xs12 sm8 offset-sm-2>
        <v-card subheader dense color="grey darken-3">
          <v-subheader class="justify-center sub">
            <b>New Messages</b>
          </v-subheader>
          <v-flex
            v-for="item in newMessages"
            :key="item._id"
          >
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="red" @click="deleteMessage(item.id)">
                  mdi-close-box
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content class="ml-n6 ml-sm-0" @click="dialog(item)">
                <v-list-item-title>
                  <v-chip color="green lighten-1" outlined label>
                    {{ item.project_name }}
                  </v-chip>
                </v-list-item-title>
                <v-list-item-subtitle class="pl-3">
                  <small><b> To: <u>{{ item.names.to }}</u></b> / <b> From: <u>{{ item.names.from }}</u></b></small><br>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-icon v-if="!$vuetify.breakpoint.xsOnly">
                <v-icon color="blue">
                  chat_bubble
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-divider class="my-1" />
          </v-flex>
        </v-card>
        <v-divider />
      </v-flex>
      <v-flex v-if="readMessages.length >= 1" xs12 sm8 offset-sm-2>
        <v-card subheader dense color="grey darken-3">
          <v-subheader class="justify-center sub">
            <v-flex xs1 text-left>
              <v-btn
                icon
                @click="showRead = !showRead"
              >
                <v-icon>{{ showRead ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs11 class="mr-6" text-center>
              <b>Read & Sent </b>
            </v-flex>
          </v-subheader>
          <v-expand-transition>
            <div v-show="showRead">
              <v-flex
                v-for="item in readMessages"
                :key="item._id"
              >
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="red" @click="deleteMessage(item.id)">
                      mdi-close-box
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content class="ml-n6 ml-sm-0" @click="dialog(item)">
                    <v-list-item-title>
                      <v-chip v-if="!item.read.includes($auth.user.sub)" color="green lighten-1" outlined label>
                        {{ item.project_name }}
                      </v-chip>
                      <v-chip v-else color="grey blue lighten-1" outlined label>
                        {{ item.project_name }}
                      </v-chip>
                    </v-list-item-title>
                    <v-list-item-subtitle class="pl-3">
                      <small><b> To: <u>{{ item.names.to }}</u></b> / <b> From: <u>{{ item.names.from }}</u></b></small><br>
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-icon v-if="!$vuetify.breakpoint.xsOnly">
                    <v-icon color="blue">
                      chat_bubble
                    </v-icon>
                  </v-list-item-icon>
                </v-list-item>
                <v-divider class="my-1" />
              </v-flex>
            </div>
          </v-expand-transition>
        </v-card>
      </v-flex>
      <v-flex v-if="readMessages.length < 1 && newMessages.length < 1" xs12 sm8 offset-sm-2>
        <v-list subheader dense color="grey darken-3">
          <v-subheader class="justify-center sub">
            <b>No Messages Yet!</b>&nbsp;<v-icon small>
              mdi-emoticon-sad-outline
            </v-icon>
          </v-subheader>
        </v-list>
      </v-flex>
      <v-flex v-if="readMessages.length < 1 && newMessage.length < 1" xs12 sm8 offset-sm-2 text-center>
        <v-list subheader dense color="grey darken-3">
          <v-subheader class="justify-center">
            <b>No Messages Yet!</b>&nbsp;<v-icon small>
              mdi-emoticon-sad-outline
            </v-icon>
          </v-subheader>
        </v-list>
      </v-flex>
    </v-card>
    <v-dialog ref="chat" v-model="dialogMessage" persistent max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogMessage = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title v-if="selectedMessage.names">
            Message(s) with {{ (selectedMessage.names.from === $auth.user.name) ? selectedMessage.names.to : selectedMessage.names.from }}
          </v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <v-container fluid>
          <v-layout>
            <v-flex xs12>
              <v-card class="scroll" height="400">
                <v-flex v-for="message in selectedMessage.messages" :key="message.id">
                  <v-card
                    v-if="message.uid === $auth.user.sub"
                    max-width="250px"
                    class="mt-3 bg ml-2"
                    outlined
                  >
                    <v-flex class="ibm ma-2">
                      {{ message.text }}
                    </v-flex>
                  </v-card>
                  <v-card
                    v-else
                    max-width="250px"
                    class="mt-3 mx-auto bg2"
                    outlined
                  >
                    <v-card-text class="mt-n4">
                      <div>{{ message.name }}</div>
                      <v-divider />
                    </v-card-text>
                    <v-flex class="ibm ma-2 mt-n2">
                      {{ message.text }}
                    </v-flex>
                  </v-card>
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
              @keydown.enter="send"
            />
            <v-btn @click="send()">
              Send
            </v-btn>
          </v-form>
        </v-container>
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogMassMessage" persistent max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogMassMessage = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Message</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <v-flex xs12 class="my-4">
          <span class="mr-2 mt-1 ibm">Sending to:</span>
          <v-chip v-for="user in selectUser" :key="user.uid" class="mr-2 mt-1" small>
            {{ user.name }}
          </v-chip>
        </v-flex>
        <v-form ref="form" lazy-validation class="mt-5">
          <v-textarea
            v-model="massMessage.messages.text"
            label="Message"
            solo
            outlined
            clearable
            class="purple-input"
            auto-grow
          />
        </v-form>
        <v-flex text-right class="ma-2">
          <v-btn color="blue darken-3" @click="massSend">
            Send
          </v-btn>
        </v-flex>
        <v-divider />
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.scroll {
  overflow-y: auto;
}
.bg {
  background-color: #616161;
}
.bg2 {
  background-color: #004D40;
}
.confirmed {
  color:rgb(21, 170, 21);
}
.awaiting {
  color: #F44336;
}
.change {
  color: rgb(238, 121, 25);
}
.sub {
  background-color: #546E7A;
}
.ibm {
  font-family: 'IBM Plex Sans', sans-serif;
  font-style: italic;
}
</style>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showRead: false,
      show: false,
      search: '',
      dialogMassMessage: false,
      selectUser: [],
      alert: false,
      alertInfo: 'info',
      alertText: '',
      userColor: 'amber lighten-4',
      selectedMessage: {},
      dialogMessage: false,
      newMessage: { // for replying to a message
        name: '',
        text: '',
        uid: ''
      },
      massMessage: { // for the mass message fn
        to: '',
        names: {
          to: '',
          from: ''
        },
        project_name: '',
        messages: {
          text: '',
          name: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      profile: 'profile/getProfile',
      read: 'messages/Read',
      newMessages: 'messages/getNewMessages',
      readMessages: 'messages/getReadMessages',
      team: 'team/getTeam'
    }),
    filteredList () {
      let filtered = this.team
      if (this.search) {
        if (this.search.length > 0) {
          filtered = this.team.filter(user => user.name.toLowerCase().includes(this.search.toLowerCase()))
        }
      }
      return filtered
    }
  },
  watch: {
    dialogMessage () {
      this.scrollDown()
    },
    newMessages () {
      this.scrollDown()
    }
  },
  created () {
    this.$store.dispatch('messages/getMessages')
    this.scrollDown()
    if (this.profile.user_metadata && !this.profile.user_metadata.welcomeMsg) {
      this.alertText = process.env.welcomeMsg
      this.alert = true
      return this.$axios.$post('account/edit', { user_metadata: { welcomeMsg: true } })
    }
  },
  methods: {
    scrollDown () {
      this.$nextTick(() => {
        const scrollDown = this.$refs.chat.$refs.dialog.querySelector('.scroll')
        if (scrollDown) {
          scrollDown.scrollTop = scrollDown.scrollHeight
        }
      })
    },
    deleteMessage (id) {
      this.$axios.$post(`message/delete/${id}`).then((res) => {
        this.$store.dispatch('messages/getMessages')
      })
    },
    dialog (item) {
      this.selectedMessage = item
      this.dialogMessage = !this.dialogMessage
      if (this.dialogMessage) {
        if (!this.dialogMessage.read) {
          if (!item.read.includes(this.$auth.user.sub)) {
            this.$axios.$get(`message/read/${this.selectedMessage.id}`).then((res) => { // set message to read
              this.$store.commit('messages/Read', true)
              this.$store.dispatch('messages/getMessages')
              this.$store.dispatch('notifications/getNotifications')
            })
          }
        }
      }
    },
    send () {
      if (this.newMessage.text.trim().length > 0) {
        this.newMessage.uid = this.$auth.user.sub
        this.newMessage.name = this.$auth.user.name
        this.$axios.$post(`message/send/${this.selectedMessage.id}`, { name: this.$auth.user.name, message: this.newMessage }).then((res) => {
          this.selectedMessage = res
          this.newMessage.text = ''
          const user = (res.to === this.$auth.user.sub) ? res.from : res.to
          this.$store.dispatch('notifications/createNotification',
            {
              senderId: this.$auth.user.sub,
              recipientId: user,
              activity: 'Message',
              activityDesc: 'You have a new message',
              link: res._id
            })
          this.$store.dispatch('messages/getMessages')
        })
      }
    },
    async massSend () {
      if (this.massMessage.messages.text) {
        this.massMessage.project_name = this.$auth.user.name
        this.massMessage.messages.name = this.$auth.user.name
        this.massMessage.messages.uid = this.$auth.user.sub
        this.massMessage.names.from = this.$auth.user.name
        for (const key in this.selectUser) {
          const user = this.selectUser[key]
          this.massMessage.names.to = user.name
          this.massMessage.to = user.uid
          await this.$axios.$post('message/send', this.massMessage).then((res) => {
            this.snackbarText = 'Successfully Sent!'
            this.snackbar = true
            this.$store.dispatch('notifications/createNotification',
              {
                senderId: this.$auth.user.sub,
                recipientId: user.uid,
                activity: 'Message',
                activityDesc: 'You have a new message',
                link: res._id
              })
          })
        }
        this.dialogMassMessage = false
        this.massMessage.messages.text = ''
      }
    }
  }

}
</script>
