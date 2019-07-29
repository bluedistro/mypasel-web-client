import NotFound from "../pages/NotFound.vue";
const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import(/* webpackChunkName: 'Login' */ "../pages/Login.vue")
  },

  {
    path: "/register",
    name: "Register",
    component: () => import(/* webpackChunkName: 'Register' */ "../pages/Register.vue")
  },

  {
    path: "/request-delivery",
    name: "RequestDelivery",
    component: () =>
      import(/* webpackChunkName: 'RequestDelivery' */ "../pages/requestDeliveryPages/RequestDelivery.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/setup",
    name: "SystemSetup",
    component: () =>
      import(/* webpackChunkName: 'RequestDelivery' */ "../pages/SystemSetup.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/ongoing",
    name: "Ongoing",
    component: () =>
      import(/* webpackChunkName: 'RequestDeliveryOngoing' */ "../pages/requestDeliveryPages/RequestDeliveryOngoing.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/scheduled",
    name: "Scheduled",
    component: () =>
      import(/* webpackChunkName: 'RequestDeliveryScheduled' */ "../pages/requestDeliveryPages/RequestDeliveryScheduled.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/request-payment",
    name: "RequestPayment",
    component: () =>
      import(/* webpackChunkName: 'RequestPayment' */ "../pages/requestDeliveryPages/RequestDeliveryRequestPayment.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/history",
    name: "History",
    component: () =>
      import(/* webpackChunkName: 'RequestDeliveryHistory' */ "../pages/requestDeliveryPages/RequestDeliveryHistory.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/navbar",
    name: "Navbar",
    component: () =>
      import(/* webpackChunkName: 'Navbar' */ "../pages/requestDeliveryPages/RequestDeliveryNavbar.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/courier-found",
    name: "CourierFound",
    component: () =>
      import(/* webpackChunkName: 'CourierFound' */ "../pages/requestDeliveryPages/RequestDeliveryCourierFound.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/reset-password",
    name: "resetPassword",
    component: () =>
      import(/* webpackChunkName: 'ForgotPassword' */ "../pages/forgotPassword/ForgotPasswordStep1.vue")
  },

  {
    path: "/confirm-password",
    name: "confirmPassword",
    component: () =>
      import(/* webpackChunkName: 'ForgotPassword' */ "../pages/forgotPassword/ForgotPasswordStep2.vue")
  },

  {
    path: "/searching",
    name: "SearchingCourier",
    // component: CourierSearchLoader,
    component: () =>
      import(/* webpackChunkName: 'SearchingCourier' */ "../pages/requestDeliveryPages/RequestDeliveryCourierSearchLoader.vue"),
    meta: { requiresAuth: true }
  },

  {
    path: "/account",
    name: "UserAccount",
    // component: CourierSearchLoader,
    component: () =>
      import(/* webpackChunkName: 'SearchingCourier' */ "../pages/requestDeliveryPages/RequestDeliveryUserAccount.vue"),
    meta: { requiresAuth: true }
  },
  { path: "/404", component: NotFound, name: "NotFound" },
  { path: "*", redirect: "/404" },
];

export default routes;
