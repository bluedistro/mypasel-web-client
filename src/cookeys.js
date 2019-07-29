/*
All cookies generated and used in the application are code named
in this file to ensure a little bit tighter security.


In addition to the store.js file, Cookies are set in the following components as well
* RequestDelivery.vue,
* RequestDeliveryCourierFound.vue
* RequestDeliveryCourierSearchLoader.vue
* RequestDelveryOngoing.vue
* RequestDeliveryUserAccount.vue

All components reference this script with the prototype $cookeys
declared in the main script except the Ongoing Component
due to firebase conflicting this keyword.

LIST OF COOKIE KEYS AND WHAT THEY HOLD
-----------------------------------------
USER_DATA_KEY: Contains basic user information and login credentials
TOKEN_KEY: Contains the user token used for authenticating users in the application
REQUEST_DELIVERY_PAYLOAD_KEY: Contains the payload which is sent to the
request delivery API when a user makes a delivery request
PRICING_KEY: Contains the pricing of the delivery option selected
BOOKING_SUCCESS_PAYLOAD_KEY: Contains information about successful booking transaction
such as transactionNumber, webId, etc...
ONGOING_TRANSACTIONS_DATA_KEY: Contains a list of  currently active deliveries
FCM_TOKEN: Contains the Firebase Cloud Messaging token to enable browser notificatons
DELIVERY_TIME: Contains the delivery time option selected by the user
DELIVERY_MODE: Contains the delivery mode option selected by the user
COURIER_DETAILS_KEY: Contains the information about the courier which responded
to a particular delivery request
*/

const user = "MPSL140GH"
const token_key = "MPSL250GH"
const request_delivery_payload = "MPSL3140GH"
const pricing = "MPSL470GH"
const booking_success_payload = "MPSL5190GH"
const ongoing_transactions_payload = "MPSL6200GH"
const fcm_token = "MPSL790GH"
const delivery_time = "MPSL8130GH"
const delivery_mode = "MPSL9130GH"
const courier_details_key = "MPSL10150GH"
const saved_address_key = 'MPSL11190GH'
const resetEmailAddress = 'MPSLXXZY200GH'

const cookeys = {
  USER_DATA_KEY: user,
  TOKEN_KEY: token_key,
  REQUEST_DELIVERY_PAYLOAD_KEY: request_delivery_payload,
  PRICING_KEY: pricing,
  BOOKING_SUCCESS_PAYLOAD_KEY: booking_success_payload,
  ONGOING_TRANSACTIONS_DATA_KEY: ongoing_transactions_payload,
  FCM_TOKEN_KEY: fcm_token,
  DELIVERY_TIME: delivery_time,
  DELIVERY_MODE: delivery_mode,
  COURIER_DETAILS_KEY: courier_details_key,
  SAVED_ADDRESS_KEY: saved_address_key,
  RESET_EMAIL_ADDRESS: resetEmailAddress,
  cookie_expire: 30 // 30 days duration for cookie
}

export default cookeys
