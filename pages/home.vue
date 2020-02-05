<template>
  <v-layout wrap>
    <!-- Messages -->
    <v-flex xs12 sm5 offset-sm-1 text-center class="pa-2">
      <v-card class="mx-auto pa-4">
        <v-chip label>
          <h2 class="sub">
            Messages
          </h2>
        </v-chip>
        <v-card
          class="mx-auto"
          elevation="15"
          shaped
          color="grey darken-2"
        >
          <v-flex xs12 class="ml-6 pa-2" text-center>
            <span>You have 0 new messages !</span>
          </v-flex>
        </v-card>
        </v-chip>
      </v-card>
    </v-flex>
    <!-- Metings -->
    <v-flex xs12 sm5 text-center class="pa-2">
      <v-card class="mx-auto pa-4">
        <v-chip label>
          <h2 class="sub">
            Meetings
          </h2>
        </v-chip>
        <v-card
          class="mx-auto"
          elevation="15"
          shaped
          color="grey darken-2"
        >
          <v-flex xs12 class="ml-6 pa-2" text-center>
            <span>No meeting activity !</span>
          </v-flex>
        </v-card>
        </v-chip>
      </v-card>
    </v-flex>
    <v-flex xs12 class="my-6" />
    <!-- job posting -->
    <v-flex xs12 sm6 text-center class="pa-2">
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
        </v-chip>
      </v-card>
    </v-flex>
    <!-- Latest news -->
    <v-flex xs12 sm6 text-center class="pa-2">
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
        </v-chip>
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
        </v-chip>
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
