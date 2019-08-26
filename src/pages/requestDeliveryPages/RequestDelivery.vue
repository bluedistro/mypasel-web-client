<template>
  <div class="">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 col-sm-12 col-lg-12">
          <!-- forms side -->
          <div class="row">
            <div class="col-md-5 col-sm-12 col-12 col-lg-5 formSide">
              <div>
                <content-loader class="c-loader-pickup" v-if="pickupInit == null"
                :speed="3"
                :height="250"
                :primaryColor="'#dae1ed'"
                :secondaryColor="'#8acbe3'"
                :animate="true">
                </content-loader>
                <div>
                  <pickup-form
                    @set_markers="getPickupMarker"
                    @pickup_details="getPickupInfo"
                    @pickup_init="pickup_init"
                    v-bind:disablePickupAddress="savePickup"
                    v-bind:disableFullName="savePickup"
                    v-bind:disablePhoneField="savePickup"
                    data-v-step="0"
                  >
                  </pickup-form>
                </div>
              </div>
              <div class="pickupSaveContainer">
                <div class="row pickupSave">
                  <div class="col-md-6 col-sm-10 col-10 col-lg-6 sliderDiv">
                    <label class="switch">
                      <input type="checkbox" v-model="savePickup" />
                      <span class="slider"></span>
                    </label>
                    <span class="pickupSave text">Save to address book</span>
                  </div>
                  <div class="col-md-6 col-sm-2 col-2 col-lg-6 save-help">
                    <font-awesome-icon
                      icon="question-circle"
                      id="saveHelp"
                      @click="$bvToast.show('example-toast')"
                    />
                  </div>
                  <div class="save-help-note">
                    <b-toast id="example-toast" title="Using address book" static no-auto-hide>
                      This feature saves the <strong>pickup address, sender's full name
                      and sender's phone number</strong> during the course of this session.
                      However, do note that saved information will <strong> only and
                      immediately be discarded </strong> when you log out or disable the switch.
                    </b-toast>
                  </div>
                  <b-tooltip target="saveHelp" placement="left" title="Help"> </b-tooltip>
                </div>
              </div>
              <div>
                <content-loader v-if="dropOffInit == null" class="c-loader-dropOff"
                :speed="3"
                :height="250"
                :primaryColor="'#dae1ed'"
                :secondaryColor="'#8acbe3'"
                :animate="true">
                <rect x="0" y="0" rx="0" ry="0" width="400" height="220" />
                <rect x="317" y="225" rx="0" ry="0" width="84" height="45" />
                <rect x="215" y="225" rx="0" ry="0" width="94" height="45" />
                </content-loader>
                <drop-off-form
                  v-bind:minimumDropOffs="minimumDropOffForm"
                  v-bind:maximumDropOffs="maximumDropOffForm"
                  @set_markers="getDropOffMarkers"
                  @dropoff_details="getDropOffInfo"
                  @dropOff_init="dropOff_init"
                  data-v-step="1"
                >
                </drop-off-form>
              </div>
              <div class="checkPricingDiv">
                <div class="row">
                  <div class="col-md-12 col-lg-12 col-sm-12 col-12">
                    <button
                      type="button"
                      v-promise-btn
                      class="btn btn-info btn-sm checkPricingBtn"
                      data-v-step="3"
                      name="button"
                      @click.prevent="checkPricing"
                    >
                      Check pricing
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <content-loader v-if="pricingInit == null" class="c-loader-pricing"
                :speed="2"
                :height="170"
                :primaryColor="'#dae1ed'"
                :secondaryColor="'#8acbe3'"
                :animate="true">
                </content-loader>
                <pricing-results
                  v-bind:pricingDetails="pricingDetails"
                  data-v-step="4"
                  @selected_pricing_option="getSelectedPricingChoice"
                  @pricing_init="pricing_init"
                >
                </pricing-results>
              </div>
              <!-- TODO: Disable courier scheduling for now -->
              <!-- <div class="row">
                <div class="col-md-12 col-lg-12 col-12 col-sm-12">
                  <delivery-date
                    @selected_delivery_option="get_selected_delivery_option"
                    data-v-step="5"
                  ></delivery-date>
                </div>
              </div> -->
              <div>
                <button
                  type="button"
                  @click="proceedToPayment"
                  class="btn btn-info btn-sm proceedToPaymentBtn"
                  data-v-step="6"
                  name="button"
                >
                  Proceed to payment
                </button>
              </div>
            </div>
            <!-- maps side -->
            <div class="col-md-4 col-lg-4 googleMapsDiv">
              <content-loader v-if="googleMapsInit == null" class="c-loader-maps"
              :speed="2"
              :primaryColor="'#dae1ed'"
              :height="1366"
              :width="800"
              :secondaryColor="'#8acbe3'"
              :animate="true">
              </content-loader>
              <google-maps
                @google_maps_init="googleMaps_init"
                v-bind:pickupMarker="pickupMarker"
                data-v-step="2"
                v-bind:dropOffMarkers="dropOffMarkers"
              >
              </google-maps>
              <!-- check internet connection -->
              <internet-connection-check></internet-connection-check>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- trouble with request delivery -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="request-delivery-error-modal"
        size="sm"
        id="request-delivery-error-modal"
        v-model="incompleteRequestDelivery"
        title="Incomplete Information"
      >
        <p class="request-delivery-error-modal-text">{{ errorModalMessage }}</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="info" @click="RequestDeliveryErrorModalHide"
            >Okay.</b-button
          >
        </template>
      </b-modal>
    </div>
    <v-tour name="myTour" :steps="steps"></v-tour>
  </div>
