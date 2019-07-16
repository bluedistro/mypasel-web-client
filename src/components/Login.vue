<template lang="html">
  <div class="container-fluid">
    <!-- square floats in login -->
    <ul class="circles">
         <li></li>
         <li></li>
         <li></li>
         <li></li>
         <li></li>
         <li></li>
         <li></li>
         <li></li>
         <li></li>
         <li></li>
    </ul>
      <div class="row area">
        <div class="col-sm-12 col-xl-6 col-md-8 col-lg-6" id="logreg-forms">
          <form class="form-signin" v-promise-btn="{ action: 'submit' }" @submit.prevent="login">
            <div class="row">
              <div class="col-md-9 col-8">
                <h1 class="h3 mb-3 font-weight-normal login-header">
                  <b-img-lazy
                    fluid
                    rounded="circle"
                    alt="brand-logo"
                    class="login-brand"
                    src="https://web.mypasel.com/img/brand-logo.png"
                  >

                  </b-img-lazy>
                  MyPasel
                </h1>
              </div>
              <div class="col-md-3 col-sm-6 col-lg-3 col-4">
                <!-- <p>Don't have an account!</p>  -->
                  <button
                    class="btn btn-dark btn-sm btn-block"
                    type="button"
                    v-bind:id="signupAnimate"
                    v-on:click="createNewAccount"
                  >
                    Register
                  </button>
              </div>
            </div>
            <div v-bind:class="errorClass" id="login-error-id">
              <span v-if="unsuccessfulLogin">{{ errorMessage }}</span>
            </div>
            <!-- <vue-phone-number-input
              v-model="loginData.phoneNumber"
              autofocus
              :default-country-code="phoneField.defaultCode"
              :clearable="phoneField.clearable"
              required
              :preferred-countries="phoneField.preferred"
              name="inputPhoneNumber"
              id="inputPhoneNumber"
            /> -->

            <input
              type="text"
              v-model="loginData.emailOrPhoneNumber"
              id="inputPhoneNumber"
              class="form-control emailPhoneField"
              placeholder="username or phone number"
              required
            />

            <input
              type="password"
              id="inputPassword"
              class="form-control passwordField"
              placeholder="Password"
              required
              v-model="loginData.password"
            />

            <button id="login"
              class="btn btn-outline-dark btn-sm btn-block col-md-2 col-lg-2 col-4 col-sm-3"
              type="submit"
            >
              Log in
            </button>
            <a href="#" id="forgot_pswd" v-bind:class="forgotPasswordAnimate">
              <router-link class="forgot-password-text" :to="{ name: 'ForgotPasswordEmail', params: {} }">Forgot password?</router-link>
            </a>
            <!-- <hr /> -->
          </form>
          <div class="copyright-div">
            Copyright &copy; MyPasel {{ copyrightYear }} by Desymal Technologies. All Rights Reserved.
          </div>
          <div class="terms-div">
             <a target="_blank" href="https://mypasel.com/privacy">Privacy</a>&nbsp;<a target="_blank" href="https://mypasel.com/terms">Terms</a>&nbsp;<a target="_blank" href="https://mypasel.com/faqs">FAQs</a>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  components: {},
  data() {
    return {
      errorMessage: "",
      errorClass: "",
      copyrightYear: "",
      // loaderBarControl: false,
      loginData: {
        emailOrPhoneNumber: "",
        password: ""
      },
      unsuccessfulLogin: false,
      // animate forgot password on credentials forgotten
      forgotPasswordAnimate: "",
      signupAnimate: "",
      phoneField: {
        defaultCode: "GH",
        preferred: ["GH"],
        clearable: true
      }
    };
  },
  methods: {
    createNewAccount(evt) {
      this.$router.push({ name: "Register" });
    },
    login(evt) {
      evt.preventDefault();
      // remove error class animations
      this.errorClass = "";
      this.forgotPasswordAnimate = "";
      this.signupAnimate = "";
      // this.loaderBarControl = true;
      this.unsuccessfulLogin = false;
      let user = {
        emailOrPhoneNumber: this.loginData.emailOrPhoneNumber.replace(/\s/g, ""),
        password: this.loginData.password
      };

      // access Vuex to perform login transaction
      return this.$store
        .dispatch("login", user)
        .then(response => {
          this.$router.push({ name: "SystemSetup" });
        })
        .catch(error => {
          // console.log(error.response.status)
          if (error.response.status) {
            if (error.response.status == 400) {
              this.errorMessage = "Incorrect phone number or password. Please try again";
            } else if (error.response.status == 503) {
              this.errorMessage =
                "Service temporarily unavailable. We are working very hard to get it back as soon as possible";
            } else if (error.response.status == 404) {
              this.errorMessage = error.response.data.message;
            } else {
              this.errorMessage = "Unable to login. Please check credentials and try again";
            }
          } else {
            this.errorMessage =
              "Unable to login due to a technical error. Kindly try again later.";
          }

          this.unsuccessfulLogin = true;
          // append error class
          this.errorClass = "login-error";
          // handle forgot password animate bounce
          if(this.errorMessage.includes("credentials")){
            setTimeout(() => {
              this.forgotPasswordAnimate = "forgot-password-animate";
            }, 3000);
          }else if(this.errorMessage.includes("found")){
            setTimeout(() => {
              this.signupAnimate = "signup-animate";
            }, 3000);
          }
        });
    }
  },
  created() {
    // this.loaderBarControl = false;
    // if (this.$cookie.get(this.$cookeys.TOKEN_KEY != null)) {
    //   this.$router.push({ name: "RequestDelivery" });
    // }
  },
  mounted(){
    let cRightYear = new Date();
    cRightYear = cRightYear.getUTCFullYear();
    this.copyrightYear = cRightYear;
  }
};
</script>

