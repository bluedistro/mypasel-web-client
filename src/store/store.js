import Vue from "vue"
import Vuex from "vuex"
import * as Cookies from "js-cookie"

import state from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

// import cookie code names
import createPersistedState from "vuex-persistedstate"
import cookeys from "../cookeys"

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      getState: key => Cookies.getJSON(key),
      setState: (key, value) => Cookies.set(key, value, { expires: cookeys.cookie_expire }),
      removeItem: key => Cookies.remove(key)
    })
  ],
  state,
  actions,
  getters,
  mutations,
})
