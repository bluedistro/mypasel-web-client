<template lang="html">
  <div>
    <navbar :hidden="hideTabs"></navbar>
    <div class="loader-icon">
      <div class="ds">
        <div class="ds">
          <div class="ds">
            <div class="ds">
              <div class="ds">
                <div class="ds"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loader">
      <div class="loader--text"></div>
      <button
        type="button"
        class="btn btn-outline-danger btn-sm cancel-order"
        name="button"
        @click="cancelOrder"
      >
        Cancel Order
      </button>
    </div>
    <!-- cancel booking -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="booking-cancellation-error-form-modal"
        id="booking-cancellation-error-form-modal"
        v-model="bookingCancellationFormModal"
        title="Order Cancellation Form"
      >
        <!-- <p class="booking-cancellation-error-modal-text">Transaction cancellation unsuccessful</p> -->
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="Can you please let us know your reason for cancelling?"
            label-for="name-input"
          >
            <b-form-textarea
              id="name-input"
              v-model="cancellationReason"
              rows="4"
              max-rows="8"
              placeholder="Reason is optional"
            ></b-form-textarea>
          </b-form-group>
        </form>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button v-promise-btn variant="outline-danger" @click="bookingCancellationErrorModalTry"
            >Cancel order</b-button
          >
          <b-button variant="outline-dark" @click="stopCancellationProcess">Ignore</b-button>
        </template>
      </b-modal>
    </div>
    <!-- Unable to cancel booking -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="booking-cancellation-error-modal"
        size="sm"
        id="booking-cancellation-error-modal"
        v-model="unsuccessfulBookingModal"
        title="Booking Cancellation Status"
      >
        <p class="booking-error-modal-text">Sorry, we were unable to cancel your order.</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="outline-danger" @click="bookingErrorModalHide"
            >Okay</b-button
          >
        </template>
      </b-modal>
    </div>
    <!-- Successful booking cancellation -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="booking-cancellation-success-modal"
        size="sm"
        id="booking-cancellation-success-modal"
        v-model="successfulBookingModal"
        title="Booking Cancellation Status"
      >
        <p class="booking-success-modal-text">Order cancellation successful.</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button
            size="sm"
            variant="outline-success"
            @click="bookingErrorCancellationSuccessModalHide"
            >Back to request delivery</b-button
          >
        </template>
      </b-modal>
    </div>
    <!-- Courier found -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="courier-found-modal"
        size="sm"
        id="courier-found-modal"
        v-model="courierFoundModal"
        title="Courier Found"
      >
        <p class="courier-found-modal-text">Continue to view courier profile.</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="outline-success" @click="courierDetails">Continue</b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
const Navbar = () => import("./RequestDeliveryNavbar");
const firebase = () => import("firebase");

