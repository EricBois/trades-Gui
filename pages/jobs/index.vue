<template>
  <v-container>
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
    <v-card>
      <v-card-title>
        Job listings
        <div class="flex-grow-1" />
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details />
      </v-card-title>
      <v-data-table dense :headers="headers" :items="jobs" :search="search" />
    </v-card>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      search: '',
      jobs: [],
      headers: [
        {
          text: 'Project',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Type', value: 'type' },
        { text: 'Skills', value: 'Skills' },
        { text: 'Location', value: 'location' },
        { text: 'Budget', value: 'budget' }
      ]
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
      console.log(res)
    })
    console.log(this.jobs)
  }
}
</script>
