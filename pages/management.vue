<template>
  <v-container>
    <v-layout wrap>
      <v-flex xs12 text-center>
        <v-card class="mx-auto" max-width="800">
          <v-data-table
            :headers="headers"
            :items="codes"
            sort-by="created[-1]"
            class="elevation-1"
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
                  <v-btn color="primary" dark class="mb-2" @click="gencode">
                    <v-icon class="mr-2">
                      mdi-sync
                    </v-icon>
                    Generate Code
                  </v-btn>
                </template>
              </v-toolbar>
            </template>
            <template v-slot:item.used="{ item }">
              <v-btn v-if="item.used" icon large color="green ligthen-1" dark>
                <v-icon>mdi-check-circle-outline</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.action="{ item }">
              <v-chip v-if="!item.used" color="blue-grey darken-2" label @click="used(item.code)">
                <v-icon class="mr-2">
                  mdi-checkbox-marked-circle-outline
                </v-icon>
                Use Code
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      codes: [],
      headers: [
        {
          text: 'Code',
          align: 'left',
          sortable: false,
          value: 'code'
        },
        { text: 'Created By', value: 'user' },
        { text: 'Used', value: 'used' },
        { text: 'Sent', value: 'action', sortable: false }
      ]
    }
  },
  computed: mapGetters({
    profile: 'profile/getProfile'
  }),
  mounted () {
    if (this.profile && (!this.profile.app_metadata || !this.profile.app_metadata.admin === true)) {
      this.$router.push('/')
    } else {
      this.getCodes()
    }
  },
  methods: {
    used (code) {
      this.$axios.$post('account/usedCode', { code }).then((res) => {
        this.getCodes()
      })
    },
    getCodes () {
      this.$axios.$get('account/codes').then((res) => {
        this.codes = res
      })
    },
    gencode () {
      this.$axios.$post('account/genCode', { name: this.$auth.user.name }).then((res) => {
        this.getCodes()
      })
    }
  }
}
</script>
