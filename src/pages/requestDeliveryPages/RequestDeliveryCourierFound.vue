<template lang="html">
  <div>
    <navbar :hidden="hideTabs"></navbar>


    <div class="mapDiv">
      <div class="map">
        <Gmap-Map
           :center="{lat:latitude, lng:longitude}"
           :zoom="12" ref="mapRef"
           :options="{mapTypeControl: false,
                      streetViewControl: false,
                      rotateControl: false,
                      fullscreenControl: false}"
           map-type-id="roadmap"
           style="width: 1370px; height: 1430px">

           <Gmap-Marker
             :position="{lat:latitude, lng:longitude}"
             icon="http://maps.google.com/mapfiles/ms/icons/motorcycling.png"
           /></Gmap-Marker>

        </Gmap-Map>
      </div>
      <div class="courierDetailContainer col-md-12 col-sm-12 col-12 col-lg-12">

              <div class="row mb-2">
                <div class="">
                    <div class="card hovercard">
                        <div class="cardheader" v-bind:style="{ 'background': 'url(' + coverImage + ')' }">
                          <span ></span>
                        </div>
                        <div class="avatar">
                            <img alt="" v-bind:src="image">
                        </div>
                        <div class="info">
                            <div class="title">
                                <h3>{{ name }}</h3>
                            </div>
                            <div class="row">
                               <div class="col-md-12 desc">
                                    {{ vehicleInfo }}
                               </div>
                               <div class="col-md-12">
                                  {{ phone }}
                               </div>
                            </div>
                        </div>
                        <div class="bottom">
                          <div class="row">
                              <div class="col-md-8">
                                 Estimated Arrival
                              </div>
                              <div class="col-md-4">
                                 {{ timeAway}}
                              </div>
                          </div>
                          <div class="row">
                             <star-rating class="star-rating" :rating="rating" :read-only="true" :star-size="20" :show-rating="false"></star-rating>
                          </div>
                          <small v-show="ratingTrue">Rating is not yet available for this driver</small>
                        </div>
                        <button type="button" @click="trackParcel" class="form-control btn-sm btn-info">
                            Track
                        </button>
                    </div>
                </div>
              </div>
      </div>
    </div>

  </div>
</template>

<script>

const Navbar = () => import('./RequestDeliveryNavbar');
const StarRating = () => import('vue-star-rating');

export default {
  name: 'CourierFound',
  components: {
    'navbar' : Navbar,
    'star-rating': StarRating,
  },
  data () {
    return {
      hideTabs: true,
      returnBack: false,
      mapSize: 'width: 100%; height: 100px',
      name: '',
      phone: '',
      rating: '',
      ratingTrue: false,
      timeAway: '',
      vehicleInfo: '',
      image: '',
      latitude: '',
      longitude: '',
      coverImage: "https://picsum.photos/50/50?blur=1",
    }
  },
  methods: {

    trackParcel () {
      this.returnBack = true

      // and ugly hack to prevent user from going back to the courier found page
      this.$store.dispatch('redirectToOngoing')
      this.$router.push({name: 'Ongoing'})
    }

  },
  mounted () {
    localStorage.setItem('courierFoundPage', 'passed')
    const courier_details = JSON.parse(this.$cookie.get(this.$cookeys.COURIER_DETAILS_KEY))
    this.name = courier_details.name
    this.phone = courier_details.phone
    this.rating = parseInt(courier_details.rating)
    this.timeAway = courier_details.timeAway
    this.vehicleInfo = courier_details.vehicleInfo
    this.image = courier_details.image
    this.latitude = parseFloat(courier_details.latitude)
    this.longitude = parseFloat(courier_details.longitude)
  },
  created () {
    if(this.rating < 0 ||  this.rating > 5){
       this.rating = 0
       this.ratingTrue = true
    }
    const user_id = JSON.parse(this.$cookie.get(this.$cookeys.USER_DATA_KEY)).id
    this.$store.dispatch('getOngoingTransactions', user_id)
               .then((resp) => {
                 // set another variable to track set Timestamp and use to show and hide timestamp appropriately in tracking page
                 resp.data.forEach(function(txns, index){
                   txns.timeStamp = false
                 })
                  this.$cookie.set(this.$cookeys.ONGOING_TRANSACTIONS_DATA_KEY, JSON.stringify(resp.data), {expires: this.$cookeys.cookie_expire})
               })
               .catch((err) => {})

  },
  beforeDestroy () {
    if(!this.returnBack){
      this.$router.push({name: 'CourierFound'})
    }
  }
}

</script>

<style lang="css" scoped>

div.courierDetailContainer {
  position: -webkit-sticky;
  position: sticky;
  top: 0%;
  bottom: 10%;
  margin-top: -25%;
  margin-left: 70%;
  width: 300px;
  color: black;
}

.mb-2 {

}

.mapDiv {
  position: fixed;
  left: 0%;
}

.more-details {
  text-align: left;
}

.star-rating {
  margin-left: 75px;
}

.trackBtn {
  text-decoration: none;
  color: #fff;
  font-size: 17px;
}


.details-phone {
  margin-top: 5px;
}

