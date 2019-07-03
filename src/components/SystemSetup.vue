<template lang="html">
  <div class="">
    <div class="bar"></div>
    <div class="container">
       <div class="row">
          <div class="col-md-12 col-lg-12 col-sm-12 col-12 setup-message">
              Please hold on a second while we setup you up...
          </div>
       </div>
    </div>
    <!-- unable to set firebase token modal -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="reset-fcm-modal"
        size="sm"
        id="reset-fcm-modal"
        v-model="resetFCMModal"
        title="System Setup Failure"
      >
        <p class="reset-fcm-text">Sorry, we were not able to set up your system successfully but calm down because it's our fault. Kindly refresh this page to resolve the problem</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="info" @click="resetFCMModalHide">Okay</b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: "SystemSetup",
  data() {
    return {
      resetFCMModal: false,
    };
  },
  methods: {
    resetFCMModalHide(){
      this.$refs["reset-fcm-modal"].hide();
      // try reloading page a second time
      this.$forceUpdate();
    }
  },
  mounted(){
    // check for fcm token presence
    this.$store.dispatch('checkFCMTokenPresence')
               .then((resp) => {
                 // reroute to request delivery if token present
                 this.$router.push({name: 'RequestDelivery'});
               })
               .catch((error) => {
                // show failure modal
                this.resetFCMModal = true;
               })

      },
};
</script>

<style lang="css" scoped>
.bar {
   border: solid #545e5a 1px;
   transform: translate(-100%);
   animation: loader-bar 10s ease-in alternate infinite both;
 }

 @keyframes loader-bar {
     0%{border: 1px solid #42f4d1; transform: translate(-100%);}
    25%{border: 1px solid #42f4d1; transform: translate(-75%);}
    50%{border: 1px solid red; transform: translate(-50%);}
    75%{border: 1px solid yellow; transform: translate(-25%);}
    100%{border: 1px solid green; transform: translate(-0%);}
  }

 .setup-message {
   margin-top: 80px;
   font-weight: bold;
 }

</style>
