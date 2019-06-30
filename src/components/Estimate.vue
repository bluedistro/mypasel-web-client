<template lang="html">
  <div class="container">
    <div class="pricingForm">
      <div class="pricingFormHeader">
        <h4>Try out our awesome pricing!</h4>
      </div>
      <div class="search-sec">
        <form @submit.prevent="getPricing">
          <div class="row">
            <div class="col-lg-12">
              <div class="row">
                <div class="col-lg-1 col-md-1 col-sm-12 p-0">
                  <b-spinner
                    id="locationSpinner"
                    v-if="showSpinner"
                    label="Large Spinner"
                    variant="info"
                    type="grow"
                  >
                  </b-spinner>
                </div>
                <div class="col-lg-2 col-md-3 col-sm-12 p-0">
                  <gmap-autocomplete
                    @place_changed="getPickupAddressData"
                    id="pickupMap"
                    ref="pickupAddress"
                    class="form-control search-slt"
                    :options="autoCompleteOptions"
                    required
                    placeholder="Enter pick up location"
                    v-on:focus="displaySpinner"
                  >
                  </gmap-autocomplete>
                </div>
                <div class="col-lg-2 col-md-3 col-sm-12 p-0">
                  <gmap-autocomplete
                    @place_changed="getDropOffAddressData"
                    id="dropOffMap"
                    ref="dropOffAddress"
                    class="form-control search-slt"
                    :options="autoCompleteOptions"
                    required
                    placeholder="Enter drop off location"
                    v-on:focus="displaySpinner"
                  >
                  </gmap-autocomplete>
                </div>
                <div class="col-lg-2 col-md-2 col-sm-12 p-0">
                  <select class="form-control search-slt" id="cityOfFocus" v-model="city">
                    <option disabled selected>Select City</option>
                    <option>Accra</option>
                    <option>Kumasi</option>
                    <option>Tamale</option>
                    <option>Koforidua</option>
                    <option>Takoradi</option>
                    <option>Winneba</option>
                    <option>Cape Coast</option>
                  </select>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-12 p-0">
                  <button type="submit" class="btn btn-primary wrn-btn">Check Pricing</button>
                </div>
              </div>
              <div class="col">
                <span class="invalidLocationFeedback" v-if="invalidLocationAlert"
                  >Invalid location entry. Make sure a valid location is selected</span
                >
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import router from '../router';
import axios from "axios";

const PRICING_DATA_KEY = "pricing_data";
const ROUTING_PATH_KEY = "routes";
const USER_SESSION_KEY = "user_data";
export default {
  name: "Estimate",
  data() {
    return {
      showSpinner: false,
      pickUpFeedbackData: false,
      invalidLocationAlert: false,
      noResultsFoundData: {
        pickupName: "",
        dropOffName: ""
      },
      pickupData: null,
      dropOffData: null,
      autoCompleteOptions: {
        componentRestrictions: {
          country: ["gh"]
        }
      },
      city: [],
      pricingData: ""
    };
  },
  components: {},
  mounted() {
    // this.$refs.pickupAddress.focus();
  },
  created() {
    // let user_data = JSON.parse(sessionStorage.getItem(USER_SESSION_KEY) || '[]');
    let user_data = this.$cookie.get("user_data");
    // console.log(JSON.parse(user_data));
  },
  methods: {
    displaySpinner(evt) {
      this.showSpinner = true;
      if (this.noResultsFoundData.name != "") {
        this.showSpinner = true;
      }

      if (this.noResultsFoundData.name != "") {
        this.pickUpFeedbackData = true;
      }
    },
    getPickupAddressData(place) {
      this.showSpinner = false;
      this.invalidLocationAlert = false;
      if (place.geometry) {
        let infoToReturn = place.geometry;
        infoToReturn["formatted_address"] = place.formatted_address;
        infoToReturn["place_id"] = place.place_id;
        this.pickupData = infoToReturn;
      } else {
        this.pickupData = null;
        this.noResultsFoundData.pickupName = place.name;
      }
    },
    getDropOffAddressData(place) {
      this.showSpinner = false;
      this.invalidLocationAlert = false;
      if (place.geometry) {
        let infoToReturn = place.geometry;
        infoToReturn["formatted_address"] = place.formatted_address;
        infoToReturn["place_id"] = place.place_id;
        this.dropOffData = infoToReturn;
      } else {
        this.dropOffData = null;
        this.noResultsFoundData.dropOffName = place.name;
      }
    },
    noResultsFound(evt) {
      this.noResultsFoundData.name = evt.name;
    },
    getPricing(evt) {
      evt.preventDefault();
      // data Sanity check
      if (this.pickupData == null || this.dropOffData == null) {
        this.invalidLocationAlert = true;
        this.pickUpFeedbackData = false;
        console.log("error");
        return;
      }

      const path =
        "https://api.desymal.com/v1/route/get?source=" +
        this.pickupData.location.lat() +
        "," +
        this.pickupData.location.lng() +
        "&isSourceID=f&destination=" +
        this.dropOffData.location.lat() +
        "," +
        this.dropOffData.location.lng() +
        "&isDestID=f";
      axios
        .get(path)
        .then(res => {
          this.pricingData = res.data;
          // redirect to results page with the data
          this.$router.push({ name: "EstimateResults" });
          sessionStorage.setItem(PRICING_DATA_KEY, JSON.stringify(this.pricingData.pricing));
          localStorage.setItem(
            ROUTING_PATH_KEY,
            JSON.stringify({
              pickup_route: this.pickupData.formatted_address,
              dropoff_route: this.dropOffData.formatted_address
            })
          );
        })
        .catch(error => {
          this.$router.push({ name: "Estimate" });
        });
    }
  }
};
</script>

<style lang="css" scoped>
/*search box css start here*/

.pricingFormHeader {

}

.invalidLocationFeedback {
  text-align: left;
  vertical-align: middle;
  color: #cc8710;
  font-size: 85%;
}

#locationSpinner {
   width: 3rem;
   height: 3rem;
}

.pricingForm {
  margin-top: 12%;
}

.search-sec{
  margin-top: 10%;
    padding: 2rem;
}
.search-slt{
    display: block;
    width: 100%;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #55595c;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    height: calc(3rem + 2px) !important;
    border-radius:0;
}
.wrn-btn{
    width: 100%;
    font-size: 16px;
    font-weight: 400;
    text-transform: capitalize;
    height: calc(3rem + 2px) !important;
    border-radius:0;
}
@media (min-width: 992px){
    .search-sec{
        position: relative;
        top: -114px;
        /* background: rgba(26, 70, 104, 0.51); */
    }
}

@media (max-width: 992px){
    .search-sec{
        /* background: #1A4668; */
    }
}
</style>
