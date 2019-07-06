import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import axios from "axios";
// bootstrap vue
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
// import router from './router';
// import cookie code names
import VueCookie from "vue-cookie";
import VeeValidate from "vee-validate";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
// vue button async lock
import VuePromiseBtn from "vue-promise-btn";
// styling for spinner
import "vue-promise-btn/dist/vue-promise-btn.css";
// firebase imports
import firebase from "firebase/app";
import "firebase/messaging";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import VueTour from "vue-tour";
import * as VueGoogleMaps from "vue2-google-maps";

// loading overlay
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

// font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCog,
  faEdit,
  faCircle,
  faPlus,
  faArrowRight,
  faPencilAlt,
  faComment,
  faPhone,
  faAngleUp,
  faMoneyBillAlt,
  faFlag,
  faUserCircle,
  faTimes,
  faSignOutAlt,
  faUser,
  faArrowCircleRight,
  faSignInAlt,
  faUserPlus,
  faLock,
  faSearch,
  faMotorcycle,
  faBicycle,
  faCar,
  faTruckPickup,
  faWalking,
  faShuttleVan,
  faQuestionCircle,
  faComments,
  faHome,
  faMapPin,
  faAngleDown
} from "@fortawesome/free-solid-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from "@fortawesome/vue-fontawesome";
import cookeys from "./cookeys";
import store from "./store";
import routes from "./routes";
import App from "./App.vue";

require("vue-tour/dist/vue-tour.css");

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAxhKx9yKauKHGZCVfRaLCvYsFCK1-v3mw",
    libraries: "places"
  }
});

Vue.component("vue-phone-number-input", VuePhoneNumberInput);
Vue.use(VueCookie);
Vue.use(VeeValidate);
Vue.use(VueRouter);
Vue.use(Loading);

Vue.prototype.$http = axios;
const token = VueCookie.get(cookeys.TOKEN_KEY);
if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

library.add(
  faCog,
  faUserCircle,
  faSearch,
  faPhone,
  faAngleUp,
  faEdit,
  faCircle,
  faUser,
  faSignOutAlt,
  faQuestionCircle,
  faMoneyBillAlt,
  faPlus,
  faArrowRight,
  faArrowCircleRight,
  faPencilAlt,
  faComment,
  faShuttleVan,
  faHome,
  faAngleDown,
  faFlag,
  faTimes,
  faMotorcycle,
  faBicycle,
  faWalking,
  faMapPin,
  faSignInAlt,
  faUserPlus,
  faLock,
  faCar,
  faTruckPickup,
  faComments
);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("font-awesome-layers", FontAwesomeLayers);
Vue.component("font-awesome-layers-text", FontAwesomeLayersText);
// date picker
// component site: https://vuejsexamples.com/a-vuejs-component-for-select-date-time-2/
Vue.component("vue-ctk-date-time-picker", VueCtkDateTimePicker);

Vue.use(VuePromiseBtn);
Vue.use(BootstrapVue);
// A simple vue tour of the app
Vue.use(VueTour);

Vue.config.productionTip = false;
Vue.config.devtools = true;

const config = {
  apiKey: "AIzaSyActd9Uo9vznMtsin3ufh-ONaeuwziNmnc",
  authDomain: "macro-incline-164306.firebaseapp.com",
  databaseURL: "https://macro-incline-164306.firebaseio.com",
  projectId: "macro-incline-164306",
  storageBucket: "macro-incline-164306.appspot.com",
  messagingSenderId: "296173793992"
};

// create cookeys prototype
Vue.prototype.$cookeys = cookeys;

//
firebase.initializeApp(config);
Vue.prototype.$messaging = firebase.messaging();

navigator.serviceWorker
  .register("./firebase-messaging-sw.js")
  .then(registration => {
    Vue.prototype.$messaging.useServiceWorker(registration);
  })
  .catch(err => {
    console.log(err);
  });

// get the FCM token right here
firebase.messaging().requestPermission()
  .then(() => firebase.messaging().getToken())
  .then(token => {
    // ste fcm token in localStorage to be used
    VueCookie.set(cookeys.FCM_TOKEN_KEY, token, { expires: cookeys.cookie_expire });
  })
  .catch(err => {
    console.log("Unable to receive notification...");
  });

// click away directive
Vue.directive("click-outside", {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      // here I check that click was outside the el and his childrens
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unbind: function(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  }
});

// set vue router for routes
const router = new VueRouter({
  routes,
  mode: "history"
});

// set navigation guard for login protected pages
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.loggedIn) {
      next({
        name: "Login"
      });
    } else {
      next();
    }
  } else {
    next();
  }
  // prevent users from navigating directly to courier found page
  if (to.matched.some(record => record.name == "CourierFound")) {
    if (store.state.rawRouteGuards == true) {
      next({
        name: "RequestDelivery"
      });
    }
  }
  // take user directly to dashboard if logged in already
  if(to.matched.some(record => record.name=="Login")){
      if(store.getters.loggedIn){
        next({
          name: "RequestDelivery"
        })
      }
  }
});

new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount("#app");
