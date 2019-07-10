import state from './state';
import VueCookie from 'vue-cookie';
import cookeys from '../cookeys';

const loggedIn = (state) => {
  return VueCookie.get(cookeys.TOKEN_KEY) ? true : false;
}

export default {
  loggedIn,
}
