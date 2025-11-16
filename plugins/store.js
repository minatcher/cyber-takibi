import Vue from 'vue'
import Vuex from 'vuex'
import weather from '~/store/weather'

Vue.use(Vuex)
Vue.prototype.$store = new Vuex.Store({
  modules: {
    weather,
  },
})
