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
          :disabled="disableFullName"
          v-on:blur="sendInfo"
          placeholder="Sender full name"
        >
        </b-form-input>
      </b-form-group>

      <b-form-group id="phone-number">
        <vue-phone-number-input
          v-model="phoneNumber"
          :default-country-code="phoneField.defaultCode"
          :clearable="phoneField.clearable"
          :preferred-countries="phoneField.preferred"
          name="phoneNumber"
          :disabled="disablePhoneField"
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
          rows="3"
          max-rows="6"
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
    disableFullName: Boolean,
    disablePhoneField: Boolean,
  },
  data() {
    return {
      senderAddressPlaceholder: "Sender address",
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
      if (JSON.parse(localStorage.getItem("savedPickUpData")) != null) {
        this.getPickupAddressData(JSON.parse(localStorage.getItem("savedPickUpData")));
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
      if (place.geometry) {
        infoToReturn = place.geometry;
        infoToReturn["source"] = "saved";
        infoToReturn["location"] = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
        // lat = infoToReturn.location.lat();
        // lng = infoToReturn.location.lng();
        // search data coming from localStorage saved data
      } else {
        infoToReturn = place;
        infoToReturn["source"] = "direct";
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
          position: infoToReturn["location"]
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
  created() {
    // controls the display and hiding of the saved data in the form fields on page created
    const savedPickupData = JSON.parse(localStorage.getItem("savedPickUpData"));
    if(this.disablePickupAddress === true){
      if (savedPickupData != null) {
        this.searchAddress = savedPickupData.searchAddress;
        this.senderAddressPlaceholder = savedPickupData.searchAddress.formatted_address;
        this.phoneNumber = savedPickupData.phoneNumber;
        this.fullName = savedPickupData.fullName;
      }
    }else{
      this.searchAddress = null;
      this.senderAddressPlaceholder = 'Sender address';
      this.phoneNumber = '';
      this.fullName = '';
    }
  },
// controls the display and hiding of the saved data in the form fields on address form value change
  watch: {
    disablePickupAddress(status){
      let savedPickupData = JSON.parse(localStorage.getItem("savedPickUpData"));
      if(status === true){
        if (savedPickupData != null) {
          this.searchAddress = savedPickupData.searchAddress;
          this.senderAddressPlaceholder = savedPickupData.searchAddress.formatted_address;
          this.phoneNumber = savedPickupData.phoneNumber;
          this.fullName = savedPickupData.fullName;
        }
      }else{
        this.searchAddress = null;
        this.senderAddressPlaceholder = 'Sender address';
        this.phoneNumber = '';
        this.fullName = '';
      }
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
}

.card.pickup-card {
  padding: 15px 10px;
  padding-bottom: 20px;
  margin-bottom: 30px;
  margin-top: 20px;
  border-color: #d4d8dd;
  border-radius: 2px;
}

#pickupMap {
  outline: none;
  border-color: #ccc;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}

#pickupMap:focus {
  border-color: #00bcd4;
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}

textarea:focus {
  border-color: #00bcd4;
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}

textarea {
  border-color: #ccc;
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}

input[type="text"]:focus {
  border-color: #00bcd4;
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}

input[type="text"] {
  border-color: #ccc;
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}

.form-control.search-slt {
  content: "\1F50E";
}
</style>