</template>

<script>

// lazy load imports
import axios from "axios"
import { ContentLoader } from 'vue-content-loader'

const GoogleMaps = () => import("./RequestDeliveryGoogleMaps")
const PickupForm = () => import("./RequestDeliveryPickupForm")
const DropOffForm = () => import("./RequestDeliveryDropOffForm")
const PricingResults = () => import("./RequestDeliveryPricingResults")
const InternetConnectivity = () => import("../InternetConnection")
const DeliveryDate = () => import("./RequestDeliveryDate")
const Navbar = () => import("./RequestDeliveryNavbar")

export default {
  name: "RequestDelivery",
  components: {
    ContentLoader,
    navbar: Navbar,
    "google-maps": GoogleMaps,
    "pickup-form": PickupForm,
    "drop-off-form": DropOffForm,
    "pricing-results": PricingResults,
    "internet-connection-check": InternetConnectivity,
    "delivery-date": DeliveryDate
  },
  data () {
    return {
      // child component initializers
      pickupInit: null,
      dropOffInit: null,
      pricingInit: null,
      googleMapsInit: null,
      loaderBarControl: true,
      // control rd error
      incompleteRequestDelivery: false,
      errorModalMessage: "",

      minimumDropOffForm: 1,
      maximumDropOffForm: 3,
      componentRestrictions: {
        country: ["gh"]
      },
      pickupMarker: [],
      dropOffMarkers: [],
      //
      emittedFormData: {
        pickupData: {
          details: '',
          fullName: '',
          phoneNumber: '',
          searchAddress: null,
        },
        dropOffData: null
      },
      pricingDetails: {},
      selectedPricingOption: null,
      selectedDeliveryOption: null,
      // to save pickup address data
      savedPickUpData: null,
      // decision model
      savePickup: JSON.parse(this.$cookie.get(this.$cookeys.SAVED_ADDRESS_KEY)) ? true : false,
      //
      steps: [
        {
          target: '[data-v-step="0"]', // We're using document.querySelector() under the hood
          content: `Hi, Welcome to <strong>MyPasel Web</strong>! In order to request a delivery, Kindly complete the pickup details form.
                        When typing in the location in the pickup and dropoff form, kindly select your corresponding location from the autocomplete
                        suggestions`,
          params: {
            placement: "right"
          }
        },
        {
          target: '[data-v-step="1"]',
          content:
            "Go ahead and provide the provide the dropoff information as well. This will help make delivery easier for the courier"
        },
        {
          target: '[data-v-step="2"]',
          content:
            "All locations entered in the pickup and dropoff forms are pinned on the map for you to be sure of them",
          params: {
            placement: "left"
          }
        },
        {
          target: '[data-v-step="3"]',
          content:
            "Use this button to check the pricing of your delivery request. And oh by the way!, we have the most affordable delivery pricing nationwide",
          params: {
            placement: "top"
          }
        },
        {
          target: '[data-v-step="4"]',
          content:
            "Our Pricing list will show up here for you to select your mode of delivery after clicking on the check pricing button",
          params: {
            placement: "top"
          }
        },
        {
          target: '[data-v-step="5"]',
          content: `Now, select the date and time you want the delivery to be made. You can also click on the button "<bold>Now</bold>" for instant delivery`,
          params: {
            placement: "right"
          }
        },
        {
          target: '[data-v-step="6"]',
          content:
            "Finally, click on this button when all information has been correctly provided to make payment and start courier search",
          params: {
            placement: "top"
          }
        }
      ]
    }
  },
  methods: {
    // control error with booking details
    // TODO: Disable scheduling for now
    // get_selected_delivery_option(deliveryTime) {
    //   this.selectedDeliveryOption = deliveryTime
    // },
    RequestDeliveryErrorModalHide () {
      this.$refs["request-delivery-error-modal"].hide()
    },
    getSelectedPricingChoice (evt) {
      this.selectedPricingOption = evt
    },
    getDropOffInfo (evt) {
      // reset pricing options after each location address change
      this.pricingDetails = {}
      this.emittedFormData.dropOffData = evt
    },
    // get emitted pickup info
    getPickupInfo (evt) {
      // reset pricing options after each location address change
      this.pricingDetails = {}
      // store pickup searchAddress info temporarily
      this.savedPickUpData = evt
      this.emittedFormData.pickupData = evt
    },
    // get the emitted pickup marker point and set them to the corresponding data variable
    getPickupMarker (pickupMarker, data) {
      // store pickup searchAddress info temporarily
      this.savedPickUpData = data
      // updating the pick up data for redundancy'
      this.emittedFormData.pickupData = data
      this.pickupMarker = pickupMarker
    },
    // get the emitted drop off marker points and set them to the corresponding data variable
    getDropOffMarkers (dropOffMarkers, data) {
      // updating the dropoff data for redundancy
      this.emittedFormData.dropOffData = data
      this.dropOffMarkers = dropOffMarkers
    },
    checkPricing (evt) {
      evt.preventDefault()
      if (this.emittedFormData.pickupData.searchAddress == null || this.emittedFormData.dropOffData == null) {
        this.errorModalMessage = "Please provide both pickup and dropoff addresses in order to check pricing"
        this.incompleteRequestDelivery = true
      } else {
        return this.$store
          .dispatch("getPricing", this.emittedFormData)
          .then(response => {
            this.pricingDetails = JSON.parse(this.$cookie.get(this.$cookeys.PRICING_KEY))
            this.pricingDetails.walking = "N/A"
          })
          .catch(error => {
            if (error) {
              if (error.response.status == 503 || error.response.status == 500) {
                this.errorModalMessage =
                  "Unable to fetch pricing due to a technical glitch. Please try again"
              } else {
                this.errorModalMessage = "Please complete pick up and dropoff information"
              }
            } else {
              this.errorModalMessage = "Unable to get pricing"
            }
            this.incompleteRequestDelivery = true
          })
      }
    },

    proceedToPayment (evt) {
      // disable scheduling option and set to now for the moment
      let now = new Date()
      this.selectedDeliveryOption = Date.parse(now)
      let item = this.selectedPricingOption
      let price_validator = this.pricingDetails[item]
      // disable date checking for now
      if (!isNaN(price_validator) /*&& this.selectedDeliveryOption*/) {
        this.$cookie.set(this.$cookeys.DELIVERY_MODE, item, {
          expires: this.$cookeys.cookie_expire
        })
        this.$cookie.set(this.$cookeys.DELIVERY_TIME, this.selectedDeliveryOption, {
          expires: this.$cookeys.cookie_expire
        })
        this.$router.push({ name: "RequestPayment" })
      } else {
        this.errorModalMessage =
          "Please complete pick up and dropoff information and select a delivery mode and time to proceed"
        this.incompleteRequestDelivery = true
        this.$router.push({ name: "RequestDelivery" })
      }
    },
    // child components initialization
    pricing_init (message) {
      this.pricingInit = message
    },
    pickup_init (message) {
      this.pickupInit = message
    },
    dropOff_init (message) {
      this.dropOffInit = message
    },
    googleMaps_init (message) {
      this.googleMapsInit = message
    }
  },
  // watch for changes in selected pricing choice
  watch: {
    // save the pick up address if opted to do so
    savePickup: function(choice) {
      if (choice) {
        this.$cookie.set(this.$cookeys.SAVED_ADDRESS_KEY, JSON.stringify(this.savedPickUpData))
      } else if (!choice) {
        this.savedPickUpData = null
        this.$cookie.delete(this.$cookeys.SAVED_ADDRESS_KEY)
      }
    },
    // watch emitted form pickup data to determine its source and act on sending it accordingly
    emittedFormData (evt){
       const savedData = JSON.parse(this.$cookie.get(this.$cookeys.SAVED_ADDRESS_KEY))
       if(savedData != null){
         this.emittedFormData.pickupData.searchAddress = savedData.searchAddress
       }
    }
  },
  mounted () {
    // watch for saved pickup data first
    const savedData = JSON.parse(this.$cookie.get(this.$cookeys.SAVED_ADDRESS_KEY))
    if(savedData != null){
      this.emittedFormData.pickupData.searchAddress = savedData.searchAddress
    }

    // start tour
    // this.$tours['myTour'].start()

  }
}
</script>

