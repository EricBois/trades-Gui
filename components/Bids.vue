<template>
  <v-container>
    {{ bids }}
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
