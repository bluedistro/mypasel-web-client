import axios from "axios";
import VueCookie from "vue-cookie";
import cookeys from "../cookeys";

// check for presence of token
const checkFCMTokenPresence = ({ commit }) => {
  return new Promise((resolve, reject) => {
    const fcm_token = VueCookie.get(cookeys.FCM_TOKEN_KEY);
    if (fcm_token != null) {
      resolve(fcm_token);
    } else {
      const error = "Unable to retrieve FCM token";
      reject(error);
    }
  });
};

const login = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    // check whether login id is email or phone number
    const params = user.emailOrPhoneNumber.match(/[a-z]/i) ? {emailAddress: user.emailOrPhoneNumber, password: user.password} : {phoneNumber: user.emailOrPhoneNumber, password: user.password}
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
};

// and ugly hack to prevent user from going back to the courier found page
const redirectToOngoing = ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit("setRawRouteGuards", true);
  });
};

const register = ({ commit }, registerData) => {
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
        sex: registerData.sex,
        referenceNumber: 'N/A',
      };
    }

    if (registerData.type == "business") {
      params = {
        emailAddress: registerData.companyEmployeeEmail,
        name: registerData.companyEmployeeName,
        country: registerData.companyEmployeeCountry,
        phoneNumber: registerData.companyEmployeePhone,
        password: registerData.companyEmployeePassword,
        type: registerData.type,
        sex: registerData.companyEmployeeSex,
        referenceNumber: registerData.companyEmployeeReferenceNumber,
      };
    }
    console.log('register params ', params);
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
};

const logout = ({ commit }) => {
  return new Promise((resolve, reject) => {
    // remove all stored items
    for (var key in cookeys) {
      // avoid logging inherited properties
      if (cookeys.hasOwnProperty(key)) {
        VueCookie.delete(cookeys[key]);
      }
    }
    // remove saved addresses
    if (JSON.parse(localStorage.getItem("savedPickUpData")) != null) {
      localStorage.removeItem("savedPickUpData");
    }

    delete axios.defaults.headers.common["Authorization"];
    commit("logout");
    resolve();
  });
};

const cancelTransaction = ({ commit }, payload) => {
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
};

const getPricing = ({ commit }, requestPayload) => {
  // the requestPayload contains the pickUpData and the DropOff Data
  return new Promise((resolve, reject) => {
    // assuming there are two different paths for single and multiple dropoff requests
    // for single DropOff request
    const destinations = [];
    for (let i = 0; i < requestPayload.dropOffData.length; i++) {
      const dest_loc =
        requestPayload.dropOffData[i].searchAddress.location.lat +
        "," +
        requestPayload.dropOffData[i].searchAddress.location.lng;
      destinations.push(dest_loc);
    }

    // if (requestPayload.dropOffData.length == 1) {
    // send payload to single request api and set the return payload to the pricing store state
    const path = "https://api.desymal.com/v2/route/get";
    // check for the source of the data whether it is coming from the raw google autocomplete or a saved info and act accordingly
    var source;
    if (requestPayload.pickupData.searchAddress.source == "saved") {
      source =
        requestPayload.pickupData.searchAddress.location.lat +
        "," +
        requestPayload.pickupData.searchAddress.location.lng;
    } else if (requestPayload.pickupData.searchAddress.source == "direct") {
      source =
        requestPayload.pickupData.searchAddress.location.lat +
        "," +
        requestPayload.pickupData.searchAddress.location.lng;
    }
    const params = {
      source: source,
      destinations: destinations,
      sourceID: requestPayload.pickupData.searchAddress.place_id
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
        // add currency to pricing
        pricing.currency = "GHS";
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
    // }
  });
};

// NOTE: Promo code no longer needed
// validatePromoCode({ commit }, payload) {
//   return new Promise((resolve, reject) => {
//     const path = "https://api.desymal.com/v1/promo/:" + payload.code + "/:" + payload.id;
//     axios
//       .get(path)
//       .then(resp => {
//         const data = resp.data;
//         commit("promocode_auth_success", data);
//         resolve(resp);
//       })
//       .catch(err => {
//         commit("promocode_auth_error");
//         reject(err);
//       });
//   });
// },

const confirmOrder = ({ commit }, payload) => {
  // payload might to be received might be the amount alone since the rest can be obtained in the store already
  return new Promise((resolve, reject) => {
    // API to book transaction
    const path = "https://api.desymal.com/v3/user/sends/create";
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
};

const getCourier = ({ commit }, payload) => {
  // console.log(payload)
  return new Promise((resolve, reject) => {
    const path = "https://api.desymal.com/v3/assigncourier";
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
};

const updateFCMToken = ({ commit }, payload) => {
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
};

const getOngoingTransactions = ({ commit }, id) => {
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
};

const changeEmail = ({ commit }, payload) => {
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
};

const changePassword = ({ commit }, payload) => {
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
};

const getScheduledTransactions = ({ commit }, id) => {
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
};

const getTransactionsHistory = ({ commit }, id) => {
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
};

const saveImage = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.desymal.com/user/" + String(payload.id) + "/uploadavatar";
    // axios.post(path, payload.file)
  });
};

const getProfileImage = ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.desymal.com/user/" + String(id) + "/avatar";
    axios
      .get(path)
      .then(resp => {
        commit("profile_image_retrieve_success");
        resolve(resp);
      })
      .catch(error => {
        commit("profile_image_retrieve_error");
        reject(error);
      });
  });
};

// forgot password
const requestPasswordReset = ({commit }, emailAddress) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.desymal.com/user/password/forgot";
    axios.post(path, emailAddress)
         .then((resp) => {
           commit("forgot_password_request_success");
           const email = emailAddress.emailAddress;
           VueCookie.set(cookeys.RESET_EMAIL_ADDRESS, email, {
             expires: cookeys.cookie_expire
           });
           resolve(resp)
         })
         .catch((error) => {
           commit("forgot_password_request_error");
           reject(error)
         })
  })
};

// reset password
const resetPassword = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.desymal.com/user/password/reset"
    axios.post(path, payload)
         .then((resp) => {
           commit('reset_password_success')
           resolve(resp)
         })
         .catch((error) => {
           commit('reset_password_error');
           reject(error)
         })
  })
};

export default {
  checkFCMTokenPresence,
  login,
  redirectToOngoing,
  register,
  logout,
  cancelTransaction,
  getPricing,
  confirmOrder,
  getCourier,
  updateFCMToken,
  getOngoingTransactions,
  changeEmail,
  changePassword,
  getScheduledTransactions,
  getTransactionsHistory,
  saveImage,
  getProfileImage,
  requestPasswordReset,
  resetPassword
};