<style media="screen" scoped>
.container-fluid {
  margin-top: 60px;
}

.formSide {
  background-color: #f2faff;
}

.c-loader-pickup {
  margin-top: 20px;
  margin-bottom: 20px;
}

.c-loader-dropOff {
  margin-top: 10px;
  margin-bottom: 10px;
}

.c-loader-pricing {
  margin-top: 20px;
  margin-bottom: 20px;
}

.c-loader-maps {
  position: fixed;
  left: 41%;
}

.proceedBtnText {
  text-decoration: none;
  color: #fff;
}

.courierNeedTimeHeader {
  margin-bottom: 5px;
  font-size: 80%;
  color: #4286f4;
}

.checkPricingBtn {
  width: 100%;
  border-radius: 1px;
}

.proceedToPaymentBtn {
  width: 100%;
  border-radius: 1px;
  margin-bottom: 20px;
}

.checkPricingDiv {
  margin-bottom: 10px;
}

.addDropOffBtn {
  border-radius: 0;
  padding-top: 7px;
  margin-right: 50px;
  padding-bottom: 7px;
}

.nowDeliveryBtn {
  border-radius: 1px;
  padding: 7px 15px;
}

.laterDeliveryBtn {
  border-radius: 1px;
  padding: 7px 15px;
  margin-left: 15px;
}

