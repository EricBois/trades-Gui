<template>
  <v-container>
    <v-card
      max-width="844"
      class="mx-auto"
      raised
    >
      <v-layout row wrap class="pa-3">
        <v-flex xs12>
          <div>
            <v-chip
              class="ma-2"
              color="grey">{{project.created}}</v-chip>
            <v-chip
              class="ma-2"
              color="orange"
            >
              {{ project.jobType }}<v-icon right>
                mdi-star
              </v-icon>
            </v-chip><v-chip v-if="project.budget" outlined color="green">
              <b>Budget: ${{ project.budget }}</b>
            </v-chip>
          </div>
          <div class="headline text-center">
            {{ project.name }}
            <div v-if="project.createdBy" class="caption grey--text">
              Project by: <u>{{ project.createdBy }}</u>
            </div>
            <div>
              <v-chip v-for="item in project.skills" :key="item._id" color="primary" small>
                {{ item.text }}
              </v-chip><v-chip v-for="item in project.tickets" :key="item._id" color="yellow" small>
                {{ item.text }}
              </v-chip>
            </div>
          </div>
        </v-flex>
        <v-flex xs12>
          <v-card-text class="text-center">
            {{ project.description }}
          </v-card-text>
        </v-flex>
        <v-flex xs12>
          <v-card-actions class="justify-center">
            <v-btn
              color="green"
            >
              Place a Bid
            </v-btn>
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>
<style scoped>
    .v-chip {
        margin-left: 5px;
        color: black
    }
</style>
<script>
export default {
  data () {
    return {
      project: {}
    }
  },
  mounted () {
    // get the job with the id
    this.$axios.$get(`job/view/${this.$route.params.id}`).then((res) => {
      this.project = res
      this.project.created = new Date(res.created).toISOString().slice(0, 10)
    })
  }
}
</script>
