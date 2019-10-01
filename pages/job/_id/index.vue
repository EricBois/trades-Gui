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
              class="mb-4"
              color="grey"
              outlined
            >
              Posted  {{ $moment(project.Created).fromNow() }}
            </v-chip>
          </div>
          <div>
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
            <div v-if="project.createdBy" class="caption grey--text mb-2">
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
              v-if="project.user !== this.$auth.user.sub"
              class="ma-1"
              color="green"
              small
            >
              Place a Bid
            </v-btn>
            <v-btn
              v-else
              class="ma-1"
              color="green"
              small
            >
              View Bids
            </v-btn>
            <v-btn
              v-if="project.user === this.$auth.user.sub"
              class="blue-grey lighten-1 ma-1"
              small
              :to="job+project.id+edit"
            >
              Edit
            </v-btn>
            <v-btn
              v-if="project.user === this.$auth.user.sub"
              class="red darken-4 ma-1"
              small
              @click="deleteProject(project.id)"
            >
              Delete
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
      project: {},
      job: '../job/',
      edit: '/edit'
    }
  },
  mounted () {
    // get the job with the id
    this.$axios.$get(`job/view/${this.$route.params.id}`).then((res) => {
      this.project = res
    }).catch(() => {
      // handle this error here
      this.$router.push(`../jobs`)
    })
  },
  methods: {
    deleteProject (id) {
      this.$axios.$post(`job/delete/${id}`).then((res) => {
        //  direct to jobs page
        this.$router.push(`../../user/projects`)
      })
    }
  }
}
</script>
