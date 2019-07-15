<template lang="html">
  <!-- <div class="form-gap"></div> -->
  <div class="container">
    <div class="row">
      <div class="col-md-12 col-sm-10 col-lg-6 form-body">
        <div class="panel panel-default">
          <div class="panel-body">
            <div class="text-center">
              <h3>
                <font-awesome-icon icon="lock" size="2x" />
              </h3>
              <h2 class="text-center">Forgot Password?</h2>
              <p>You can reset your password here.</p>
              <div v-bind:class="errorClass">
                <span v-if="unableToSendEmail">{{ errorMessage }}</span>
              </div>
              <div class="panel-body">
                <form
                  @submit="requestPasswordReset"
                  v-promise-btn="{ action: 'submit' }"
                  id="register-form"
                >
                  <div class="form-group">
                    <div class="input-group">
                      <input
                        id="email"
                        name="email"
                        required
                        placeholder="email address *"
                        class="form-control"
                        v-model="emailAddress"
                        type="email"
                      />
                    </div>
                  </div>
                  <div class="form-group col-md-2 col-4 col-sm-3 col-lg-2 reset-btn">
                    <input
                      name="recover-submit"
                      class="btn btn-sm btn-outline-dark btn-change-password"
                      value="Submit"
                      type="submit"
                    />
                  </div>
                  <input type="hidden" class="hide" name="token" id="token" value="" />
                </form>
                <div>
                  <div class="border-line"></div>
                  <a href="#">
                    <router-link class="loginPageBtn" :to="{ name: 'Login', params: {} }"
                      >Login</router-link
                    >
                    <router-link class="createAccountBtn" :to="{ name: 'Register', params: {} }"
                      >Create new account</router-link
                    >
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ForgotPasswordEmail",
  data() {
    return {
      emailAddress: '',
      errorMessage: '',
      errorClass: '',
      unableToSendEmail: false,
    };
  },
  methods: {
    requestPasswordReset(evt) {
      evt.preventDefault();
      // show loader
      let loader = this.$loading.show({
        loader: "bars",
        color: "#00bcd4",
        height: 80,
        width: 80
      });

      this.errorClass = '';
      this.unableToSendEmail = false;
      const payload = {
        emailAddress : this.emailAddress
      }
      return this.$store.dispatch('requestPasswordReset', payload)
                        .then((resp) => {
                          loader.hide();
                          this.$router.push({name: 'ForgotPasswordConfirm'});
                        })
                        .catch((error) => {
                          loader.hide();
                          if (error.response.status) {
                            if (error.response.status == 400) {
                              this.errorMessage = "Email address may be invalid. Please make sure the email address is valid and try again";
                            } else if (error.response.status == 503) {
                              this.errorMessage =
                                "Service temporarily unavailable. We are working very hard to get it back as soon as possible";
                            } else if (error.response.status == 404) {
                              this.errorMessage = "A problem occured while trying to verify email. Please make sure the provided email is valid";
                            } else {
                              this.errorMessage = "Unable send verification code to email.";
                            }
                          } else {
                            this.errorMessage =
                              "Unable to send verification code. Kindly try again later.";
                          }
                          this.unableToSendEmail = true;
                          this.errorClass = 'verify-email-error'

                        })

    }
  }
};
</script>

<style lang="css" scoped>
 .form-body {
   float: none;
   margin: 0 auto;
   background-color: #f5f9ff;
   padding: 15px 15px;
   -webkit-animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
         animation: slide-in-fwd-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
 }

 /* fprgot animation */
 /* ----------------------------------------------
 * Generated by Animista on 2019-7-14 7:51:30
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slide-in-fwd-center
 * ----------------------------------------
 */
@-webkit-keyframes slide-in-fwd-center {
  0% {
    -webkit-transform: translateZ(-1400px);
            transform: translateZ(-1400px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateZ(0);
            transform: translateZ(0);
    opacity: 1;
  }
}
@keyframes slide-in-fwd-center {
  0% {
    -webkit-transform: translateZ(-1400px);
            transform: translateZ(-1400px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateZ(0);
            transform: translateZ(0);
    opacity: 1;
  }
}

.verify-email-error {
  font-size: 90%;
  margin-bottom: 5px;
  color: #f57242;
  -webkit-animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
          animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}


/* email verificaton error animation */
/* ----------------------------------------------
 * Generated by Animista on 2019-7-13 16:48:24
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation shake-horizontal
 * ----------------------------------------
 */
@-webkit-keyframes shake-horizontal {
  0%,
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70% {
    -webkit-transform: translateX(-10px);
            transform: translateX(-10px);
  }
  20%,
  40%,
  60% {
    -webkit-transform: translateX(10px);
            transform: translateX(10px);
  }
  80% {
    -webkit-transform: translateX(8px);
            transform: translateX(8px);
  }
  90% {
    -webkit-transform: translateX(-8px);
            transform: translateX(-8px);
  }
}
@keyframes shake-horizontal {
  0%,
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70% {
    -webkit-transform: translateX(-10px);
            transform: translateX(-10px);
  }
  20%,
  40%,
  60% {
    -webkit-transform: translateX(10px);
            transform: translateX(10px);
  }
  80% {
    -webkit-transform: translateX(8px);
            transform: translateX(8px);
  }
  90% {
    -webkit-transform: translateX(-8px);
            transform: translateX(-8px);
  }
}



 .border-line {
   border: solid #ccc 0.5px;
   margin-bottom: 10px;
 }

 .row{
   margin-top: 90px;
 }

 .reset-btn {
   margin-left: -18px;
 }

 .btn-change-password {
   border-radius: 20px;
   background-color: #5bc0de;
   border: none;
   color: #fff;
   padding: 10px;
 }

 .loginPageBtn {
   float: left;
   text-decoration: none;
   color: #f47d42;
 }

 .createAccountBtn{
   text-decoration: none;
   float: right;
   color: #309940;
 }

 input[type="email"] {
   border-color: #ccc;
   outline: none;
   -webkit-box-shadow: none;
   box-shadow: none;
   border-top: none;
   border-left: none;
   border-right: none;
   border-radius: 0;
   background: #f5f9ff;
 }

 input[type="email"]:focus {
   border-color: #00bcd4;
   outline: none;
   -webkit-box-shadow: none;
   box-shadow: none;
   border-top: none;
   border-left: none;
   border-right: none;
   border-radius: 0;
   background: #fff;
 }


/* for smaller devices devices */
 @media (max-width: 700px){
   .form-body {
     background-color: #fff;
   }

   input[type="email"], input[type="email"]:focus {
     background: #fff;
   }
 }

/* show background shadow for bigger devices */
 @media (min-width: 992px){
    .form-body {
      border: solid #ced3db 1px;
      border-radius: 2px;
      /* -webkit-box-shadow: 2px 3px 3px -1px rgba(0,0,0,0.75);
      -moz-box-shadow: 2px 3px 3px -1px rgba(0,0,0,0.75);
      box-shadow: 2px 3px 3px -1px rgba(0,0,0,0.75); */
    }
 }
</style>