<style lang="css" scoped>
/* sign in FORM */

.login-container {
 /* height: 100vh; */
}

.copyright-div {
  margin-top: 40px;
  font-size: 80%;
  color: #a2acbd;
}

.terms-div {
  /* margin-top: 5px; */
  text-align: center;
  font-size: 80%;
  color: #a2acbd;
  word-spacing: 5px;
}

.terms-div a{
  color: black;
}

.login-brand {
  height: 50px;
  width: 50px;
}

/* background */
@keyframes animate {

    0%{
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
    }

    100%{
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
    }

}

.area{
    background: #4e54c8;
    background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);
    width: 100vw;
    height:100vh;


}

.circles{
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 97vh;
    overflow: hidden;
}

.circles li{
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    animation: animate 25s linear infinite;
    bottom: -150px;

}

.circles li:nth-child(1){
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
}


.circles li:nth-child(2){
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
}

.circles li:nth-child(3){
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
}

.circles li:nth-child(4){
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
}

.circles li:nth-child(5){
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
}

.circles li:nth-child(6){
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;
}

.circles li:nth-child(7){
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
}

.circles li:nth-child(8){
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
}

.circles li:nth-child(9){
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;
}

.circles li:nth-child(10){
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
}

#login {
  border-radius: 20px;
  background-color: #5bc0de;
  border: none;
  color: #fff;
  padding: 7px;
}

#login-error-id {
  height: 25px;
  min-height: 25px;
}

.login-error{
  /* float: left; */
  font-size: 90%;
  /* margin-bottom: 2px; */
  color: #f57242;
  -webkit-animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
	        animation: shake-horizontal 0.8s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
}

/* login error message animation */
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

/* jello forgot password as kind reminder */
.forgot-password-animate {
  -webkit-animation: bounce-top 0.9s both;
	        animation: bounce-top 0.9s both;
}

/* keyframe for forgot password animate */
/* ----------------------------------------------
 * Generated by Animista on 2019-7-13 17:0:30
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation bounce-top
 * ----------------------------------------
 */
