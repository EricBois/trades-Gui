<template>
  <v-layout wrap>
    <!-- job posting -->
    <v-flex xs12 text-center class="pa-2">
      <v-card max-width="750" class="mx-auto pa-4">
        <v-chip label>
          <h2 class="sub">
            Recent job postings
          </h2>
        </v-chip>
        <v-card
          max-width="700"
          class="mx-auto"
          elevation="15"
          shaped
          color="grey darken-2"
        >
          <v-flex xs12 class="ml-6 pa-2" text-left>
            <span>Job posting link and info</span>
          </v-flex>
        </v-card>
      </v-card>
    </v-flex>
    <!-- Latest news -->
    <v-flex xs12 text-center class="pa-2">
      <v-card max-width="750" class="mx-auto pa-4">
        <v-chip label>
          <h2 class="sub">
            Your Latest News
          </h2>
        </v-chip>
        <v-card
          max-width="700"
          class="mx-auto"
          elevation="15"
          shaped
          color="grey darken-2"
        >
          <v-flex xs12 class="ml-6 pa-2" text-left>
            <span>- News from api with link</span>
          </v-flex>
        </v-card>
      </v-card>
    </v-flex>
    <!-- Important Messages -->
    <v-flex xs12 text-center class="pa-2">
      <v-card max-width="750" class="mx-auto pa-4">
        <v-chip label>
          <h2 class="sub">
            Important messages
          </h2>
        </v-chip>
        <v-card
          max-width="700"
          class="mx-auto"
          elevation="15"
          shaped
          color="grey darken-2"
        >
          <v-flex xs12 class="ml-6 pa-2" text-center>
            <span>message goes here</span>
          </v-flex>
        </v-card>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<style scoped>
.sub {
  font-family: 'IBM Plex Sans', sans-serif;
  font-style: italic;
}
</style>
