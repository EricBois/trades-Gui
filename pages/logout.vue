<template>
  <v-layout wrap>
    <v-flex xs12 text-center>
      <v-card max-width="850" class="mx-auto pa-6">
        <v-card max-width="600" min-height="100" class="mx-auto" elevation="15" shaped>
          <h1>Successfully logged out !</h1>
          <span class="sub">You have Successfully logged out, see you next time!</span>
        </v-card>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  auth: false
}
</script>
