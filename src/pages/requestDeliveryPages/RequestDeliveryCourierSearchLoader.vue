<template lang="html">
  <div class="container">
    <navbar :hidden="hideTabs"></navbar>
     <div class="row">
       <div class="col-md-12 col-lg-12 col-sm-12 col-12 search-animate">
         <div class="la-ball-scale-multiple la-blue la-lg">
          <div></div>
          <div></div>
          <div></div>
           <div></div>
         </div>
       </div>
     </div>
    <div class="loader">
      <div class="loader--text"></div>
      <div class="timer-display">
         <span v-bind:style="{ 'color':countDownTextColor }">{{ countdownMinutes }} : {{ countdownSeconds }}</span>
      </div>
      <button
        type="button"
        class="btn btn-info btn-sm cancel-order"
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
          <b-button variant="outline-info" @click="stopCancellationProcess">Ignore</b-button>
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
            variant="outline-info"
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
    <!-- courier search timeout -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="courier-search-timeout-modal"
        size="sm"
        id="courier-search-timeout-modal"
        v-model="courierSearchTimeoutModal"
        title="Courier search timed out"
      >
        <p class="courier-search-timeout-modal-text">No courier responded to your request. Please place another request</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="outline-success" @click="timedOutController">Okay</b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
var socketIOClient = require('socket.io-client')
var sailsIOClient = require('sails.io.js')

const Navbar = () => import("./RequestDeliveryNavbar")

export default {
  name: "CourierSearchLoader",
  components: {
    navbar: Navbar
  },
  data () {
    return {
      cancellationReason: "",
      hideTabs: true,
      courierFoundModal: false,
      courierSearchTimeoutModal: false,
      successfulBookingModal: false,
      unsuccessfulBookingModal: false,
      bookingCancellationFormModal: false,
      search: this.$store.state.search,
      deliveryMode: null,
      fcm: this.$cookie.get(this.$cookeys.FCM_TOKEN_KEY),
      courierFoundStatus: false,
      countdownMinutes: null,
      countdownSeconds: null,
      countDownTextColor: '#48f542'
    }
  },
  methods: {
    courierDetails () {
      this.$refs["courier-found-modal"].hide()
      this.$router.push({ name: "CourierFound" })
    },
    timedOutController () {
      this.$refs["courier-search-timeout-modal"].hide()
      this.$router.push({name: 'RequestDelivery'})
    },
    stopCancellationProcess () {
      this.bookingCancellationFormModal = false;
    },
    // modal control message display for successful order cancellation
    bookingErrorCancellationSuccessModalHide () {
      this.$refs["booking-cancellation-success-modal"].hide()
      this.$router.push({ name: "RequestDelivery" })
    },
    // form collection for order cancellation
    bookingErrorModalHide () {
      this.$refs["booking-cancellation-error-modal"].hide()
    },
    // Whole control operation for booking cancellation
    bookingCancellationErrorModalTry () {
      let loader = this.$loading.show({
        loader: "bars",
        color: "#00bcd4",
        opacity: 0.7,
        height: 80,
        width: 80
      })
      const id = JSON.parse(this.$cookie.get(this.$cookeys.BOOKING_SUCCESS_PAYLOAD_KEY)).webId
      const payload = {
        cancelId: id,
        reason: this.cancellationReason
      }
      this.$refs["booking-cancellation-error-form-modal"].hide()
      // make a call to the order cancellation action in store
      return this.$store
        .dispatch("cancelTransaction", payload)
        .then(resp => {
          loader.hide()
          this.successfulBookingModal = true
        })
        .catch(err => {
          loader.hide()
          this.unsuccessfulBookingModal = true
        })
    },
    // kick starter function for order cancellation procedure
    cancelOrder (evt) {
      this.bookingCancellationFormModal = true
    }
  },
  created () {
    // if routed before due time, initiate forceful redirect to payment page
    if (!this.search) {
      this.$router.push({ name: "RequestPayment" })
    }

    const payload = {
      sendID: JSON.parse(this.$cookie.get(this.$cookeys.BOOKING_SUCCESS_PAYLOAD_KEY)).webId
    }

    // test firebase
    this.$store
      .dispatch("getCourier", payload)
      .then(resp => {} )
      .catch(err => {} )

      const id = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id
      let io
      if(socketIOClient.sails){
        io = socketIOClient
      }else{
        io = sailsIOClient(socketIOClient)
      }
      io.sails.url = "https://api.mypasel.com"
      io.socket.request({
            method: 'get',
            url: '/user/subscribe?id='+id,
            headers: {
              'Authorization': 'key=EA9559850E60F62854CBB543791D5141'
            }
          },
          (responseData, jwres)=>{})

      io.socket.on('events', (payload) => {
            if (payload.activity == "Courier found") {
              this.$cookie.set(this.$cookeys.COURIER_DETAILS_KEY, JSON.stringify(payload), {
                expires: this.$cookeys.cookie_expire
              })
              this.courierFoundModal = true
            }
        })

  },
  mounted () {
    var start = new Date().getTime()
    // countdown from 5 minutes
    var countdown = new Date(start + 5*60000)
    var x = setInterval(() => {
      var now = new Date().getTime()
      var distance = countdown - now
      this.countdownMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      this.countdownSeconds = Math.floor((distance % (1000 * 60)) / 1000)
      if(distance < 60000){
        this.countDownTextColor = '#c43d14'
      }
      if(distance < 1000){
        this.courierSearchTimeoutModal = true
        clearInterval(x)
      }
    })
  }
}

