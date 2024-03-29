<template>
  <v-container fill-height fluid grid-list-xl>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      bottom
    >
      {{ snackbarText }}
      <v-icon v-if="snackbarColor.includes('red')">
        mdi-alert-outline
      </v-icon>
      <v-icon v-else>
        mdi-check-circle-outline
      </v-icon>
    </v-snackbar>
    <v-layout justify-center wrap elevation-6>
      <v-flex xs12 text-center>
        <v-avatar v-if="user.picture" size="170">
          <v-img :src="user.picture" class="img-circle elevation-6" aspect-ratio="1.4" />
        </v-avatar>
        <div class="name mt-4">
          {{ user.name }}
        </div>
        <div class="mt-2">
          <a v-if="user.metadata && user.metadata.facebook" :href="user.metadata.facebook" target="_blank" rel="noreferrer"><v-icon class="circle-icon" color="blue darken-1">mdi-facebook mdi-36px</v-icon></a>
          <a v-if="user.metadata && user.metadata.instagram" :href="user.metadata.instagram" target="_blank" rel="noreferrer"><v-icon class="instagram">mdi-instagram mdi-36px</v-icon></a>
          <v-icon @click="dialogMessage = !dialogMessage" class="circle-icon" color="blue darken-1">
            mdi-message-text mdi-36px
          </v-icon>
          <a v-if="user.metadata && user.metadata.web" :href="user.metadata.web" target="_blank" rel="noreferrer"><v-icon class="circle-icon" color="green">mdi-web mdi-36px</v-icon></a>
          <a v-if="user.metadata && user.metadata.phone" :href="phone"><v-icon class="circle-icon" color="teal">mdi-phone-classic mdi-36px</v-icon></a>
          <v-btn v-if="user.uid !== $auth.user.sub && !alreadyInTeam " @click="addToTeam()" fab color="blue darken-3">
            <v-icon large>
              mdi-account-multiple-plus
            </v-icon>
          </v-btn>
        </div>
      </v-flex>

      <v-flex v-if="user.metadata && user.metadata.skills && user.metadata.skills.length > 0" xs12 sm6 text-center>
        <div class="sub">
          Skills
          <v-divider class="mx-10 pt-1" />
        </div>
        <v-chip
          v-for="item in user.metadata.skills"
          :key="item"
          color="cyan lighten-4"
          x-small
          class="mr-1"
          outlined
          label
        >
          {{ item }}
        </v-chip>
      </v-flex>
      <v-flex v-if="user.metadata && user.metadata.tickets" xs12 sm6 text-center>
        <div class="sub">
          Tickets
          <v-divider class="mx-10 pt-1" />
        </div>
        <v-chip
          v-for="item in user.metadata.tickets"
          :key="item"
          color="orange lighten-3"
          x-small
          class="mr-1"
          outlined
          label
        >
          {{ item }}
        </v-chip>
      </v-flex>
      <v-flex xs12 text-center>
        <v-chip v-if="user.metadata && user.metadata.wcb" small>
          <v-icon small color="green">
            mdi-check-decagram
          </v-icon>&nbsp; Wcb Coverage
        </v-chip>
        <v-chip v-if="user.metadata && user.metadata.liability" small>
          <v-icon small color="green">
            mdi-check-decagram
          </v-icon>&nbsp; Liability Insurance
        </v-chip>
      </v-flex>
      <v-flex v-if="user.metadata && user.metadata.description" xs12 class="mt-n4" text-center>
        <p class=" pa-1 elevation-2 description">
          {{ user.metadata.description }}
        </p>
      </v-flex>
      <v-container v-if="user.photos || photos.length >= 1" class="mx-5 photo">
        <v-layout v-if="user.photos && user.photos.photos && user.photos.photos.length >= 1" row wrap class="pa-3">
          <v-flex
            v-for="img in user.photos.photos"
            :key="img.id"
            xs12
            sm4
            md3
            class="pa-4"
          >
            <v-card>
              <ExpandableImage :src="img" class="image" max-width="400" contain />
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout v-else row wrap class="pa-3">
          <v-flex
            v-for="img in photos"
            :key="img.id"
            xs12
            sm4
            md3
            class="pa-4"
          >
            <v-card>
              <ExpandableImage :src="img" class="image" max-width="400" contain />
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-flex xs12 text-center>
        <v-card v-if="rating >= 1" min-height="150" shaped>
          <v-chip v-if="$vuetify.breakpoint.width >= 372" label class=" mt-n4 py-6 name">
            <v-icon class="mr-1">
              mdi-star-four-points
            </v-icon>
            {{ reviews.length }}
            Review(s)
            <v-icon class="ml-1">
              mdi-star-four-points
            </v-icon>
          </v-chip>
          <v-chip v-else label class=" mt-n4 py-6 mobile">
            <v-icon class="mr-1">
              mdi-star-four-points
            </v-icon>
            {{ reviews.length }}
            Review(s)
            <v-icon class="ml-1">
              mdi-star-four-points
            </v-icon>
          </v-chip>
          <br>
          <v-chip v-if="$vuetify.breakpoint.width >= 372" large class="sub mt-1" label>
            <v-btn color="grey darken-3" fab>
              <span class="rating">{{ rating }}</span>
            </v-btn>
            <v-rating
              v-model="rating"
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="mdi-star-outline"
              half-icon="mdi-star-half"
              half-increments
              hover

              readonly
            />
          </v-chip>
          <v-chip v-else large class="sub mt-1" label>
            <v-btn color="grey darken-3" fab>
              <span class="rating">{{ rating }}</span>
            </v-btn>
            <v-rating
              v-model="rating"
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="mdi-star-outline"
              half-icon="mdi-star-half"
              half-increments
              hover
              small
              readonly
            />
          </v-chip>
        </v-card>
        <v-card v-else min-height="80" shaped>
          <v-chip label class=" mt-n4 py-6 name">
            <v-icon class="mr-1">
              mdi-star-four-points
            </v-icon>
            No Reviews
            <v-icon class="ml-1">
              mdi-star-four-points
            </v-icon>
          </v-chip>
        </v-card>
        <v-card v-for="review in reviews" :key="review.id" class="pa-8 mt-n6" elevation="18">
          <v-layout wrap>
            <v-flex class="mt-n5" xs12 text-left>
              <v-chip label>
                {{ review.reviewerName }}
              </v-chip>
            </v-flex>
            <v-flex v-if="review.reviewerUid === $auth.user.sub" class="mt-n12 mb-2" xs12 text-right>
              <v-btn @click="editReview(review)" class="mt-n4" x-small fab color="yellow darken-3">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="deleteReview(review)" class="mr-n2 mt-n4" x-small fab color="red darken-4">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs12 class="mt-n7" text-right>
              <v-chip x-small outlined color="blue-grey lighten-4" label>
                {{ review.projectName }}
              </v-chip>
              <v-divider />
            </v-flex>
            <v-flex :class="($vuetify.breakpoint.width <= 600)? 'mt-n4': ''" :text-left="($vuetify.breakpoint.width > 600)? true: false" xs12 sm4>
              <span>Quality of work</span>
              <v-rating
                v-model="review.ratingA"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="mdi-star-outline"
                half-icon="mdi-star-half"
                half-increments
                hover
                small
                readonly
              />
              <span>Timeliness</span>
              <v-rating
                v-model="review.ratingB"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="mdi-star-outline"
                half-icon="mdi-star-half"
                half-increments
                hover
                small
                readonly
              />
            </v-flex>
            <v-flex :class="($vuetify.breakpoint.width <= 600)? 'mt-n4': ''" :text-left="($vuetify.breakpoint.width > 600)? true: false" xs12 sm4>
              <span>Cleanliness</span>
              <v-rating
                v-model="review.ratingC"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="mdi-star-outline"
                half-icon="mdi-star-half"
                half-increments
                hover
                small
                readonly
              />
              <span>Budget</span>
              <v-rating
                v-model="review.ratingD"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="mdi-star-outline"
                half-icon="mdi-star-half"
                half-increments
                hover
                small
                readonly
              />
            </v-flex>
            <v-flex :class="($vuetify.breakpoint.width <= 600)? 'mt-n4': ''" :text-left="($vuetify.breakpoint.width > 600)? true: false" xs12 sm4>
              <span>Reliability</span>
              <v-rating
                v-model="review.ratingE"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="mdi-star-outline"
                half-icon="mdi-star-half"
                half-increments
                hover
                small
                readonly
              />
            </v-flex>
            <v-flex xs12>
              <v-card class="pa-2" elevation="18">
                {{ review.description }}
              </v-card>
            </v-flex>
            <v-flex v-if="user.uid === $auth.user.sub && !review.comment" xs12 text-left>
              <v-btn @click="openComment(review)" color="blue" x-small text>
                Leave a comment
              </v-btn>
            </v-flex>
            <v-flex v-else-if="review.comment" class="mt-n2" xs12 text-left>
              <v-chip outlined small>
                {{ user.name }}
              </v-chip>
              <v-divider class="mb-1" />
              <small class="ml-6">{{ review.comment }}</small>
              <v-btn
                v-if="user.uid === $auth.user.sub"
                @click="openComment(review)"
                class="ml-2"
                outlined
                color="green"
                x-small
              >
                Edit
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialogMessage" max-width="600">
      <v-card>
        <v-toolbar height="30" dark color="blue darken-3">
          <v-spacer />
          <v-toolbar-title class="body-1">
            Messages
          </v-toolbar-title>
          <v-btn @click="dialogMessage = false" icon dark>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <Message :dialog-message.sync="dialogMessage" :user="user" />
        <v-divider />
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogReview"
      max-width="400"
    >
      <v-card>
        <v-flex xs12 class="pa-3" text-center>
          <h3 class="ibm">
            Edit review <span class="green--text"><u>{{ currentReview.projectName }}</u></span>
          </h3>
          <v-divider />
        </v-flex>
        <v-card shaped class="ma-2">
          <v-form
            ref="form"
            lazy-validation
          >
            <v-layout wrap>
              <v-flex xs12 text-center>
                <span class="ratings">Quality of work</span>
                <v-divider />
                <v-rating
                  v-model="newReview.ratingA"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="mdi-star-outline"
                  hover
                />
              </v-flex>
              <v-flex xs12 text-center>
                <span class="ratings">Timeliness</span>
                <v-divider />
                <v-rating
                  v-model="newReview.ratingB"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="mdi-star-outline"
                  hover
                />
              </v-flex>
              <v-flex xs12 text-center>
                <span class="ratings">Cleanliness</span>
                <v-divider />
                <v-rating
                  v-model="newReview.ratingC"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="mdi-star-outline"
                  hover
                />
              </v-flex>
              <v-flex xs12 text-center>
                <span class="ratings">Budget</span>
                <v-divider />
                <v-rating
                  v-model="newReview.ratingD"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="mdi-star-outline"
                  hover
                />
              </v-flex>
              <v-flex xs12 text-center>
                <span class="ratings">Reliability</span>
                <v-divider />
                <v-rating
                  v-model="newReview.ratingE"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  empty-icon="mdi-star-outline"
                  hover
                />
                <v-divider class="my-2" />
              </v-flex>
              <v-flex class="ma-2" xs12>
                <v-textarea
                  v-model="newReview.description"
                  :rules="descRule"
                  label="How was your experience ?"
                  outlined
                  class="purple-input"
                  counter="400"
                />
              </v-flex>
              <v-flex class="my-4" text-right>
                <v-btn
                  @click="dialogReview = false"
                  color="orange darken-3"
                  text
                >
                  Cancel
                </v-btn>

                <v-btn
                  @click="saveReview()"
                  color="green darken-1"
                  text
                >
                  Save Changes!
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogDelete"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Please Confirm
        </v-card-title>

        <v-card-text>
          Delete this review:
          <v-chip class="ml-2" label>
            {{ currentReview.projectName }}
          </v-chip>
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn
            @click="dialogDelete = false"
            color="orange darken-3"
            text
          >
            No
          </v-btn>

          <v-btn
            @click="confirmDelete()"
            color="green darken-1"
            text
          >
            Yes!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogComment"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          Leave a comment
        </v-card-title>
        <v-textarea
          v-model="comment"
          :rules="descRule"
          label="Leave a comment"
          outlined
          class="purple-input"
          counter="400"
        />
        <v-card-actions>
          <v-spacer />

          <v-btn
            @click="dialogComment = false"
            color="orange darken-3"
            text
          >
            cancel
          </v-btn>

          <v-btn
            @click="leaveComment()"
            color="green darken-1"
            text
          >
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.circle-icon {
    background: white;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    text-align: center;
    line-height: 100px;
    vertical-align: middle;
    padding: 25px;
}
a:link {
  text-decoration: none;
}
.instagram{ width:25px; height:25px;
  border-radius: 50%;
    text-align: center;
    line-height: 100px;
    vertical-align: middle;
    padding: 25px;
  background: #f09433;
  background: -moz-linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f09433', endColorstr='#bc1888',GradientType=1 );
}
.insta {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
  -webkit-background-clip: text;
          /* Also define standard property for compatibility */
          background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 200px; /* change this to change the size*/
}
.img-circle {
  border-radius: 20%;
}
.wrap {
  background-color: rgb(94, 91, 91);
}
.name {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 2.3em;
  font-display: swap;
  transform: rotate(358deg);
  background-color: rgb(87, 88, 88);
  box-shadow: -1px 5px 14px 5px rgba(0,0,0,0.36);
  max-width: 400px;
  margin: 0 auto;
}
.mobile {
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 1.5em;
  font-display: swap;
  transform: rotate(358deg);
  background-color: rgb(87, 88, 88);
  box-shadow: -1px 5px 14px 5px rgba(0,0,0,0.36);
  max-width: 400px;
  margin: 0 auto;
}
.sub {
  transform: rotate(359deg);
  margin: 0 auto;
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: bold;
  font-display: swap;
}
.description {
  color: white;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.8em;
  font-display: swap;
}
.container {
  max-width: 1200px;
}
.rating {
  font-size: 1.9em;
}
</style>

