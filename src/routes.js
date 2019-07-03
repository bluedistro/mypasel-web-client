import EstimateResults from "./components/EstimateResults.vue";
import NotFound from "./components/NotFound.vue";
import Estimate from "./components/Estimate.vue";

// import CourierSearchLoader from './components/RequestDeliveryCourierSearchLoader.vue';

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import(/* webpackChunkName: 'Login' */ "./components/Login.vue")
  },

  {
    path: "/register",
    name: "Register",
    component: () => import(/* webpackChunkName: 'Register' */ "./components/Register.vue")
  },

  {
    path: "/request-delivery",
    name: "RequestDelivery",
    component: () =>
      import(/* webpackChunkName: 'RequestDelivery' */ "./components/RequestDelivery.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/setup",
    name: "SystemSetup",
    component: () =>
      import(/* webpackChunkName: 'RequestDelivery' */ "./components/SystemSetup.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/ongoing",
    name: "Ongoing",
    component: () =>
      import(/* webpackChunkName: 'RequestDeliveryOngoing' */ "./components/RequestDeliveryOngoing.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/scheduled",
    name: "Scheduled",
    component: () =>
      import(/* webpackChunkName: 'RequestDeliveryScheduled' */ "./components/RequestDeliveryScheduled.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/request-payment",
    name: "RequestPayment",
    component: () =>
      import(/* webpackChunkName: 'RequestPayment' */ "./components/RequestDeliveryRequestPayment.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/history",
    name: "History",
    component: () =>
      import(/* webpackChunkName: 'RequestDeliveryHistory' */ "./components/RequestDeliveryHistory.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/navbar",
    name: "Navbar",
    component: () =>
      import(/* webpackChunkName: 'Navbar' */ "./components/RequestDeliveryNavbar.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/courier-found",
    name: "CourierFound",
    component: () =>
      import(/* webpackChunkName: 'CourierFound' */ "./components/RequestDeliveryCourierFound.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () =>
      import(/* webpackChunkName: 'ForgotPassword' */ "./components/ForgotPassword.vue")
  },

  {
    path: "/searching",
    name: "SearchingCourier",
    // component: CourierSearchLoader,
    component: () =>
      import(/* webpackChunkName: 'SearchingCourier' */ "./components/RequestDeliveryCourierSearchLoader.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/account",
    name: "UserAccount",
    // component: CourierSearchLoader,
    component: () =>
      import(/* webpackChunkName: 'SearchingCourier' */ "./components/RequestDeliveryUserAccount.vue"),
    meta: { requiresAuth: true }
  },

  { path: "/estimate", name: "Estimate", component: Estimate },
  { path: "/pricing", name: "EstimateResults", component: EstimateResults },
  { path: "/404", component: NotFound, name: "NotFound" },
  { path: "*", redirect: "/404" }
];

export default routes;
