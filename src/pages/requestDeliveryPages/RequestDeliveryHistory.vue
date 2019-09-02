<template lang="html">
  <div class="container mb-2">
    <div class="row transaction-history-header">
      <h4>Transactions History</h4>
    </div>
    <div class="row">
      <transition name="historyChange" mode="in-out">
        <div
          class="col-md-12 col-12 col-lg-12 col-sm-12"
          v-if="historyContent.length <= 0"
          key="no-history">
          <no-activity v-bind:message="message"></no-activity>
        </div>

        <div
          class="col-md-10 col-10 col-lg-10 col-sm-11 col-11 general-container"
          v-if="historyContent.length > 0"
          key="history">
          <transition-group name="sortList" tag="ul">
            <li
              v-for="(txns, index) in lists"
              :key="index"
              id="historyDataId"
              class="historyDataContainer"
            >
              <div class="row">
                <div class="history-data col-md-10 col-10 col-lg-10 col-sm-12 col-12">
                  <div class="row history-card-header">
                    <div class="col-md-4 col-lg-4 col-sm-4 col-4 transaction-header">
                      {{ txns.transactionNumber }}
                    </div>
                    <div class="col-md-2 col-lg-2 col-sm-2 col-3 fee-text">
                      GHC {{ txns.fee }}
                    </div>
                    <div class="col-md-6 col-lg-6 col-sm-6 col-5 transaction-timeStamp">
                      {{ txns.timeStamp }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12 col-lg-12 col-sm-12 col-12 pickup-text">
                      <font-awesome-icon icon="map-pin" class="pickup-pin" /> {{ txns.pickup }}
                    </div>
                    <div class="dropoff-text">
                      <div class="col-md-12 col-lg-12 col-sm-12 col-12" v-for="d_o in txns.dropOff">
                        <font-awesome-icon icon="map-pin" class="dropoff-pin" /> {{ JSON.parse(d_o.targetLocation).name }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </transition-group>
          <div class="row pagination">
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="historyDataId"
            >
            </b-pagination>
            <div class="col-md-3 col-sm-3 col-3 col-lg-3 tickers" id="tickers">
              <a @click="sortDateAscending"><font-awesome-icon icon="angle-up"/></a> <br />
              <a @click="sortDateDescending"><font-awesome-icon icon="angle-down"/></a>
            </div>
            <b-tooltip
              target="tickers"
              placement="left"
              title="Sort by transaction date"
            ></b-tooltip>
          </div>
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
import { ContentLoader } from 'vue-content-loader'
const NoActivity = () => import("./RequestDeliveryNoActivity")
export default {
  name: "History",
  components: {
    ContentLoader,
    "no-activity": NoActivity
  },
  data () {
    return {
      perPage: 10,
      currentPage: 1,
      txnsHistorySearch: "",
      message: 'Loading...',
      historyContent: [],
      errorMessage:
        "Unable to fetch history due to a technical failure. Please refresh page to try again",
      historyFetchErrorModal: false
    }
  },
  methods: {
    historyFetchError () {
      this.$refs["history-fetch-error-modal"].hide()
    },
    sortDateAscending () {
      this.historyContent = this.historyContent.sort((a, b) => a.rawTime - b.rawTime)
    },
    sortDateDescending () {
      this.historyContent = this.historyContent.sort((a, b) => b.rawTime - a.rawTime)
    }
  },
  computed: {
    // filter history data using pickup location
    filteredHistory: function () {
      return this.historyContent.filter(txns => {
        return txns.pickup.toLowerCase().match(this.txnsHistorySearch.toLowerCase())
      })
    },

    lists () {
      const items = this.historyContent
      // Return just page of items needed
      return items.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    },

    rows () {
      return this.historyContent.length
    }
  },
  mounted () {
    // GET transaction history
    const id = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id
    this.$store
      .dispatch("getTransactionsHistory", id)
      .then(resp => {
        // alter data a bit to get dropOff and timeStamp easily
        resp.data.forEach((txns, index) => {
          tnxs.destinations.forEach((txnDest, index) => {
            const dateItem = new Date(txnsDest.updatedAt)
            txns.timeStamp = dateItem.toGMTString()
            txns.rawTime = txnsDest.updatedAt
          })
          txns.dropOff = txns.destinations
        })
        
        this.historyContent = resp.data
        if (this.historyContent.length <= 0){
          this.message = "You have no transaction history"
        }else{
          this.historyContent = this.historyContent.sort((a, b) => b.rawTime - a.rawTime)
        }
      })
      .catch(error => {
        if (error.response.status == 503) {
          this.errorMessage =
            "Our servers failed while retrieving your history. Kindly refresh page to try again"
        } else if (error.response.status == 500) {
          this.errorMessage =
            "Sorry, we experienced a technical glitch while fetching your history data. Please refresh page to try again"
        }
        this.historyFetchErrorModal = true
      })
  }
}
</script>

<style lang="css" scoped>
.mb-2 {
  margin-top: 100px;
}

.history-data {
    border: solid #8f9696 1px;
    border-radius: 1px;
    background: #f9fff9;
}

.historyDataContainer {
  margin-bottom: 12px;
  /*  */

}

.general-container {
  margin-left: 130px;
}

.transaction-header {
  text-align: left;
  padding: 5px;
  font-weight: bold;
}

.history-card-header {
  padding-bottom: 4px;
  padding-top: 4px;
  border-bottom: solid #ccc 1px;
}

.transaction-timeStamp{
  text-align: right;
  padding: 5px;
}

.pickup-text {
  text-align: left;
  padding: 10px 0 0 15px;
  /*  */
  /* font-family: "Lucida Console", Monaco, monospace; */
  font-size: 15px;
  letter-spacing: 1px;
  word-spacing: 0.5px;
  color: #222324;
  font-weight: normal;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}

.dropoff-text {
  text-align: left;
  padding-left: 0;
  padding-bottom: 10px;
  /*  */
  /*  */
  /* font-family: "Lucida Console", Monaco, monospace; */
  font-size: 15px;
  letter-spacing: 1px;
  word-spacing: 0.5px;
  color: #222324;
  font-weight: normal;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}

.fee-text {
  padding-top: 5px;
  color: #27a344;
  font-weight: 400;
  background-color: #e4ebeb;
  border-radius: 15px;
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

.pagination {
  justify-content: center;
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
    margin-left: -3px;
  }

  .tickers{
    display: none;
    /* text-align: right; */
  }

  .pagination {
    justify-content: center;
    /* text-align: center; */
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

/* history list transitions */
.sortList-enter-active,
.sortList-leave-active,
.sortList-move {
  transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transition-property: opacity, transform;
}

.sortList-enter {
  opacity: 0;
  transform: translateX(50px) scaleY(0.5);
}

.sortList-enter-to {
  opacity: 1;
  transform: translateX(0) scaleY(1);
}

.sortList-leave-active {
  position: absolute;
}

.sortList-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: center top;
}
</style>
