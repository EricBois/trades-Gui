<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap elevation-6>
      <v-flex xs12 text-center>
        <v-avatar v-if="user.picture" size="170">
          <v-img class="img-circle elevation-6" aspect-ratio="1.4" :src="user.picture" />
        </v-avatar>
        <div class="name mt-4">
          {{ user.name }}
        </div>
        <div class="mt-2">
          <a v-if="user.metadata && user.metadata.facebook" :href="user.metadata.facebook" target="_blank"><v-icon class="circle-icon" color="blue darken-1">mdi-facebook-box mdi-36px</v-icon></a>
          <a v-if="user.metadata && user.metadata.instagram" :href="user.metadata.instagram" target="_blank"><v-icon class="instagram">mdi-instagram mdi-36px</v-icon></a>
          <v-icon class="circle-icon" color="blue darken-1" @click="dialogMessage = !dialogMessage">
            mdi-message-text mdi-36px
          </v-icon>
          <a v-if="user.metadata && user.metadata.web" :href="user.metadata.web" target="_blank"><v-icon class="circle-icon" color="green">mdi-web mdi-36px</v-icon></a>
          <a v-if="user.metadata && user.metadata.phone" :href="phone"><v-icon class="circle-icon" color="teal">mdi-phone-classic mdi-36px</v-icon></a>
        </div>
      </v-flex>
      <v-flex v-if="user.metadata && user.metadata.skills && user.metadata.skills.length > 0" xs12 sm6 text-center>
        <div class="sub">
          Skills
          <v-divider class="mx-10 pt-1" />
        </div>
        <v-chip
          v-for="item in user.metadata.skills"
          :key="item"
          color="cyan lighten-4"
          x-small
          class="mr-1"
          outlined
          label
        >
          {{ item }}
        </v-chip>
      </v-flex>
      <v-flex v-if="user.metadata && user.metadata.tickets" xs12 sm6 text-center>
        <div class="sub">
          Tickets
          <v-divider class="mx-10 pt-1" />
        </div>
        <v-chip
          v-for="item in user.metadata.tickets"
          :key="item"
          color="orange lighten-3"
          x-small
          class="mr-1"
          outlined
          label
        >
          {{ item }}
        </v-chip>
      </v-flex>
      <v-flex xs12 text-center>
        <v-chip v-if="user.metadata && user.metadata.wcb" small>
          <v-icon small color="green">
            mdi-check-decagram
          </v-icon>&nbsp; Wcb Coverage
        </v-chip>
        <v-chip v-if="user.metadata && user.metadata.liability" small>
          <v-icon small color="green">
            mdi-check-decagram
          </v-icon>&nbsp; Liability Insurance
        </v-chip>
      </v-flex>
      <v-flex v-if="user.metadata && user.metadata.description" xs12 class="mt-n4" text-center>
        <p class=" pa-1 elevation-2 description">
          {{ user.metadata.description }}
        </p>
      </v-flex>
      <v-flex xs12 text-center>
        <v-btn v-if="user.uid !== $auth.user.sub && !alreadyInTeam " class="mt-n6" color="blue darken-4" @click="addToTeam()">
          <v-icon class="mr-2">
            mdi-account-plus-outline
          </v-icon> Team
        </v-btn>
      </v-flex>
      <v-container v-if="user.photos" class="mx-5 photo">
        <v-layout row wrap class="pa-3">
          <v-flex
            v-for="img in user.photos.photos"
            :key="img.id"
            xs12
            sm4
            md3
            class="pa-4"
          >
            <v-card>
              <ExpandableImage class="image" :src="img" max-width="400" contain />
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
    <v-dialog v-model="dialogMessage" max-width="600">
      <v-card class="px-3">
        <v-toolbar dark color="blue">
          <v-btn icon dark @click="dialogMessage = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Messages</v-toolbar-title>
          <div class="flex-grow-1" />
        </v-toolbar>
        <Message :dialog-message.sync="dialogMessage" :user="user" />
        <v-divider />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.circle-icon {
    background: white;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    text-align: center;
    line-height: 100px;
    vertical-align: middle;
    padding: 25px;
}
a:link {
  text-decoration: none;
}
.instagram{ width:25px; height:25px;
  border-radius: 50%;
    text-align: center;
    line-height: 100px;
    vertical-align: middle;
    padding: 25px;
  background: #f09433;
  background: -moz-linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f09433', endColorstr='#bc1888',GradientType=1 );
}
.insta {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
  -webkit-background-clip: text;
          /* Also define standard property for compatibility */
          background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 200px; /* change this to change the size*/
}
.img-circle {
  border-radius: 20%;
}
.wrap {
  background-color: rgb(94, 91, 91);
}
.name {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 2.3em;
  transform: rotate(358deg);
  background-color: rgb(87, 88, 88);
  box-shadow: -1px 5px 14px 5px rgba(0,0,0,0.36);
  max-width: 400px;
  margin: 0 auto;
}
.sub {
  transform: rotate(359deg);
  margin: 0 auto;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: bold;
}
.description {
  color: white;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.8em;
}
.container {
  max-width: 1200px;
}
</style>

<script>
import { mapGetters } from 'vuex'
import ExpandableImage from '../components/ExpandableImage'
import Message from '../components/Message.vue'
export default {
  components: {
    ExpandableImage,
    Message
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      alreadyInTeam: false,
      dialogMessage: false,
      phone: ''
    }
  },
  computed: mapGetters({
    team: 'team/getTeam'
  }),
  watch: {
    user () {
      this.alreadyInTeam = false
      // make sure user isn't in team already
      this.team.forEach((member) => {
        if (member.uid === this.user.uid) {
          this.alreadyInTeam = true
        }
      })
    },
    team () {
      this.alreadyInTeam = false
      // make sure user isn't in team already
      if (this.team) {
        this.team.forEach((member) => {
          if (member.uid === this.user.uid) {
            this.alreadyInTeam = true
          }
        })
      }
    }
  },
  created () {
    if (this.user.metadata && this.user.metadata.phone) {
      this.phone = `tel:${this.user.metadata.phone}`
    }
    if (this.user.user_metadata) {
      this.user.metadata = this.user.user_metadata
      this.user.uid = this.user.user_id
    }
    if (this.team) {
      // make sure user isn't in team already
      this.team.forEach((member) => {
        if (member.uid === this.user.uid) {
          this.alreadyInTeam = true
        }
      })
    }
  },
  methods: {
    addToTeam () {
      this.$store.commit('team/addMember', {
        uid: this.user.uid, // ID
        name: this.user.name,
        picture: this.user.picture,
        metadata: this.user.metadata
      })
      this.$store.dispatch('team/saveTeam')
    }
  }
}
</script>
