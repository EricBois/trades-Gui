<template>
  <v-container>
    <v-card flat color="#303030">
      <!-- meetings -->
      <v-flex xs12 sm8 offset-sm-2>
        <v-list subheader dense color="blue-grey darken-3">
          <v-subheader class="justify-center sub">
            <b>New meeting activity</b>
          </v-subheader>
          <v-flex v-if="meetingNew.length < 1" text-center class="ibm">
            <span>No new meeting activity</span>
          </v-flex>
          <v-flex
            v-for="item in meetingNew"
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
                  <v-chip color="grey blue lighten-1" label outlined>
                    {{ item.projectName }}
                  </v-chip>
                        &nbsp;
                </v-list-item-title>
                <v-list-item-subtitle>
                  <small v-if="!item.confirm.status && !item.change.status"><i class="awaiting">New Meeting request from <br v-if="$vuetify.breakpoint.xsOnly"><v-chip class="ml-1" x-small label outlined>{{ item.contractor }}</v-chip></i></small>
                  <small v-if="item.change.status && $auth.user.sub !== item.change.uid"><v-icon class="mr-2 change" small>mdi-alert-outline</v-icon><i class="change">Please review the changes</i></small>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon v-if="item.confirm.status && !item.change.status" class="confirmed">
                  mdi-calendar-check
                </v-icon>
                <v-icon v-else-if="item.change.status && $auth.user.sub !== item.change.uid" class="change">
                  mdi-calendar-edit
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-divider class="my-1" />
          </v-flex>
          <v-subheader v-if="meetingAwait.length >= 1" class="justify-center sub">
            <b>Awaiting Confirmation</b>
          </v-subheader>
          <v-flex
            v-for="item in meetingAwait"
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
                  <v-chip color="grey blue lighten-1" label outlined>
                    {{ item.projectName }}
                  </v-chip>
                        &nbsp;
                </v-list-item-title>
                <v-list-item-subtitle>
                  <small v-if="item.change.status && $auth.user.sub === item.change.uid"><v-icon class="mr-2 awaitConfirm" small>mdi-clock-outline</v-icon><i class="awaitConfirm">Awaiting Confirmation from <br v-if="$vuetify.breakpoint.xsOnly"> <v-chip class="ml-1" x-small label outlined>{{ (item.host !== $auth.user.sub) ? item.contractor : item.createdBy }}</v-chip></i></small>
                  <small v-if="!item.confirm.status && item.host === $auth.user.sub"><i class="awaiting">Awaiting Response from <br v-if="$vuetify.breakpoint.xsOnly"><v-chip class="ml-1" x-small label outlined>{{ (item.host !== $auth.user.sub) ? item.contractor : item.createdBy }}</v-chip></i></small>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon v-if="item.change.status && $auth.user.sub === item.change.uid" class="awaitConfirm">
                  mdi-clock-outline
                </v-icon>
                <v-icon v-else-if="!item.confirm.status && item.host == $auth.user.sub" class="awaiting">
                  mdi-clock-outline
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-divider class="my-1" />
          </v-flex>
          <v-subheader v-if="meetingConfirmed.length >= 1" class="justify-center sub">
            <b>Confirmed Meetings</b>
          </v-subheader>
          <v-flex
            v-for="item in meetingConfirmed"
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
                  <v-chip color="grey blue lighten-1" label outlined>
                    {{ item.projectName }}
                  </v-chip>
                        &nbsp;
                </v-list-item-title>
                <v-list-item-subtitle>
                  <small v-if="item.confirm.status && !item.change.status"><i class="confirmed">Confirmed with <br v-if="$vuetify.breakpoint.xsOnly"><v-chip class="ml-1" x-small label outlined>{{ (item.host !== $auth.user.sub) ? item.contractor : item.createdBy }}</v-chip></i></small>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon>
                <v-icon v-if="item.confirm.status && !item.change.status" class="confirmed">
                  mdi-calendar-check
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
            <v-divider class="my-1" />
          </v-flex>
        </v-list>
      </v-flex>
    </v-card>
    <v-dialog v-model="dialogMeeting" max-width="800">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Meeting
          </v-toolbar-title>
          <v-btn icon dark @click="dialogMeeting = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <DatePicker :dialog-meeting.sync="dialogMeeting" :selected-meeting.sync="selectedMeeting" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog v-model="alert" persistent max-width="500">
      <v-card>
        <v-flex xs12>
          <v-alert
            icon="mdi-information-outline"
            prominent
            transition="scale-transition"
            text
            :type="alertInfo"
          >
            {{ alertText }}
          </v-alert>
        </v-flex>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" text @click="alert = false">
            Ok !
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.confirmed {
  color:rgb(21, 170, 21);
}
.awaiting {
  color: rgb(207, 176, 39);
}
.awaitConfirm {
  color:rgb(117, 172, 81)
}
.change {
  color: rgb(245, 255, 104);
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
      alert: false,
      alertInfo: 'info',
      alertText: '',
      selectedMeeting: {},
      dialogMeeting: false,
      meetings: [],
      meetingSent: [],
      meetingIds: [],
      meetingNew: [],
      meetingAwait: [],
      meetingConfirmed: [],
      interval: null
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  watch: {
    selectedMeeting () {
      this.getMeetings()
    }
  },
  mounted () {
    this.getMeetings()
    this.interval = setInterval(
      function () {
        this.getMeetings()
      }.bind(this),
      150000
    )
    if (this.profile.user_metadata && !this.profile.user_metadata.welcomeMeeting) {
      this.alertText = process.env.welcomeMeeting
      this.alert = true
      this.$axios.$post('account/edit', { user_metadata: { welcomeMeeting: true } })
    }
  },
  methods: {
    async getMeetings () {
      await this.$axios.$get(`bid/getMeetings`).then((res) => {
        this.meetingNew = []
        this.meetingConfirmed = []
        this.meetingAwait = []
        this.meetingIds = []
        res.forEach((item) => {
          this.meetingIds.push(item._id)

          // check for new meeting request or changes
          if ((item.change.status && this.$auth.user.sub !== item.change.uid) || (!item.confirm.status && item.host !== this.$auth.user.sub)) {
            this.meetingNew.push(item)
          } else if (item.confirm.status && !item.change.status) {
            this.meetingConfirmed.push(item)
          } else {
            this.meetingAwait.push(item)
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
