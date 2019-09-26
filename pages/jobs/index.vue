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
          <v-layout row wrap>
            <!--  Create Cards Based on Objects in an Array -->
            <v-flex v-for="job in jobs" :key="job._id" xs12 class="flexit">
              <v-card raised>
                <v-list subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title v-text="job.name" />
                    </v-list-item-content>
                    <v-list-item-content>
                      {{ job.description }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider />
                <v-list>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-chip v-for="item in job.skills" :key="item._id" color="primary" small>
                            {{ item.text }}
                          </v-chip>
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-chip v-if="job.budget" color="green" small>
                        Budget: ${{ job.budget }}
                      </v-chip>
                    </v-list-item>
                  </v-list>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<style scoped>
    .flexit {
        background-color: rgb(192, 192, 192)
    }
    .v-sheet.theme--dark {
        background-color: rgb(48, 63, 82)
    }
    .v-chip {
        margin-left: 5px;
        color: black
    }
</style>
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
