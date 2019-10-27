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
        <v-avatar size="170" v-if="user.picture" class="mt-10">
          <v-img class="img-circle elevation-6" aspect-ratio="1.4" :src="user.picture"></v-img>
        </v-avatar>
        <div class="name mt-4">{{user.name}}</div>
        <div>
          <v-chip v-for="item in user.metadata.skills" :key="item" color="primary" small>{{ item }}</v-chip>
          <br />
          <v-chip v-for="item in user.metadata.tickets" :key="item" color="green" small>{{ item }}</v-chip>
        </div>
      </v-flex>
      <v-flex xs12 description text-center>
        <p class="mt-2 pa-3 elevation-4">{{user.metadata.description}}</p>
      </v-flex>
      <!-- <v-flex xs12 v-if="photos && photos.length > 0">
        <v-carousel>
          <v-carousel-item
            @click="zoom(photo.link)"
            v-for="photo in photos"
            :key="photo._id"
            :src="photo.link"
          ></v-carousel-item>
        </v-carousel>
      </v-flex>-->
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
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
