<template lang="html">
  <!-- position to the left of the parent component -->
  <div class="card pickup-card">
    <div class="row">
      <div class="col-md-9 col-9 col-sm-9 col-lg-9">
        <h6 class="pickupForm-header">Pick up</h6>
      </div>
      <div class="col-md-3 col-3 col-lg-3 col-sm-3 searchPinger">
        <b-spinner
          id="locationSpinner"
          label="Large Spinner"
          v-if="searchingAddressLoader"
          variant="danger"
          required
          type="grow"
        >
        </b-spinner>
      </div>
    </div>
    <b-form>
      <b-form-group id="input-group-1">
        <gmap-autocomplete
          @place_changed="getPickupAddressData"
          id="pickupMap"
          ref="pickupAddress"
          class="form-control search-slt"
          :placeholder="senderAddressPlaceholder"
          :options="autoCompleteOptions"
          :disabled="disablePickupAddress"
          v-on:blur="sendInfo"
          required
          v-on:focus="addressSearchLoader"
        >
        </gmap-autocomplete>
      </b-form-group>

      <b-form-group id="input-group-2">
        <b-form-input
          required
          id="input-2"
          v-model="fullName"
          v-on:blur="sendInfo"
          placeholder="Sender full name"
        >
        </b-form-input>
      </b-form-group>

      <b-form-group id="input-group-1">
        <vue-phone-number-input
          v-model="phoneNumber"
          :default-country-code="phoneField.defaultCode"
          :clearable="phoneField.clearable"
          :preferred-countries="phoneField.preferred"
          name="phoneNumber"
          required
          v-on:blur="sendInfo"
          id="phoneNumber"
        />
      </b-form-group>

      <b-form-group id="input-group-2">
        <b-form-textarea
          required
          id="input-2"
          v-model="details"
          rows="2"
          max-rows="4"
          v-on:blur="sendInfo"
          placeholder="Add extra information for courier"
        >
        </b-form-textarea>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "PickupForm",
  components: {
    // 'vue-google-autocomplete': VueGoogleAutocomplete,
  },
  props: {
    disablePickupAddress: Boolean,
  },
  data() {
    return {
      senderAddressPlaceholder: 'Sender address',
      searchingAddressLoader: false,
      phoneField: {
        defaultCode: "GH",
        preferred: ["GH"],
        clearable: true
      },
      fullName: "",
      phoneNumber: "",
      details: "",
      searchAddress: null,
      autoCompleteOptions: {
        componentRestrictions: {
          country: ["gh"]
        }
      },
      markers: []
    };
  },
  methods: {
    addressSearchLoader() {
      this.searchingAddressLoader = true;
    },
    sendInfo() {
      let data = {
        phoneNumber: this.phoneNumber.replace(/\s/g, ""),
        details: this.details,
        searchAddress: this.searchAddress,
        fullName: this.fullName
      };
      // to enable the getPickupAddressData to fire
      if(JSON.parse(localStorage.getItem('savedPickUpData')) != null){
        this.getPickupAddressData(JSON.parse(localStorage.getItem('savedPickUpData')) );
      }
      this.$emit("pickup_details", data);
    },
    getPickupAddressData(place) {
      // gather needed information from maps

      // handle information from two different sources
      var infoToReturn;
      var lat;
      var lng;
      // search data straight from google autocomplete
      if(place.geometry){
        infoToReturn = place.geometry;
        infoToReturn["source"] = 'saved';
        lat = infoToReturn.location.lat();
        lng = infoToReturn.location.lng();
        // search data coming from localStorage saved data
      }else{
        infoToReturn = place;
        infoToReturn["source"] = 'direct';
        lat = infoToReturn.location.lat;
        lng = infoToReturn.location.lng;
      }
      // let infoToReturn = place.geometry;
      infoToReturn["place_id"] = place.place_id;
      infoToReturn["formatted_address"] = place.name;
      infoToReturn["reference"] = place.reference;
      infoToReturn["vicinity"] = place.vicinity;
      // return needed information
      this.searchAddress = infoToReturn;
      if (this.searchAddress) {
        this.searchingAddressLoader = false;
        this.markers = [];
        this.markers.push({
          position: {
            lat: lat,
            lng: lng
          }
        });
      }
      // emit data once again (for redundancy)
      let data = {
        phoneNumber: this.phoneNumber.replace(/\s/g, ""),
        details: this.details,
        searchAddress: this.searchAddress,
        fullName: this.fullName
      };
      this.$emit("set_markers", this.markers, data);
    },
    displaySpinner() {},
    noResultsFound() {}
  },
  created(){
    const searchAddress = JSON.parse(localStorage.getItem('savedPickUpData'));

    if(searchAddress != null){
      this.searchAddress = searchAddress;
      this.senderAddressPlaceholder = searchAddress.formatted_address;

    }

  }
};
</script>

<style lang="css" scoped>

.searchPinger {
  /* float: right; */
  text-align: right;
}

.pickupForm-header{
  text-align: left;
  color: #4286f4;
  font-size: 110%;
  /* font-weight: bold; */
}

.card.pickup-card {
  padding: 15px 10px;
  height: 300px;
  padding-bottom: 20px;
  margin-bottom: 30px;
  margin-top: 20px;
  border-color: #d4d8dd;
}

.form-control.search-slt {
  content: "\1F50E";
}

</style>
