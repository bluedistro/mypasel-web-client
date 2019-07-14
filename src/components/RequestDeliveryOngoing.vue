<template lang="html">
  <div class="container mb-2">
    <div class="row ongoing-header-alt" v-if="ongoingTransactions.length <= 0">
      <h4>Ongoing Transactions</h4>
    </div>
    <div class="row">
      <transition name="ongoingChange" mode="in-out">
        <!-- if no transactions at the moment -->
        <div
          class="col-md-12 col-12 col-lg-12 col-sm-12"
          v-if="ongoingTransactions.length <= 0"
          key="no-ongoing"
        >
          <no-activity v-bind:message="message"></no-activity>
        </div>
        <!-- else -->
        <div
          class="col-md-12 col-12  col-lg-12 col-sm-12"
          v-if="ongoingTransactions.length > 0"
          key="ongoing"
        >
          <div class="ongoings-header">
            <div class="row">
              <div class="col-md-10 col-lg-10 col-8 col-sm-8">
                <h3>Ongoing Transactions</h3>
              </div>
              <div class="col-md-2 col-lg-2 col-4 col-sm-4 totalTransactions">
                {{ ongoingTransactions.length }} Transaction(s)
              </div>
            </div>
          </div>
          <div class="row item-container" v-for="(i, index) in ongoingTransactions" :key="index">
            <div class="col-md-10 col-sm-10 col-9 col-lg-10 transaction">
              <progress-steps v-bind:step1="i.step0" v-bind:step2="i.step1" v-bind:step3="i.step2">
              </progress-steps>
              <div class="status">
                {{ i.status }}
              </div>
            </div>
            <!-- <div class="item-container"></div> -->
            <div class="col-md-2 col-sm-2 col-3 col-lg-1 moreBtn">
              <button
                type="button"
                class="btn-sm btn-outline-dark form-control"
                @click="showMoreFunc(index)"
                name="button"
              >
                More
              </button>
            </div>
            <div class="row courierFullDetailsDiv" v-if="showMore == index && showIndex">
              <div class="courierTextDetailsDiv col-md-9 col-lg-9 col-9 col-sm-9" :id="index">
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="details-header">
                        <h6 class="">{{ i.transactionNumber }}</h6>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="details-text"><font-awesome-icon class="icon-decor" icon="user-circle" /> {{ i.travellerName }}</div>
                    </div>
                    <div class="col-lg-12">
                      <div class="details-text"><font-awesome-icon class="icon-decor" icon="phone" /> {{ i.travellerPhone }}</div>
                    </div>
                    <div class="col-lg-12">
                      <div class="details-text"><font-awesome-icon class="icon-decor" icon="circle" /> {{ i.modeOfDelivery | capitalize }} &bull; <span>{{ i.timeAway }}</span></div>
                    </div>
                    <div class="col-lg-12">
                        <div class="details-text" v-if="i.journeyUpdate != null">
                            <font-awesome-icon class="icon-decor" icon="flag"/> Journey updates &bull; <span class="journey-updates-decor">{{ i.journeyUpdate }}</span>
                        </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="details-text">
                        <span v-if="i.isTimeStamp" class="timeStamp"> {{ i.timeStamp }}</span>
                      </div>
                    </div>

                    <!-- <div class="details-text">Delivery Update: {{ i.update }}</div> -->
                  </div>
              </div>
              <div class="col-md-3 col-lg-3 col-3 col-sm-3 courierDetailsImage">
                <!-- <img src="../assets/tc.jpeg" class="cImage" height="148px"
                               width="209px" alt="courier image"> -->
                    <div class="row">
                        <div class="col-md-12 col-lg-12 col-12 col-sm-12">
                          <b-img-lazy
                            :show="true"
                            right
                            :src="i.travellerImage"
                            class="courierImage"
                            rounded="circle"
                            thumbnail
                            fluid
                            alt="Right image"
                          ></b-img-lazy>
                        </div>
                        <!-- TODO: Visual display of timaway - not completed -->
                        <!-- <div class="col-md-12 col-lg-12 col-12 col-sm-12">
                          <div class="timeAwayIndicator">
                            <div class="awayMonitor" v-bind:style="{width: 100 + '%'}"></div>
                          </div>
                        </div> -->
                    </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import VueCookie from "vue-cookie";
