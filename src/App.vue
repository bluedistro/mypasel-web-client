<template>
  <div id="app">
    <navbar v-if="['RequestDelivery', 'Ongoing', 'Scheduled', 'History', 'UserAccount'].includes($route.name)"></navbar>
    <router-view/>
  </div>
</template>

<script>
import router from './router';
import Navbar from './components/RequestDeliveryNavbar.vue';
export default {
  components : {
    'navbar' : Navbar,
  },
  mounted(){

  },
  created(){


    // token refresh
    this.$messaging.onTokenRefresh(() => {
      firebase.messaging().getToken()
             .then((refreshToken) => {
                // const id = this.$store.state.user.id
                console.log('token refreshed...')
                const id = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id
                // save the refreshed fcm token
                const payload = {
                  id: id,
                  fcmToken: refreshToken
                }
                this.$store.dispatch('updateFCMToken', payload)
                           .then((resp) => {
                           })
                           .catch((err) => {
                           })
            })
            .catch((err) => {

            })
    })
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 65px; */
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
