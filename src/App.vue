<template>
  <div id="app">
    <navbar v-if="['RequestDelivery', 'Ongoing', 'Scheduled', 'History', 'UserAccount'].includes($route.name)">
    </navbar>
    <router-view />
  </div>
</template>

<script>
import Navbar from "./pages/requestDeliveryPages/RequestDeliveryNavbar.vue"

export default {
  components: {
    navbar: Navbar
  },
  created () {}
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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
