<template lang="html">
  <div class="container mb-2">
    <div class="row">
      <!-- side bar content -->
      <div class="col-md-3 sidebar-content">
        <!-- sidebar content here -->
        <div class="row image-row">
          <b-img
            rounded="circle"
            class="image"
            thumbnail
            fluid
            :src="aviImage"
            alt="Image 1"
          ></b-img>
        </div>
        <div class="row upload-btn-wrapper">
          <button class="imagebtn" @click.prevent="submit">Upload image</button>
          <input type="file" @change="previewImage" accept="image/*" name="image" id="image" />
        </div>
        <div class="row user-identity">
          {{ fullName }}
        </div>
        <div class="row account-settings">
          <ul>
            <a
              href="#"
              @click.prevent="
                (selectedPage = 'overview'),
                  (overviewActive = 'active'),
                  (accSettingsActive = ''),
                  (resetPasswordActive = ''),
                  (faqActive = '')
              "
            >
              <li :class="overviewActive"><font-awesome-icon icon="home" /> Overview</li>
            </a>
            <a
              href="#"
              @click.prevent="
                (selectedPage = 'resetPassword'),
                  (resetPasswordActive = 'active'),
                  (accSettingsActive = ''),
                  (overviewActive = ''),
                  (faqActive = '')
              "
            >
              <li :class="resetPasswordActive"><font-awesome-icon icon="flag" /> Reset Password</li>
            </a>
            <a
              href="#"
              @click.prevent="
                (selectedPage = 'accountSettings'),
                  (accSettingsActive = 'active'),
                  (overviewActive = ''),
                  (resetPasswordActive = ''),
                  (faqActive = '')
              "
            >
              <li :class="accSettingsActive"><font-awesome-icon icon="cog" /> Account settings</li>
            </a>
            <a
              href="#"
              @click.prevent="
                (selectedPage = 'faq'),
                  (resetPasswordActive = ''),
                  (accSettingsActive = ''),
                  (overviewActive = ''),
                  (faqActive = 'active')
              "
            >
              <li :class="faqActive"><font-awesome-icon icon="question-circle" /> FAQs</li>
            </a>
          </ul>
        </div>
      </div>
      <div class="col-md-8 main-content">
        <!-- User Information Overview -->
        <div class="" v-if="selectedPage == 'overview'">
          <div class="row header-text">
            <h4>Overview</h4>
          </div>
          <div class="header-border"></div>
          <!-- actual user information -->
          <div class="row">
            <div class="col-md-12 user-details-overview">
              <div class="user-details">
                <form v-promise-btn="{ action: 'submit' }" @submit.prevent="updateInfo">
                  <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="fullName"
                      aria-describedby="nameHelp"
                      placeholder="full name"
                      required
                      disabled
                      v-model="fullName"
                    />
                  </div>
                  <div class="form-group">
                    <label for="phoneNumber">Phone number</label>
                    <input
                      type="text"
                      class="form-control"
                      id="fullName"
                      aria-describedby="nameHelp"
                      placeholder="phone number"
                      readonly
                      v-model="phoneNumber"
                    />
                    <small id="emailHelp" class="form-text text-muted"
                      >Phone number cannot be altered.</small
                    >
                  </div>
                  <div class="row">
                    <div class="form-group col-md-6 col-lg-6 col-sm-6 col-6">
                      <label for="country">Country</label>
                      <select class="form-control" required readonly v-model="country" id="country">
                        <option disabled>Ghana</option>
                        <option disabled>Nigeria</option>
                      </select>
                    </div>
                    <div class="form-group col-md-6 col-lg-6 col-sm-6 col-6">
                      <label for="sex">Sex</label>
                      <select class="form-control" required readonly v-model="sex" id="sex">
                        <option disabled>Male</option>
                        <option disabled>Female</option>
                        <option disabled>Other</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="emailAddress">Email address</label>
                    <input
                      type="email"
                      class="form-control"
                      required
                      id="emailAddress"
                      aria-describedby="emailHelp"
                      placeholder="Enter email"
                      v-model="emailAddress"
                    />
                    <small id="emailHelp" class="form-text text-muted"
                      >We'll never share your email with anyone else.</small
                    >
                  </div>
                  <button type="submit" class="btn btn-outline-primary">Save</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- Password Reset -->
        <div class="" v-if="selectedPage == 'resetPassword'">
          <div class="row header-text">
            <h4>Reset password</h4>
          </div>
          <div class="header-border"></div>
          <div class="row">
            <div class="col-md-12 password-reset-overview">
              <div class="password-reset">
                <form v-promise-btn="{ action: 'submit' }" @submit.prevent="updatePassword">
                  <div class="form-group">
                    <label for="currentPassword">Current password</label>
                    <input
                      type="password"
                      v-model="currentPassword"
                      class="form-control"
                      id="currentPassword"
                      placeholder="current password"
                    />
                  </div>
                  <div class="row">
                    <div class="form-group col-md-6 col-lg-6 col-sm-5 col-5">
                      <label for="newPassword">New password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="newPassword"
                        v-model="newPassword"
                        name="newPassword"
                        ref="newPassword"
                        data-vv-delay="200"
                        :class="{ input: true, 'is-danger': errors.has('newPassword') }"
                        v-validate="'required|verify_password'"
                        placeholder="new password"
                      />
                      <span v-show="errors.first('newPassword')" class="help is-danger"
                        >* {{ errors.first("newPassword") }}</span
                      >
                    </div>
                    <div class="form-group col-md-6 col-lg-6 col-sm-5 col-7">
                      <label for="confirmNewPassword">Confirm new password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="confirmNewPassword"
                        v-model="confirmNewPassword"
                        ref="confirmNewPassword"
                        v-validate="'required|confirmed:newPassword'"
                        :class="{ input: true, 'is-danger': errors.has('confirmNewPassword') }"
                        name="confirmNewPassword"
                        placeholder="confirm new password"
                      />
                      <span v-show="errors.first('confirmNewPassword')" class="help is-danger"
                        >*{{ errors.first("confirmNewPassword") }}</span
                      >
                    </div>
                  </div>
                  <button type="submit" class="btn btn-outline-primary">Reset Password</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- Account settings -->
        <div class="" v-if="selectedPage == 'accountSettings'">
          <div class="row header-text">
            <h4>Account settings</h4>
          </div>
          <div class="header-border"></div>
        </div>
        <!-- FAQs -->
        <div class="" v-if="selectedPage == 'faq'">
          <div class="row header-text">
            <h4>FAQs</h4>
          </div>
          <div class="header-border"></div>
        </div>
      </div>
    </div>
    <!-- modal to display data change success or failure -->
    <div>
      <b-modal
        no-close-on-backdrop
        hide-header-close
        no-close-on-esc
        ref="info-change-status-modal"
        size="sm"
        id="info-change-status-modal"
        v-model="infoChangeStatusModal"
        title="Status"
      >
        <p class="info-change-status-modal-text">{{ info_change_status_message }}</p>
        <template slot="modal-footer" slot-scope="{ ok }">
          <b-button size="sm" variant="info" @click="infoChangeStatusFunction">Okay</b-button>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserAccount",
  data() {
    return {
      // status modal control
      infoChangeStatusModal: false,
      info_change_status_message: "",
      selectedPage: "overview",
      overviewActive: "active",
      accSettingsActive: "",
      resetPasswordActive: "",
      faqActive: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      phoneNumber: "",
      emailAddress: "",
      fullName: "",
      country: "",
      sex: "",
      aviImage: "https://picsum.photos/150/150?blur=1&grayscale"
    };
  },
  methods: {
    // preview image
    previewImage(event) {
      var input = event.target;
      var file = input.files[0];
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = e => {
          var image = new Image();
          image.onLoad = function(imageEvent) {
            // resize image to at least 150px before being submitted
            var max_size = 150;
            var w = image.width;
            var h = image.height;
            if (w > h) {
              if (w > max_size) {
                h *= max_size / w;
                w = max_size;
              }
            } else {
              if (h > max_size) {
                w *= max_size / h;
                h = max_size;
              }
            }

            var canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d").drawImage(image, 0, 0, w, h);
            var resizedImage = canvas.toDataURL("image/jpeg");
          };
          this.aviImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    submit(){

    },
    infoChangeStatusFunction(evt) {
      this.$refs["info-change-status-modal"].hide();
    },
    updateInfo(evt) {
      evt.preventDefault();
      const user_data = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY));
      const payload = {
        id: user_data.id,
        email: this.emailAddress
      };
      // check for email differences
      if (this.emailAddress == user_data.emailAddress) {
        this.info_change_status_message =
          "Unable to update information. No change in data was detected";
        this.infoChangeStatusModal = true;
      } else {
        return this.$store
          .dispatch("changeEmail", payload)
          .then(resp => {
            // update the email in the cookie storage too
            user_data.emailAddress = this.emailAddress;
            this.$cookie.set(this.$cookeys.USER_DATA_KEY, JSON.stringify(user_data), {
              expires: this.$cookeys.cookie_expire
            });
            // trigger modal
            this.info_change_status_message = "Data updated successfully";
            this.infoChangeStatusModal = true;
          })
          .catch(error => {
            console.log(error);
            if (error.response.status == 503) {
              this.info_change_status_message =
                "Unable to update email. It looks like our servers are temporarily down. Please try again later";
            } else {
              this.info_change_status_message =
                "Unable to update email due to a technical glitch. Please try again later";
            }

            // this.info_change_status_message = 'Data update failed'
            this.infoChangeStatusModal = true;
          });
      }
    },
    updatePassword(evt) {
      evt.preventDefault();
      return this.$validator.validateAll().then(result => {
        if (result) {
          const payload = {
            id: JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id,
            old_password: this.currentPassword,
            new_password: this.newPassword
          };
          // ensure that new password is different from old pasword
          if (this.currentPassword == this.newPassword) {
            this.info_change_status_message =
              "Unable to change password. Please make sure new password is different from current password";
            this.infoChangeStatusModal = true;
          } else {
            return this.$store
              .dispatch("changePassword", payload)
              .then(resp => {
                this.info_change_status_message = "Password has been updated successfully";
                this.infoChangeStatusModal = true;
                // reset form fields
                this.currentPassword = "";
                this.newPassword = "";
                this.confirmNewPassword = "";
              })
              .catch(error => {
                if (error.response.status == 503) {
                  this.info_change_status_message =
                    "Unable to update password. It looks like our servers are temporarily down. Please try again later";
                } else if (error.response.status == 400) {
                  this.info_change_status_message = error.response.data.message;
                } else {
                  this.info_change_status_message =
                    "Unable to update password due to a technical glitch. Please try again later";
                }

                // this.info_change_status_message = "Unable to change password";
                this.infoChangeStatusModal = true;
                // reset form fields
                this.currentPassword = "";
                this.newPassword = "";
                this.confirmNewPassword = "";
              });
          }
        } else {
          // just flag errors in form field
        }
      });
    }
  },
  mounted() {
    const user_data = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY));
    this.phoneNumber = user_data.phoneNumber;
    this.emailAddress = user_data.emailAddress;
    this.fullName = user_data.name;
    this.country = user_data.country;
    this.sex = user_data.sex;
  },
  created() {
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


    // retrieve prfile image
    const id = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id
    return this.$store.dispatch('getProfileImage', id)
                      .then((resp) => {
                        console.log(resp)
                      })
                      .catch((error) => {

                      })

  }

};
</script>