import cookeys from "../cookeys";

const NoActivity = () => import("./RequestDeliveryNoActivity");
const ProgressSteps = () => import("./RequestDeliveryOngoingProgressComponent");

export default {
  name: "Ongoing",
  components: {
    "no-activity": NoActivity,
    "progress-steps": ProgressSteps
  },
  data() {
    return {
      showMore: null,
      showIndex: false,
      ongoingTransactions: "",
      ongoingTransactionsPolling: null,
      // test data, to be deleted soon
      message: "Loading...",
      // set to true if no transaction is going on
      noTransaction: false,
      // transaction updates
      minutesRemaining: '',
    };
  },
  methods: {
    showMoreFunc(evt) {
      // control the show details function
      if (this.showMore == evt) {
        this.showIndex = !this.showIndex;
      } else {
        this.showIndex = true;
      }
      this.showMore = evt;
    },
    // refresh ongoing transactions data every 3 seconds
    pollOngoingTransactionsData(){
      this.ongoingTransactionsPolling = setInterval(() => {
        this.ongoingTransactions = JSON.parse(VueCookie.get(cookeys.ONGOING_TRANSACTIONS_DATA_KEY));
      }, 3000)
    },
  },
  filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
},
  beforeDestroy(){
    clearInterval(this.ongoingTransactionsPolling);
  },
  created() {
    this.pollOngoingTransactionsData()
    // prevent user from going back to courier Found after ongoing is loaded and instead redirect them to request delivery page
    window.onpopstate = event => {
      if (this.$store.state.courierFoundPage == true) {
        this.$router.push("/");
      }
    };
  },
  mounted() {
    window.onpopstate = event => {
      if (this.$store.state.courierFoundPage == true) {
        this.$router.push("/");
      }
    };

    this.ongoingTransactions = JSON.parse(VueCookie.get(cookeys.ONGOING_TRANSACTIONS_DATA_KEY));
    if (this.ongoingTransactions == null) {
      this.ongoingTransactions = [];
      this.message = "You have no ongoing transactions"
    }

    this.$messaging.onMessage(payload => {
      if(payload.data.activity == 'Navigation started'){
        const ongoing_txns_data = JSON.parse(VueCookie.get(cookeys.ONGOING_TRANSACTIONS_DATA_KEY));
        ongoing_txns_data.forEach(function(txns, index){
          if(txns.sendID == parseInt(payload.data.sendID)){
            txns.journeyUpdate = payload.data.status;
            txns.timeAway = payload.data.timeAway;
          }
        })
        VueCookie.set(cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(ongoing_txns_data));
        this.ongoingTransactions = ongoing_txns_data;
      }
      // for multiple delivery updates
      if(payload.data.activity == "Delivery complete"){
          const ongoing_txns_data = JSON.parse(VueCookie.get(cookeys.ONGOING_TRANSACTIONS_DATA_KEY));
          ongoing_txns_data.forEach(function(txns, index){
            if(txns.sendID == parseInt(payload.data.sendID)){
              txns.journeyUpdate = payload.data.update

            }
          })
          VueCookie.set(cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(ongoing_txns_data));
          this.ongoingTransactions = ongoing_txns_data;
      }
      // for parcel location time update
      if(payload.data.activity == "Parcel location"){
         const ongoing_txns_data = JSON.parse(VueCookie.get(cookeys.ONGOING_TRANSACTIONS_DATA_KEY));
         ongoing_txns_data.forEach(function(txns, index){
            if(txns.sendID == parseInt(payload.data.sendID)){
              let message = " ride away from headed destination"
              txns.timeAway = payload.data.timeAway + message;
            }
         })
         VueCookie.set(cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(ongoing_txns_data));
         this.ongoingTransactions = ongoing_txns_data;
      }
      // for courier progress
      if (payload.data.activity == "Courier progress") {
        // get the sendID of the payload, compare with the send id of the ongoingTransactions data list, and update the
        // location, status, step, update,
        const time = payload.data.timeStamp;
        const isoDate = new Date(parseInt(time));
        const timeData = isoDate.toGMTString();
        const ongoing_txns_data = JSON.parse(VueCookie.get(cookeys.ONGOING_TRANSACTIONS_DATA_KEY));
        ongoing_txns_data.forEach(function(txns, index) {
          if (txns.sendID == parseInt(payload.data.sendID)) {
            txns.step = payload.data.step;
            txns.lastKnownLocation = payload.data.location;
            txns.update = payload.data.update;
            txns.status = payload.data.status;
            txns.timeStamp = timeData;
            // set data to true to indicate data presence;
            txns.isTimeStamp = true;
            // iterate over step and set step<step> values in ongoing trasaction data to active to update progress
            for (let i = 0; i < parseInt(txns.step); i++) {
              const step = `step${i}`;
              txns[step] = "active";
            }
          }

          // NOTE: This code is potetially irrelevant and might be removed in the nearby future
          // remove completed transactions
          // if(txns.status == 'Parcel Delivered'){
          //   console.log('finished alert....')
          //     ongoing_txns_data.splice(index, 1);
          //     console.log('ongoing is ', cookeys.ONGOING_TRANSACTIONS_DATA_KEY);
          //     VueCookie.set(cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(ongoing_txns_data))
          // }
        });
        // set cookie data back
        VueCookie.set(cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(ongoing_txns_data));
        this.ongoingTransactions = ongoing_txns_data;
      }
    });
  }
};
</script>