.courierTimeBtnsDiv {
  display: inline-block;
}

.googleMapsDiv {
  position: fixed;
  left: 41%;
}

.courierNeedDiv {
  text-align: center;
  margin-bottom: 10px;
}

.switch input {
  display: none;
}
.switch {
  display: inline-block;
  width: 40px;
  height: 20px;
  transform: translateY(50%);
  position: relative;
}

.slider {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 30px;
  box-shadow: 0 0 0 1px #777, 0 0 1px #777;
  cursor: pointer;
  border: 2px solid transparent;
  overflow: hidden;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  width: 80%;
  height: 100%;
  background: #777;
  border-radius: 999px;
  transform: translateX(-30px);
  transition: 0.4s;
}

input:checked + .slider:before {
  transform: translateX(3px);
  background: #42d1f5;
}
input:checked + .slider {
  box-shadow: 0 0 0 1px #42d1f5, 0 0 1px #42d1f5;
}

/* end of save pickup info switch */

.pickupSave {
  margin-bottom: 10px;
  margin-right: 10px;
}

.pickupSave.text {
  font-size: 100%;
  margin-left: 20px;
  text-align: left;
  color: #61646b;
}

.pickupSaveContainer {
  background-color: #fff;
  border-radius: 2px;
  border: solid 1px #d4d8dd;
}

.save-help {
  text-align: right;
  color: #42d1f5;
}

.save-help-note {
  justify-content: center;
  margin-left: 20px;
}

/* courier urgency switch */
/*  */

/* for smaller devices (mobile display) */
@media screen and (max-width: 759px) {
  .googleMapsDiv {
    display: none;
  }

  .formSide {
    background-color: #f2faff;
    margin-top: 15px;
  }
}

/* Desktops and laptops ----------- */
@media only screen and (min-width: 1224px) {
  /* Styles */
  .formSide {
    background-color: #f2faff;
    margin-top: 10px;
  }
}
</style>
