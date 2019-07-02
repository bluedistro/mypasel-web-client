<template lang="html">
  <div class="container">
    <!-- <loader-bar v-show="loaderBarControl"></loader-bar> -->
    <div class="col-sm-12 col-xl-8 col-md-8 col-lg-12" id="logreg-forms">
      <form class="form-signin" v-promise-btn="{ action: 'submit' }" @submit.prevent="login">
        <div class="row">
          <div class="col-md-9 col-6">
            <h1 class="h3 mb-3 font-weight-normal login-header" style="text-align: center">
              MyPasel
            </h1>
          </div>
          <div class="col-md-3 col-sm-6 col-lg-3 col-6">
            <!-- <p>Don't have an account!</p>  -->
            <button
              class="btn btn-outline-dark btn-sm btn-block"
              type="button"
              id="btn-signup"
              v-on:click="createNewAccount"
            >
              Register
            </button>
          </div>
        </div>
        <span class="login-error" v-if="unsuccessfulLogin">{{ errorMessage }}</span>

        <vue-phone-number-input
          v-model="loginData.phoneNumber"
          autofocus
          :default-country-code="phoneField.defaultCode"
          :clearable="phoneField.clearable"
          required
          :preferred-countries="phoneField.preferred"
          name="inputPhoneNumber"
          id="inputPhoneNumber"
        />

        <input
          type="password"
          id="inputPassword"
          class="form-control passwordField"
          placeholder="Password"
          required=""
          v-model="loginData.password"
        />

        <button
          class="btn btn-outline-dark btn-sm btn-block col-md-3 col-lg-3 col-4 col-sm-3"
          type="submit"
        >
          Sign in
        </button>
        <a href="#" id="forgot_pswd">
          <router-link :to="{ name: 'ForgotPassword', params: {} }">Forgot password?</router-link>
        </a>
        <hr />
      </form>
    </div>
  </div>
</template>

<script>
import LoaderBar from "./LoaderBar.vue";

export default {
  name: "Login",
  components: {
    "loader-bar": LoaderBar
  },
  data() {
    return {
      errorMessage: "",
      loaderBarControl: false,
      loginData: {
        phoneNumber: "",
        password: ""
      },
      unsuccessfulLogin: false,
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
      this.loaderBarControl = true;
      this.unsuccessfulLogin = false;
      let user = {
        phoneNumber: this.loginData.phoneNumber.replace(/\s/g, ""),
        password: this.loginData.password
      };

      // access Vuex to perform login transaction
      return this.$store
        .dispatch("login", user)
        .then(response => {
          this.$router.push({ name: "RequestDelivery" });
        })
        .catch(error => {
          // console.log(error.response.status)
          if(error.response.status){
            if (error.response.status == 400) {
              this.errorMessage = "Incorrect phone number or password. Please try again";
            } else if (error.response.status == 503) {
              this.errorMessage =
                "Service temporarily unavailable. We are working very hard to get it back as soon as possible";
            } else if(error.response.status == 404){
              this.errorMessage = error.response.data.message;
            }
             else {
              this.errorMessage =
                "Unable to login. Please check credentials and try again";
            }
          }else{
            this.errorModalMessage = "Unable to login due to a technical error. Kindly try again later."
          }

          // this.errorMessage = 'Incorrect phone number or password. Please try again';
          this.unsuccessfulLogin = true;
          this.loaderBarControl = false;
        });
    }
  },
  created() {
    this.loaderBarControl = false;
  }
};
</script>

<style lang="css" scoped>
/* sign in FORM */

@keyframes errorFade {
    0% {opacity: 0;}
    100% {opacity: 1;}
}

.login-error{
  /* float: left; */
  font-size: 80%;
  margin-bottom: 5px;
  color: #c45d13;
  animation: errorFade 1s ease-in-out;
}

.login-header{
  float: left;
}

.passwordField{
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}

#forgot_pswd {
  float: right;
}

#btn-signup {

}

#btn-signup:hover {

}

#logreg-forms{
    width:612px;
    margin:10vh auto;
    height: 300px;
    border-radius: 1px;
    border: solid #ced3db 1px;
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
}

#inputPhoneNumber{
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px
}

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
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}
#logreg-forms .form-signin input[type="password"] {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}

#logreg-forms a{
    display: block;
    padding-top:10px;
    color:lightseagreen;
    text-decoration: none;
}



#logreg-forms button[type="submit"]{ margin-top:10px; }

#logreg-forms .form-signup .social-btn{ width:210px; }

#logreg-forms .form-signup input { margin-bottom: 2px;}

/* Mobile */

@media screen and (max-width:500px){
    #logreg-forms{
        width:100%;
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
