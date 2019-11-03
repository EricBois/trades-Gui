<template>
  <v-container>
    <v-flex v-if="messages.length >= 1" xs12 sm8 offset-sm-2>
      <v-list subheader dense color="grey darken-3">
        <v-subheader class="justify-center sub"><b>New Messages</b></v-subheader>
        <v-flex
          v-for="item in messages"
          :key="item._id"
        >
          <v-list-item
            v-if="item.read.includes($auth.user.sub)"
          >
            <v-list-item-content @click="dialog(item)">
              <v-list-item-title text-center>
                No new messages&nbsp;<v-icon small>mdi-thumb-up-outline</v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="!item.read.includes($auth.user.sub)"
          >
            <v-list-item-icon v-if="!item.read.includes($auth.user.sub)">
              <v-icon color="red" @click="deleteMessage(item.id)">
                mdi-close-box
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content @click="dialog(item)">
              <v-list-item-title>
                <v-chip v-if="!item.read.includes($auth.user.sub)" color="green lighten-1" outlined>
                  {{ item.project_name }}
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle class="pl-3">
                <small><b> From: <u>{{ item.messages[item.messages.length - 1].name }} </u></b></small></br>
                <small v-if="item.messages[item.messages.length - 1].text.length <= 60">{{ item.messages[item.messages.length - 1].text }}</small>
                <small v-else>{{ item.messages[item.messages.length - 1].text.substring(0,60)+"..." }}</small>
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
      <v-divider />
      <v-list subheader dense color="grey darken-3">
        <v-subheader class="justify-center sub"><b>Read & Sent</b></v-subheader>
        <v-flex
          v-for="item in messages"
          :key="item._id"
        >
          <v-list-item
            v-if="!item.read.includes($auth.user.sub)"
          >
            <v-list-item-content @click="dialog(item)">
              <v-list-item-title>
                All Clear!
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="item.read.includes($auth.user.sub)"
          >
            <v-list-item-icon v-if="item.read.includes($auth.user.sub)">
              <v-icon color="red" @click="deleteMessage(item.id)">
                mdi-close-box
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content @click="dialog(item)">
              <v-list-item-title>
                <v-chip v-if="!read" color="green lighten-1" outlined>
                  {{ item.project_name }}
                </v-chip>
                <v-chip v-else color="grey blue lighten-1" outlined>
                  {{ item.project_name }}
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle class="pl-3">
                <small><b>From: <u>{{ item.messages[item.messages.length - 1].name }} </u></b></small></br>
                <small v-if="item.messages[item.messages.length - 1].text.length <= 60">{{ item.messages[item.messages.length - 1].text }}</small>
                <small v-else>{{ item.messages[item.messages.length - 1].text.substring(0,60)+"..." }}</small>
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
    <v-flex v-else xs12 sm8 offset-sm-2 text-center>
      <v-list subheader dense color="grey darken-3">
        <v-subheader class="justify-center"><b>No Messages Yet!</b>&nbsp;<v-icon small>mdi-emoticon-sad-outline</v-icon></v-subheader>
      </v-list>
    </v-flex>
    <!-- meetings -->
    <v-flex xs12 sm8 offset-sm-2>
      <v-divider class="my-5" />
      <v-list subheader dense color="blue-grey darken-3">
        <v-subheader v-if="meetings.length >= 1" class="justify-center sub"><b>Meeting Invites</b></v-subheader>
        <v-subheader v-else class="justify-center sub"><b>No Meeting Yet!</b>&nbsp;<v-icon small>mdi-emoticon-sad-outline</v-icon></v-subheader>
        <v-flex
          v-for="item in meetings"
          :key="item.id"
        >
          <v-list-item>
            <v-list-item-content @click="meetingPicker(item)">
              <v-list-item-title>
                <v-chip color="grey blue lighten-1" outlined>
                  {{ item.projectName }}
                </v-chip>
                  &nbsp;
              </v-list-item-title>
              <v-list-item-subtitle>
                <small v-if="item.confirm.status && !item.change.status"><i class="confirmed">Confirmed by <v-chip small outlined>{{ item.createdBy }}</v-chip></i></small>
                <small v-if="!item.confirm.status && !item.change.status"><i class="awaiting">New Meeting request from<v-chip small outlined>{{ item.contractor }}</v-chip></i></small>
                <small v-if="item.change.status && $auth.user.sub !== item.change.uid"><v-icon color="orange" small>mdi-alert-outline</v-icon><i class="change">Please review the changes</i></small>
                <small v-if="item.change.status && $auth.user.sub === item.change.uid"><v-icon color="orange" small>mdi-alert-outline</v-icon><i class="change">Awaiting Confirmation</i></small>
                <small v-if="!item.confirm.status && item.host == $auth.user.sub"><i class="awaiting">Awaiting Response from <v-chip small outlined>{{ item.createdBy }}</v-chip></i></small>
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
          <v-divider class="my-1"/>
        </v-flex>
        <v-subheader v-if="meetingSent.length >= 1" class="justify-center sub"><b>Meeting Request</b></v-subheader>
        <v-flex
          v-for="item in meetingSent"
          :key="item.id"
        >
          <v-list-item >
            <v-list-item-content @click="meetingPicker(item)">
              <v-list-item-title>
                <v-chip color="grey blue lighten-1" outlined>
                  {{ item.projectName }}
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle>
                <small v-if="item.confirm.status && !item.change.status"><i class="confirmed">Confirmed by <v-chip small outlined>{{ item.createdBy }}</v-chip></i></small>
                <small v-if="item.change.status && $auth.user.sub !== item.change.uid"><v-icon color="orange" small>mdi-alert-outline</v-icon><i class="change">Please review the changes</i></small>
                <small v-if="item.change.status && $auth.user.sub === item.change.uid"><v-icon color="orange" small>mdi-alert-outline</v-icon><i class="change">Awaiting Confirmation</i></small>
                <small v-if="!item.confirm.status && item.host == $auth.user.sub"><i class="awaiting">Awaiting Response from <v-chip small outlined>{{ item.createdBy }}</v-chip></i></small>
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
          <v-divider class="my-1"/>
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
      messages: [],
      dialogMessage: false,
      intervalMsg: null,
      newMessage: {
        name: '',
        text: ''
      },
      meetings: [],
      meetingSent: []
    }
  },
  computed: mapGetters({
    read: 'read/get'
  }),
  created () {
    this.$axios.$get(`bid/getMeetings`).then((res) => {
      res.forEach((element) => {
        if (element.meeting.host === this.$auth.user.sub) {
          this.meetingSent.push(element)
        } else {
          this.meetings.push(element)
        }
      })
    })
    this.getMessages()
    this.intervalMsg = setInterval(() => { this.getMessages() }, 80000)
  },
  beforeDestroy () {
    clearInterval(this.intervalMsg)
  },
  methods: {
    getMessages () {
      this.$axios
        .$get(`message/get`)
        .then((res) => {
          this.messages = []
          for (const key in res) {
            const message = res[key]
            message._id = key
            if (!message.delete.includes(this.$auth.user.sub)) {
              this.messages.push(message)
              if (!message.read.includes(this.$auth.user.sub)) {
                this.$store.commit('read/add', false)
              }
            }
          }
        }).catch(() => {
          this.$router.push('/')
        })
    },
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
    meetingPicker (item) {
      this.selectedMeeting = item
      this.dialogMeeting = !this.dialogMeeting
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
