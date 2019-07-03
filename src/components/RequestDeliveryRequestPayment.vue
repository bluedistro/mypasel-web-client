<template lang="html">
  <div>
    <navbar></navbar>
    <div class="col-md-5 col-lg-5 col-12 payment-div">
      <div class="row">
        <div class="col">
          <h5 class="payment-header">Select Payment Mode</h5>
        </div>
        <div class="col">
          <h6 class="pricing-amount">GHS {{ amount }}.00</h6>
        </div>
      </div>
      <div class="payment-row-header-border"></div>
      <div class="row v-payment-row">
        <div class="col-md-4 col-4">
          <input
            type="radio"
            name="paymentOption"
            id="cash"
            checked
            class="input-hidden"
            value="cash"
            v-model="paymentOption"
          />
          <label for="cash">
            Cash
            <img src="../assets/cedi.jpg" height="40px" width="100px" />
          </label>
        </div>
        <div class="col-md-4 col-4">
          <input
            type="radio"
            name="paymentOption"
            id="momo"
            class="input-hidden"
            value="mobileMoney"
            :disabled="disableMobileMoneyOption"
            v-model="paymentOption"
          />
          <label for="momo">
            Mobile Money
            <img src="../assets/mobile-money.jpg" height="40px" width="100px" />
          </label>
        </div>
        <div class="col-md-4 col-4">
          <input
            type="radio"
            name="paymentOption"
            id="prepaid"
            class="input-hidden"
            value="prepaid"
            :disabled="disablePrepaidOption"
            v-model="paymentOption"
          />
          <label for="prepaid">
            Prepaid
            <img src="../assets/prepaid.jpeg" height="40px" width="100px" />
          </label>
        </div>
      </div>
      <div class="payment-row-border"></div>
      <!-- Payment Form Div -->
      <div class="row">
        <!--  cash -->
        <div v-if="paymentOption == 'cash'" class="radioLinkedDiv col-md-12">
          <!-- no action to be performed on cash select -->
        </div>

        <!--  mobile money -->
        <div v-if="paymentOption == 'mobileMoney'" class="radioLinkedDiv col-md-12">
          <div class="col-md-12 contact-name">
            <input
              type="text"
              id="registeredName"
              placeholder="Registered name"
              class="form-control"
              name=""
              value=""
            />
          </div>
          <div class="col-md-12 contact-number">
            <vue-phone-number-input
              v-model="phoneNumber"
              :default-country-code="phoneField.defaultCode"
              :clearable="phoneField.clearable"
              :preferred-countries="phoneField.preferred"
              name="phoneNumber"
              id="phoneNumber"
            />
          </div>
          <div class="payment-row-border"></div>
        </div>
        <!--  prepaid -->
        <div v-if="paymentOption == 'prepaid'" class="radioLinkedDiv col-md-12">
          <div class="col-md-12 contact-name">
            <input
              type="text"
              id="registeredName"
              placeholder="Company name"
              class="form-control"
              name=""
              value=""
            />
          </div>
          <div class="col-md-12 contact-number">
            <vue-phone-number-input
              v-model="phoneNumber"
              :default-country-code="phoneField.defaultCode"
              :clearable="phoneField.clearable"
              :preferred-countries="phoneField.preferred"
              name="phoneNumber"
              id="phoneNumber"
            />
          </div>
          <div class="payment-row-border"></div>
        </div>
      </div>

      <!-- promo code -->
      <div class="promo-code-div">
        <div class="col-md-12">
          <!-- get promo code and update amount -->
          <div class="row">
            <div class="col-md-8 col-sm-8 col-8 promo-code-text">
              Use promo code
            </div>
            <div class="col-md-4 col-sm-4 col-4">
              <label class="switch" id="toggleRadio">
                <input
                  type="checkbox"
                  :disabled="disablePromoCodeFeature"
                  v-model="toggleState"
                  @click="changeToggleState"
                />
                <span class="slider"></span>
              </label>
              <b-tooltip
                v-show="disablePromoCodeFeature"
                target="toggleRadio"
                placement="bottom"
                title="feature is disabled"
              ></b-tooltip>
            </div>
          </div>
          <div v-show="promoCodeToggle" class="row">
            <div class="row col-md-12">
              <div class="col-8 col-md-8 col-sm-8 col-lg-8">
                <input
                  type="text"
                  id="registeredName"
                  placeholder="Enter code"
                  v-model="promoCode"
                  class="form-control"
                  name=""
                  value=""
                />
              </div>
              <div class="col-4 col-md-4 col-sm-4 col-lg-4 promo-code-btn">
                <input
                  type="button"
                  @click="checkPromoCodeValidity"
                  class="form-control btn-sm btn btn-outline-info"
                  value="Apply"
                  name="button"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- proceed div -->
      <div class="col-md-12">
        <button
          type="button"
          @click="confirmOrder"
          v-promise-btn
          class="btn btn-outline-dark btn-sm proceedBtn"
          name="button"
        >
          Confirm Order
        </button>
      </div>
    </div>
    <!-- Unable to book -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="booking-error-modal"
        size="sm"
        id="booking-error-modal"
        v-model="unsuccessfulBookingModal"
        title="Booking Status"
      >
        <p class="booking-error-modal-text">
          Sorry, we were unable to complete your transaction booking.
        </p>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button size="sm" variant="warning" @click="bookingErrorModalHide"
            >Start new request</b-button
          >
          <b-button size="sm" variant="outline-dark" @click="bookingErrorModalTry"
            >Try Again</b-button
          >
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
const Navbar = () => import("./RequestDeliveryNavbar");
export default {
  name: "RequestPayment",
  components: {
    navbar: Navbar
  },
  data() {
    return {
      // disable prepaid and mobile money payment option
      disablePrepaidOption: true,
      disableMobileMoneyOption: true,
      // modal works
      unsuccessfulBookingModal: false,

      phoneField: {
        defaultCode: "GH",
        preferred: ["GH"],
        clearable: true
      },
      phoneNumber: "",
      paymentOption: "cash",
      promoCodeToggle: false,
      toggleState: false,
      deliveryMode: this.$cookie.get(this.$cookeys.DELIVERY_MODE),
      amount: null,
      promoCode: null,
      sourceCountry: "Ghana",
      targetCountry: "Ghana",
      disablePromoCodeFeature: true,
      bookingData: null,
      fcm: this.$cookie.get(this.$cookeys.FCM_TOKEN_KEY)
    };
  },
  methods: {
    bookingErrorModalHide() {
      this.$refs["booking-error-modal"].hide();
      this.$router.push({ name: "RequestDelivery" });
    },
    bookingErrorModalTry() {
      this.$refs["booking-error-modal"].hide();
    },
    // TODO: Finish Promo code feature at a later time
    checkPromoCodeValidity(evt) {
      // send promocode if any
      const payload = {
        id: JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id,
        code: this.promoCode
      };
      this.$store
        .dispatch("validatePromoCode", payload)
        .then(resp => {
          console.log(resp);
        })
        .catch(error => {});
    },
    // Promocode has been disabled
    changeToggleState(evt) {
      this.toggleState = !this.toggleState;
      this.promoCodeToggle = !this.promoCodeToggle;
    },
    // confirm booking order
    confirmOrder(evt) {
      // prepare payload
      const requestPayload = this.$cookie.get(this.$cookeys.REQUEST_DELIVERY_PAYLOAD_KEY);
      const parsedRequestPayload = JSON.parse(requestPayload);
      const dropoffs = []
      for(let i = 0; i < parsedRequestPayload.dropOffData.length; i++){
        const d_o = {
          name: parsedRequestPayload.dropOffData[i].searchAddress.formatted_address,
          latitude: parsedRequestPayload.dropOffData[i].searchAddress.location.lat,
          longitude: parsedRequestPayload.dropOffData[i].searchAddress.location.lng,
          contact: {
            name: parsedRequestPayload.dropOffData[i].fullName,
            phone: parsedRequestPayload.dropOffData[i].phoneNumber,
          },
          additionalInformation: ""
        }
        dropoffs.push(d_o);
      }

      const payload = {
        sender: JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id, // sender ID Is obtained from user store
        pickup: {
          name: parsedRequestPayload.pickupData.searchAddress.formatted_address,
          latitude: parsedRequestPayload.pickupData.searchAddress.location.lat,
          longitude: parsedRequestPayload.pickupData.searchAddress.location.lng,
          contact: {
            name: parsedRequestPayload.pickupData.fullName,
            phone: parsedRequestPayload.pickupData.phoneNumber,
          },
          additionalInformation: parsedRequestPayload.pickupData.details
        },
        dropoffs: dropoffs,
        deliveryDate: JSON.parse(this.$cookie.get(this.$cookeys.DELIVERY_TIME)),
        modeOfDelivery: this.deliveryMode,
        fee: this.amount
      };

      // post to the API of the confirm Order
      return this.$store
        .dispatch("confirmOrder", payload)
        .then(resp => {
          // redirect to courier search loader
          this.$router.push({ name: "SearchingCourier" });
        })
        .catch(error => {
          this.unsuccessfulBookingModal = true;
        });
    }
  },
  computed: {},
  created() {
    if (this.$store.state.search == true) {
      this.$router.push({ name: "SearchingCourier" });
    }
    // check for pricing availability and value
    let option = this.deliveryMode;
    this.amount = JSON.parse(this.$cookie.get(this.$cookeys.PRICING_KEY))[option];
  },
  beforeDestroy() {}
};
</script>

