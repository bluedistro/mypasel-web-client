<template lang="html">
  <div class="googleMapsDiv">
    <!-- welcome to the light of the world, let no one deceive you in any way because you are the chosen one.
    Behold to the one who deny this fate. -->
      <Gmap-Map
        class="mapHeightStyle"
        :center="{lat:5.622200, lng:-0.175963}"
        :zoom="12" ref="mapRef"
        :options="{mapTypeControl: false,
                   streetViewControl: false,
                   rotateControl: false,
                   fullscreenControl: false}"
        map-type-id="roadmap"
      >

        <Gmap-Marker v-for="(marker, index) in pickupMarker"
          @click="center=m.position"
          :clickable="true"
          :position="marker.position"
          icon="http://maps.google.com/mapfiles/ms/icons/red.png"
        /></Gmap-Marker>
        <Gmap-Marker v-for="(marker, index) in dropOffMarkers"
          :position="marker.position"
          icon="http://maps.google.com/mapfiles/ms/icons/green.png"
        /></Gmap-Marker>
     </Gmap-Map>
  </div>
</template>

<script>
export default {
  name: 'GoogleMaps',
  components: {
  },
  // get  the pick up and drop off marker arrays as properties from the parent component
  props: {
    pickupMarker: Array,
    dropOffMarkers: Array,
  },
  data(){
    return {
      // 565 is the actual one
      mapSize: 'width: 800px; height: 1366px',
     }
  },
  methods: {

  },
}
</script>

<style lang="css" scoped>


/* for smaller devices (mobile display) */
@media screen and (max-width: 759px){
   .googleMapsDiv {
     display: none;
   }
}

/* for medium screen devices (tablet display) */
@media screen and (min-width: 760px){
  .formSide{
    background-color: #f2faff;
    height: 1366px;
  }

  /* Ipad map placing */
  .mapHeightStyle{
    width: 655px;
    height: 578px;
  }
}

/* iPads (portrait) ----------- */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) {
  /* Styles */
  .mapHeightStyle{
    width: 59vw;
    height: 90vh;
  }
}

/* iPads (landscape) ----------- */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) {
  /* Styles */
  .mapHeightStyle{
    width: 59vw;
    height: 92vh;
  }
}


/* iPad 3 (portrait) ----------- */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: portrait) and (-webkit-min-device-pixel-ratio: 2) {
  /* Styles */
  .mapHeightStyle{
    width: 59vw;
    height: 94vh;
  }
}

/* iPad 3 (landscape) ----------- */
@media only screen and (min-device-width: 768px) and (max-device-width: 1024px) and (orientation: landscape) and (-webkit-min-device-pixel-ratio: 2) {
  /* Styles */
  .mapHeightStyle{
    width: 59vw;
    height: 92vh;
  }
}

/* Desktops and laptops ----------- */
@media only screen and (min-width: 1224px) {
  /* Styles */
  .mapHeightStyle{
    width: 59vw;
    height: 91vh;
  }
}

/* Large screens ----------- */
@media only screen and (min-width: 1824px) {
  /* Styles */
  .mapHeightStyle{
    width: 59vw;
    height: 91vh;
  }
}

</style>
