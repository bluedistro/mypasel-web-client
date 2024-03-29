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
              <div class="col-md-2 col-lg-2 col-5 col-sm-5 totalTransactions">
                {{ ongoingTransactions.length }} Transaction(s)
              </div>
            </div>
          </div>
          <div class="row item-container" v-for="(i, index) in ongoingTransactions" :key="index">
            <div class="col-md-7 col-sm-12 col-12 col-lg-8 transaction">
              <progress-steps v-bind:step1="i.step0" v-bind:step2="i.step1" v-bind:step3="i.step2">
              </progress-steps>
            </div>
            <div class="status col-md-3 col-sm-0 col-0 col-lg-2">
              {{ i.status }}
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

            <div class="col-md-2 col-sm-3 col-9 col-lg-2 moreBtn">
              <button
                type="button"
                :disabled="i.transactionCompleted"
                class="btn-sm btn-warning form-control"
                @click="cancelTransaction(index)"
                name="button"
              >
                Cancel Transaction
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
                  </div>
              </div>
              <div class="col-md-3 col-lg-3 col-3 col-sm-3 courierDetailsImage">
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
                    </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- cancel transaction -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="cancel-transaction"
        id="cancel-transaction"
        v-model="transactionCancellationFormModal"
        title="Transaction cancellation form"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            label="Can you please let us know your reason for cancelling?"
            label-for="name-input"
          >
            <b-form-textarea
              id="name-input"
              v-model="cancellationReason"
              rows="4"
              max-rows="8"
              placeholder="Reason is optional"
            ></b-form-textarea>
          </b-form-group>
        </form>
        <template slot="modal-footer" slot-scope="{ ok, cancel }">
          <b-button v-promise-btn variant="outline-danger" @click="proceedCancelTransaction"
            >Cancel transaction</b-button
          >
          <b-button variant="outline-info" @click="stopCancellationProcess">Ignore</b-button>
        </template>
      </b-modal>
    </div>
    <!-- Unable to cancel booking -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="transaction-cancellation-error-modal"
        size="sm"
        id="transaction-cancellation-error-modal"
        v-model="unsuccessfulTransactionCancellationModal"
        title="Transaction cancellation failure"
      >
        <p class="transaction-cancellation-error-modal-text">Sorry, we were unable to cancel your order.</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="outline-danger" @click="transactionCancellationErrorModalHide"
            >Okay</b-button
          >
        </template>
      </b-modal>
    </div>

  </div>
</template>

<script>
// TODO: Reaccess the progress steps update procedure
var socketIOClient = require('socket.io-client')
var sailsIOClient = require('sails.io.js')

const NoActivity = () => import("./RequestDeliveryNoActivity")
const ProgressSteps = () => import("./RequestDeliveryOngoingProgressComponent")