<style lang="css" scoped>

.radioLinkedDiv .contact-number {
   margin-top: 20px;
}

.radioLinkedDiv {
  margin-top: 30px;
}

.proceedBtn {
  float: left;
  margin-top: 10px;
}

.labelFloat {
  float: left;
}

input[type=radio] + label {
  /* border: 1px dashed #444; */
  width: 100px;
  height: 40px;
}

.input-hidden {
  position: absolute;
  left: -9999px;
}

input[type=radio]:checked + label>img {
  border: 1px dashed green;
  -webkit-box-shadow: 0px 1px 5px 0px rgba(11,123,252,1);
-moz-box-shadow: 0px 1px 5px 0px rgba(11,123,252,1);
box-shadow: 0px 1px 5px 0px rgba(11,123,252,1);
}

.v-name-container{
text-align: left;
}

.v-payment-row{
  margin-bottom: 12px;
}

.payment-row-border {
  margin-top: 25px;
  border-bottom: solid #d4d8dd 1px;
}

.payment-row-header-border {
  margin-bottom: 5px;
  border-bottom: solid #d4d8dd 1px;
}

.promo-code-entry {
  text-align: right;
}

.promo-code-btn {
  text-align: right;
  float: right;
}

.promo-code-text {
  text-align: left;
  font-size: 120%;
  font-family: 'Sans';
}

