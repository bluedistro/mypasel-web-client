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
  </div>
</template>

<script>
export default {
  name: "SystemSetup",
  data() {
    return {
      resetFCMModal: false,
      setupMessage: "Requesting browser permission to configure notifications...",
      errorMessage: "Failed to set up system. Please click on resolve issue to fix it",
      redirectToLogin: false,
    };
  },
  methods: {
    // call function to get newly generated FCM token and set it up as cookie
    async resolveFCMIssue() {
      const tokenExpect = await this.generateFCM();
      if (tokenExpect != null || tokenExpect != "error") {
        // after resolve
        setTimeout(() => {
          this.$cookie.set(this.$cookeys.FCM_TOKEN_KEY, tokenExpect, {
            expires: this.$cookeys.cookie_expire
          });
          this.$router.push({ name: "RequestDelivery" });
        }, 2000);
      }
      // else if (tokenExpect == "error") {
      //   this.setupMessage =
      //     "System issue could not be resolved. \
      //      Please accept notificatons for this site if you haven't and try logging in again.";
      //   setTimeout(() => {
      //     this.$router.push({ name: "Login" });
      //   }, 5000);
      // }
    },
    // try to generate FCM token again on first try failure
    generateFCM() {
      return new Promise((resolve, reject) => {
        this.$messaging
          .requestPermission()
          .then(() => this.$messaging.getToken())
          .then(token => {
            resolve(token);
          })
          .catch((error) => {
            const err = "error";
            this.setupMessage = "Browser notifications permission was not granted and blocked instead. Please allow notifications."
            setTimeout(() => {
              this.redirectToLogin = true;
            },5000);
            reject(err);
          });
      });
    }
  },
  watch: {
    redirectToLogin(val){
      this.setupMessage = "Unable to get notification permission. Please allow notification for this site. Redirecting to login page..."
      setTimeout(() => {
        // revert login status and clear all cookies
        this.$store.dispatch('logout')
                   .then((resp) => {
                     this.$router.push({name: 'Login'})
                   })
                   .catch((error) => {
                     //
                   })
      }, 5000);
    }
  },
  mounted() {
    // check for fcm token presence
    this.$store
      .dispatch("checkFCMTokenPresence")
      .then(resp => {
        console.log('mounted info ', resp);
        // reroute to request delivery if token present
        this.$router.push({ name: "RequestDelivery" });
      })
      .catch(error => {
        // try resolving issue
        this.resolveFCMIssue();
      });
  }
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
