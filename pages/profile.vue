<template>
  <v-container fill-height fluid grid-list-xl>
    <v-layout justify-center wrap>
      <v-flex xs12 md8>
        <v-form>
          <v-container py-0>
            <v-layout wrap>
              <v-flex v-if="picture" xs12 text-xs-center>
                <v-btn ripple icon>
                  <v-icon color="red" large>
                    mdi-delete-circle
                  </v-icon>
                </v-btn>
                <v-avatar tile size="150">
                  <v-img :src="picture" />
                </v-avatar>
              </v-flex>
              <v-flex v-else xs12 pt-5 text-xs-center />
              <v-flex xs12 md6>
                <v-text-field v-model="name" class="purple-input" label="Name" />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field v-model="phone" class="purple-input" label="Phone #" />
              </v-flex>
              <v-flex xs12>
                <v-textarea v-model="description" label="Description" class="purple-input" />
              </v-flex>
              <v-flex xs12 md6>
                <v-text-field
                  v-model="hourly"
                  label="Hourly"
                  class="purple-input"
                  prefix="$"
                  type="number"
                />
              </v-flex>
              <v-flex xs12 md6>
                <v-switch v-model="switch1" label="Available" />
              </v-flex>
              <!-- <v-flex xs12 md12>
                  <gmap-autocomplete
                    class="v-input__slot theme--light"
                    :value="info.location.address"
                    :select-first-on-enter="true"
                    @place_changed="setPlace"
                  />
              </v-flex>-->
              <v-flex xs12 text-xs-right>
                <v-btn
                  class="mx-0 font-weight-light"
                  ceditolor="success"
                  @click="edit"
                >
                  Update Profile
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      phone: '',
      description: '',
      hourly: '',
      picture: null,
      switch1: false
    }
  },
  mounted () {
    this.$axios
      .$get('account/get')
      .then((res) => {
        this.name = res.account.name
        this.phone = res.account.phone
        this.picture = res.account.picture
        this.description = res.account.description
        this.hourly = res.account.hourly
        this.available = res.account.available
        if (this.available) {
          this.switch1 = true
        } else {
          this.switch1 = false
        }
      })
  },
  methods: {
    edit () {
      this.$axios
        .$post('account/edit', {
          name: this.name,
          phone: this.phone,
          description: this.description,
          hourly: this.hourly,
          picture: this.picture,
          available: this.switch1 })
        .then((res) => {
          this.name = res.name
          this.phone = res.phone
          this.picture = res.picture
          this.description = res.description
          this.hourly = res.hourly
          this.available = res.available
          if (this.available) {
            this.switch1 = true
          } else {
            this.switch1 = false
          }
        })
    }
  }
}
</script>
