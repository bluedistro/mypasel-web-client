import state from './state';

const loggedIn = (state) => {
  return state.token ? true : false;
}

export default {
  loggedIn,
}