<script>
import { mapGetters } from 'vuex'
import ExpandableImage from '../components/ExpandableImage'
import Message from '../components/Message.vue'
export default {
  components: {
    ExpandableImage,
    Message
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    photos: {
      type: Array,
      default: () => { return [] }
    }
  },
  data () {
    return {
      dialogComment: false,
      comment: '',
      snackbar: false,
      snackbarColor: 'green darken-3',
      snackbarText: '',
      descRule: [
        v => (v || '').length <= 400 || 'Description should be 400 characters or less '
      ],
      sum: 0,
      reviews: [],
      rating: 0,
      alreadyInTeam: false,
      dialogMessage: false,
      dialogReview: false,
      dialogDelete: false,
      phone: '',
      currentReview: {},
      newReview: {
        ratingA: 0,
        ratingB: 0,
        ratingC: 0,
        ratingD: 0,
        ratingE: 0,
        description: ''
      }
    }
  },
  computed: mapGetters({
    team: 'team/getTeam'
  }),
  watch: {
    reviews () {
      this.rating = 0
      this.sum = 0
      this.reviews.forEach((review) => {
        // convert Str to Int
        review.ratingA = parseInt(review.ratingA)
        review.ratingB = parseInt(review.ratingB)
        review.ratingC = parseInt(review.ratingC)
        review.ratingD = parseInt(review.ratingD)
        review.ratingE = parseInt(review.ratingE)
        // Get sum
        this.sum += review.ratingA + review.ratingB + review.ratingC + review.ratingD + review.ratingE
      })
      if (this.reviews && this.reviews.length >= 1) {
        // calculate average of reviews score
        this.rating = (this.sum / this.reviews.length / 5)
      }
    },
    user () {
      this.alreadyInTeam = false
      // make sure user isn't in team already
      this.team.forEach((member) => {
        if (member.uid === this.user.uid) {
          this.alreadyInTeam = true
        }
      })
      this.rating = 0
      this.sum = 0
      this.$axios.get(`review/get/${this.user.uid}`).then((res) => {
        res.data.forEach((review) => {
        // convert Str to Int
          review.ratingA = parseInt(review.ratingA)
          review.ratingB = parseInt(review.ratingB)
          review.ratingC = parseInt(review.ratingC)
          review.ratingD = parseInt(review.ratingD)
          review.ratingE = parseInt(review.ratingE)
          // Get sum
          this.sum += review.ratingA + review.ratingB + review.ratingC + review.ratingD + review.ratingE
        })
        this.reviews = res.data
        if (this.reviews.length >= 1) {
        // calculate average of reviews score
          this.rating = (this.sum / this.reviews.length / 5)
        }
      })
    },
    team () {
      this.alreadyInTeam = false
      // make sure user isn't in team already
      if (this.team) {
        this.team.forEach((member) => {
          if (member.uid === this.user.uid) {
            this.alreadyInTeam = true
          }
        })
      }
    }
  },
  created () {
    if (this.user.user_metadata) {
      this.user.metadata = this.user.user_metadata
      this.user.uid = this.user.user_id
    }
    if (this.user.metadata && this.user.metadata.phone) {
      this.phone = `tel:${this.user.metadata.phone}`
    }
    this.$axios.get(`review/get/${this.user.uid}`).then((res) => {
      res.data.forEach((review) => {
        // convert Str to Int
        review.ratingA = parseInt(review.ratingA)
        review.ratingB = parseInt(review.ratingB)
        review.ratingC = parseInt(review.ratingC)
        review.ratingD = parseInt(review.ratingD)
        review.ratingE = parseInt(review.ratingE)
        // Get sum
        this.sum += review.ratingA + review.ratingB + review.ratingC + review.ratingD + review.ratingE
      })
      this.reviews = res.data
      if (this.reviews.length >= 1) {
        // calculate average of reviews score
        this.rating = (this.sum / this.reviews.length / 5)
      }
    })
    if (this.team) {
      // make sure user isn't in team already
      this.team.forEach((member) => {
        if (member.uid === this.user.uid) {
          this.alreadyInTeam = true
        }
      })
    }
  },
  methods: {
    openComment (review) {
      this.currentReview = review
      if (review.comment) {
        this.comment = review.comment
      }
      this.dialogComment = true
    },
    leaveComment () {
      if (this.comment.length > 1 || this.currentReview.comment) {
        this.$axios.$post(`review/comment/${this.currentReview.bid}`, { comment: this.comment }).then((res) => {
          const index = this.reviews.indexOf(this.currentReview)
          this.reviews.splice(index, 1)
          this.reviews.unshift(res)
          this.dialogComment = false
        })
      }
    },
    editReview (review) {
      this.currentReview = review
      // set saved data for editing and convert to integer
      this.newReview.ratingA = parseInt(review.ratingA)
      this.newReview.ratingB = parseInt(review.ratingB)
      this.newReview.ratingC = parseInt(review.ratingC)
      this.newReview.ratingD = parseInt(review.ratingD)
      this.newReview.ratingE = parseInt(review.ratingE)
      this.newReview.description = review.description
      this.dialogReview = true
    },
    deleteReview (review) {
      this.currentReview = review
      this.dialogDelete = true
    },
    confirmDelete () {
      this.$axios.$post(`review/delete/${this.currentReview.bid}/${this.currentReview.reviewerUid}`).then((res) => {
        // update review
        const index = this.reviews.indexOf(this.currentReview)
        this.reviews.splice(index, 1)
        this.dialogDelete = false
      })
    },
    saveReview () {
      if (this.$refs.form.validate()) {
        this.newReview.reviewerName = this.$auth.user.name
        this.newReview.user = this.currentReview.user
        this.newReview.project = this.currentReview.project
        this.newReview.bid = this.currentReview.bid
        this.newReview.projectName = this.currentReview.projectName
        this.$axios.$post(`review/edit/${this.currentReview.bid}`, this.newReview).then((res) => {
          // update review
          const index = this.reviews.indexOf(this.currentReview)
          this.reviews.splice(index, 1)
          this.reviews.unshift(res.review)
          this.dialogReview = false
        })
      }
    },
    addToTeam () {
      this.$store.commit('team/addMember', {
        uid: this.user.uid, // ID
        name: this.user.name,
        picture: this.user.picture,
        metadata: this.user.metadata
      })
      this.$store.dispatch('team/saveTeam')
      this.snackbarText = `Successfully added ${this.user.name} to team`
      this.snackbar = true
    }
  }
}
</script>
