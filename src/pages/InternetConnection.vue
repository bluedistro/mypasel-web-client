<template lang="html">
  <!-- check internet connection -->
  <div class="internetCheckerOverlay" v-show="!onLine">
    <v-offline
      online-class="online"
      offline-class="offline"
      @detected-condition="handleConnectivityChange"
    >
      <template v-slot:[onlineSlot] :slot-name="onlineSlot">
        {{ message }}
      </template>
      <template v-slot:[offlineSlot] :slot-name="offlineSlot">
        {{ message }}
      </template>
    </v-offline>
  </div>
</template>

<script>
import VOffline from "v-offline"

export default {
  components: {
    VOffline
  },
  name: "InternetConnectivity",
  data() {
    return {
      onLine: null,
      message: "",
      onlineSlot: "online",
      offlineSlot: "offline"
    }
  },
  methods: {
    handleConnectivityChange(status) {
      this.onLine = status
      if (this.onLine) {
        this.message = "Online"
      } else {
        this.message = "Offline"
      }
    }
  },
  watch: {}
}
</script>

<style lang="css" scoped>
div.internetCheckerOverlay {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  margin-top: 5%;
  /* background-color: red; */
  padding: 5px;
  width: 200px;
  color: #fff;
  font-size: 15px;
}

@media screen and (max-width:1000px){
  div.internetCheckerOverlay {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    margin-top: 0;
    margin-left: -20%;
    padding: 5px;
    width: 200px;
    color: #fff;
    font-size: 15px;
  }
}

.offline {
  background-color: #fc9842;
  background-image: linear-gradient(315deg, #fc9842 0%, #fe5f75 74%);
}
.online {
  background-color: #00b712;
  background-image: linear-gradient(315deg, #00b712 0%, #5aff15 74%);
}
</style>
