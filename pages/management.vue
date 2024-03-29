<template>
  <v-container>
    <v-layout wrap>
      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        bottom
      >
        {{ snackbarText }}
        <v-icon v-if="snackbarColor.includes('red')">
          mdi-alert-outline
        </v-icon>
        <v-icon v-else>
          mdi-check-circle-outline
        </v-icon>
      </v-snackbar>
      <v-flex xs12 text-center>
        <v-card class="mx-auto" max-width="900">
          <v-data-table
            :headers="tableHeaders"
            :items="codes"
            :expanded.sync="expanded"
            sort-by="created[-1]"
            class="elevation-1"
            item-key="code"
            show-expand
            single-expand
          >
            <template v-slot:top>
              <v-toolbar flat color="dark">
                <v-toolbar-title>Access Codes</v-toolbar-title>
                <v-divider
                  class="mx-4"
                  inset
                  vertical
                />
                <v-spacer />
                <template>
                  <v-btn @click="gencode" color="primary" dark class="mb-2">
                    <v-icon class="mr-2">
                      mdi-sync
                    </v-icon>
                    Generate Code
                  </v-btn>
                </template>
              </v-toolbar>
            </template>
            <template v-slot:item.code="{ item }">
              <v-chip v-if="!item.used" label color="blue darken-3">
                *****
              </v-chip>
              <v-chip v-else @click="copy(item.code)" label color="blue darken-3">
                <v-icon class="mr-2">
                  mdi-content-copy
                </v-icon>
                {{ item.code }}
              </v-chip>
            </template>
            <template v-slot:item.created="{ item }">
              <v-chip small color="amber lighten-3" outlined label>
                {{ fromNow(item.created) }}
              </v-chip>
            </template>
            <template v-slot:item.user="{ item }">
              <v-chip dark>
                {{ item.user }}
              </v-chip>
            </template>
            <template v-slot:item.used="{ item }">
              <v-btn v-if="item.used" icon large color="green ligthen-1" dark>
                <v-icon>mdi-check-circle-outline</v-icon>
              </v-btn>
            </template>
            <template v-slot:expanded-item="{ item }">
              <td colspan="2">
                <v-card v-if="item.note" flat>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="body-2 mb-1">
                        <u>Recipient</u>
                      </v-list-item-title>
                      <v-list-item-subtitle class="caption">
                        {{ item.note }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </td>
              <td colspan="2">
                <v-card v-if="item.userType" flat>
                  <v-list-item two-line>
                    <v-list-item-content>
                      <v-list-item-title class="body-2 mb-1">
                        <u>User Type</u>
                      </v-list-item-title>
                      <v-list-item-subtitle class="caption">
                        {{ item.userType }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-card>
              </td>
              <td colspan="1">
                <v-btn @click="deleteCode(item.code)" small color="red darken-3">
                  Delete
                </v-btn>
              </td>
            </template>
            <template v-slot:item.action="{ item }">
              <v-chip v-if="!item.used" @click="makeSure(item.code)" color="blue-grey darken-2" label>
                <v-icon class="mr-2">
                  mdi-cursor-default-click
                </v-icon>
                Use This Code
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Please Confirm
        </v-card-title>

        <v-card-text>
          Are you going to use or give this code away ?
          <v-text-field v-model="note" class="mt-2" label="Recipient name? " />
          <v-select
            v-model="userType"
            :items="userTypes"
            label="User type"
            outlined
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            @click="dialog = false"
            color="orange darken-3"
            text
          >
            No
          </v-btn>

          <v-btn
            @click="used(currentCode)"
            color="green darken-1"
            text
          >
            Yes, i will!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
export default {
  data () {
    return {
      expanded: [],
      dialog: false,
      currentCode: '',
      snackbar: false,
      snackbarColor: 'green darken-3',
      snackbarText: '',
      alert: false,
      errorMsg: '',
      codes: [],
      note: '',
      userType: '',
      userTypes: ['User', 'Company', 'Ambassador'],
      tableHeaders: [
        {
          text: 'Codes',
          align: 'left',
          sortable: false,
          value: 'code'
        },
        { text: 'Created By', value: 'user' },
        { text: 'Created', value: 'created' },
        { text: 'Already Used', value: 'used' },
        { text: 'Action', value: 'action', sortable: false }
      ]
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  mounted () {
    dayjs.extend(relativeTime)
    if (this.profile && (!this.profile.app_metadata || !this.profile.app_metadata.admin === true)) {
      this.$router.push('/')
    } else {
      this.getCodes()
    }
  },
  methods: {
    fromNow (date) {
      return dayjs(date).fromNow()
    },
    makeSure (code) {
      this.dialog = true
      this.currentCode = code
    },
    used () {
      this.$axios.$post('account/usedCode', { code: this.currentCode, note: this.note, userType: this.userType }).then((res) => {
        this.getCodes()
        this.dialog = false
      })
    },
    getCodes () {
      this.$axios.$get('account/codes').then((res) => {
        this.codes = res
      })
    },
    deleteCode (code) {
      this.$axios.$post('account/delCode', { code }).then((res) => {
        this.getCodes()
      })
    },
    gencode () {
      this.$axios.$post('account/genCode', { name: this.$auth.user.name }).then((res) => {
        this.getCodes()
      })
    },
    async copy (text) {
      try {
        await this.$copyText(text)
        this.snackbarText = 'Successfully Copied!'
        this.snackbar = true
      } catch (e) {
        this.snackbarText = `Something went wrong!`
        this.snackbar = true
      }
    }
  }
}
</script>
