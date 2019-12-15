<template>
  <v-container>
    <v-card flat color="#303030">
      <!-- meetings -->
      <v-flex xs12 sm8 offset-sm-2>
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
      meetings: [],
      meetingSent: [],
      meetingIds: [],
      interval: null
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  mounted () {
    this.getMeetings()
    this.interval = setInterval(
      function () {
        this.getMeetings()
      }.bind(this),
      150000
    )
    if (this.profile.user_metadata && !this.profile.user_metadata.welcomeMeeting) {
      this.$swal.fire({
        position: 'bottom-end',
        type: 'info',
        text: process.env.welcomeMeeting,
        showConfirmButton: true,
        width: '22rem'
      }).then(() => {
        return this.$axios.$post('account/edit', { user_metadata: { welcomeMeeting: true } })
      })
    }
  },
  methods: {
    async getMeetings () {
      await this.$axios.$get(`bid/getMeetings`).then((res) => {
        this.meetings = []
        this.meetingSent = []
        this.meetingIds = []
        res.forEach((element) => {
          this.meetingIds.push(element._id)
          if (element.meeting.host === this.$auth.user.sub) {
            this.meetingSent.push(element)
          } else {
            this.meetings.push(element)
          }
        })
      })
      await this.$store.dispatch('notifications/deleteBulkNotification', this.meetingIds)
    },
    meetingPicker (item) {
      this.selectedMeeting = item
      this.dialogMeeting = !this.dialogMeeting
    }
  }

}
</script>
