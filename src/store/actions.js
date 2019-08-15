import axios from "axios"
import VueCookie from "vue-cookie"
import cookeys from "../cookeys"

const login = ({ commit }, user) => {
  return new Promise((resolve, reject) => {
    const params = user.emailOrPhoneNumber.match(/[a-z]/i) ? {username: user.emailOrPhoneNumber, password: user.password} : {phoneNumber: user.emailOrPhoneNumber, password: user.password}
    const path = "https://api.mypasel.com/user/account/verify"
    axios
      .post(path, params, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        const token = resp.data.token
        const user = resp.data
        let stateData = { token: token, user: user }
        VueCookie.set(cookeys.USER_DATA_KEY, JSON.stringify(user), {
          expires: cookeys.cookie_expire
        })
        VueCookie.set(cookeys.TOKEN_KEY, token, { expires: cookeys.cookie_expire })
        commit("auth_success", stateData)
        resolve(resp)
      })
      .catch(err => {
        VueCookie.delete(cookeys.TOKEN_KEY)
        commit("auth_error")
        reject(err)
      })
  })
}

// prevent user from going back to the courier found page
const redirectToOngoing = ({ commit }) => {
  return new Promise((resolve, reject) => {
    commit("setRawRouteGuards", true)
  })
}

const register = ({ commit }, registerData) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/v2/users/create"
    let params = null
    if (registerData.type == "individual") {
      params = {
        emailAddress: registerData.userEmail,
        name: registerData.userFullName,
        country: registerData.userCountry,
        phoneNumber: registerData.userPhone,
        password: registerData.userPassword,
        type: registerData.type,
        sex: registerData.sex,
        username: registerData.username,
        referenceNumber: 'N/A',
      }
    }

    if (registerData.type == "business") {
      params = {
        emailAddress: registerData.companyEmployeeEmail,
        name: registerData.companyEmployeeName,
        country: registerData.companyEmployeeCountry,
        phoneNumber: registerData.companyEmployeePhone,
        password: registerData.companyEmployeePassword,
        type: registerData.type,
        username: registerData.companyEmployeeUsername,
        sex: registerData.companyEmployeeSex,
        referenceNumber: registerData.companyEmployeeReferenceNumber,
      }
    }
    axios
      .post(path, params, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        const returnStatus = resp.data
        commit("register_success")
        resolve(resp)
      })
      .catch(err => {
        commit("register_error")
        reject(err)
      })
  })
}

const logout = ({ commit }) => {
  return new Promise((resolve, reject) => {
    for (var key in cookeys) {
      if (cookeys.hasOwnProperty(key)) {
        VueCookie.delete(cookeys[key])
      }
    }
    if (JSON.parse(localStorage.getItem("savedPickUpData")) != null) {
      localStorage.removeItem("savedPickUpData")
    }
    delete axios.defaults.headers.common["Authorization"]
    commit("logout")
    resolve()
  })
}

const cancelTransaction = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/v1/order/" + payload.cancelId + "/cancel"
    const param = {
      reason: payload.reason
    }
    axios
      .post(path, param, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        commit("cancellation_success")
        resolve(resp)
      })
      .catch(err => {
        commit("cancellation_error")
        reject(err)
      })
  })
}

const getPricing = ({ commit }, requestPayload) => {

  return new Promise((resolve, reject) => {
    const destinations = []
    for (let i = 0; i < requestPayload.dropOffData.length; i++) {
      const dest_loc =
        requestPayload.dropOffData[i].searchAddress.location.lat +
        "," +
        requestPayload.dropOffData[i].searchAddress.location.lng
      destinations.push(dest_loc)
    }

    var source;
    if (requestPayload.pickupData.searchAddress.source == "saved") {
      source =
        requestPayload.pickupData.searchAddress.location.lat +
        "," +
        requestPayload.pickupData.searchAddress.location.lng
    // feels redundant; might delete later, idk
    } else if (requestPayload.pickupData.searchAddress.source == "direct") {
      source =
        requestPayload.pickupData.searchAddress.location.lat +
        "," +
        requestPayload.pickupData.searchAddress.location.lng
    }
    const params = {
      source: source,
      destinations: destinations,
      sourceID: requestPayload.pickupData.searchAddress.place_id
    }
    const path = "https://api.mypasel.com/v2/route/get?source=" + source + "&destinations=" + destinations + "&sourceID=" + requestPayload.pickupData.searchAddress.place_id
    commit("request_payload_mutation", requestPayload)
    VueCookie.set(cookeys.REQUEST_DELIVERY_PAYLOAD_KEY, JSON.stringify(requestPayload), {
      expires: cookeys.cookie_expire
    })
    axios
      .get(path, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        const pricing = resp.data.pricing
        pricing.currency = "GHS"
        for (var key in pricing) {
          if (pricing[key] < 0) {
            pricing[key] = "N/A"
          }
        }
        commit("pricing_success", pricing)
        VueCookie.set(cookeys.PRICING_KEY, JSON.stringify(pricing), {
          expires: cookeys.cookie_expire
        })
        resolve(resp)
      })
      .catch(error => {
        commit("pricing_error")
        reject(error)
      })
  })
}

