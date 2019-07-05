<template lang="html">
  <div>
    <b-navbar toggleable="lg" fixed="top" type="dark" variant="info">
      <b-navbar-brand class="navbar-brand">
        <router-link class="navbar-brand-text" :to="{ name: 'RequestDelivery', params: {} }">
          <b-img-lazy
            rounded="circle"
            class="brand-logo"
            src="https://lh3.googleusercontent.com/C49t3XyUftk6mV63EKR9oUX8rioUCV1HqEfD5LxQJfUC52tsYZBCdx7hsWiR7vKKrA"
            fluid
            alt="brand logo"
          >
          </b-img-lazy>
          MyPasel
        </router-link>
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-if="!hidden" v-bind:class="rdClassStyle" @click="requestDeliveryRedirect">
              Request Delivery
          </b-nav-item>
          <b-nav-item v-if="!hidden" v-bind:class="orClassStyle" @click="ongoingRedirect">
              Ongoing
          </b-nav-item>
          <b-nav-item v-if="!hidden" v-bind:class="srClassStyle" @click="scheduledRedirect">
              Scheduled
          </b-nav-item>
          <b-nav-item v-if="!hidden" v-bind:class="hrClassStyle" @click="historyRedirect">
              History
          </b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template slot="button-content">
              <font-awesome-icon icon="user-circle" size="2x" />
            </template>
            <b-dropdown-item href="#">
              <span class="user-profile-dropdown-name">
                <font-awesome-icon icon="user" /> Hi, {{ userData.name }}
              </span>
            </b-dropdown-item>
            <div class="user-profile-dropdown-border"></div>
            <b-dropdown-item>
              <span class="user-profile-dropdown" @click="userAccountRedirect">
                <font-awesome-icon icon="pencil-alt" class="account-edit" />
                  Edit profile
              </span>
            </b-dropdown-item>
            <b-dropdown-item>
              <span class="user-profile-dropdown">
                <font-awesome-icon icon="comments" /> Submit Feedback
              </span>
            </b-dropdown-item>
            <div class="user-profile-dropdown-border"></div>
            <b-dropdown-item @click="logOut">
              <span class="user-profile-dropdown">
                <font-awesome-icon icon="sign-out-alt" /> Sign out
              </span>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
const RequestDelivery = () => import("./RequestDelivery");
export default {
  name: "Navbar",
  components: {
    "request-delivery": RequestDelivery
  },
  props: {
    hidden: false,
  },
  data() {
    return {
      userData: JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)),
      // handle individual nav-link border
      rdClassStyle: 'nav-item active-link',
      orClassStyle: 'nav-item',
      srClassStyle: 'nav-item',
      hrClassStyle: 'nav-item',
    };
  },
  methods: {
    userAccountRedirect(evt){
      let loader = this.$loading.show({
          loader: 'bars',
          color: '#00bcd4',
          height: 80,
          width: 80
      })
      this.$router.push({name: 'UserAccount'});
      loader.hide();
    },
    requestDeliveryRedirect(){
      let loader = this.$loading.show({
          loader: 'bars',
          color: '#00bcd4',
          height: 80,
          width: 80
      })
      this.$router.push({name: 'RequestDelivery'});
      // handle individual nav-link border
      this.rdClassStyle = 'nav-item active-link'
      this.orClassStyle = 'nav-item',
      this.srClassStyle ='nav-item',
      this.hrClassStyle = 'nav-item',
      loader.hide();
    },
    scheduledRedirect(){
      let loader = this.$loading.show({
          loader: 'bars',
          color: '#00bcd4',
          height: 80,
          width: 80
      })
      this.$router.push({name: 'Scheduled'});
      // handle individual nav-link border
      this.rdClassStyle = 'nav-item'
      this.orClassStyle = 'nav-item',
      this.srClassStyle ='nav-item active-link',
      this.hrClassStyle = 'nav-item',
      loader.hide();
    },
    historyRedirect(){
      let loader = this.$loading.show({
          loader: 'bars',
          color: '#00bcd4',
          height: 80,
          width: 80
      })
      this.$router.push({name: 'History'});
      // handle individual nav-link border
      this.rdClassStyle = 'nav-item'
      this.orClassStyle = 'nav-item',
      this.srClassStyle ='nav-item',
      this.hrClassStyle = 'nav-item active-link',
      loader.hide();
    },
    ongoingRedirect(){
      let loader = this.$loading.show({
          loader: 'bars',
          color: '#00bcd4',
          height: 80,
          width: 80
      })
      this.$router.push({name: 'Ongoing'});
      // handle individual nav-link border
      this.rdClassStyle = 'nav-item'
      this.orClassStyle = 'nav-item active-link',
      this.srClassStyle ='nav-item',
      this.hrClassStyle = 'nav-item',
      loader.hide();
    },
    logOut(evt) {
      // set up loader overlay
      let loader = this.$loading.show({
          loader: 'bars',
          color: '#00bcd4',
          height: 80,
          width: 80
      })

      this.$store
        .dispatch("logout")
        .then(response => {
          this.$router.push({ name: "Login" });
          loader.hide();
        })
        .catch(error => {
          console.log("error");
        });
    }
  },
  mounted() {},
  created() {}
};
</script>

<style lang="css" scoped>

.navbar{
    background: #fff;
    color: #fff;
    padding: 10px 0 !important;
    border-bottom: solid #d4d8dd 1px;
    margin-bottom: 20px;
    /* box-shadow: 0 4px 18px 0 rgba(0,0,0,0.12), 0 7px 10px -5px rgba(0,0,0,0.15) !important; */
}

.navbar.bg-info{
    color: #fff;
    background: #00bcd4!important;
    border-bottom: solid #d4d8dd 1px;
    /* box-shadow: 0 4px 20px 0 rgba(0,0,0,0.14), 0 7px 12px -5px rgba(0,188,212,0.46); */
}

.nav-item {
  color: #fff;
  text-decoration: none;
}

.active-link {
  border-bottom: solid white 1px;
}

.navbar .navbar-nav .nav-item .nav-link{
    color: #fff;
    position: relative;
    color: inherit;
    padding: 15px;
    font-weight: 400;
    font-size: 15px;
    /* text-transform: uppercase; */
    border-radius: 3px;
    line-height: 15px;
}

.navbar .navbar-nav .nav-item .nav-link i{
    font-size: 20px;
    margin-top: -7px;
    top: 5px;
    position: relative;
    margin-right: 3px;
}

.navbar .navbar-nav .nav-item .nav-link i.fa{
    margin-top: -4px;
    top: 2px;
}

.navbar .navbar-nav .nav-item.active .nav-link{
    background-color: hsla(0,0%,100%,.1);
    border-radius: 4px;
}

.navbar-brand{
    color: #fff;
    font-weight: 300;
    font-size: 18px;
    margin-left: 30px;
}

.navbar-brand-text {
  color: #fff;
  text-decoration: none;
}

.navbar-brand:hover{
  color: #fff;
}

.user-profile-dropdown {
  color: #64666b;
}

.brand-logo {
  width: 50px;
  height: 50px;
}

.user-profile-dropdown-name {
font-family: "Lucida Console", Monaco, monospace;
  font-size: 17px;
  letter-spacing: -0.8px;
  word-spacing: -4.6px;
  color: #4A4432;
  font-weight: normal;
  text-decoration: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}


.user-profile-dropdown-border {
  border-bottom: solid #ccc 1px;
}

.account-edit {
  color: #64666b;
  margin-left: 4px;
  text-decoration: none;
}


</style>