export default {
  name: "Ongoing",
  components: {
    "no-activity": NoActivity,
    "progress-steps": ProgressSteps
  },
  data () {
    return {
      showMore: null,
      showIndex: false,
      ongoingTransactions: "",
      ongoingTransactionsPolling: null,
      message: "Loading...",
      noTransaction: false,
      minutesRemaining: '',
      transactionCancellationFormModal: false,
      unsuccessfulTransactionCancellationModal: false,
      cancellationReason: '',
      transactionID: ''
    }
  },
  methods: {
    showMoreFunc (evt) {
      // control the show details function
      if (this.showMore == evt) {
        this.showIndex = !this.showIndex
      } else {
        this.showIndex = true
      }
      this.showMore = evt
    },
    cancelTransaction (index) {
      this.transactionCancellationFormModal = true
      let transactionID = this.ongoingTransactions[index].sendID
      this.transactionID = transactionID
    },
    proceedCancelTransaction () {
      let loader = this.$loading.show({
        loader: "bars",
        color: "#00bcd4",
        opacity: 0.7,
        height: 80,
        width: 80
      })
      this.transactionCancellationFormModal = false
      let cancellationPayload = {
        cancelId: this.transactionID,
        reason: this.cancellationReason
      }
      return this.$store.dispatch('cancelTransaction', cancellationPayload)
                 .then(resp => {
                   this.updateOngoingTransactions()
                   loader.hide()
                   // notify user of cancellation status
                 })
                 .catch(err => {
                   loader.hide()
                   this.unsuccessfulTransactionCancellationModal = true
                   // same here
                 })

    },
    stopCancellationProcess () {
      this.transactionCancellationFormModal = false
    },
    transactionCancellationErrorModalHide () {
      this.unsuccessfulTransactionCancellationModal = false
    },
    updateOngoingTransactions () {
      const user_id = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id
      this.$store.dispatch('getOngoingTransactions', user_id)
                        .then((resp) => {
                          // get updated ongoingTransactions data from cookie and assign to the data object
                          this.ongoingTransactions = resp.data
                          if(this.ongoingTransactions.length > 0){
                            this.ongoingTransactions.forEach(function(txns, index){
                              for (let i = 0; i < txns.step; i++) {
                                let step = `step${i}`
                                txns[step] = "active"
                                txns.journeyUpdate = txns.status
                                txns.timeAway = 'N/A mins ride away from headed destination'
                              }
                              // txns.journeyUpdate = txns.status
                            })
                          }else if(this.ongoingTransactions <= 0){
                            // reset to empty array
                            this.ongoingTransactions = []
                            this.message = 'No ongoing transactions'
                          }
                          // sync cookie info
                          this.$cookie.set(this.$cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(this.ongoingTransactions))
                        })
                        .catch((err) => {})
    },
    // refresh ongoing transactions data every 3 seconds
    pollOngoingTransactionsData () {
      this.ongoingTransactionsPolling = setInterval(() => {
        this.updateOngoingTransactions()
      }, 10000)
    },
  },
  filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
},
  beforeDestroy () {
    clearInterval(this.ongoingTransactionsPolling)
  },
  created () {
    // prevent user from going back to courier Found after ongoing is loaded and instead redirect them to request delivery page
    window.onpopstate = event => {
      if (this.$store.state.courierFoundPage == true) {
        this.$router.push("/")
      }
    }
  },
  mounted () {
    window.onpopstate = event => {
      if (this.$store.state.courierFoundPage == true) {
        this.$router.push("/")
      }
    }
    // instantiate ongoing transactions before polling
    this.updateOngoingTransactions()
    //Begin continuous polling
    // this.pollOngoingTransactionsData()

    const id = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id
    let io
    if(socketIOClient.sails){
      io = socketIOClient
    }else{
      io = sailsIOClient(socketIOClient)
    }
    io.sails.url = "https://api.mypasel.com"
    io.socket.request({
          method: 'get',
          url: '/user/subscribe?id='+id,
          headers: {
            'Authorization': 'key=EA9559850E60F62854CBB543791D5141'
          }
        },
        (responseData, jwres)=> {} )

    io.socket.on('events', (payload) => {
      if(payload.activity == 'Navigation started'){
        const ongoing_txns_data = JSON.parse(this.$cookie.get(this.$cookeys.ONGOING_TRANSACTIONS_DATA_KEY))
        ongoing_txns_data.forEach(function(txns, index){
          if(txns.sendID == parseInt(payload.sendID)){
            txns.journeyUpdate = payload.status
            txns.status = payload.status
            txns.timeAway = payload.timeAway + ' ride away from headed destination'
          }
        })
        this.$cookie.set(this.$cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(ongoing_txns_data))
        this.ongoingTransactions = ongoing_txns_data
      }
      // for multiple delivery updates
      if(payload.activity == "Delivery complete"){
          const ongoing_txns_data = JSON.parse(this.$cookie.get(this.$cookeys.ONGOING_TRANSACTIONS_DATA_KEY))
          ongoing_txns_data.forEach(function(txns, index){
            if(txns.sendID == parseInt(payload.sendID)){
              txns.transactionCompleted = true
              txns.journeyUpdate = payload.update
              txns.status = payload.update
              txns["step3"] = "active"
            }
          })
          // sync cookie info
          this.$cookie.set(this.$cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(ongoing_txns_data))
          this.ongoingTransactions = ongoing_txns_data
      }
      // for parcel location time update
      if(payload.activity == "Parcel location"){
         const ongoing_txns_data = JSON.parse(this.$cookie.get(this.$cookeys.ONGOING_TRANSACTIONS_DATA_KEY))
         ongoing_txns_data.forEach(function(txns, index){
            if(txns.sendID == parseInt(payload.sendID)){
              let message = " ride away from headed destination"
              txns.timeAway = payload.timeAway + message
            }
         })
         // sync cookie info
         this.$cookie.set(this.$cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(ongoing_txns_data))
         this.ongoingTransactions = ongoing_txns_data
      }
      // for courier progress
      if (payload.activity == "Courier progress") {
        console.log('cp ', payload)
        // get the sendID of the payload, compare with the send id of the ongoingTransactions data list, and update the
        // location, status, step, update,
        const time = payload.timeStamp
        const isoDate = new Date(parseInt(time))
        const timeData = isoDate.toGMTString()
        const ongoing_txns_data = JSON.parse(this.$cookie.get(this.$cookeys.ONGOING_TRANSACTIONS_DATA_KEY))
        ongoing_txns_data.forEach(function(txns, index) {
          if (txns.sendID == parseInt(payload.sendID)) {
            txns.step = payload.step
            txns.lastKnownLocation = payload.location
            txns.journeyUpdate = payload.update
            txns.status = payload.status
            txns.timeAway = payload.timeAway + " ride away from headed destination"
            txns.timeStamp = timeData
            // set data to true to indicate data presence
            txns.isTimeStamp = true
            // iterate over step and set step<step> values in ongoing trasaction data to active to update progress
            for (let i = 0; i < parseInt(txns.step); i++) {
              const step = `step${i}`
              txns[step] = "active"
            }
          }
        })
        // // sync cookie info
        this.$cookie.set(this.$cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(ongoing_txns_data))
        this.ongoingTransactions = ongoing_txns_data
      }
    })

    // on server-socket disconnect
    io.socket.on('disconnect', () => {
      // call ongoings api
      this.updateOngoingTransactions()
      // try reconnecting
      io.socket.request({
            method: 'get',
            url: '/user/subscribe?id='+id,
            headers: {
              'Authorization': 'key=EA9559850E60F62854CBB543791D5141'
            }
          },
          (responseData, jwres)=> {} )
    })

  }
}
</script>

<style lang="css" scoped>
  .mb-2 {
      margin-top: 100px;
  }

  .status {
    color: #3aac5d;
    margin-top: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .totalTransactions {
    text-align: right;
  }

  ul{
    list-style-type: none;
  }

  button:disabled {
    opacity: 0.5;
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
    margin-top: 10px;
    margin-left: -35px;
  }

  .status {
    color: #3aac5d;
    margin-top: 0px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .moreBtn {
    vertical-align: middle;
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