.card {
    padding-top: 20px;
    margin: 10px 0 20px 0;
    height: 400px;
    background-color: rgba(214, 224, 226, 0.2);
    border-top-width: 0;
    border-bottom-width: 2px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.card .card-heading {
    padding: 0 20px;
    margin: 0;
}


.card .card-heading.simple {
    font-size: 20px;
    font-weight: 300;
    color: #777;
    border-bottom: 1px solid #e5e5e5;
}

.card .card-heading.image img {
    display: inline-block;
    width: 46px;
    height: 46px;
    margin-right: 15px;
    vertical-align: top;
    border: 0;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
}

.card .card-heading.image .card-heading-header {
    display: inline-block;
    vertical-align: top;
}

.card .card-heading.image .card-heading-header h3 {
    margin: 0;
    font-size: 14px;
    line-height: 16px;
    color: #262626;
}

.card .card-heading.image .card-heading-header span {
    font-size: 12px;
    color: #999999;
}

.card .card-body {
    padding: 0 20px;
    margin-top: 20px;
}

.card .card-media {
    padding: 0 20px;
    margin: 0 -14px;
}

.card .card-media img {
    max-width: 100%;
    max-height: 100%;
}

.card .card-actions {
    min-height: 30px;
    padding: 0 20px 20px 20px;
    margin: 20px 0 0 0;
}

.card .card-comments {
    padding: 20px;
    margin: 0;
    background-color: #f8f8f8;
}

.card .card-comments .comments-collapse-toggle {
    padding: 0;
    margin: 0 20px 12px 20px;
}

.card .card-comments .comments-collapse-toggle a,
.card .card-comments .comments-collapse-toggle span {
    padding-right: 5px;
    overflow: hidden;
    font-size: 12px;
    color: #999;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.card-comments .media-heading {
    font-size: 13px;
    font-weight: bold;
}

.card.people {
    position: relative;
    display: inline-block;
    width: 170px;
    height: 300px;
    padding-top: 0;
    margin-left: 20px;
    overflow: hidden;
    vertical-align: top;
}

.card.people:first-child {
    margin-left: 0;
}

.card.people .card-top {
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 170px;
    height: 150px;
    background-color: #ffffff;
}

.card.people .card-top.green {
    background-color: #53a93f;
}

.card.people .card-top.blue {
    background-color: #427fed;
}

.card.people .card-info {
    position: absolute;
    top: 150px;
    display: inline-block;
    width: 100%;
    height: 101px;
    overflow: hidden;
    background: #ffffff;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.card.people .card-info .title {
    display: block;
    margin: 8px 14px 0 14px;
    overflow: hidden;
    font-size: 16px;
    font-weight: bold;
    line-height: 18px;
    color: #404040;
}

.card.people .card-info .desc {
    display: block;
    margin: 8px 14px 0 14px;
    overflow: hidden;
    font-size: 12px;
    line-height: 16px;
    color: #737373;
    text-overflow: ellipsis;
}

.card.people .card-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    display: inline-block;
    width: 100%;
    padding: 10px 20px;
    line-height: 29px;
    text-align: center;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.card.hovercard {
    position: relative;
    padding-top: 0;
    overflow: hidden;
    text-align: center;
    /* height: 300px; */
    background-color: #eaedf2;
}

.card.hovercard .cardheader {
    background-size: cover;
    height: 135px;
}

.card.hovercard .avatar {
    position: relative;
    top: -50px;
    margin-bottom: -50px;
}

.card.hovercard .avatar img {
    width: 100px;
    height: 100px;
    max-width: 100px;
    max-height: 100px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    border: 5px solid rgba(255,255,255,0.5);
}

.card.hovercard .info {
    padding: 4px 8px 10px;
}

.card.hovercard .info .title {
    margin-bottom: 4px;
    font-size: 24px;
    line-height: 1;
    color: #262626;
    vertical-align: middle;
}

.card.hovercard .info .desc {
    overflow: hidden;
    font-size: 15px;
    margin-top: -7px;
    line-height: 20px;
    color: #737373;
    text-overflow: ellipsis;
}

.card.hovercard .bottom {
    padding: 0 20px;
    margin-bottom: 17px;
}

.btn{ border-radius: 50%; width:32px; height:32px; line-height:18px;  }

@media screen and (max-width: 1200px){
  .card {
      padding-top: 20px;
      width: 300px;
      height: 400px;
      margin: 10px 0 20px 0;
      background-color: rgba(214, 224, 226, 0.2);
      border-top-width: 0;
      border-bottom-width: 2px;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
  }

  div.courierDetailContainer {
    position: -webkit-sticky;
    position: sticky;
    top: 0%;
    bottom: 10%;
    margin-top: -75%;
    margin-left: 50%;
    padding: 5px;
    width: 350px;
    color: black;
  }

}


@media screen and (max-width: 770px){
  .card {
      padding-top: 20px;
      width: 280px;
      margin: 10px 0 20px 0;
      background-color: rgba(214, 224, 226, 0.2);
      border-top-width: 0;
      border-bottom-width: 2px;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
  }

  div.courierDetailContainer {
    position: -webkit-sticky;
    position: sticky;
    top: 0%;
    margin-top: -5%;
    margin-left: 3%;
    width: 350px;
    color: black;
  }

}

</style>
