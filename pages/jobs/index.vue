<template>
  <v-container class="mx-5">
    <v-card v-for="project in jobs" :key="project.id" raised ripple :to="job+project.id">
      <v-layout row wrap class="pa-3">
        <v-flex xs12 md4 mx-3>
          <div class="caption grey--text">
            <v-chip outlined small color="grey">
              Posted {{ $moment(project.Created).fromNow() }}
            </v-chip>
          </div>
          <div>
            {{ project.name }}<v-chip
              class="ma-2"
              color="orange"
            >
              {{ project.jobType }}<v-icon right>
                mdi-star
              </v-icon>
            </v-chip>
          </div>
        </v-flex>
        <v-flex xs8 md4>
          <div class="caption grey--text">
            Description
          </div>
          <div>{{ project.description }}</div>
        </v-flex>
        <v-flex xs4 md3>
          <div class="caption grey--text">
            Budget
          </div>
          <v-chip v-if="project.budget" outlined color="green">
            <b>${{ project.budget }}</b>
          </v-chip>
        </v-flex>
        <v-flex xs8 mt-2>
          <v-chip v-for="item in project.skills" :key="item._id" color="primary" small>
            {{ item.text }}
          </v-chip>
        </v-flex>
        <v-flex xs4>
          <v-btn v-if="project.wcb" class="ma-1" x-small text>
            <v-icon>mdi-check-decagram</v-icon>&nbsp; Wcb
          </v-btn><v-btn v-if="project.liability" class="ma-1" x-small text>
            <v-icon>mdi-check-decagram</v-icon>&nbsp;Liability
          </v-btn>
        </v-flex>
      </v-layout>
      <v-divider dark />
    </v-card>
  </v-container>
</template>
<style scoped>
    .flexit {
        background-color: rgb(192, 192, 192)
    }
    .container {
        background-color: rgb(94, 104, 117)
    }
    .v-chip {
        margin-left: 5px;
        color: black
    }
    .v-divider {
    display: block !important;
    flex: 1 1 0px !important;
    max-width: 100% !important;
    border: solid !important;
    border-width: thin 0 0 0 !important;
}
</style>
<script>
export default {
  data () {
    return {
      job: 'job/',
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
    }).catch(() => {
      this.$router.push('/')
    })
  }
}
</script>
