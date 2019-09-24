<template>
  <v-layout justify-center>
    <v-btn
      color="amber darken-4"
      dark
      absolute
      middle
      right
      fab
      large
      to="jobs/create"
    >
      <v-icon>mdi-plus-box</v-icon>
    </v-btn>
    <!-- Make Main Card Take up 1/2 the Page by Wrapping in Flex -->
    <v-flex xs10 class="mt-3">
      <v-card>
        <!-- Push Contents In and Put Space Between Flex Items Using Grid List -->
        <v-container fluid grid-list-lg>
          <h1>Job Listings </h1>
          <v-layout row wrap >
            <!--  Create Cards Based on Objects in an Array -->
            <v-flex v-for="job in jobs" :key="job._id" xs12>
              <v-card raised>
                <v-card-title>{{job.name}} <v-spacer></v-spacer> <v-chip small v-if="job.budget">Budget: ${{job.budget}}</v-chip> </v-card-title>
                <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="body-2">{{job.description}}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
                <v-card-text>
                    <v-chip color="primary" small v-for="item in job.skills" :key="item._id"> {{item.text}}</v-chip>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data () {
    return {
      search: '',
      jobs: []
    }
  },
  mounted () {
    this.$axios.$get('job/get').then((res) => {
      const data = res
      for (const key in data) {
        const job = data[key]
        job._id = key
        this.jobs.push(job)
      }
    })
    console.log(this.jobs)
  }
}
</script>
