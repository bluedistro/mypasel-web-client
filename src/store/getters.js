import state from './state';
import VueCookie from 'vue-cookie';
import cookeys from '../cookeys';

const loggedIn = (state) => {
  return state.token ? true : false;
}

export default {
  loggedIn,
}
