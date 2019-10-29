<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap elevation-6>
      <v-flex xs12 text-center>
        <v-avatar v-if="user.picture" size="170">
          <v-img class="img-circle elevation-6" aspect-ratio="1.4" :src="user.picture" />
        </v-avatar>
        <div class="name mt-4">
          {{ user.name }}
          <a v-if="user.metadata.web" :href="user.metadata.web" target="_blank"><v-icon color="orange lighten-4">mdi-web</v-icon></a>
          <a v-if="user.metadata.phone" :href="phone" target="_blank"><v-icon color="orange lighten-4">mdi-phone</v-icon></a>
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
