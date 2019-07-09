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
              <div class="panel-body">
                <form
                  @submit="getNewPassword"
                  v-promise-btn="{ action: 'submit' }"
                  id="register-form"
                >
                  <div class="form-group">
                    <div class="input-group">
                      <input
                        id="email"
                        name="email"
                        placeholder="email address *"
                        class="form-control"
                        type="email"
                      />
                    </div>
                  </div>
                  <div class="form-group col-md-4 reset-btn">
                    <input
                      name="recover-submit"
                      class="btn btn-md btn-outline-dark"
                      value="Reset Password"
                      type="submit"
                    />
                  </div>
                  <input type="hidden" class="hide" name="token" id="token" value="" />
                </form>
                <div>
                  <div class="border-line"></div>
                  <a href="#">
                    <router-link class="loginPageBtn" :to="{ name: 'Login', params: {} }"
                      >Back to login page</router-link
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
  name: "ForgotPassword",
  data() {
    return {};
  },
  methods: {
    getNewPassword(evt) {
      evt.preventDefault();
    }
  }
};
</script>

<style lang="css" scoped>
 .form-body {
   float: none;
   margin: 0 auto;
   padding: 15px 15px;
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
   background: #fff;
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
 @media (max-width: 992px){

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
