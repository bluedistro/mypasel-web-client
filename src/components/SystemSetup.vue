<template lang="html">
  <div class="">
    <div class="bar"></div>
    <div class="container">
       <div class="row">
          <div class="col-md-12 col-lg-12 col-sm-12 col-12 setup-message">
              {{ setupMessage }}
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
        <p class="reset-fcm-text">{{ errorMessage }}</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="info" @click="resetFCMModalHide">Resolve Issue</b-button>
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
      setupMessage: "Please hold on a second while we setup you up...",
      errorMessage: "Failed to set up system. Please click on resolve issue to fix it"
    };
  },
  methods: {
    // call function to get newly generated FCM token and set it up as cookie
    async resetFCMModalHide(){
      const tokenExpect = await this.generateFCM();
      if(tokenExpect != null || tokenExpect != 'error'){
        this.$cookie.set(this.$cookeys.FCM_TOKEN_KEY, tokenExpect, {expires: this.$cookeys.cookie_expire})
        this.$router.push({name: 'RequestDelivery'});
      }else if(tokenExpect == 'error'){
        this.errorMessage = "System issue could not be resolved. Please accept notificatons for this site if you haven't and try logging in again.";
        this.$router.push({name: 'Login'});
      }
      this.$refs["reset-fcm-modal"].hide();
    },
    // try to generate FCM token again on first try failure
    generateFCM(){
      return new Promise((resolve, reject) => {
        this.$messaging.requestPermission()
            .then(() => this.$messaging.getToken())
            .then(token => {
              resolve(token)
            })
            .catch(error => {
              const err = 'error';
              reject(err);
            })
      })
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
                 this.setupMessage = "Still setting up..."
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

.reset-fcm-text {
  font-size: 80%;
}

 .setup-message {
   margin-top: 80px;
   font-weight: bold;
 }

</style>
