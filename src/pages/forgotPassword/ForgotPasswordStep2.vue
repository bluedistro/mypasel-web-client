<template lang="html">
<div class="body">
  <div class="container">
    <div class="row">
      <div class="col-md-12 col-sm-10 col-lg-6 form-body">
        <div class="panel panel-default">
          <div class="panel-body">
            <div class="text-center">
              <h2 class="text-cent">Reset Password</h2>
              <p>A confirmation code was sent to the email provided. Please enter the confirmation code and a new password</p>
              <div v-bind:class="errorClass" id="reset-password-error-id">
                <span v-if="unableToResetPassword">{{ errorMessage }}</span>
              </div>
              <div class="panel-body">
                <form
                  @submit="getNewPassword"
                  v-promise-btn="{ action: 'submit' }"
                  id="register-form"
                >
                  <div class="form-group">
                    <div class="input-group">
                      <input
                        id="verification_code"
                        name="verification_code"
                        placeholder="verification code *"
                        v-model="verificatonCode"
                        class="form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="input-group">
                      <input
                        id="userPassword"
                        name="userPassword"
                        v-model="userPassword"
                        placeholder="new password *"
                        ref="userPassword"
                        class="form-control"
                        type="password"
                        :class="{
                          input: true,
                          'is-danger': errors.has('userPassword')
                        }"
                        v-validate="'required|verify_password'"
                      />
                    </div>
                    <span
                      v-show="errors.first('userPassword')"
                      class="help is-danger"
                      >* {{ errors.first("userPassword") }}</span>
                  </div>
                  <div class="form-group">
                    <div class="input-group">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        ref="confirmPassword"
                        v-model="confirmPassword"
                        placeholder="confirm new password *"
                        class="form-control"
                        type="password"
                        v-validate="'required|confirmed:userPassword'"
                        :class="{
                          input: true,
                          'is-danger': errors.has('confirmPassword')
                        }"
                      />
                  </div>
                  <span
                    v-show="errors.first('confirmPassword')"
                    class="help is-danger"
                    >*{{ errors.first("confirmPassword") }}</span>
                </div>
                  <div class="form-group col-md-2 col-4 col-sm-3 col-lg-2 reset-btn">
                    <input
                      name="recover-submit"
                      class="btn btn-sm btn-outline-dark btn-change-password"
                      value="Reset Password"
                      type="submit"
                    />
                  </div>
                  <input type="hidden" class="hide" name="token" id="token" value="" />
                </form>
                <div>
                  <div class="border-line"></div>
                  <div class="resend-email-div">
                    <small>Did not receive any email? <a href="#" @click="resendEmail">Resend email</a></small>
                    &nbsp;
                    <b-spinner small v-if="resendEmailControl === true"
                      id="resendEmail"
                      variant="primary"
                    >
                    </b-spinner>
                    <b-badge v-if="resendEmailSent === true" variant="info">Email sent</b-badge>
                  </div>
                  <a href="#">
                    <router-link class="loginPageBtn" :to="{ name: 'Login', params: {} }"><small>Back to login page</small></router-link>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="resetSuccessful == true">
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="reset-successful-modal"
        size="sm"
        id="reset-successful-modal"
        v-model="resetSuccessful"
        title="Password reset completed"
      >
        <p class="reset-successful-modal-text">Password reset successful</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="info" @click="resetPasswordSuccessModalControl"
            >Login</b-button
          >
        </template>
      </b-modal>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios"
