import VueCookie from "vue-cookie";
import cookeys from "../cookeys";

const state =  {
    status: "",
    token: VueCookie.get(cookeys.TOKEN_KEY) || null,
    user: {},
    pricing: {},
    request_payload: {},
    amountAfterPromoCode: null,
    search: false,
    rawRouteGuards: null,
    booking_return_data: {}
}

export default state;
