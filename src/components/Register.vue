<template lang="html">
  <div>
    <div class="container-fluid register">
      <div class="row">
        <div class="col-md-3 register-left">
          <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt="" />
          <h3>Akwaaba to MyPasel</h3>
          <p>Package Delivery and Logistics Made Easy!</p>
          <button type="button" class="loginBtn" name="button">
            <router-link id="loginBtnText" :to="{ name: 'Login', params: {} }">Login</router-link>
          </button>
          <br />
          <!-- <div class="sign-up-notice">
            By Signing Up, you agree to our
            <a href="https://mypasel.com/terms" target="_blank" class="terms">Terms</a> and
            <a href="https://mypasel.com/privacy" target="_blank" class="privacy">Privacy Policy</a
            >.
          </div> -->
        </div>
        <div class="col-md-9 register-right">
          <ul class="nav nav-tabs nav-justified" id="myTab" role="tablist">
            <li class="nav-item">
              <a
                v-on:click="setIndividualTrue"
                :class="paneControl.individualClass"
                id="applicant-tab"
                data-toggle="tab"
                href="#applicant"
                role="tab"
                aria-controls="applicant"
                :aria-selected="paneControl.individualAria"
                >Individual</a
              >
            </li>
            <li class="nav-item">
              <a
                v-on:click="setEmployeeTrue"
                :class="paneControl.employeeClass"
                id="company-tab"
                data-toggle="tab"
                href="#company"
                role="tab"
                aria-controls="company"
                :aria-selected="paneControl.employeeAria"
                >Business</a
              >
            </li>
          </ul>
          <div class="tab-content" id="myTabContent">
            <div
              :class="paneControl.individualTabPane"
              id="applicant"
              role="tabpanel"
              aria-labelledby="applicant-tab"
            >
              <h3 class="register-heading">Welcome onboard to MyPasel</h3>
              <form
                class=""
                v-promise-btn="{ action: 'submit' }"
                @submit.prevent="validateRegisterForm('userForm')"
                @reset="onUserFormReset"
                data-vv-scope="userForm"
              >
                <div class="row register-form">
                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="First Name *"
                        v-validate="'required|alpha'"
                        data-vv-delay="500"
                        :class="{ input: true, 'is-danger': errors.has('userForm.firstName') }"
                        name="firstName"
                        value=""
                        v-model="userData.firstName"
                      />
                      <span v-show="errors.has('userForm.firstName')" class="help is-danger"
                        >* {{ errors.first("userForm.firstName") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Last Name *"
                        v-validate="'required|alpha'"
                        data-vv-delay="500"
                        :class="{ input: true, 'is-danger': errors.has('userForm.lastName') }"
                        name="lastName"
                        value=""
                        v-model="userData.lastName"
                      />
                      <span v-show="errors.has('userForm.lastName')" class="help is-danger"
                        >* {{ errors.first("userForm.lastName") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Password *"
                        value=""
                        name="userPassword"
                        ref="userPassword"
                        data-vv-delay="200"
                        :class="{ input: true, 'is-danger': errors.has('userForm.userPassword') }"
                        v-validate="'required|verify_password'"
                        v-model="userData.userPassword"
                      />
                      <span v-show="errors.first('userForm.userPassword')" class="help is-danger"
                        >* {{ errors.first("userForm.userPassword") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Confirm Password *"
                        value=""
                        v-model="userData.confirmUserPassword"
                        v-validate="'required|confirmed:userPassword'"
                        :class="{
                          input: true,
                          'is-danger': errors.has('userForm.confirmUserPassword')
                        }"
                        name="confirmUserPassword"
                      />
                      <span
                        v-show="errors.first('userForm.confirmUserPassword')"
                        class="help is-danger"
                        >*{{ errors.first("userForm.confirmUserPassword") }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Your Email *"
                        name="userEmail"
                        v-validate="'required|email'"
                        :class="{ input: true, 'is-danger': errors.has('userForm.userEmail') }"
                        data-vv-delay="1000"
                        value=""
                        v-model="userData.userEmail"
                      />
                      <span v-show="errors.has('userForm.userEmail')" class="help is-danger"
                        >* {{ errors.first("userForm.userEmail") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <vue-phone-number-input
                        v-model="userData.userPhone"
                        :default-country-code="userPhoneField.defaultCode"
                        :clearable="userPhoneField.clearable"
                        :preferred-countries="userPhoneField.preferred"
                        name="userPhone"
                        id="userPhone"
                        v-validate="'required'"
                        data-vv-delay="500"
                        :class="{ input: true, 'is-danger': errors.has('userForm.userPhone') }"
                      />
                      <span v-show="errors.has('userForm.userPhone')" class="help is-danger"
                        >* {{ errors.first("userForm.userPhone") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <select
                        class="form-control"
                        v-model="userData.sex"
                        name="sex"
                        v-validate="'required'"
                        data-vv-delay="500"
                        :class="{ input: true, 'is-danger': errors.has('userForm.sex') }"
                      >
                        <option class="hidden" disabled>Please select your sex</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                      <span v-show="errors.has('userForm.sex')" class="help is-danger"
                        >* {{ errors.first("userForm.sex") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <select

                        class="form-control"
                        v-model="userData.userCountry"
                        name="userCountry"
                        v-validate="'required'"
                        data-vv-delay="500"
                        :class="{ input: true, 'is-danger': errors.has('userForm.userCountry') }"
                      >
                        <option class="hidden" disabled>Please select your country</option>
                        <option>Ghana</option>
                      </select>
                      <span v-show="errors.has('userForm.userCountry')" class="help is-danger">{{
                        errors.first("userForm.userCountry")
                      }}</span>
                    </div>
                  </div>
                  <div class="col-md-12 individual-terms-accept">
                      <input type="checkbox" name="termsAgree" v-model="individualTerms" required>
                      By registering, you agree to have read and understood the <a href="https://mypasel.com/terms">Terms</a> and <a href="https://mypasel.com/privacy">Privacy policies</a> of MyPasel.
                  </div>
                    <div class="col-md-6 individual-register-btns">
                      <input type="submit" class="btnRegister" value="Register" />
                      <input type="reset" class="btnReset" value="Reset" />
                    </div>
                </div>
              </form>
            </div>
            <!-- company -->
            <div
              :class="paneControl.employeeTabPane"
              id="company"
              role="tabpanel"
              aria-labelledby="company-tab"
            >
              <h3 class="register-heading">Welcome onboard to MyPasel</h3>
              <form
                v-promise-btn="{ action: 'submit' }"
                @submit.prevent="validateRegisterForm('companyForm')"
                @reset="onCompanyFormReset"
                data-vv-scope="companyForm"
              >
                <div class="row register-form">
                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Employee name *"
                        v-validate="'required|min:2|max:100'"
                        data-vv-delay="500"
                        :class="{ input: true, 'is-danger': errors.has('companyForm.companyEmployeeName') }"
                        name="companyEmployeeName"
                        value=""
                        v-model="companyData.companyEmployeeName"
                      />
                      <span v-show="errors.has('companyForm.companyEmployeeName')" class="help is-danger"
                        >* {{ errors.first("companyForm.companyEmployeeName") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Reference code *"
                        v-validate="'required|min:2|max:20'"
                        data-vv-delay="500"
                        :class="{ input: true, 'is-danger': errors.has('companyForm.companyEmployeeReferenceNumber') }"
                        name="companyEmployeeReferenceNumber"
                        value=""
                        v-model="companyData.companyEmployeeReferenceNumber"
                      />
                      <span v-show="errors.has('companyForm.companyEmployeeReferenceNumber')" class="help is-danger"
                        >* {{ errors.first("companyForm.companyEmployeeReferenceNumber") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Password *"
                        value=""
                        name="companyEmployeePassword"
                        ref="companyEmployeePassword"
                        data-vv-delay="200"
                        :class="{
                          input: true,
                          'is-danger': errors.has('companyForm.companyEmployeePassword')
                        }"
                        v-validate="'required|verify_password'"
                        v-model="companyData.companyEmployeePassword"
                      />
                      <span
                        v-show="errors.first('companyForm.companyEmployeePassword')"
                        class="help is-danger"
                        >* {{ errors.first("companyForm.companyEmployeePassword") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Confirm password *"
                        value=""
                        v-model="companyData.confirmCompanyEmployeePassword"
                        v-validate="'required|confirmed:companyEmployeePassword'"
                        :class="{
                          input: true,
                          'is-danger': errors.has('companyForm.confirmCompanyEmployeePassword')
                        }"
                        name="confirmCompanyEmployeePassword"
                      />
                      <span
                        v-show="errors.first('companyForm.confirmCompanyEmployeePassword')"
                        class="help is-danger"
                        >*{{ errors.first("companyForm.confirmCompanyEmployeePassword") }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Email *"
                        name="companyEmployeeEmail"
                        v-validate="'required|email'"
                        :class="{
                          input: true,
                          'is-danger': errors.has('companyForm.companyEmployeeEmail')
                        }"
                        data-vv-delay="1000"
                        value=""
                        v-model="companyData.companyEmployeeEmail"
                      />
                      <span v-show="errors.has('companyForm.companyEmployeeEmail')" class="help is-danger"
                        >* {{ errors.first("companyForm.companyEmployeeEmail") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <vue-phone-number-input
                        v-model="companyData.companyEmployeePhone"
                        :default-country-code="companyPhoneField.defaultCode"
                        :clearable="companyPhoneField.clearable"
                        :preferred-countries="companyPhoneField.preferred"
                        name="companyEmployeePhone"
                        id="companyEmployeePhone"
                        v-validate="'required'"
                        data-vv-delay="500"
                        :class="{
                          input: true,
                          'is-danger': errors.has('companyForm.companyEmployeePhone')
                        }"
                      />
                      <span v-show="errors.has('companyForm.companyEmployeePhone')" class="help is-danger"
                        >* {{ errors.first("companyForm.companyEmployeePhone") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <select
                        class="form-control"
                        v-model="companyData.companyEmployeeCountry"
                        name="companyEmployeeCountry"
                        v-validate="'required'"
                        data-vv-delay="500"
                        :class="{
                          input: true,
                          'is-danger': errors.has('companyForm.companyEmployeeCountry')
                        }"
                      >
                        <option class="hidden">Please select your country</option>
                        <option selected>Ghana</option>
                      </select>
                      <span
                        v-show="errors.has('companyForm.companyEmployeeCountry')"
                        class="help is-danger"
                        >{{ errors.first("companyForm.companyEmployeeCountry") }}</span
                      >
                    </div>
                    <div class="form-group">
                      <select
                        class="form-control"
                        v-model="companyData.companyEmployeeSex"
                        name="sex"
                        v-validate="'required'"
                        data-vv-delay="500"
                        :class="{ input: true, 'is-danger': errors.has('companyForm.companyEmployeeSex') }"
                      >
                        <option class="hidden" disabled>Please select your sex</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                      <span v-show="errors.has('companyForm.companyEmployeeSex')" class="help is-danger"
                        >* {{ errors.first("companyForm.companyEmployeeSex") }}</span
                      >
                    </div>
                  </div>
                  <div class="col-md-12 company-terms-accept">
                      <input type="checkbox" name="termsAgree" v-model="companyTerms" required>
                      By registering, you agree to have read and understood the <a href="https://mypasel.com/terms">Terms</a> and <a href="https://mypasel.com/privacy">Privacy policies</a> of MyPasel.
                  </div>
                  <div class="col-md-6 company-register-btns">
                    <input type="submit" class="companyBtnRegister" value="Register" />
                    <input type="reset" class="companyBtnReset" value="Reset" />
                  </div>
                </div>
              </form>
            </div>
            <!-- company -->
          </div>
        </div>
      </div>
    </div>
    <!-- Unable to Login modal -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="error-modal"
        size="sm"
        id="error-modal"
        v-model="unsuccessfulRegistrationModal"
        title="Registration Status"
      >
        <p class="error-modal-text">{{ errorMessage }}</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="warning" @click="errorModalHide">Okay</b-button>
        </template>
      </b-modal>
    </div>
    <!-- Login modal success -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="success-modal"
        size="sm"
        id="error-modal"
        v-model="successfulRegistrationModal"
        title="Registration Status"
      >
        <p class="success-modal-text">Registration was successful</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="info" @click="successModalHide">Proceed to login</b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  components: {},
  data() {
    return {
      errorMessage: "",
      companyTerms: false,
      individualTerms: false,
      unsuccessfulRegistrationModal: false,
      successfulRegistrationModal: false,
      // user registering data
      userData: {
        firstName: "",
        lastName: "",
        userPassword: "",
        confirmUserPassword: "",
        userEmail: "",
        userPhone: "",
        sex: '',
        userCountry: 'Ghana'
      },
      // control the phone number field of the user data
      userPhoneField: {
        defaultCode: "GH",
        preferred: ["GH"],
        clearable: true
      },
      // company registering data
      companyData: {
        companyEmployeeName: "",
        companyEmployeeEmail: "",
        companyEmployeePassword: "",
        confirmEmployeeCompanyPassword: "",
        companyEmployeePhone: "",
        companyEmployeeCountry: "Ghana",
        companyEmployeeReferenceNumber: "",
        companyEmployeeSex: '',
      },
      // control the phone number field of the company data
      companyPhoneField: {
        defaultCode: "GH",
        preferred: ["GH"],
        clearable: true
      },
      // transmittable
      sendableInfo: null,
      // control the hide and show of the company and applicant forms
      paneControl: {
        individualClass: "nav-link active",
        individualAria: true,
        individualTabPane: "tab-pane fade show active",
        employeeAria: false,
        employeeClass: "nav-link",
        employeeTabPane: "tab-pane fade show"
      }
    };
  },
  methods: {
    errorModalHide() {
      this.$refs["error-modal"].hide();
    },
    successModalHide() {
      this.$refs["success-modal"].hide();
      //  redirect to Login page
      this.$router.push({ name: "Login" });
    },
    // reset company form field
    onCompanyFormReset(evt) {
      evt.preventDefault();
      this.companyData.companyEmployeeName = null;
      this.companyData.companyEmployeeEmail = null;
      this.companyData.companyEmployeePassword = null;
      this.companyData.confirmCompanyEmployeePassword = null;
      this.companyData.companyEmployeePhone = null;
      this.companyData.companyEmployeeCountry = null;
      this.companyEmployeeReferenceNumber = null;
      this.companyEmployeeSex = null;
    },
    // reset the user form field
    onUserFormReset(evt) {
      evt.preventDefault();
      this.userData.firstName = null;
      this.userData.lastName = null;
      this.userData.userPassword = null;
      this.userData.confirmUserPassword = null;
      this.userData.userEmail = null;
      this.userData.userPhone = null;
      this.userData.sex = [];
      this.userData.userCountry = [];
    },

    // controls the Individual Registration forms
    // sets the Individual Registration form to visible
    setIndividualTrue(evt) {
      this.paneControl.individualClass = "nav-link active";
      this.paneControl.individualAria = true;
      this.paneControl.individualTabPane = "tab-pane fade show active";
      this.paneControl.employeeAria = false;
      this.paneControl.employeeClass = "nav-link";
      this.paneControl.employeeTabPane = "tab-pane fade show";
    },
    // controls the employee Registration forms
    // sets the employee Registration form to visible
    setEmployeeTrue(evt) {
      this.paneControl.individualClass = "nav-link";
      this.paneControl.individualAria = false;
      this.paneControl.individualTabPane = "tab-pane fade show";
      this.paneControl.employeeAria = true;
      this.paneControl.employeeClass = "nav-link active";
      this.paneControl.employeeTabPane = "tab-pane fade show active";
    },
    // validate and register form
    validateRegisterForm(scope) {
      this.$validator.validateAll(scope).then(result => {
        if (result) {
          // show loader first
          let loader = this.$loading.show({
            loader: "bars",
            color: "#00bcd4",
            height: 80,
            width: 80
          });
          // all validations complete for company forms
          if (scope == "companyForm") {
            this.companyData.type = "business";
            this.companyData.companyEmployeePhone = this.companyData.companyEmployeePhone.replace(/\s/g, "");
            this.sendableInfo = this.companyData;
          }
          // all validation complete for user forms
          if (scope == "userForm") {
            this.userData.type = "individual";
            this.userData.userPhone = this.userData.userPhone.replace(/\s/g, "");
            this.userData.userFullName = this.userData.firstName + " " + this.userData.lastName;
            this.sendableInfo = this.userData;
          }
          // post register information
          return this.$store
            .dispatch("register", this.sendableInfo)
            .then(response => {
              loader.hide();
              this.successfulRegistrationModal = true;
            })
            .catch(err => {
              if (err.response.status == 400) {
                this.errorMessage = err.response.data.message;
              } else if ((err.response.status = 503)) {
                this.errorMessage =
                  "Service temporarily unavailable. We are working very hard to get it back as soon as possible";
              } else {
                this.errorMessage =
                  "Unable to complete registration due to a technical glitch. Please try again later";
              }

              // this.errorMessage = 'Unable to complete registration'
              loader.hide();
              this.unsuccessfulRegistrationModal = true;
            });
          // return;
        }
        // else errors throw up upon validation failure
      });
    }
  },
  mounted() {

    // create a strong password validator on validate
    this.$validator.extend("verify_password", {
      getMessage: field => `The password must be eight characters long and contain at least: 1 uppercase letter
                  1 lowercase letter, 1 number, and one special character`,
      validate: value => {
        var strongRegex = new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})"
        );
        return strongRegex.test(value);
      }
    });
  },
  created() {}
};
</script>

<style lang="css" scoped>

.individual-register-btns {

}

.individual-terms-accept {
  text-align: left;
}

.company-register-btns {

}

.company-terms-accept {
  text-align: left;
}

.error-modal-text {
  color: #f47a42;
}

.success-modal-text {
  color: #71f441;
}

.sign-up-notice {
  margin-top: 10px;
  font-size: 90%;
}

.terms{
  text-decoration: none;
  color: #000;
}

.privacy {
  text-decoration: none;
  color: #000;
}

.register{
    background: -webkit-linear-gradient(right, #743eca, #00ae91);
    /* margin-top: 5%; */
    /* margin-bottom: 1%; */
    /* padding: 1%; */
    padding-top: 39px;
    padding-bottom: 32px;
}
.register-left{
    text-align: center;
    color: #fff;
    margin-top: 4%;
}
.register-left .loginBtn{
    border: none;
    border-radius: 1.5rem;
    padding: 2%;
    width: 60%;
    background: #f8f9fa;
    font-weight: bold;
    color: #383d41;
    margin-top: 5%;
    margin-bottom: 3%;
    cursor: pointer;
}

#loginBtnText {
  text-decoration: none;
}

#applicant-tab {
  font-weight: 300;
  padding-left: 10px;
}

#company-tab{
  font-weight: 300;
  padding-right: 10px;
}

#company {
  padding: 10px;
}

.register-right{
    background: #f8f9fa;
    border-top-left-radius: 20% 30%;
    border-bottom-left-radius: 20% 30%;
}
.register-left img{
    margin-top: 15%;
    margin-bottom: 5%;
    width: 25%;
    -webkit-animation: mover 2s infinite  alternate;
    animation: mover 1s infinite  alternate;
}
@-webkit-keyframes mover {
    0% { transform: translateY(0); }
    100% { transform: translateY(-20px); }
}
@keyframes mover {
    0% { transform: translateY(0); }
    100% { transform: translateY(-20px); }
}
.register-left p{
    font-weight: lighter;
    padding: 12%;
    margin-top: -9%;
}
.register .register-form{
    padding: 10%;
    margin-top: 10%;
}
.btnRegister{
    float: left;
    margin-top: 2%;
    border: none;
    border-radius: 1.5rem;
    padding: 2%;
    background: #0062cc;
    color: #fff;
    font-weight: 300;
    width: 50%;
    cursor: pointer;
}

.btnReset{
  float: left;
  margin-top: 2%;
  border: none;
  border-radius: 1.5rem;
  padding: 2%;
  background: #efc023;
  color: #fff;
  font-weight: 300;
  width: 20%;
  margin-left: 10px;
  cursor: pointer;
}

.companyBtnRegister{
  float: left;
  margin-top: 2%;
  margin-bottom: 17%;
  border: none;
  border-radius: 1.5rem;
  padding: 10px;
  background: #0062cc;
  color: #fff;
  font-weight: 300;
  width: 50%;
  cursor: pointer;
}

.companyBtnReset {
  float: left;
  margin-top: 2%;
  margin-bottom: 17%;
  border: none;
  border-radius: 1.5rem;
  padding: 10px;
  background: #efc023;
  color: #fff;
  font-weight: 300;
  width: 25%;
  margin-left: 10px;
  cursor: pointer;
}

input[type="text"]:focus, input[type="password"]:focus, select:focus {
  border-color: #00bcd4;
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  background: #f8f9fa;
}

input[type="text"], input[type="password"], select {
  border-color: #ccc;
  outline: none;
  -webkit-box-shadow: none;
  box-shadow: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
  background: #f8f9fa;
}


.register .nav-tabs{
    margin-top: 3%;
    border: none;
    background: #0062cc;
    border-radius: 1.5rem;
    /* width: 28%; */
    float: right;
}
.register .nav-tabs .nav-link{
    padding: 2%;
    height: 34px;
    font-weight: 600;
    color: #fff;
    border-top-right-radius: 1.5rem;
    border-bottom-right-radius: 1.5rem;
}
.register .nav-tabs .nav-link:hover{
    border: none;
}
.register .nav-tabs .nav-link.active{
    width: 100px;
    color: #0062cc;
    border: 2px solid #0062cc;
    border-top-left-radius: 1.5rem;
    border-bottom-left-radius: 1.5rem;
}
.register-heading{
    text-align: center;
    margin-top: 8%;
    margin-bottom: -15%;
    color: #495057;
}

.help.is-danger {
  color: #f49841;
  font-size: 70%;
  float: left;
}

.form-group {
  margin-bottom: 20px;
}
</style>
