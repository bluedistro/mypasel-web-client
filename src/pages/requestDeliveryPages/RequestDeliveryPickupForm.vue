<template lang="html">
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
        <div class="place_warning">
          <small v-if="invalidPlace == true">Invalid place selected. Please choose a place from the suggested locations</small>
        </div>
      </b-form-group>

      <b-form-group id="input-group-2">
        <b-form-input
          required
          id="input-2"
          v-model="fullName"
          class="search-slt"
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
          class="search-slt"
          v-on:blur="sendInfo"
          placeholder="Extra information or comments"
        >
        </b-form-textarea>
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "PickupForm",
  props: {
    disablePickupAddress: Boolean,
    disableFullName: Boolean,
    disablePhoneField: Boolean
  },
  data () {
    return {
      senderAddressPlaceholder: "Sender address",
      searchingAddressLoader: false,
      invalidPlace: false,
      place: null,
      phoneField: {
        defaultCode: "GH",
        preferred: ["GH"],
        clearable: false,
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
    addressSearchLoader () {
      this.searchingAddressLoader = true
    },
    sendInfo () {
      this.searchingAddressLoader = null
      let data = {
        phoneNumber: this.phoneNumber.replace(/\s/g, ""),
        details: this.details,
        searchAddress: this.searchAddress,
        fullName: this.fullName
      }
      // to enable the getPickupAddressData to fire
      if (JSON.parse(this.$cookie.get(this.$cookeys.SAVED_ADDRESS_KEY)) != null) {
        this.getPickupAddressData(JSON.parse(this.$cookie.get(this.$cookeys.SAVED_ADDRESS_KEY)))
      }
      this.$emit("pickup_details", data)
    },
    getPickupAddressData (place) {
      if(place.place_id){
        this.invalidPlace = false
        this.place = place
        var infoToReturn
        var lat
        var lng
        infoToReturn = this.place.geometry
        infoToReturn["source"] = "saved"
        infoToReturn["location"] = {
          lat: this.place.geometry.location.lat(),
          lng: this.place.geometry.location.lng()
        }
        infoToReturn["place_id"] = this.place.place_id
        infoToReturn["formatted_address"] = this.place.name
        infoToReturn["reference"] = this.place.reference
        infoToReturn["vicinity"] = this.place.vicinity
        // return needed information
        this.searchAddress = infoToReturn
        if (this.searchAddress) {
          this.searchingAddressLoader = false
          this.markers = []
          this.markers.push({
            position: infoToReturn["location"]
          })
        }
        let data = {
          phoneNumber: this.phoneNumber.replace(/\s/g, ""),
          details: this.details,
          searchAddress: this.searchAddress,
          fullName: this.fullName
        }
        this.$emit("set_markers", this.markers, data)
      }else{
        this.data = null
        this.markers = []
        this.invalidPlace = true
        this.$emit("set_markers", this.markers, this.data)
      }
    }
  },
  created () {
    // controls the display and hiding of the saved data in the form fields on page created
    const savedPickupData = JSON.parse(this.$cookie.get(this.$cookeys.SAVED_ADDRESS_KEY))
    if(this.disablePickupAddress === true){
      if (savedPickupData != null) {
        this.searchAddress = savedPickupData.searchAddress
        this.senderAddressPlaceholder = savedPickupData.searchAddress.formatted_address
        this.phoneNumber = savedPickupData.phoneNumber
        this.fullName = savedPickupData.fullName
      }
    }else{
      this.searchAddress = null
      this.senderAddressPlaceholder = 'Sender address'
      this.phoneNumber = ''
      this.fullName = ''
    }
  },
  mounted () {
    this.$emit('pickup_init', 'pickup_ready')
  },
// controls the display and hiding of the saved data in the form fields on address form value change
  watch: {
    disablePickupAddress (status) {
      let savedPickupData = JSON.parse(this.$cookie.get(this.$cookeys.SAVED_ADDRESS_KEY))
      if(status === true){
        if (savedPickupData != null) {
          this.searchAddress = savedPickupData.searchAddress
          this.senderAddressPlaceholder = savedPickupData.searchAddress.formatted_address
          this.phoneNumber = savedPickupData.phoneNumber
          this.fullName = savedPickupData.fullName
        }
      }else{
        this.searchAddress = null
        this.senderAddressPlaceholder = 'Sender address'
        this.phoneNumber = ''
        this.fullName = ''
      }
    }
  }
}
</script>

<style lang="css" scoped>

.searchPinger {
  text-align: right;
}

.place_warning {
  text-align: left;
  color: orange;
}

.pickupForm-header{
  text-align: left;
  color: #4286f4;
  font-size: 110%;
}

.card.pickup-card {
  padding: 15px 10px;
  padding-bottom: 20px;
  margin-bottom: 10px;
  margin-top: 20px;
  border-color: #d4d8dd;
  border-radius: 2px;
}

/* for autocomplete search input field */
  .search-slt {
    outline: none;
    border-color: #ccc;
    -webkit-box-shadow: none;
    box-shadow: none;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }

/* for autocomplete search input field */
  .search-slt:focus {
    border-color: #00bcd4;
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }

</style>
