<template>
  <v-layout wrap>
    <v-flex v-if="error.length > 0" xs12 text-center class="mb-5">
      <h2 class="error sub">
        {{ error }}
      </h2>
    </v-flex>
    <v-flex xs12 text-center>
      <v-card max-width="650" class="mx-auto pa-6">
        <v-card max-width="600" min-height="100" class="mx-auto" elevation="15" shaped>
          <div v-if="error.statusCode === 404">
            <v-icon color="error">
              mdi-alert-circle-outline mdi-48px
            </v-icon> Oops! Page not found ...&nbsp; <v-icon color="error">
              mdi-emoticon-sad-outline mdi-48px
            </v-icon>
          </div>
          <div v-else>
            <v-icon color="error">
              mdi-alert-circle-outline mdi-48px
            </v-icon> Oops! Something went wrong..&nbsp; <v-icon color="error">
              mdi-emoticon-sad-outline mdi-48px
            </v-icon>
          </div><v-btn to="/" color="blue darken-3">
            <v-icon class="mr-2">
              mdi-arrow-left-circle
            </v-icon>
            Go back home
          </v-btn>
        </v-card>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  }
}
</script>

<style scoped>
.mainTitle {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 2.3em;
      font-weight: bold;
      font-style: italic;
    }
h1 {
  font-size: 20px;
}
</style>