<style lang="css" scoped>
  .mb-2 {
    margin-top: 80px;
    /* background: #F1F3FA; */
  }

  .help.is-danger {
    color: #f49841;
    font-size: 70%;
    float: left;
  }

  .image{
    height: 150px;
    width: 150px;
  }

  .header-border {
    border: solid #ccc 1px;
  }

  .header-text {
    margin-left: 2px;
  }

  .user-details-overview {
    /* background: #f2f4f9; */
    margin-top: 5px;
    /* height: 400px; */
  }

  .user-details {
    text-align: left;
  }

  .password-reset-overview {
    /* background: #f2f4f9; */
    margin-top: 5px;
    /* height: 400px; */
  }

  .password-reset {
    text-align: left;
  }

  /* image upload button */
  .upload-btn-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    justify-content: center;
  }

  .imagebtn {
    border: 2px solid gray;
    color: gray;
    margin-top: 10px;
    background-color: white;
    /* padding: 8px 10px; */
    border-radius: 8px;
    font-size: 10px;
    font-weight: bold;
  }

  .upload-btn-wrapper input[type=file] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }


  .user-identity {
    justify-content: center;
    margin-top: 10px;
    font-family: "Lucida Console", Monaco, monospace;
    font-size: 20px;
    letter-spacing: -0.2px;
    word-spacing: 2px;
    color: #444444;
    font-weight: normal;
    text-decoration: none;
    font-style: normal;
    font-variant: normal;
    text-transform: none;
  }

  .main-content {
    margin-top: 15px;
  }

  .sidebar-content {
    /* border: solid black 1px; */
    height: 400px;
    margin-top: 20px;
    /*  */
    position: sticky;
    position: -webkit-sticky; /* Safari */
    top: 100px;
    left: 0;
  }

  .image-row {
    margin-top: 10px;
    justify-content: center;
  }

  .account-settings {
    margin-top: 20px;
    /* justify-content: center; */
  }

  ul {
    list-style: none;
  }

  ul li {
    border-bottom: solid #ccc 1px;
    text-align: left;
    padding: 5px;
    color: #2c5899;
    width: 200px;
    /* margin-left: -50px; */
    font-size: 15px;
  }

  ul li:last-child {
    border-bottom: none;
  }

  ul li.active{
    background: #edf1f7;
    text-align: left;
    padding: 5px;
    border-left: solid 2px #79a3e0;
  }


/* Smartphones (portrait and landscape) ----------- */
@media only screen
and (min-device-width : 320px)
and (max-device-width : 768px) {
/* Styles */
.account-settings {
  margin-top: 20px;
  justify-content: center;
  }

  .sidebar-content {
    position: static;
    top: 100px;
    left: 0;
  }
}

/* iPads (portrait and landscape) ----------- */
@media only screen
and (min-device-width : 768px)
and (max-device-width : 1024px) {
/* Styles */
.account-settings {
  margin-top: 20px;
  margin-left: -40px;
  /* justify-content: center; */
  }

  .sidebar-content {
    position: static;
    top: 100px;
    left: 0;
  }

  ul li {
    width: 150px;
  }
}


/* Desktops and laptops ----------- */
@media only screen
and (min-width : 1224px) {
/* Styles */
.account-settings {
  margin-top: 30px;
  /* justify-content: center; */
  }

  .main-content {
    margin-top: 15px;
  }

  .side-bar-content {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 100px;
    left: 0;
  }
}
</style>