</script>

<style lang="css" scoped>

.search-animate {
  margin-top: 100px;
  text-align: center;
}

/*!
 * Load Awesome v1.1.0 (http://github.danielcardoso.net/load-awesome/)
 * Copyright 2015 Daniel Cardoso <@DanielCardoso>
 * Licensed under MIT
 */
.la-ball-scale-multiple,
.la-ball-scale-multiple > div {
    position: relative;
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
}
.la-ball-scale-multiple {
    display: inline-block;
    margin-left: -300px;
    font-size: 0;
    color: #fff;
}


.la-ball-scale-multiple.la-dark {
    color: #333;
}

.la-ball-scale-multiple.la-blue{
  color: #5bc0de;
}

.la-ball-scale-multiple > div {
    display: inline-block;
    float: none;
    background-color: currentColor;
    border: 0 solid currentColor;
}
.la-ball-scale-multiple {
    width: 32px;
    height: 32px;
}
.la-ball-scale-multiple > div {
    position: absolute;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    opacity: 0;
    -webkit-animation: ball-scale-multiple 1s 0s linear infinite;
       -moz-animation: ball-scale-multiple 1s 0s linear infinite;
         -o-animation: ball-scale-multiple 1s 0s linear infinite;
            animation: ball-scale-multiple 1s 0s linear infinite;
}
.la-ball-scale-multiple > div:nth-child(2) {
    -webkit-animation-delay: .2s;
       -moz-animation-delay: .2s;
         -o-animation-delay: .2s;
            animation-delay: .2s;
}
.la-ball-scale-multiple > div:nth-child(3) {
    -webkit-animation-delay: .4s;
       -moz-animation-delay: .4s;
         -o-animation-delay: .4s;
            animation-delay: .4s;
}
.la-ball-scale-multiple > div:nth-child(4) {
    -webkit-animation-delay: .4s;
       -moz-animation-delay: .4s;
         -o-animation-delay: .4s;
            animation-delay: .4s;
}
.la-ball-scale-multiple.la-sm {
    width: 16px;
    height: 16px;
}
.la-ball-scale-multiple.la-sm > div {
    width: 16px;
    height: 16px;
}
.la-ball-scale-multiple.la-2x {
    width: 64px;
    height: 64px;
}
.la-ball-scale-multiple.la-2x > div {
    width: 64px;
    height: 64px;
}
.la-ball-scale-multiple.la-3x {
    width: 96px;
    height: 96px;
}
.la-ball-scale-multiple.la-3x > div {
    width: 96px;
    height: 96px;
}
.la-ball-scale-multiple.la-lg {
    width: 300px;
    height: 300px;
}
.la-ball-scale-multiple.la-lg > div {
    width: 300px;
    height: 300px;
}
/*
 * Animation
 */
@-webkit-keyframes ball-scale-multiple {
    0% {
        opacity: 0;
        -webkit-transform: scale(0);
                transform: scale(0);
    }
    5% {
        opacity: .75;
    }
    100% {
        opacity: 0;
        -webkit-transform: scale(1);
                transform: scale(1);
    }
}
@-moz-keyframes ball-scale-multiple {
    0% {
        opacity: 0;
        -moz-transform: scale(0);
             transform: scale(0);
    }
    5% {
        opacity: .75;
    }
    100% {
        opacity: 0;
        -moz-transform: scale(1);
             transform: scale(1);
    }
}
@-o-keyframes ball-scale-multiple {
    0% {
        opacity: 0;
        -o-transform: scale(0);
           transform: scale(0);
    }
    5% {
        opacity: .75;
    }
    100% {
        opacity: 0;
        -o-transform: scale(1);
           transform: scale(1);
    }
}
@keyframes ball-scale-multiple {
    0% {
        opacity: 0;
        -webkit-transform: scale(0);
           -moz-transform: scale(0);
             -o-transform: scale(0);
                transform: scale(0);
    }
    5% {
        opacity: .75;
    }
    100% {
        opacity: 0;
        -webkit-transform: scale(1);
           -moz-transform: scale(1);
             -o-transform: scale(1);
                transform: scale(1);
    }
}

.cancel-order{
  height: 50px;
  width: 300px;
  position: fixed;
  top: 75%;
  left: 50%;
  margin-left: -150px;
  margin-top: -10px;
}

.timer-display {
  color: #808996;
  height: 20px;
  width: 300px;
  background-color: #e0dfd7;
  position: fixed;
  top: 84%;
  left: 50%;
  margin-left: -150px;
  margin-top: -10px;
}

@media screen and (max-width:500px){
  .cancel-order{
    height: 50px;
    width: 300px;
    position: fixed;
    top: 65%;
    left: 50%;
    margin-left: -150px;
    margin-top: 70px;
  }

  .timer-display {
    color: #808996;
    height: 20px;
    width: 300px;
    background-color: #e0dfd7;
    position: fixed;
    top: 86%;
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

.loader {
height: 90px;
width: 300px;
position: fixed;
top: 40%;
left: 50%;
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
content: "Searching for courier";
color: #333;
animation: loading-text 10s ease-in-out infinite both;
}

@keyframes loading-text {
  0% {
    content: "Searching for courier";
  }
  25% {
    content: "Searching for courier.";
  }
  50% {
    content: "Searching for courier..";
  }
  75% {
    content: "Searching for courier...";
  }
}
</style>
