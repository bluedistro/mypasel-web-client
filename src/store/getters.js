import state from './state'
import VueCookie from 'vue-cookie'
import cookeys from '../cookeys'

const loggedIn = (state) => {
  // previously state.token as condition
  return state.token != null ? true : false
}

export default {
  loggedIn,
}