export default {
  name: "confirmPassword",
  data () {
    return {
      emailAddress: this.$cookie.get(this.$cookeys.RESET_EMAIL_ADDRESS),
      verificatonCode: '',
      userPassword: '',
      confirmPassword: '',
      unableToResetPassword: false,
      resetSuccessful: false,
      resendEmailControl: false,
      resendEmailSent: false,
      resendEmailMessage: '',
      errorMessage: '',
      errorClass: '',
    }
  },
  methods: {
    resendEmail () {
      this.resendEmailControl = true
      this.resendEmailSent = false
      const payload = {
        emailAddress: this.emailAddress
      }
      return this.$store.dispatch('requestPasswordReset', payload)
        .then(resp => {
          this.resendEmailSent = true
          this.resendEmailMessage = 'Email sent'
          this.resendEmailControl = false
        })
        .catch(err => {
          this.resendEmailSent = true
          this.resendEmailMessage = 'Unable to send email'
          this.resendEmailControl = false
        })
      alert(this.emailAddress)
    },
    resetPasswordSuccessModalControl () {
      this.$refs["reset-successful-modal"].hide()
      this.$router.push({name: 'Login'})
    },
    getNewPassword (evt) {
      evt.preventDefault()
      this.errorClass = ''
      this.unableToResetPassword = false
      return this.$validator.validateAll().then(result => {
        if(result){
          const payload = {
            emailAddress: this.emailAddress,
            verification_code: this.verificatonCode,
            password: this.userPassword
          }
          let loader = this.$loading.show({
            loader: "bars",
            color: "#00bcd4",
            height: 80,
            width: 80
          })
        return this.$store.dispatch('resetPassword', payload)
            .then((resp) => {
              loader.hide()
                this.resetSuccessful = true
            })
            .catch((error) => {
              loader.hide()
              console.log('error here')
              if (error.response.status) {
                if (error.response.status == 400) {
                  this.errorMessage = "Unable to reset password. Please check verification code and try again"
                } else if (error.response.status == 503) {
                  this.errorMessage =
                    "Service temporarily unavailable. We are working very hard to get it back as soon as possible"
                } else if (error.response.status == 404) {
                  this.errorMessage = "A problem occured while trying to reset password. Please make sure the confirmation code is valid"
                } else {
                  this.errorMessage = "Unable reset password."
                }
              } else {
                this.errorMessage =
                  "Unable to reset password. Kindly try again later."
              }
              this.unableToResetPassword = true
              this.errorClass = "reset-password-error"
            })
         }
      })

    }
  },
  mounted () {
    this.$validator.extend("verify_password", {
      getMessage: field => `The password must be at least eight characters long and contain at least: 1 uppercase letter
                  1 lowercase letter and 1 number`,
      validate: value => {
        var strongRegex = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,20})"
        )
        return strongRegex.test(value)
      }
    })
  }
}
</script>

<style lang="css" scoped>

.body {
  height: 100vh;
  background: #2980B9;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to top, #FFFFFF, #6DD5FA, #2980B9);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to top, #FFFFFF, #6DD5FA, #2980B9); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
 }

 .resend-email-div {
   text-align: left;
 }

 #resendEmail {
   font-size: 3px;
 }

 .form-body {
   float: none;
   background-color: #f5f9ff;
   margin: 0 auto;
   padding: 15px 15px;
   -webkit-animation: slide-in-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
 }

 /* confirmation animation */
 /* ----------------------------------------------
 * Generated by Animista on 2019-7-14 7:53:32
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slide-in-left
 * ----------------------------------------
 */
@-webkit-keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
            transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}
@keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-1000px);
            transform: translateX(-1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
}

#reset-password-error-id {
  height: 40px;
  min-height: 40px;
}

.reset-password-error {
  font-size: 90%;
  margin-bottom: 5px;
  color: #f57242;
  -webkit-animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
          animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

/* reset password error animation */

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
   padding-top: 60px;
 }

 .reset-btn {
   margin-left: -18px;
 }

 .btn-change-password {
   border-radius: 20px;
   background-color: #5bc0de;
   border: none;
   color: #fff;
   padding: 7px;
   margin-top: 5px;
 }

 .help.is-danger {
   color: #f49841;
   font-size: 70%;
   margin-top: -10px;
   float: left;
 }

 .loginPageBtn{
   text-decoration: none;
   float: left;
 }

 input[type="text"], input[type="password"] {
   border-color: #ccc;
   outline: none;
   -webkit-box-shadow: none;
   box-shadow: none;
   border-top: none;
   border-left: none;
   border-right: none;
   border-radius: 0;
   background: #f5f9ff;
   margin-bottom: 10px;
 }

 input[type="text"]:focus, input[type="password"]:focus {
   border-color: #00bcd4;
   outline: none;
   -webkit-box-shadow: none;
   box-shadow: none;
   border-top: none;
   border-left: none;
   border-right: none;
   border-radius: 0;
   background: #f5f9ff;
 }


 /* for smaller devices devices */
  @media (max-width: 700px){
    .form-body {
      background-color: #fff;
    }

    input[type="email"], input[type="password"], input[type="text"], input[type="password"]:focus, input[type="text"]:focus, input[type="email"]:focus {
      background: #fff;
    }

  }

/* show background shadow for bigger devices */
 @media (min-width: 992px){
    .form-body {
      border: solid #ced3db 1px;
      border-radius: 2px;
    }
 }
</style>
