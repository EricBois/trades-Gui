<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap elevation-6>
      <v-flex xs12 text-center>
        <v-avatar v-if="user.picture" size="170">
          <v-img class="img-circle elevation-6" aspect-ratio="1.4" :src="user.picture" />
        </v-avatar>
        <div class="name mt-4">
          {{ user.name }}
          <div class="bottomDiv">
            <a v-if="user.metadata.facebook" :href="user.metadata.facebook" target="_blank"><v-icon color="blue darken-1">mdi-facebook-box mdi-36px</v-icon></a>
            <a v-if="user.metadata.instagram" :href="user.metadata.instagram" target="_blank"><v-icon class="insta">mdi-instagram mdi-36px</v-icon></a>
            <a v-if="user.metadata.web" :href="user.metadata.web" target="_blank"><v-icon color="green">mdi-web mdi-36px</v-icon></a>
            <a v-if="user.metadata.phone" :href="phone" target="_blank"><v-icon color="teal">mdi-phone-classic mdi-36px</v-icon></a>
          </div>
        </div>
        <div class="mt-2">
          <v-chip v-for="item in user.metadata.skills" :key="item" color="primary" small>
            {{ item }}
          </v-chip>
          <br>
          <v-chip v-for="item in user.metadata.tickets" :key="item" color="teal" small>
            {{ item }}
          </v-chip>
          <br>
          <v-chip v-if="user.metadata.wcb">
            <v-icon color="green">
              mdi-check-decagram
            </v-icon>&nbsp; Wcb Coverage
          </v-chip>
          <v-chip v-if="user.metadata.liability">
            <v-icon color="green">
              mdi-check-decagram
            </v-icon>&nbsp; Liability Insurance
          </v-chip>
        </div>
      </v-flex>
      <v-flex xs12 description text-center>
        <p class="mt-2 pa-3 elevation-4">
          {{ user.metadata.description }}
        </p>
      </v-flex>
      <v-container class="mx-5 photo">
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
  </v-container>
</template>

<style scoped>
.bottomDiv{
  position:relative;
  bottom:15px;
}
a:link {
  text-decoration: none;
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
  font-family: "Righteous", cursive;
  font-size: 2.3em;
  transform: rotate(358deg);
  background-color: rgb(87, 88, 88);
  box-shadow: -1px 5px 14px 5px rgba(0,0,0,0.36);
}
.description {
  color: white;
  font-family: "Righteous", cursive;
}
.container {
  max-width: 1200px;
}
</style>

<script>
import ExpandableImage from '../components/ExpandableImage'
export default {
  components: {
    ExpandableImage
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      phone: ''
    }
  },
  created () {
    if (this.user.metadata.phone) {
      this.phone = `tel:${this.user.metadata.phone}`
    }
  }
}
</script>
