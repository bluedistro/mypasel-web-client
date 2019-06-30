<template lang="html">
  <div class="container mb-2">
    <div class="row scheduled-header">
      <h4>Scheduled Transactions</h4>
    </div>
    <div class="col-md-12 col-sm-12 col-12 col-lg-12" v-if="scheduledData.length <= 0">
      <no-activity v-show="noScheduled" v-bind:message="message"></no-activity>
    </div>
    <div class="row" v-if="scheduledData.length > 0">
      <div
        class="col-md-10 col-lg-10 col-11 col-sm-11 scheduledContainer"
        v-for="(txns, index) in scheduledData"
        :key="index"
      >
        <div class="row">
          <div class="col-md-9 col-sm-9 col-9 col-lg-9 scheduledContainerDetailText">
            <div>
              <h6 class="scheduled-container-header">{{ txns.transactionNumber }}</h6>
            </div>
            <div class="">
              {{ txns.travellerName }}
            </div>
            <div class=""><font-awesome-icon /> {{ txns.travellerPhone }}</div>
            <div class=""><span class="alt-design">Pickup:</span> {{ txns.pickup }}</div>
            <div class=""><span class="alt-design">Update:</span> {{ txns.status }}</div>
          </div>
          <div class="col-md-3 col-sm-3 col-3 col-lg-3 scheduledContainerDetailImage">
            <b-img-lazy
              :show="true"
              right
              :src="txns.travellerImage"
              class="travellerImage"
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
</template>

<script>
// import NoActivity from './RequestDeliveryNoActivity.vue';
const NoActivity = () => import("./RequestDeliveryNoActivity");
export default {
  name: "Scheduled",
  components: {
    "no-activity": NoActivity
  },
  data() {
    return {
      message: "You have no scheduled transactions",
      noScheduled: true,
      scheduledData: []
    };
  },
  created() {},
  mounted() {
    const id = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id;
    this.$store
      .dispatch("getScheduledTransactions", id)
      .then(resp => {
        this.scheduledData = resp.data;
        // console.log(resp.data)
      })
      .catch(error => []);
  }
};
</script>

<style lang="css" scoped>
.mb-2 {
  margin-top: 100px;
}

.scheduled-header {
  text-align: left;
  margin-top: 20px;
  border-bottom: solid #ccc 1px;
}

.scheduledContainer{
border: solid #ccc 1px;
border-radius: 2px;
margin-top: 10px;
}

.scheduled-container-header {
  margin-top: 5px;
  font-weight: bold;
}

.scheduledContainerDetailText {
  text-align: left;
  font-size: 14px;
}

.scheduledContainerDetailImage {
  margin-top: 10px;
  margin-bottom: 10px;
}

.travellerImage {
  height: 100px;
  width: 100px;
}

.pickup-pin {
  color: #f46542;
}

.alt-design {
  font-weight: bold;
}

@media screen and (max-width: 768px){
  .scheduledContainer {
    margin-left: 13px;
  }

}
</style>
