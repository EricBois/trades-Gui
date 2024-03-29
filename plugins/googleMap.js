import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDOYmK25Z4F9mWH7_p0Qgqu6HHkD50TcNw',
    libraries: 'places',
    region: 'CA',
    language: 'en'
    // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
    /// If you want to set the version, you can do so:
    // v: '3.26',
  }
})
