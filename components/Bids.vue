<template>
  <v-container>
    <v-card
      v-for="bid in bids"
      :key="bid._id"
      color="grey darken-2"
      class="mt-2 pa-1"
      raised
      shaped
    >
      <v-layout wrap>
        <v-flex xs8 sm5 class="pl-4">
          {{ bid.createdBy }}
        </v-flex>
        <v-flex v-if="$vuetify.breakpoint.smAndUp" sm4 text-center>
          {{ bid.trade }}
        </v-flex>
        <v-flex xs4 sm3 text-center>
          ${{ bid.price }}
        </v-flex>
      </v-layout>
    </v-card>
    <!-- <v-flex xs12 class="mt-12">
      {{ bids }}
    </v-flex> -->
  </v-container>
</template>
<script>
export default {
  props: {
    bids: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  }
}
</script>