export default {
  name: "CourierSearchLoader",
  components: {
    navbar: Navbar
  },
  data() {
    return {
      cancellationReason: "",
      hideTabs: true,
      courierFoundModal: false,
      successfulBookingModal: false,
      unsuccessfulBookingModal: false,
      bookingCancellationFormModal: false,
      search: this.$store.state.search,
      //
      deliveryMode: null,
      fcm: this.$cookie.get(this.$cookeys.FCM_TOKEN_KEY),
      courierFoundStatus: false
    };
  },
  methods: {
    //courier details
    courierDetails() {
      this.$refs["courier-found-modal"].hide();
      this.$router.push({ name: "CourierFound" });
    },
    // stop the cancellation process
    stopCancellationProcess() {
      this.bookingCancellationFormModal = false;
    },
    // modal control message display for successful order cancellation
    bookingErrorCancellationSuccessModalHide() {
      this.$refs["booking-cancellation-success-modal"].hide();
      // redirect back
      this.$router.push({ name: "RequestDelivery" });
    },
    // form collection for order cancellation
    bookingErrorModalHide() {
      this.$refs["booking-cancellation-error-modal"].hide();
    },
    // Whole control operation for booking cancellation
    bookingCancellationErrorModalTry() {
      const id = JSON.parse(this.$cookie.get(this.$cookeys.BOOKING_SUCCESS_PAYLOAD_KEY)).webId;
      const payload = {
        cancelId: id,
        reason: this.cancellationReason
      };
      // hide form
      this.$refs["booking-cancellation-error-form-modal"].hide();
      // make a call to the order cancellation action in store
      return this.$store
        .dispatch("cancelTransaction", payload)
        .then(resp => {
          this.successfulBookingModal = true;
        })
        .catch(err => {
          this.unsuccessfulBookingModal = true;
        });
    },
    // kick starter function for order cancellation procedure
    cancelOrder(evt) {
      this.bookingCancellationFormModal = true;
    }
  },
  created() {
    // if routed before due time, initiate forceful redirect to payment page
    if (!this.search) {
      this.$router.push({ name: "RequestPayment" });
    }

    console.log(this.fcm);
    this.deliveryMode = this.$cookie.get(this.$cookeys.DELIVERY_MODE);
    // prepare payload for courier search api
    const requestPayload = this.$cookie.get(this.$cookeys.REQUEST_DELIVERY_PAYLOAD_KEY);
    const parsedRequestPayload = JSON.parse(requestPayload);

    const payload = {
      senderID: JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id, // sender ID Is obtained from user store
      senderPhone: parsedRequestPayload.pickupData.phoneNumber,
      senderName: parsedRequestPayload.pickupData.fullName,
      recipientName: parsedRequestPayload.dropOffData[0].fullName,
      recipientPhone: parsedRequestPayload.dropOffData[0].phoneNumber,
      FCM: this.fcm,
      modeOfDelivery: this.deliveryMode,
      startingPoint: parsedRequestPayload.pickupData.searchAddress.formatted_address,
      cityOfDelivery: parsedRequestPayload.dropOffData[0].searchAddress.formatted_address,
      pickUpCoordinates:
        parsedRequestPayload.pickupData.searchAddress.location.lat +
        "," +
        parsedRequestPayload.pickupData.searchAddress.location.lng,
      destinationCoordinates:
        parsedRequestPayload.dropOffData[0].searchAddress.location.lat +
        "," +
        parsedRequestPayload.dropOffData[0].searchAddress.location.lng,
      sendID: JSON.parse(this.$cookie.get(this.$cookeys.BOOKING_SUCCESS_PAYLOAD_KEY)).webId,
      distance: ""
    };

    // console.log(payload)
    // test firebase
    this.$store
      .dispatch("getCourier", payload)
      .then(resp => {
        // nothing is returned
      })
      .catch(err => {
        console.log(err);
        console.log("Searching courier error");
      });

    this.$messaging.onMessage(payload => {
      if (payload.data.activity == "Courier found") {
        this.$cookie.set(this.$cookeys.COURIER_DETAILS_KEY, JSON.stringify(payload.data), {
          expires: this.$cookeys.cookie_expire
        });
        this.courierFoundModal = true;
      }
    });
  },
  mounted() {},
  beforeDestroy() {}
};
</script>

<style lang="css" scoped>
.ds {
display: table-cell;
border-radius: 999px;
border: 24px double #42f4d1;
animation: spin 10s alternate-reverse ease-in-out infinite both;
}

.loader-icon {
/* margin: auto; */
top: 40%;
/* bottom: 0; */
left: 50%;
margin-left: -140px;
margin-top: -120px;
/* right: 0; */
position: fixed;
height: 350px;
width: 280px;
}

.cancel-order{
  height: 50px;
  width: 300px;
  /* position: absolute; */
  position: fixed;
  top: 75%;
  /* bottom: 0; */
  left: 50%;
  /* right: 0; */
  margin-left: -150px;
  margin-top: -10px;
}

@media screen and (max-width:300px){
  .cancel-order{
    height: 50px;
    width: 300px;
    position: fixed;
    top: 65%;
    left: 50%;
    margin-left: -150px;
    margin-top: -10px;
  }


  .loader-icon {
  top: 40%;
  left: 50%;
  margin-left: -140px;
  margin-top: -120px;
  position: fixed;
  height: 350px;
  width: 280px;
  }

}

@keyframes spin {
0% { transform: rotate(0deg); border: 24px inset #42f4d1; }
25% { transform: rotate(90deg); border: 24px dotted #41f4d6; }
50% { transform: rotate(180deg); border: 24px dashed #2c9ca0; }
75% { transform: rotate(270deg); border: 24px outset #6ec5d8; }
}

.loader {
height: 90px;
width: 300px;
/* position: absolute; */
position: fixed;
top: 40%;
/* bottom: 0; */
left: 50%;
/* right: 0; */
margin-left: -160px;
margin-top: -10px;
color: white;
}

.loader--text {
position: absolute;
top: 200%;
left: 0;
right: 0;
width: 20rem;
margin: auto;
}

.loader--text:after {
content: "Contacting Nearest Available Courier";
color: #42f4d1;
animation: loading-text 10s alternate-reverse ease-in-out infinite both;
}

@keyframes loading-text {
  0% {
    content: "Contacting Nearest Available Courier";
    color: #42f4d1;
  }
  25% {
    content: "Contacting Nearest Available Courier.";
    color: #41f4d6;
  }
  50% {
    content: "Contacting Nearest Available Courier..";
    color: #2c9ca0;
  }
  75% {
    content: "Contacting Nearest Available Courier...";
    color: #6ec5d8;
  }
}
</style>
