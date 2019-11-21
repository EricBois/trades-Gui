<template>
  <v-app dark>
    <v-layout align-center justify-center row fill-height>
      <v-flex v-if="error.statusCode === 404" xs12 text-center>
        <v-card raised class="mainTitle px-8 mx-3" height="400px">
          <v-layout align-center justify-center row fill-height>
            <v-icon color="error">
              mdi-alert-circle-outline mdi-48px
            </v-icon> Oops! Page not found ...&nbsp; <v-icon color="error">
              mdi-emoticon-sad-outline mdi-48px
            </v-icon>
          </v-layout>
          <v-btn to="/" color="cyan darken-3">
            Go back home
          </v-btn>
        </v-card>
      </v-flex>
      <v-flex v-else xs12 text-center>
        <v-card raised class="mainTitle px-8" height="400px">
          <v-layout align-center justify-center row fill-height>
            <v-icon color="error">
              mdi-alert-circle-outline mdi-48px
            </v-icon> Oops! Something went wrong..&nbsp; <v-icon color="error">
              mdi-emoticon-sad-outline mdi-48px
            </v-icon>
          </v-layout>
          <v-btn to="/" color="cyan darken-3">
            Go back home
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-app>
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
