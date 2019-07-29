<template lang="html">
  <div>
    <transition-group name="add-dropOff">
      <div v-for="dropOff in dropOffData" :key="dropOff.id">
        <div class="card dropOff-card">
          <div class="row">
            <div class="col-md-9 col-9 col-sm-9 col-lg-9">
              <h6 class="dropOffForm-header">Dropoff</h6>
            </div>
            <div class="col-md-3 col-3 col-lg-3 col-sm-3 searchPinger">
              <b-spinner
                :id="dropOff.searchId"
                label="Large Spinner"
                :ref="dropOff.searchId"
                v-if="searchingAddressLoader == dropOff.searchId"
                variant="success"
                type="grow"
              >
              </b-spinner>
            </div>
          </div>
          <b-form>
            <b-form-group id="input-group-1">
              <gmap-autocomplete
                @place_changed="getDropOffAddressData($event, dropOff.searchId)"
                :id="dropOff.searchId"
                ref="searchData"
                class="form-control search-slt"
                required
                placeholder="Recipient address"
                :options="autoCompleteOptions"
                v-on:focus="addressSearchLoader(dropOff.searchId)"
                v-on:blur="sendInfo"
              >
              </gmap-autocomplete>
              <div class="place_warning">
                <small v-if="invalidPlace == true">Invalid place selected. Please choose a place from the suggested locations</small>
              </div>
            </b-form-group>

            <b-form-group id="input-group-2">
              <b-form-input
                required
                v-on:blur="sendInfo"
                :id="dropOff.fullName"
                class="search-slt"
                placeholder="Recipient full name"
                v-model="dropOff.fullName"
              >
              </b-form-input>
            </b-form-group>

            <b-form-group id="input-group-1">
              <vue-phone-number-input
                v-model="dropOff.phoneNumber"
                :default-country-code="phoneField.defaultCode"
                :clearable="phoneField.clearable"
                :preferred-countries="phoneField.preferred"
                name="phoneNumber"
                required
                v-on:blur="sendInfo"
                :id="dropOff.phoneId"
              />
            </b-form-group>

            <b-form-group id="input-group-2">
              <b-form-textarea
                required
                :id="dropOff.detailId"
                rows="3"
                max-rows="6"
                class="search-slt"
                v-on:blur="sendInfo"
                v-model="dropOff.details"
                placeholder="Extra information or comments"
              >
              </b-form-textarea>
            </b-form-group>
          </b-form>
        </div>
      </div>
    </transition-group>
    <div class="row">
      <div id="multiDropOffDiv" class="col-md-12 col-lg-12 col-sm-12 col-12 dropOffBtnDiv">
        <button
          type="button"
          :disabled="disableRemoveDropOffs"
          class="btn btn btn-warning
                    btn-sm  removeDropOffBtn"
          @click="removeDropOff"
        >
          <font-awesome-icon icon="times" />&nbsp;Remove dropoff
        </button>
        <button
          type="button"
          :disabled="disableAddDropOffs"
          class="btn btn-success
                    btn-sm addDropOffBtn"
          @click="addDropOff"
        >
          <font-awesome-icon icon="plus" />&nbsp;Add dropoff
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropOffForm",
  components: {},
  props: {
    minimumDropOffs: Number,
    maximumDropOffs: Number
  },
  data () {
    return {
      disableAddDropOffs: false,
      disableRemoveDropOffs: true,
      searchingAddressLoader: null,
      invalidPlace: false,
      counter: 0,
      place: null,
      // due to the dynamic nature of the drop off form, I use
      // dynamically generated IDs to track the generated forms
      dropOffData: [
        {
          id: "dropOff 0",
          nameId: "name 0",
          searchId: "search 0",
          phoneId: "phone 0",
          detailId: "detail 0",
          fullName: "",
          details: "",
          // search address will contain an object of format {lat: Int, lng: Int}
          searchAddress: null,
          phoneNumber: ""
        }
      ],
      phoneField: {
        defaultCode: "GH",
        preferred: ["GH"],
        clearable: true
      },
      searchAddress: [],
      autoCompleteOptions: {
        componentRestrictions: {
          country: ["gh"]
        }
      },
      markers: []
    }
  },
  methods: {
    // control the address search loader growing loader for each drop off form
    addressSearchLoader (id) {
      this.searchingAddressLoader = id
    },
    sendInfo () {
      this.searchingAddressLoader = null
      let data = this.dropOffData
      this.$emit("dropoff_details", data)
    },
    addDropOff () {
      // create Drop off forms with tracking IDs to track input fields
      if (this.dropOffData.length < this.maximumDropOffs) {
        let counterInc = ++this.counter
        this.dropOffData.push({
          id: `dropOff ${counterInc}`,
          nameId: `name ${counterInc}`,
          searchId: `search ${counterInc}`,
          phoneId: `phone ${counterInc}`,
          detailId: `detail ${counterInc}`
        })
      }
    },
    // remove one drop off form and update drop off markers array.
    // Emit these values to the parent component
    removeDropOff () {
      if (this.dropOffData.length > this.minimumDropOffs) {
        this.dropOffData.pop()
        this.searchAddress.pop()
        --this.counter
      }

      this.markers = []
      for (var i = 0; i < this.dropOffData.length; i++) {
        if(this.dropOffData[i].searchAddress != null){
          this.markers.push({
            position: {
              lat: this.dropOffData[i].searchAddress.location.lat,
              lng: this.dropOffData[i].searchAddress.location.lng
            }
          })
        }
      }
      // emit the data again for redundancy and prevent data loss
      let data = this.dropOffData
      this.$emit("set_markers", this.markers, data)
    },
    // get search address, update the marker array with coordinates and emit these values to the parent component
    getDropOffAddressData (place, id) {
        if(place.place_id){
          this.invalidPlace = false
          this.place = place
          // use the binded number (binded to the generated ID) to matcch the autocomplete
          // results to its right data
          let digitally_generated_id = parseInt(id.split(" ")[1])
          // gather needed information from maps
          let infoToReturn = this.place.geometry
          infoToReturn["place_id"] = this.place.place_id
          infoToReturn["formatted_address"] = this.place.name
          infoToReturn["reference"] = this.place.reference
          infoToReturn["vicinity"] = this.place.vicinity
          infoToReturn["location"] = {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng()
          }
          // return needed information
          this.dropOffData[digitally_generated_id].searchAddress = infoToReturn
          if (this.dropOffData[digitally_generated_id].searchAddress) {
            // disable searching address spinner
            this.searchingAddressLoader = null
            // replace marker on drop off place change
            this.markers.splice(digitally_generated_id, 1, {
              position: {
                lat: infoToReturn.location.lat,
                lng: infoToReturn.location.lng
              }
            })
          }
          let data = this.dropOffData
          this.$emit("set_markers", this.markers, data)
        }else{
          this.data = null
          this.markers = []
          this.invalidPlace = true
          this.$emit("set_markers", this.markers, this.data)
        }
      }
  },
  mounted () {
    this.$emit('dropOff_init', 'dropOff_ready')
  },
  watch: {
    dropOffData: function(do_data) {
      do_data.length == this.maximumDropOffs ? this.disableAddDropOffs = true : this.disableAddDropOffs = false
      do_data.length == 1 ? this.disableRemoveDropOffs = true : this.disableRemoveDropOffs = false
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

.dropOffForm-header{
  text-align: left;
  color: #4286f4;
  font-size: 110%;
}

.removeDropOffBtn{
  margin-right: 10px;
  border-radius: 2px;
}

.addDropOffBtn {
  border-radius: 2px;
}

.dropOffBtnDiv{
  text-align: right;
  margin-bottom: 20px;
}

  .card.dropOff-card {
    padding: 15px 10px;
    padding-bottom: 20px;
    margin-bottom: 5px;
    margin-top: 10px;
    border-color: #d4d8dd;
    border-radius: 2px;
  }

  .dropoff-notice {
    text-align: left;
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

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .add-dropOff-enter-active {
    transition: all .3s ease;
  }
  .add-dropOff-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .add-dropOff-enter, .add-dropOff-leave-to
  /* .add-dropOff-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