@-webkit-keyframes bounce-top {
  0% {
    -webkit-transform: translateY(-45px);
            transform: translateY(-45px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  40% {
    -webkit-transform: translateY(-24px);
            transform: translateY(-24px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  65% {
    -webkit-transform: translateY(-12px);
            transform: translateY(-12px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  82% {
    -webkit-transform: translateY(-6px);
            transform: translateY(-6px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  93% {
    -webkit-transform: translateY(-4px);
            transform: translateY(-4px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  25%,
  55%,
  75%,
  87% {
    -webkit-transform: translateY(0px);
            transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateY(0px);
            transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
    opacity: 1;
  }
}
@keyframes bounce-top {
  0% {
    -webkit-transform: translateY(-45px);
            transform: translateY(-45px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
    opacity: 1;
  }
  24% {
    opacity: 1;
  }
  40% {
    -webkit-transform: translateY(-24px);
            transform: translateY(-24px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  65% {
    -webkit-transform: translateY(-12px);
            transform: translateY(-12px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  82% {
    -webkit-transform: translateY(-6px);
            transform: translateY(-6px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  93% {
    -webkit-transform: translateY(-4px);
            transform: translateY(-4px);
    -webkit-animation-timing-function: ease-in;
            animation-timing-function: ease-in;
  }
  25%,
  55%,
  75%,
  87% {
    -webkit-transform: translateY(0px);
            transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
  }
  100% {
    -webkit-transform: translateY(0px);
            transform: translateY(0px);
    -webkit-animation-timing-function: ease-out;
            animation-timing-function: ease-out;
    opacity: 1;
  }
}

/* probe user to sign up on account not found */
#signup-animate {
  -webkit-animation: vibrate-1 0.5s linear  both;
  	        animation: vibrate-1 0.5s linear  both;
}

/* key frame for sign up animate */
/* ----------------------------------------------
 * Generated by Animista on 2019-7-13 17:9:17
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation jello-horizontal
 * ----------------------------------------
 */
 /* ----------------------------------------------
  * Generated by Animista on 2019-7-13 17:16:41
  * w: http://animista.net, t: @cssanimista
  * ---------------------------------------------- */

 /**
  * ----------------------------------------
  * animation vibrate-1
  * ----------------------------------------
  */
 @-webkit-keyframes vibrate-1 {
   0% {
     -webkit-transform: translate(0);
             transform: translate(0);
   }
   20% {
     -webkit-transform: translate(-2px, 2px);
             transform: translate(-2px, 2px);
   }
   40% {
     -webkit-transform: translate(-2px, -2px);
             transform: translate(-2px, -2px);
   }
   60% {
     -webkit-transform: translate(2px, 2px);
             transform: translate(2px, 2px);
   }
   80% {
     -webkit-transform: translate(2px, -2px);
             transform: translate(2px, -2px);
   }
   100% {
     -webkit-transform: translate(0);
             transform: translate(0);
   }
 }
 @keyframes vibrate-1 {
   0% {
     -webkit-transform: translate(0);
             transform: translate(0);
   }
   20% {
     -webkit-transform: translate(-2px, 2px);
             transform: translate(-2px, 2px);
   }
   40% {
     -webkit-transform: translate(-2px, -2px);
             transform: translate(-2px, -2px);
   }
   60% {
     -webkit-transform: translate(2px, 2px);
             transform: translate(2px, 2px);
   }
   80% {
     -webkit-transform: translate(2px, -2px);
             transform: translate(2px, -2px);
   }
   100% {
     -webkit-transform: translate(0);
             transform: translate(0);
   }
 }





.login-header{
  float: left;
  text-align: center;
  color: #fff;
}

/* .emailPhoneField{
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: #4e54c8;
  color: #fff;
}

.passwordField{
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 5px;
  background-color: #4e54c8;
  color: #fff;
} */

#forgot_pswd a{
  border: none;
  float: right;
  text-decoration: none;
}

.forgot-password-text {
  color: #fff;
}


#logreg-forms{
    width:612px;
    margin:10vh auto;
    height: 360px;
    border-radius: 1px;
    border: solid #5bc0de 2px;
    -webkit-animation: slide-in-elliptic-top-fwd 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: slide-in-elliptic-top-fwd 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

/* ----------------------------------------------
 * Generated by Animista on 2019-7-13 16:1:3
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation slide-in-elliptic-top-fwd
 * ----------------------------------------
 */
@-webkit-keyframes slide-in-elliptic-top-fwd {
  0% {
    -webkit-transform: translateY(-600px) rotateX(-30deg) scale(0);
            transform: translateY(-600px) rotateX(-30deg) scale(0);
    -webkit-transform-origin: 50% 100%;
            transform-origin: 50% 100%;
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0) rotateX(0) scale(1);
            transform: translateY(0) rotateX(0) scale(1);
    -webkit-transform-origin: 50% 1400px;
            transform-origin: 50% 1400px;
    opacity: 1;
  }
}
@keyframes slide-in-elliptic-top-fwd {
  0% {
    -webkit-transform: translateY(-600px) rotateX(-30deg) scale(0);
            transform: translateY(-600px) rotateX(-30deg) scale(0);
    -webkit-transform-origin: 50% 100%;
            transform-origin: 50% 100%;
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0) rotateX(0) scale(1);
            transform: translateY(0) rotateX(0) scale(1);
    -webkit-transform-origin: 50% 1400px;
            transform-origin: 50% 1400px;
    opacity: 1;
  }
}




/* #inputPhoneNumber{
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px
} */

#logreg-forms form {
    width: 100%;
    max-width: 610px;
    padding: 15px;
    margin: auto;
}
#logreg-forms .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    padding: 10px;
    font-size: 16px;
}
#logreg-forms .form-control:focus { z-index: 2; }
#logreg-forms .form-signin input[type="email"] {
    margin-bottom: -1px;

}
#logreg-forms .form-signin input[type="password"] {

}

::placeholder { /*  Chrome, Firefox, Opera, Safari 10.1+ */
  color: #5bc0de;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* IE 10-11 */
  color: #5bc0de;
}

::ms-input-placeholder { /* Edge */
  color: #5bc0de;
}



input[type="password"], input[type="text"] {
  outline: none;
  border-color: #ccc;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  margin-bottom: 10px;
  background-color: #4e54c8;
  color: #fff;
}


input[type="password"]:focus, input[type="text"]:focus {
  outline: none;
  border-color: #00bcd4;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
  margin-bottom: 10px;
  background-color: #4e54c8;
  color: #fff;
}

/* forgot password controller */
/* #logreg-forms a{
    display: block;
    padding-top:10px;
    color: #fff;
    text-decoration: none;
} */



#logreg-forms button[type="submit"]{ margin-top:10px; }

#logreg-forms .form-signup .social-btn{ width:210px; }

#logreg-forms .form-signup input { margin-bottom: 2px;}

/* Mobile */

@media screen and (max-width:500px){
    #logreg-forms{
        width:100%;
        border: none;
    }

    .login-brand {
      height: 40px;
      width: 40px;
    }

    #logreg-forms .social-btn:nth-child(1){
        margin-bottom: 5px;
    }
    #logreg-forms .social-btn span{
        display: none;
    }
    #logreg-forms  .facebook-btn:after{
        content:'Facebook';
    }

    #logreg-forms  .google-btn:after{
        content:'Google+';
    }
}
</style>
