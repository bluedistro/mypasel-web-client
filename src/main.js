import Vue from "vue";
import App from "./App.vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import axios from "axios";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import VueCookie from "vue-cookie";
import VeeValidate from "vee-validate";
import VuePhoneNumberInput from "vue-phone-number-input";
import "vue-phone-number-input/dist/vue-phone-number-input.css";
import VuePromiseBtn from "vue-promise-btn";
import "vue-promise-btn/dist/vue-promise-btn.css";
import firebase from "firebase/app";
import "firebase/messaging";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import VueTour from "vue-tour";
import * as VueGoogleMaps from "vue2-google-maps";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
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
  faEye,
  faEyeSlash,
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
  faEllipsisV,
  faMapPin,
  faAngleDown
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faCog,
  faUserCircle,
  faSearch,
  faPhone,
  faAngleUp,
  faEdit,
  faCircle,
  faUser,
  faEye,
  faEyeSlash,
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
  faEllipsisV,
  faTruckPickup,
  faComments
);

import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from "@fortawesome/vue-fontawesome";
import cookeys from "./cookeys";
import store from "./store/store.js";
import routes from "./routes/routes";
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

// socket subscription
var socketIOClient = require('socket.io-client')
var sailsIOClient = require('sails.io.js')

if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
  // subscribe to the socket
  // subscribe to Socket event
  const id = JSON.parse(VueCookie.get(cookeys.USER_DATA_KEY)).id
  let io;
  if(socketIOClient.sails){
    io = socketIOClient;
  }else{
    io = sailsIOClient(socketIOClient)
  }

  io.sails.url = "https://api.mypasel.com"
  // subscribe to socket
  io.socket.request({
      method: 'get',
      url: '/user/subscribe?id=' + id,
      headers: {
        'Authorization': 'key=EA9559850E60F62854CBB543791D5141'
      }
    },
    (responseData, jwres) => {
      console.log('response data ', responseData);
    })

    io.socket.on('parcel', (event) => {
      console.log('picked payload', event);
    })

  // make socket a prototype
  Vue.prototype.$ioSocket = io.socket;

}

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
firebase
  .messaging()
  .requestPermission()
  .then(() => firebase.messaging().getToken())
  .then(token => {
    // ste fcm token in localStorage to be used
    VueCookie.set(cookeys.FCM_TOKEN_KEY, token, { expires: cookeys.cookie_expire });
  })
  .catch(err => {
    // console.log("Unable to receive notification...");
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
  mode: "history",
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
  // TODO: There is a problem with the getters file that needs to be fixed that's why I'mc cheking directly from the cookie.
  if (to.matched.some(record => record.name == "Login")) {
    if (store.getters.loggedIn == true) {
      next({
        name: "RequestDelivery"
      });
    }
  }
});

new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount("#app");
