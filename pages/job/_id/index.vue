<template>
  <v-layout>
    <h1> {{project}}</h1>
  </v-layout>
</template>
<script>
export default {
  data () {
    return {
      project: {}
    }
  },
  mounted () {
    // get the job with the id as seend below
    // console.log(this.$route.params.id)
    this.$axios.$get(`job/view/${this.$route.params.id}`).then((res) => {
      this.project = res
    })
  }
}
</script>
