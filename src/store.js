import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import * as Cookies from "js-cookie";
import VueCookie from "vue-cookie";

// import cookie code names
import createPersistedState from "vuex-persistedstate";
import cookeys from "./cookeys";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      getState: key => Cookies.getJSON(key),
      setState: (key, value) => Cookies.set(key, value, { expires: cookeys.cookie_expire }),
      removeItem: key => Cookies.remove(key)
    })
  ],

  state: {
    status: "",
    token: VueCookie.get(cookeys.TOKEN_KEY) || null,
    user: {},
    pricing: {},
    request_payload: {},
    amountAfterPromoCode: null,
    search: false,
    rawRouteGuards: null,
    booking_return_data: {}
  },

  mutations: {
    auth_request(state) {
      state.status = "loading";
    },

    auth_success(state, data) {
      state.status = "success";
      state.token = data.token;
      state.search = false;
      state.user = data.user;
    },
    auth_error(state) {
      state.status = "error";
      state.search = false;
    },
    logout(state) {
      state.search = false;
      state.status = "";
      state.token = "";
    },
    register_success(state) {
      state.status = "registration_success";
      state.search = false;
    },
    register_error(state) {
      state.status = "registration_error";
      state.search = false;
    },
    pricing_success(state, data) {
      state.search = false;
      state.status = "pricing_success";
      state.pricing = data;
    },
    pricing_error(state) {
      state.search = false;
      state.status = "pricing_error";
    },
    request_payload_mutation(state, data) {
      state.request_payload = data;
      state.search = false;
    },
    promo_code_authentication_success(state, data) {
      state.status = "promocode_auth_success";
      state.search = false;
      state.amountAfterPromoCode = data;
    },
    promo_code_authentication_error(state) {
      state.status = "promocode_auth_error";
      state.search = false;
    },
    booking_success(state, data) {
      state.status = "booking_success";
      state.booking_return_data = data;
      state.search = true;
    },
    booking_error(state) {
      state.status = "booking_error";
      state.search = false;
    },
    cancellation_success(state) {
      state.status = "booking_cancelled_successfully";
      state.search = false;
    },
    cancellation_error(state) {
      state.status = "booking_cancellation_error";
      state.search = false;
    },
    courier_searching_success(state) {
      state.status = "searching_courier_successfully";
      state.search = false;
    },
    courier_searching_failure(state) {
      state.status = "searching_courier_failed";
      state.search = false;
    },
    token_refresh_success(state) {
      state.status = "token_refresh_success";
      state.search = false;
    },
    token_refresh_error(state) {
      state.status = "token_refresh_error";
      state.search = false;
    },
    ongoing_transactions_success(state) {
      state.status = "ongoing_transactions_success";
      state.search = false;
    },
    ongoing_transactions_error(state) {
      state.status = "ongoing_transactions_error";
      state.search = false;
    },
    setRawRouteGuards(state, payload) {
      state.rawRouteGuards = payload;
    },
    email_change_success(state) {
      state.status = "email_change_success";
    },
    email_change_error(state) {
      state.status = "email_change_error";
    },
    password_change_success(state) {
      state.status = "password_change_success";
    },
    password_change_error(state) {
      state.status = "password_change_error";
    },
    scheduled_data_return_success(state) {
      state.status = "scheduled_data_return_success";
    },
    scheduled_data_return_error(state) {
      state.status = "scheduled_data_return_error";
    },
    transactions_history_success(state) {
      state.status = "transactions_history_success";
    },
    transactions_history_error(state) {
      state.status = "transactions_history_error";
    }
  },

  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        const params = {
          phoneNumber: user.phoneNumber,
          password: user.password
        };
        const path = "https://api.desymal.com/user/account/verify";
        axios
          .post(path, params)
          .then(resp => {
            const token = resp.data.token;
            const user = resp.data;
            let stateData = { token: token, user: user };
            VueCookie.set(cookeys.USER_DATA_KEY, JSON.stringify(user), {
              expires: cookeys.cookie_expire
            });
            VueCookie.set(cookeys.TOKEN_KEY, token, { expires: cookeys.cookie_expire });
            commit("auth_success", stateData);
            resolve(resp);
          })
          .catch(err => {
            VueCookie.delete(cookeys.TOKEN_KEY);
            commit("auth_error");
            reject(err);
          });
      });
    },

    // and ugly hack to prevent user from going back to the courier found page
    redirectToOngoing({ commit }) {
      return new Promise((resolve, reject) => {
        commit("setRawRouteGuards", true);
      });
    },

    register({ commit }, registerData) {
      return new Promise((resolve, reject) => {
        const path = "https://api.desymal.com/v2/users/create";
        let params = null;
        if (registerData.type == "individual") {
          params = {
            emailAddress: registerData.userEmail,
            name: registerData.userFullName,
            country: registerData.userCountry,
            phoneNumber: registerData.userPhone,
            password: registerData.userPassword,
            type: registerData.type,
            sex: registerData.sex
          };
        }

        if (registerData.type == "business") {
          params = {
            emailAddress: registerData.companyEmail,
            name: registerData.companyName,
            country: registerData.companyCountry,
            phoneNumber: registerData.companyPhone,
            password: registerData.companyPassword,
            type: registerData.type,
            sex: "Default"
          };
        }
        axios
          .post(path, params)
          .then(resp => {
            const returnStatus = resp.data;
            commit("register_success");
            resolve(resp);
          })
          .catch(err => {
            commit("register_error");
            reject(err);
          });
      });
    },

    logout({ commit }) {
      return new Promise((resolve, reject) => {
        // remove all stored items
        for (var key in cookeys) {
          // avoid logging inherited properties
          if (cookeys.hasOwnProperty(key)) {
            VueCookie.delete(cookeys[key]);
          }
        }

        delete axios.defaults.headers.common["Authorization"];
        commit("logout");
        resolve();
      });
    },

    cancelTransaction({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const path = "https://api.desymal.com/v1/order/" + payload.cancelId + "/cancel";
        const param = {
          reason: payload.reason
        };
        axios
          .post(path, param)
          .then(resp => {
            commit("cancellation_success");
            resolve(resp);
          })
          .catch(err => {
            commit("cancellation_error");
            reject(err);
          });
      });
    },

    getPricing({ commit }, requestPayload) {
      // the requestPayload contains the pickUpData and the DropOff Data
      return new Promise((resolve, reject) => {
        // assuming there are two different paths for single and multiple dropoff requests
        // for single DropOff request
        if (requestPayload.dropOffData.length == 1) {
          // send payload to single request api and set the return payload to the pricing store state
          const path = "https://api.desymal.com/v1/route/get";
          const params = {
            source: requestPayload.pickupData.searchAddress.place_id,
            isSourceID: "t",
            destination: requestPayload.dropOffData[0].searchAddress.place_id,
            isDestID: "t"
          };

          // Store the user request data to be saved after transaction is over
          commit("request_payload_mutation", requestPayload);
          VueCookie.set(cookeys.REQUEST_DELIVERY_PAYLOAD_KEY, JSON.stringify(requestPayload), {
            expires: cookeys.cookie_expire
          });
          axios
            .get(path, { params: params })
            .then(resp => {
              const pricing = resp.data.pricing;
              // check for negative values and rectify as such
              for (var key in pricing) {
                if (pricing[key] < 0) {
                  pricing[key] = "N/A";
                }
              }
              commit("pricing_success", pricing);
              VueCookie.set(cookeys.PRICING_KEY, JSON.stringify(pricing), {
                expires: cookeys.cookie_expire
              });
              resolve(resp);
            })
            .catch(error => {
              commit("pricing_error");
              reject(error);
            });
        } else if (requestPayload.dropOffData.length > 1) {
          // send payload to multiple request api and set the return payload to the pricing store state
        }
      });
    },

    // TODO: Work on promo code later on
    validatePromoCode({ commit }, payload) {
      // payload is the promocode from the user
      return new Promise((resolve, reject) => {
        const path = "https://api.desymal.com/v1/promo/:" + payload.code + "/:" + payload.id;
        axios
          .get(path)
          .then(resp => {
            const data = resp.data;
            commit("promocode_auth_success", data);
            resolve(resp);
          })
          .catch(err => {
            commit("promocode_auth_error");
            reject(err);
          });
      });
    },

    confirmOrder({ commit }, payload) {
      // payload might to be received might be the amount alone since the rest can be obtained in the store already
      return new Promise((resolve, reject) => {
        // API to book transaction
        const path = "https://api.desymal.com/v1/user/sends/create";
        axios
          .post(path, payload)
          .then(resp => {
            // returns webId, transactionNumber and secretKey on success
            const bookingInfo = resp.data;
            VueCookie.set(cookeys.BOOKING_SUCCESS_PAYLOAD_KEY, JSON.stringify(bookingInfo), {
              expires: cookeys.cookie_expire
            });
            commit("booking_success", bookingInfo);
            resolve(resp);
          })
          .catch(error => {
            commit("booking_error");
            reject(error);
          });
      });
    },

    getCourier({ commit }, payload) {
      // console.log(payload)
      return new Promise((resolve, reject) => {
        const path = "https://api.desymal.com/v1/assigncourier";
        // and ugly hack to prevent user from going back to the courier found page
        commit("setRawRouteGuards", false);
        axios
          .get(path, { params: payload })
          .then(resp => {
            commit("courier_searching_success");
            resolve(resp);
          })
          .catch(err => {
            commit("courier_searching_failure");
            reject(err);
          });
      });
    },

    updateFCMToken({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const path = "https://api.desymal.com/user/fcmtoken";
        axios
          .post(path, payload)
          .then(resp => {
            commit("token_refresh_success");
            resolve(resp);
          })
          .catch(err => {
            commit("token_refresh_error");
            reject(err);
          });
      });
    },

    getOngoingTransactions({ commit }, id) {
      return new Promise((resolve, reject) => {
        const path = "https://api.desymal.com/user/" + String(id) + "/ongoingtransactions";
        axios
          .get(path)
          .then(resp => {
            const data = resp.data;
            VueCookie.set(cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(data), {
              expires: cookeys.cookie_expire
            });
            commit("ongoing_transactions_success");
            resolve(resp);
          })
          .catch(err => {
            commit("ongoing_transactions_error");
            reject(err);
          });
      });
    },

    changeEmail({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const path = "https://api.desymal.com/user/email/change";
        axios
          .post(path, payload)
          .then(resp => {
            commit("email_change_success");
            resolve(resp);
          })
          .catch(error => {
            commit("email_change_error");
            reject(error);
          });
      });
    },

    changePassword({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const path = "https://api.desymal.com/user/password/change";
        axios
          .post(path, payload)
          .then(resp => {
            commit("password_change_success");
            resolve(resp);
          })
          .catch(error => {
            commit("password_change_error");
            reject(error);
          });
      });
    },

    getScheduledTransactions({ commit }, id) {
      return new Promise((resolve, reject) => {
        const path = "https://api.desymal.com/user/" + String(id) + "/scheduledtransactions";
        axios
          .get(path)
          .then(resp => {
            const scheduledData = resp.data;
            commit("scheduled_data_return_success");
            resolve(resp);
          })
          .catch(error => {
            commit("scheduled_data_return_error");
            reject(error);
          });
      });
    },

    getTransactionsHistory({ commit }, id) {
      return new Promise((resolve, reject) => {
        const path = "https://api.desymal.com/user/" + String(id) + "/finishedtransactions";
        axios
          .get(path)
          .then(resp => {
            const historyData = resp.data;
            commit("transactions_history_success");
            resolve(resp);
          })
          .catch(error => {
            commit("transactions_history_error");
            reject(error);
          });
      });
    }
  },

  getters: {
    loggedIn(state) {
      if (state.token != "") {
        return true;
      } else {
        return false;
      }
    }
  }
});
