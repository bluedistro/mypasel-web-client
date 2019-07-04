<template lang="html">
  <div class="container mb-2">
    <div class="row transaction-history-header">
      <h4>Transaction History</h4>
    </div>
    <div class="row">
      <transition name="historyChange" mode="in-out">
        <!--  if no history -->
        <div class="col-md-12 col-12 col-lg-12 col-sm-12" v-if="historyContent.length <= 0" key="no-history">
          <no-activity v-bind:message="message"></no-activity>
        </div>
        <!-- else -->
        <div
          class="col-md-10 col-10 col-lg-10 col-sm-11 col-11 general-container"
          v-if="historyContent.length > 0" key="history">
          <!-- search filter -->
          <div class="row search-filter">
            <!-- search form input and ticker -->
            <div class="col-md-9 col-sm-9 col-9 col-lg-9 search-input">
              <input
                class="form-control"
                v-model="txnsHistorySearch"
                placeholder="filter transaction history with pickup search"
              />
            </div>
            <div class="col-md-3 col-sm-3 col-3 col-lg-3 tickers" id="tickers">
                <a @click="sortDateAscending"><font-awesome-icon icon="angle-up" /></a> <br/>
                <a @click="sortDateDescending"><font-awesome-icon icon="angle-down" /></a>
            </div>
            <b-tooltip
              target="tickers"
              placement="left"
              title="Sort by transaction date"
            ></b-tooltip>
            <div
              class="col-md-10 col-sm-12 col-12 col-10 col-lg-10 search-message"
              v-if="txnsHistorySearch != ''"
            >
              Showing filtered results with pickup
              <span class="search-slot">{{ txnsHistorySearch }}</span>
            </div>
            <div class="col-md-10 col-sm-12 col-12 col-10 col-lg-10 search-border"></div>
          </div>
          <!-- history data -->
          <transition-group name="sortList" tag="div">
            <div v-for="(txns, index) in filteredHistory" :key="index" class="historyDataContainer">
              <div class="row">
                <div class="history-data col-md-10 col-10 col-lg-10 col-sm-12 col-12">
                  <div class="row">
                    <div class="col-md-6 col-lg-6 col-sm-6 col-6 transaction-header">
                      {{ txns.transactionNumber }}
                    </div>
                    <div class="col-md-6 col-lg-6 col-sm-6 col-6 transaction-timeStamp">
                      {{ txns.timeStamp }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12 col-lg-12 col-sm-12 col-12 pickup-text">
                      <font-awesome-icon icon="map-pin" class="pickup-pin" /> {{ txns.pickup }}
                    </div>
                    <div class="col-md-12 col-lg-12 col-sm-12 col-12 dropoff-text">
                      <font-awesome-icon icon="map-pin" class="dropoff-pin" /> {{ txns.dropOff }}
                    </div>
                    <div class="col-md-12 col-lg-12 col-sm-12 col-12 fee-text">GHS {{ txns.fee }}</div>
                  </div>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </transition>
    </div>
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="history-fetch-error-modal"
        size="sm"
        id="history-fetch-error-modal"
        v-model="historyFetchErrorModal"
        title="Unable to fetch history"
      >
        <p class="success-modal-text">{{ errorMessage }}</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="info" @click="historyFetchError">Okay</b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
// import NoActivity from './RequestDeliveryNoActivity.vue';
const NoActivity = () => import("./RequestDeliveryNoActivity");
export default {
  name: "History",
  components: {
    "no-activity": NoActivity
  },
  data() {
    return {
      txnsHistorySearch: "",
      message: "You have no transaction history",
      historyContent: [],
      errorMessage: "Unable to fetch history due to a technical failure. Please refresh page to try again",
      historyFetchErrorModal: false,
    };
  },
  methods: {
    historyFetchError(){
      this.$refs["history-fetch-error-modal"].hide();
    },
    sortDateAscending(){
      this.historyContent = this.historyContent.sort((a, b) => a.rawTime - b.rawTime);
    },
    sortDateDescending(){
      this.historyContent = this.historyContent.sort((a, b) => b.rawTime - a.rawTime);
    }
  },
  computed: {
    // filter history data using pickup location
    filteredHistory: function() {
      return this.historyContent.filter(txns => {
        return txns.pickup.toLowerCase().match(this.txnsHistorySearch.toLowerCase());
      });
    }
  },
  mounted() {
    // GET transaction history
    const id = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id;
    this.$store
      .dispatch("getTransactionsHistory", id)
      .then(resp => {
        // alter data a bit to get dropOff and timeStamp easily
        resp.data.forEach((txns, index) => {
          for (let i = 0; i < txns.destinations.length; i++) {
            const dateItem = new Date(txns.destinations[i].updatedAt);
            txns.timeStamp = dateItem.toGMTString();
            txns.dropOff = JSON.parse(txns.destinations[i].targetLocation).name;
            txns.rawTime = txns.destinations[i].updatedAt;
          }
        });
        this.historyContent = resp.data;
        // sort the data
        this.historyContent = this.historyContent.sort((a, b) => b.rawTime - a.rawTime)
      })
      .catch(error => {
        if(error.response.status == 503){
          this.errorMessage = 'Our servers failed while retrieving your history. Kindly refresh page to try again';
        }else if(error.response.status == 500){
          this.errorMessage = 'Sorry, we experienced a technical glitch while fetching your history data. Please refresh page to try again';
        }
        this.historyFetchErrorModal = true;
      });
  }
};
</script>

<style lang="css" scoped>
.mb-2 {
  margin-top: 100px;
}

.history-data {
    border: solid #ccc 1px;
    border-radius: 3px;
    background: #f9fff9;
}

.historyDataContainer {
  margin-bottom: 5px;
  /*  */

}

.transaction-header {
  text-align: left;
  padding: 5px;
  font-weight: bold;
}

.transaction-timeStamp{
  text-align: right;
  padding: 5px;
}

.pickup-text {
  margin-top: 5px;
  text-align: left;
  padding-left: 5px;
  /*  */
  font-family: "Lucida Console", Monaco, monospace;
  font-size: 15px;
  letter-spacing: 1px;
  word-spacing: 0.5px;
  color: #000000;
  font-weight: normal;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}

.dropoff-text {
  text-align: left;
  padding-left: 5px;
  /*  */
  /*  */
  font-family: "Lucida Console", Monaco, monospace;
  font-size: 15px;
  letter-spacing: 1px;
  word-spacing: 0.5px;
  color: #000000;
  font-weight: normal;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}

.fee-text {
  text-align: left;
  padding-left: 5px;
  /* ; */
  font-family: "Arial Black", Gadget, sans-serif;
  font-size: 15px;
  letter-spacing: 2px;
  word-spacing: 2px;
  color: #000000;
  font-weight: normal;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}

.pickup-pin {
  color: #f46542;
}

.search-input {
  margin-bottom: 10px;
  /* margin-left: -15px; */
}

.search-border {
  margin-bottom: 10px;
  border: solid #ccc 0.5px;
}

.dropoff-pin {
  color: #3ec436;
}
.fee-icon{
  color: green;
}

.search-message {
  text-align: left;
}

.search-slot {
  font-weight: bold;
  font-style: italic;
}

.search-filter {
  /* position: sticky;
  position: -webkit-sticky;
  top: 150px;
  left: 0; */
}

.tickers{
  text-align: left;
}

.transaction-history-header {
  margin-bottom: 20px;
  margin-left: 2px;
  border-bottom: solid #ccc 1px;
  padding: 3px;
  /* div */
  /* position: sticky;
  position: -webkit-sticky;
  top: 85px;
  left: 0; */

}

@media screen and (max-width: 768px){
  .general-container {
    margin-left: 13px;
  }

}


.historyChange-enter-active {
  transition: all .2s ease;
}
.historyChange-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.historyChange-enter, .historyChange-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

.sortList-move {
  transition: transform 1s;
}

</style>
