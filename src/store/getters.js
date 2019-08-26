import state from './state'
import VueCookie from 'vue-cookie'
import cookeys from '../cookeys'

const loggedIn = (state) => {
  return state.token != null ? true : false
}

export default {
  loggedIn,
}
