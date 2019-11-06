<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm4 offset-1 text-center>
        <h3>Available users</h3>
        <v-card class="mt-1">
          <draggable class="list-group" :list="users" group="people">
            <v-card v-for="user in users" :key="user.id" class="pt-1">
              {{ user.name }} <v-divider />
            </v-card>
          </draggable>
        </v-card>
      </v-flex>
      <v-flex xs12 sm4 offset-2 text-center>
        <h3>My Team</h3>
        <v-card>
          <draggable class="list-group" :list="team" group="people">
            <v-card v-for="user in team" :key="user.id" pl-2>
              {{ user.name }} <v-divider />
            </v-card>
          </draggable>
          <v-btn color="green" class="mt-3" small @click="save">
            Save
          </v-btn>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  data () {
    return {
      team: [],
      users: []
    }
  },
  created () {
    this.$axios.$get('team/fetch').then((res) => {
      this.team = res.team
    })
    this.$axios
      .$get('account/public').then((res) => {
        this.users = res
      })
  },
  methods: {
    add () {
      this.list.push({ name: 'Juan' })
    },
    replace () {
      this.list = [{ name: 'Edgard' }]
    },
    clone (el) {
      return {
        name: el.name + ' cloned'
      }
    },
    save () {
      this.$axios.$post('team/edit', { team: this.team }).then((res) => {
        // this.team = res.team
      })
    }
  }
}
</script>