<style lang="css" scoped>
  .mb-2 {
      margin-top: 100px;
  }

  .status {
    /* font-weight: bold; */
    color: #3aac5d;
  }

  .totalTransactions {
    text-align: right;
  }

  ul{
    list-style-type: none;
  }

  .courierTextDetailsDiv {

  }

  .courierDetailsImage {
    margin-top: 10px;
  }

  .timeAwayIndicator {
    margin-top: 40px;
    border: solid #ccc 1px;
  }

  .awayMonitor {
    height: 10px;
    background-color: green;
    width: 100%;
  }

  .courierImage {
    width: 100px;
    height: 100px;
  }

  .ongoings-header {
    border-bottom: solid 1px #ccc;
    margin-bottom: 10px;
    text-align: left;
    margin-left: 2px;
  }

  .ongoing-header-alt {
    text-align: left;
    margin-left: 2px;
    /* margin-top: 20px; */
    border-bottom: solid #ccc 1px;
  }

  .cImage {
    margin-left: -15px;
    width: 209px;
    height: 148px;
  }

  .courierFullDetailsDiv {
    width: 100%;
    border: solid #ccc 1px;
    margin-left: 0;
    margin-top: 0;
    border-radius: 2px;
    margin-bottom: 10px;
    text-align: left;
    padding: 5px;
  }

.details-header {
  /* color: black; */
  line-height: 20px;
  font-size: 20px;
}

.details-text {
  font-family: "Trebuchet MS", Helvetica, sans-serif;
  font-size: 15px;
  letter-spacing: 0.2px;
  word-spacing: -0.2px;
  color: #595959;
  font-weight: normal;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}

.transaction {
  margin-bottom: 10px;
  margin-top: 10px;
  margin-left: -120px;
}

/* mobile display of progress component */
@media screen and (max-width: 700px){
  .transaction {
    margin-bottom: 10px;
    margin-top: 10px;
    margin-left: -20px;
  }

}

.item-container {
  border-bottom: solid #dadee3 1px;
  text-align: left;
  margin-left: 0;
  width: 100%;
}

.moreBtn {
  vertical-align: middle;
  margin-top: 25px;
  margin-bottom: 20px;
}

.timeStamp {
  font-weight: bold;
}

.icon-decor {
  color: 	#5bc0de;
}

.journey-updates-decor {
  color: green;
}

.ongoingChange-enter-active {
  transition: all .2s ease;
}
.ongoingChange-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.ongoingChange-enter, .ongoingChange-leave-to {
  transform: translateX(10px);
  opacity: 0;
}


</style>