.payment-header {
  margin-top: 8px;
  margin-bottom: 20px;
  /* text-align: left; */
  color: #57585b;
  font-size: 110%;
}

.pricing-amount {
  margin-top: 8px;
  margin-bottom: 20px;
  /* text-align: right; */
  color: green;
  font-size: 110%;
}

.promo-code-div {
  margin-top: 20px;
}

.payment-div {
    border: solid #d4d8dd 1px;
    /* height: 300px; */
    border-radius: 1px;
    background-color: #fff;
    padding: 12px;
    margin-bottom: 15px;
    /* width: 280px; */

  }

  @media screen and (max-width:500px){
    .payment-div {
      border:none;
      height: 350px;
      margin-top: 50px;
      /* border: solid #d4d8dd 1px; */
      margin: auto;
      top: 0%;
      bottom: 0;
      left: 0;
      right: 0;
      position: absolute;
      /* height: 350px; */

    }

    .payment-header{
      font-size: 95%;
    }

    .pricing-amount{
      font-size: 95%;
    }


  }

  @media screen and (min-width:768px){
    .payment-div {
      border: solid #d4d8dd 1px;
      margin: auto;
      top: 5%;
      bottom: 0;
      left: 0;
      right: 0;
      position: absolute;
      height: 450px;

    }

    .payment-header{
      font-size: 110%;
      text-align: left;
    }

    .pricing-amount{
      font-size: 110%;
      text-align: right;
    }

  }


  /*  diff switch */
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
</style>