const confirmOrder = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/v3/user/sends/create"
    axios
      .post(path, payload, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        const bookingInfo = resp.data
        VueCookie.set(cookeys.BOOKING_SUCCESS_PAYLOAD_KEY, JSON.stringify(bookingInfo), {
          expires: cookeys.cookie_expire
        })
        commit("booking_success", bookingInfo)
        resolve(resp)
      })
      .catch(error => {
        commit("booking_error")
        reject(error)
      })
  })
}

const getCourier = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/v3/assigncourier?sendID=" + payload
    // prevent user from going back to the courier found page
    commit("setRawRouteGuards", false)
    axios
      .get(path, { headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        commit("courier_searching_success")
        resolve(resp)
      })
      .catch(err => {
        commit("courier_searching_failure")
        reject(err)
      })
  })
}

const getOngoingTransactions = ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/user/" + String(id) + "/ongoingtransactions"
    axios
      .get(path, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        const data = resp.data
        VueCookie.set(cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(data), {
          expires: cookeys.cookie_expire
        })
        commit("ongoing_transactions_success")
        resolve(resp)
      })
      .catch(err => {
        commit("ongoing_transactions_error")
        reject(err)
      })
  })
}

const changeEmail = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/user/email/change"
    axios
      .post(path, payload, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        commit("email_change_success")
        resolve(resp)
      })
      .catch(error => {
        commit("email_change_error")
        reject(error)
      })
  })
}

const changePassword = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/user/password/change"
    axios
      .post(path, payload, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        commit("password_change_success")
        resolve(resp)
      })
      .catch(error => {
        commit("password_change_error")
        reject(error)
      })
  })
}

const getScheduledTransactions = ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/user/" + String(id) + "/scheduledtransactions"
    axios
      .get(path, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        const scheduledData = resp.data
        commit("scheduled_data_return_success")
        resolve(resp)
      })
      .catch(error => {
        commit("scheduled_data_return_error")
        reject(error)
      })
  })
}

const getTransactionsHistory = ({ commit }, id) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/user/" + String(id) + "/finishedtransactions"
    axios
      .get(path, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        const historyData = resp.data
        commit("transactions_history_success")
        resolve(resp)
      })
      .catch(error => {
        commit("transactions_history_error")
        reject(error)
      })
  })
}

const saveImage = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    const id = JSON.parse(VueCookie.get(cookeys.USER_DATA_KEY)).id
    const path = "https://api.mypasel.com/user/" + String(id) + "/uploadavatar"
    axios.post(path, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'key=EA9559850E60F62854CBB543791D5141'
      }
    })
    .then((resp) => {
      commit('profile_image_save_success')
      resolve(resp)
    })
    .catch((error) => {
      commit('profile_image_save_error')
      reject(error)
    })
  })
}

const getProfileImage = ({ commit }) => {
  return new Promise((resolve, reject) => {
    const id = JSON.parse(VueCookie.get(cookeys.USER_DATA_KEY)).id
    const path = "https://api.mypasel.com/user/" + String(id) + "/avatarpath"
    axios
      .get(path, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
      .then(resp => {
        commit("profile_image_retrieve_success")
        resolve(resp)
      })
      .catch(error => {
        commit("profile_image_retrieve_error")
        reject(error)
      })
  })
}

const requestPasswordReset = ({ commit }, emailAddress) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/user/password/forgot"
    axios.post(path, emailAddress, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
         .then((resp) => {
           commit("forgot_password_request_success")
           const email = emailAddress.emailAddress
           VueCookie.set(cookeys.RESET_EMAIL_ADDRESS, email, {
             expires: cookeys.cookie_expire
           })
           resolve(resp)
         })
         .catch((error) => {
           commit("forgot_password_request_error")
           reject(error)
         })
  })
}

const resetPassword = ({commit}, payload) => {
  return new Promise((resolve, reject) => {
    const path = "https://api.mypasel.com/user/password/reset"
    axios.post(path, payload, {headers: { 'Authorization': 'key=EA9559850E60F62854CBB543791D5141' }})
         .then((resp) => {
           commit('reset_password_success')
           resolve(resp)
         })
         .catch((error) => {
           commit('reset_password_error')
           reject(error)
         })
  })
}

export default {
  login,
  redirectToOngoing,
  register,
  logout,
  cancelTransaction,
  getPricing,
  confirmOrder,
  getCourier,
  getOngoingTransactions,
  changeEmail,
  changePassword,
  getScheduledTransactions,
  getTransactionsHistory,
  saveImage,
  getProfileImage,
  requestPasswordReset,
  resetPassword
}
