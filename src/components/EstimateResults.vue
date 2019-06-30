<template lang="html">
  <div class="box">
    <div class="container">
      <div class="routing-header">
        <h3>
          Pricing search results from
          <span id="pickupHeader"> {{ searchRoutes.pickup_route }} </span>
          to
          <span id="dropOffHeader">{{ searchRoutes.dropoff_route }}</span>
        </h3>
      </div>
      <div class="row">
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div class="box-part text-center">
            <div class="title">
              <h4>Bicycle</h4>
            </div>
            <div class="">
              <img class="card-img-top" src="../assets/bicycle.png" alt="Card image cap" />
            </div>

            <div class="text">
              <span class="price-text">{{ pricing.currency }} {{ pricing.bicycle }}.00</span>
              <!-- <span>Lorem ipsum dolor sit amet, id quo eruditi eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui ad.</span> -->
            </div>
            <a href="#">Learn More</a>
          </div>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div class="box-part text-center">
            <div class="title">
              <h4>Motorcycle</h4>
            </div>
            <div class="">
              <img class="card-img-top" src="../assets/motorcycle.png" alt="Card image cap" />
            </div>

            <div class="text">
              <span class="price-text">{{ pricing.currency }} {{ pricing.bike }}.00</span>
              <!-- <span>Lorem ipsum dolor sit amet, id quo eruditi eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui ad.</span> -->
            </div>
            <a href="#">Learn More</a>
          </div>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div class="box-part text-center">
            <div class="title">
              <h4>Sedan Car</h4>
            </div>
            <div class="">
              <img class="card-img-top" src="../assets/sedan-car-model.png" alt="Card image cap" />
            </div>

            <div class="text">
              <span class="price-text">{{ pricing.currency }} N/A</span>
              <!-- <span>Lorem ipsum dolor sit amet, id quo eruditi eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui ad.</span> -->
            </div>
            <a href="#">Learn More</a>
          </div>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div class="box-part text-center">
            <div class="title">
              <h4>Pickup Truck</h4>
            </div>
            <div class="">
              <img
                class="card-img-top-pickup"
                src="../assets/pickup-truck.png"
                alt="Card image cap"
              />
            </div>

            <div class="text">
              <span class="price-text">{{ pricing.currency }} {{ pricing.truck }}</span>
              <!-- <span>Lorem ipsum dolor sit amet, id quo eruditi eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui ad.</span> -->
            </div>
            <a href="#">Learn More</a>
          </div>
        </div>

        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div class="box-part text-center">
            <div class="title">
              <h4>Delivery Truck</h4>
            </div>
            <div class="">
              <img class="card-img-top" src="../assets/delivery-truck.png" alt="Card image cap" />
            </div>

            <div class="text">
              <span class="price-text"> {{ pricing.currency }} {{ pricing.van }}</span>
              <!-- <span>Lorem ipsum dolor sit amet, id quo eruditi eloquentiam. Assum decore te sed. Elitr scripta ocurreret qui ad.</span> -->
            </div>
            <a href="#">Learn More</a>
          </div>
        </div>

        <div class="col-lg-12 col-md-12 col-sm-4 col-xs-12">
          <div class="row">
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div class="box-next-part text-center">
                <button type="button" class="btn btn-primary btn-sm" name="button">
                  <router-link id="backToEstimateBtn" :to="{ name: 'Estimate', params: {} }"
                    >Back to price estimate page</router-link
                  >
                </button>
              </div>
            </div>
            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
              <div class="box-next-part text-center">
                <button type="button" class="btn btn-success btn-sm" name="button">
                  <router-link id="proceedToRequestBtn" :to="{ name: '', params: {} }"
                    >Proceed to request delivery page</router-link
                  >
                </button>
              </div>
            </div>
          </div>
          <div class="box-next-part text-center">
            <!-- <p id="proceedBtn"><font-awesome-icon icon="arrow-circle-right" size="4x"/></p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// key to retrieve pricing data storage data
const PRICING_DATA_KEY = "pricing_data";
const ROUTING_PATH_KEY = "routes";
// import router from '../router';

export default {
  name: "EstimateResults",
  data() {
    return {
      pricing: {
        bicycle: "",
        bike: "",
        truck: "",
        van: "",
        currency: ""
      },
      searchRoutes: {
        pickup_route: "",
        dropoff_route: ""
      }
    };
  },
  methods: {},
  created() {
    let pricingData = JSON.parse(sessionStorage.getItem(PRICING_DATA_KEY));
    let routingData = JSON.parse(localStorage.getItem(ROUTING_PATH_KEY));
    // set routes path
    this.searchRoutes.pickup_route = routingData.pickup_route;
    this.searchRoutes.dropoff_route = routingData.dropoff_route;
    // handle missing pricing data
    this.pricing.bicycle = pricingData.bicycle;
    this.pricing.bike = pricingData.bike;
    if (pricingData.truck == -9) {
      this.pricing.truck = "N/A";
    } else {
      this.pricing.truck = pricingData.truck;
    }
    if (pricingData.van == -9) {
      this.pricing.van = "N/A";
    } else {
      this.pricing.van = pricingData.van;
    }
    this.pricing.currency = pricingData.currency;
  },
  mounted() {
    // if page is loaded without any pricing data, go back to price estimate request page
    if (this.pricing.bicycle == null) {
      this.$router.push({ name: "Estimate" });
    }
  }
};
</script>

<style lang="css" scoped>

#backToEstimateBtn {
  color: #fff;
}

#proceedToRequestBtn{
  color: #fff;
}

.card-img-top {
  width: 100px;
  height: 100px;
}

.card-img-top-pickup {
  width: 120px;
  height: 100px;
}

.price-text {
  font-size: 120%;
  font-weight: bold;
}

.routing-header #pickupHeader{
  font-weight: bold;
  font-size: 85%;
}

.routing-header #dropOffHeader{
  font-weight: bold;
  font-size: 85%;
}

span{
    font-size:15px;
}
a{
  text-decoration:none;
  color: #0062cc;
  /* border-bottom:2px solid #0062cc; */
}
.box{
    padding:60px 0px;
}

.box-next-part {
  background: #fff;
  border-radius:0;
  padding:6px 1px;
  margin:3px 0px;
}

.box-part{
    background: #f2f1ed;
    border-radius:0;
    padding:60px 10px;
    margin:30px 0px;
}
.text{
    margin:20px 0px;
}

.fa{
     color:#4183D7;
}
</style>
