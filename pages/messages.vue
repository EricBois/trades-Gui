<template>
  <v-container>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      centered
      show-arrows
      color="white"
    >
      <v-tab>My Messages</v-tab>
      <v-tab>My Meetings</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="mt-8">
      <v-tab-item>
        <v-card flat color="#303030">
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
                <b>Read & Sent </b>
              </v-subheader>
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
      </v-tab-item>
      <v-tab-item>
        <v-card flat color="#303030">
          <!-- meetings -->
          <v-flex xs12 sm8 offset-sm-2>
            <v-divider class="my-5" />
            <v-list subheader dense color="blue-grey darken-3">
              <v-subheader v-if="meetings.length >= 1" class="justify-center sub">
                <b>Meeting Invites</b>
              </v-subheader>
              <v-subheader v-else class="justify-center sub">
                <b>No Meeting Yet!</b>&nbsp;<v-icon small>
                  mdi-emoticon-sad-outline
                </v-icon>
              </v-subheader>
              <v-flex
                v-for="item in meetings"
                :key="item.id"
              >
                <v-list-item>
                  <v-list-item-icon v-if="!$vuetify.breakpoint.xsOnly">
                    <v-icon>
                      mdi-account-multiple
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content @click="meetingPicker(item)">
                    <v-list-item-title>
                      <v-chip color="grey blue lighten-1" outlined>
                        {{ item.projectName }}
                      </v-chip>
                        &nbsp;
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <small v-if="item.confirm.status && !item.change.status"><i class="confirmed">Confirmed by <br v-if="$vuetify.breakpoint.xsOnly"><v-chip small outlined>{{ item.createdBy }}</v-chip></i></small>
                      <small v-if="!item.confirm.status && !item.change.status"><i class="awaiting">New Meeting request from <br v-if="$vuetify.breakpoint.xsOnly"><v-chip small outlined>{{ item.contractor }}</v-chip></i></small>
                      <small v-if="item.change.status && $auth.user.sub !== item.change.uid"><v-icon color="orange" small>mdi-alert-outline</v-icon><i class="change">Please review the changes</i></small>
                      <small v-if="item.change.status && $auth.user.sub === item.change.uid"><v-icon color="orange" small>mdi-alert-outline</v-icon><i class="change">Awaiting Confirmation</i></small>
                      <small v-if="!item.confirm.status && item.host == $auth.user.sub"><i class="awaiting">Awaiting Response from <br v-if="$vuetify.breakpoint.xsOnly"><v-chip small outlined>{{ item.createdBy }}</v-chip></i></small>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon v-if="item.confirm.status && !item.change.status" color="green">
                      mdi-calendar-check
                    </v-icon>
                    <v-icon v-else-if="item.change.status" color="orange">
                      mdi-calendar-edit
                    </v-icon>
                    <v-icon v-else color="red">
                      mdi-calendar-alert
                    </v-icon>
                  </v-list-item-icon>
                </v-list-item>
                <v-divider class="my-1" />
              </v-flex>
              <v-subheader v-if="meetingSent.length >= 1" class="justify-center sub">
                <b>Meeting Request</b>
              </v-subheader>
              <v-flex
                v-for="item in meetingSent"
                :key="item.id"
              >
                <v-list-item>
                  <v-list-item-icon v-if="!$vuetify.breakpoint.xsOnly">
                    <v-icon>
                      mdi-account-multiple
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content @click="meetingPicker(item)">
                    <v-list-item-title>
                      <v-chip color="grey blue lighten-1" outlined>
                        {{ item.projectName }}
                      </v-chip>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <small v-if="item.confirm.status && !item.change.status"><i class="confirmed">Confirmed by <br v-if="$vuetify.breakpoint.xsOnly"> <v-chip small outlined>{{ item.createdBy }}</v-chip></i></small>
                      <small v-if="item.change.status && $auth.user.sub !== item.change.uid"><v-icon color="orange" small>mdi-alert-outline</v-icon><i class="change">Please review the changes</i></small>
                      <small v-if="item.change.status && $auth.user.sub === item.change.uid"><v-icon color="orange" small>mdi-alert-outline</v-icon><i class="change">Awaiting Confirmation</i></small>
                      <small v-if="!item.confirm.status && item.host == $auth.user.sub"><i class="awaiting">Awaiting Response from <br v-if="$vuetify.breakpoint.xsOnly"> <v-chip small outlined>{{ item.createdBy }}</v-chip></i></small>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon v-if="item.confirm.status && !item.change.status" color="green">
                      mdi-calendar-check
                    </v-icon>
                    <v-icon v-else-if="item.change.status" color="orange">
                      mdi-calendar-edit
                    </v-icon>
                    <v-icon v-else color="red">
                      mdi-calendar-alert
                    </v-icon>
                  </v-list-item-icon>
                </v-list-item>
                <v-divider class="my-1" />
              </v-flex>
            </v-list>
          </v-flex>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog v-model="dialogMessage" ref="chat" persistent max-width="600">
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
                    class="mt-8 bg"
                    outlined
                  >
                    <v-chip
                      color="cyan darken-3"
                      class="mb-2 ml-10 mt-n7 ibm"
                      label
                    >
                      <b>You</b>
                    </v-chip>
                    <v-flex class="ibm mb-2 ml-2" text-left>
                      {{ message.text }}
                    </v-flex>
                  </v-card>
                  <v-card
                    v-else
                    max-width="250px"
                    class="mt-8 mx-auto bg2"
                    outlined
                  >
                    <v-chip
                      color="green darken-3"
                      class="mb-2 ml-10 mt-n7 ibm"
                    >
                      <b>{{ message.name }}</b>
                    </v-chip>
                    <v-flex class="ibm mb-2 ml-2" text-left>
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
            />
            <v-btn @click="send()">
              Send
            </v-btn>
          </v-form>
        </v-container>
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogMeeting" persistent max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogMeeting = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Meeting</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <DatePicker :dialog-meeting.sync="dialogMeeting" :selected-meeting.sync="selectedMeeting" />
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
  background-color: #00838F;
}
.bg2 {
  background-color: #2E7D32;
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
import DatePicker from '../components/DatePicker.vue'
export default {
  components: {
    DatePicker
  },
  data () {
    return {
      selectedMeeting: {},
      dialogMeeting: false,
      userColor: 'amber lighten-4',
      selectedMessage: {},
      dialogMessage: false,
      newMessage: {
        name: '',
        text: '',
        uid: ''
      },
      meetings: [],
      meetingSent: [],
      tab: null,
      interval: null
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile',
    read: 'messages/Read',
    newMessages: 'messages/getNewMessages',
    readMessages: 'messages/getReadMessages'
  }),
  mounted () {
    this.getMeetings()
    this.$store.dispatch('messages/getMessages')
    this.scrollDown()
    this.interval = setInterval(
      function () {
        this.getMeetings()
      }.bind(this),
      150000
    )
    if (this.profile.user_metadata && !this.profile.user_metadata.welcomeMsg) {
      this.$swal.fire({
        position: 'bottom-end',
        type: 'info',
        text: process.env.welcomeMsg,
        showConfirmButton: true,
        width: '22rem'
      }).then(() => {
        return this.$axios.$post('account/edit', { user_metadata: { welcomeMsg: true } })
      })
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
  methods: {
    scrollDown () {
      this.$nextTick(() => {
        const scrollDown = this.$refs.chat.$refs.dialog.querySelector('.scroll')
        if (scrollDown) {
          scrollDown.scrollTop = scrollDown.scrollHeight
        }
      })
    },
    getMeetings () {
      this.$axios.$get(`bid/getMeetings`).then((res) => {
        this.meetings = []
        this.meetingSent = []
        res.forEach((element) => {
          if (element.meeting.host === this.$auth.user.sub) {
            this.meetingSent.push(element)
          } else {
            this.meetings.push(element)
          }
        })
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
    meetingPicker (item) {
      this.selectedMeeting = item
      this.dialogMeeting = !this.dialogMeeting
    },
    send () {
      if (this.newMessage.text) {
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
    }
  }

}
</script>
