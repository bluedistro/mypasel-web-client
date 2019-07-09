<template lang="html">
  <!-- position to the left of the parent component -->
  <div>
    <transition-group name="add-dropOff">
      <div v-for="dropOff in dropOffData" :key="dropOff.id">
        <div class="card dropOff-card">
          <!-- <h6 class="dropOffForm-header">Dropoff</h6> -->
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
            </b-form-group>

            <b-form-group id="input-group-2">
              <b-form-input
                required
                v-on:blur="sendInfo"
                :id="dropOff.fullName"
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
                rows="2"
                max-rows="4"
                v-on:blur="sendInfo"
                v-model="dropOff.details"
                placeholder="Add details for courier"
              >
              </b-form-textarea>
            </b-form-group>
          </b-form>
        </div>
      </div>
    </transition-group>
    <!-- drop off element controls -->
    <div class="row">
      <!-- <div class="col-md-4 col-lg-4 col-sm-1 col-1 dropoff-notice">
          <div class="col-md-12 col-sm-6 col-6">
               ({{ counter + 1}})
          </div>
      </div> -->
      <div id="multiDropOffDiv" class="col-md-12 col-lg-12 col-sm-11 col-11 dropOffBtnDiv">
        <button
          type="button"
          :disabled="disableRemoveDropOffs"
          class="btn btn btn-warning
                    btn-sm  removeDropOffBtn"
          @click="removeDropOff"
        >
          <font-awesome-icon icon="times" />&nbsp;Remove a dropoff
        </button>
        <button
          type="button"
          :disabled="disableAddDropOffs"
          class="btn btn-success
                    btn-sm addDropOffBtn"
          @click="addDropOff"
        >
          <font-awesome-icon icon="plus" />&nbsp;Add a dropoff
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DropOffForm",
  components: {},
  // minimum and maximum number of drop off forms to create
  props: {
    minimumDropOffs: Number,
    maximumDropOffs: Number
  },
  data() {
    return {
      disableAddDropOffs: false,
      disableRemoveDropOffs: true,
      searchingAddressLoader: null,
      counter: 0,
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
    };
  },
  methods: {
    // control the address search loader growing loader for each drop off form
    addressSearchLoader(id) {
      this.searchingAddressLoader = id;
    },
    sendInfo() {
      let data = this.dropOffData;
      // console.log('Drop off data is sending...')
      this.$emit("dropoff_details", data);
    },
    addDropOff() {
      // create Drop off forms with tracking IDs to track input fields
      if (this.dropOffData.length < this.maximumDropOffs) {
        let counterInc = ++this.counter;
        this.dropOffData.push({
          id: `dropOff ${counterInc}`,
          nameId: `name ${counterInc}`,
          searchId: `search ${counterInc}`,
          phoneId: `phone ${counterInc}`,
          detailId: `detail ${counterInc}`
        });
      }
    },
    // remove one drop off form and update drop off markers array.
    // Emit these values to the parent component
    removeDropOff() {
      if (this.dropOffData.length > this.minimumDropOffs) {
        this.dropOffData.pop();
        this.searchAddress.pop();
        --this.counter;
      }

      this.markers = [];
      for (var i = 0; i < this.dropOffData.length; i++) {
        this.markers.push({
          position: {
            lat: this.dropOffData[i].searchAddress.location.lat(),
            lng: this.dropOffData[i].searchAddress.location.lng()
          }
        });
      }
      // emit the data again for redundancy and prevent data loss
      let data = this.dropOffData;
      this.$emit("set_markers", this.markers, data);
    },
    // get search address, update the marker array with coordinates and emit these values to the parent component
    getDropOffAddressData(place, id) {
      // use the binded number (binded to the generated ID) to matcch the autocomplete
      // results to its right data
      let digitally_generated_id = parseInt(id.split(" ")[1]);
      // gather needed information from maps
      let infoToReturn = place.geometry;
      infoToReturn["place_id"] = place.place_id;
      infoToReturn["formatted_address"] = place.name;
      infoToReturn["reference"] = place.reference;
      infoToReturn["vicinity"] = place.vicinity;
      infoToReturn["location"] = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      // return needed information
      this.dropOffData[digitally_generated_id].searchAddress = infoToReturn;
      if (this.dropOffData[digitally_generated_id].searchAddress) {
        // set the address search loader to null if address is entered
        this.searchingAddressLoader = null;
        // replace marker on drop off place change
        this.markers.splice(digitally_generated_id, 1, {
          position: {
            lat: infoToReturn.location.lat,
            lng: infoToReturn.location.lng
          }
        });
      }
      let data = this.dropOffData;
      this.$emit("set_markers", this.markers, data);
    },
    displaySpinner() {},
    noResultsFound() {}
  },
  watch: {
    dropOffData: function(do_data) {
      if (do_data.length == 1) {
        this.disableRemoveDropOffs = true;
      } else {
        this.disableRemoveDropOffs = false;
      }

      if (do_data.length == this.maximumDropOffs) {
        this.disableAddDropOffs = true;
      } else {
        this.disableAddDropOffs = false;
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


  .dropOffForm-header{
    text-align: left;
    color: #4286f4;
    font-size: 110%;
    /* font-weight: bold; */
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
    /*  extend height to 300px when details are added again */
    height: 300px;
    padding-bottom: 20px;
    margin-bottom: 5px;
    margin-top: 10px;
    border-color: #d4d8dd;
    border-radius: 2px;
  }

  .dropoff-notice {
    text-align: left;
  }

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
