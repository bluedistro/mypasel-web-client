<template lang="html">
  <div class="container mb-2">
    <div class="row ongoing-header-alt" v-if="ongoingTransactions.length <= 0">
      <h4>Ongoing Transactions</h4>
    </div>
    <div class="row">
      <!-- if no transactions at the moment -->
      <div class="col-md-12 col-12 col-lg-12 col-sm-12" v-if="ongoingTransactions.length <= 0">
        <no-activity v-bind:message="message"></no-activity>
      </div>
      <!-- else -->
      <div class="col-md-12 col-12  col-lg-12 col-sm-12" v-if="ongoingTransactions.length > 0">
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
          <div class="col-md-2 col-sm-2 col-3 col-lg-2 moreBtn">
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
              <div class="details-header">
                <h6 class="">Transaction Details</h6>
              </div>
              <div class="details-text">Transaction ID: {{ i.transactionNumber }}</div>
              <div class="details-text">Courier Name: {{ i.travellerName }}</div>
              <div class="details-text">Contact: {{ i.travellerPhone }}</div>
              <div class="details-text">Delivery Mode: {{ i.modeOfDelivery }}</div>
              <div class="details-text">Delivery Update: {{ i.update }}</div>
              <div class="details-text">
                <span v-if="i.isTimeStamp" class="timeStamp"> {{ i.timeStamp }}</span>
              </div>
            </div>
            <div class="col-md-3 col-lg-3 col-3 col-sm-3 courierDetailsImage">
              <!-- <img src="../assets/tc.jpeg" class="cImage" height="148px"
                           width="209px" alt="courier image"> -->
              <b-img-lazy
                :show="true"
                right
                :src="i.travellerImage"
                height="125px"
                width="125px"
                class="courierImage"
                rounded="circle"
                thumbnail
                fluid
                alt="Right image"
              ></b-img-lazy>
            </div>
          </div>
        </div>
      </div>
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
      ongoingTransactions: JSON.parse(VueCookie.get(cookeys.ONGOING_TRANSACTIONS_DATA_KEY)),
      // test data, to be deleted soon
      message: "You have no ongoing transactions",
      // set to true if no transaction is going on
      noTransaction: false
      // transaction updates
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
    }
  },
  created() {
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
    }

    this.$messaging.onMessage(payload => {
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

  }

  .courierImage {
    width: 125px;
    height: 125px;
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
}

.item-container {
  border-bottom: solid #ccc 1px;
}

.moreBtn {
  vertical-align: middle;
  margin-top: 25px;
  margin-bottom: 20px;
}

.timeStamp {
  font-weight: bold;
}
</style>
