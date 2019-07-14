import state from './state';

const auth_request = (state) => {
  state.status = "loading";
};

const auth_success = (state, data) => {
  state.status = "success";
  state.token = data.token;
  state.search = false;
  state.user = data.user;
};

const auth_error = (state) => {
  state.status = "error";
  state.search = false;
};

const logout = (state) => {
  state.search = false;
  state.status = "";
  state.token = "";
};

const register_success = (state) => {
  state.status = "registration_success";
  state.search = false;
};

const register_error = (state) => {
  state.status = "registration_error";
  state.search = false;
};

const pricing_success = (state, data) => {
  state.search = false;
  state.status = "pricing_success";
  state.pricing = data;
};

const pricing_error = (state) => {
  state.search = false;
  state.status = "pricing_error";
};
const request_payload_mutation = (state, data) => {
  state.request_payload = data;
  state.search = false;
};

const promo_code_authentication_success = (state, data) => {
  state.status = "promocode_auth_success";
  state.search = false;
  state.amountAfterPromoCode = data;
}

const promo_code_authentication_error = (state) =>  {
  state.status = "promocode_auth_error";
  state.search = false;
};
const booking_success = (state, data) => {
  state.status = "booking_success";
  state.booking_return_data = data;
  state.search = true;
};

const booking_error = (state) =>  {
  state.status = "booking_error";
  state.search = false;
};

const cancellation_success = (state) => {
  state.status = "booking_cancelled_successfully";
  state.search = false;
};

const cancellation_error = (state) => {
  state.status = "booking_cancellation_error";
  state.search = false;
};

const courier_searching_success = (state) => {
  state.status = "searching_courier_successfully";
  state.search = false;
};

const courier_searching_failure = (state) => {
  state.status = "searching_courier_failed";
  state.search = false;
};

const token_refresh_success = (state) => {
  state.status = "token_refresh_success";
  state.search = false;
};

const token_refresh_error = (state) => {
  state.status = "token_refresh_error";
  state.search = false;
};

const ongoing_transactions_success = (state) => {
  state.status = "ongoing_transactions_success";
  state.search = false;
};

const ongoing_transactions_error = (state) => {
  state.status = "ongoing_transactions_error";
  state.search = false;
};

const setRawRouteGuards = (state, payload) => {
  state.rawRouteGuards = payload;
};

const email_change_success = (state) => {
  state.status = "email_change_success";
};

const email_change_error = (state)  => {
  state.status = "email_change_error";
};

const password_change_success = (state) => {
  state.status = "password_change_success";
};

const password_change_error = (state) => {
  state.status = "password_change_error";
};

const scheduled_data_return_success = (state) => {
  state.status = "scheduled_data_return_success";
};

const scheduled_data_return_error = (state) => {
  state.status = "scheduled_data_return_error";
};

const transactions_history_success = (state) => {
  state.status = "transactions_history_success";
};

const transactions_history_error = (state) => {
  state.status = "transactions_history_error";
};

const profile_image_retrieve_success = (state) => {
  state.status = "profile_image_retrieve_successfully";
};

const profile_image_retrieve_error = (state) => {
  state.status = "profile_image_retrieve_error";
};

const forgot_password_request_success = (state) => {
  state.status = "forgot_password_request_success";
};

const forgot_password_request_error = (state) => {
  state.status = "forgot_password_request_error";
} ;

const reset_password_success = (state) => {
  state.status = "reset_password_success";
};

const reset_password_error = (state) => {
  state.status = "reset_password_error"
};

export default {
  auth_request,
  auth_success,
  auth_error,
  logout,
  register_success,
  register_error,
  pricing_success,
  pricing_error,
  request_payload_mutation,
  promo_code_authentication_success,
  promo_code_authentication_error,
  booking_success,
  booking_error,
  cancellation_success,
  cancellation_error,
  courier_searching_success,
  courier_searching_failure,
  token_refresh_success,
  token_refresh_error,
  ongoing_transactions_success,
  ongoing_transactions_error,
  setRawRouteGuards,
  email_change_success,
  email_change_error,
  password_change_success,
  password_change_error,
  scheduled_data_return_success,
  scheduled_data_return_error,
  transactions_history_success,
  transactions_history_error,
  profile_image_retrieve_success,
  profile_image_retrieve_error,
  forgot_password_request_success,
  forgot_password_request_error,
  reset_password_success,
  reset_password_error
};
