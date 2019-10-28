<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap elevation-6>
      <v-btn
        v-if="user.metadata.wcb"
        class="ma-1 pr-5"
        text
        absolute
        middle
        right
        fab
        large
      >
        <v-icon>mdi-check-decagram</v-icon>&nbsp; Wcb
      </v-btn>
      <v-btn
        v-if="user.metadata.liability"
        class="ma-1 pl-10"
        text
        absolute
        middle
        left
        fab
        large
      >
        <v-icon>mdi-check-decagram</v-icon>&nbsp; Liability
      </v-btn>
      <v-flex xs12 text-center>
        <v-avatar v-if="user.picture" size="170" class="mt-10">
          <v-img class="img-circle elevation-6" aspect-ratio="1.4" :src="user.picture" />
        </v-avatar>
        <div class="name mt-4">
          {{ user.name }}
        </div>
        <div>
          <v-chip v-for="item in user.metadata.skills" :key="item" color="primary" small>
            {{ item }}
          </v-chip>
          <br>
          <v-chip v-for="item in user.metadata.tickets" :key="item" color="green" small>
            {{ item }}
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
  background-color: rgb(124, 128, 133);
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
  }
}
</script>
