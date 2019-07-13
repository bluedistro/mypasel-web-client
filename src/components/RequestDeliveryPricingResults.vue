<template lang="html">
  <div class="pricing-div">
    <h5 class="pricing-header">Pricing</h5>
    <div class="row">
      <!-- motorcycle -->
      <div class="col-md-4 col-lg-4 col-sm-6 col-6">
        <input
          type="radio"
          name="deliveryMode"
          id="bike"
          class="input-hidden"
          value="bike"
          :disabled="disabled"
          v-model="pricing"
        />
        <label for="bike">
          <div class="row dm-price-container">
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
              <b-img-lazy
                class="dm-image"
                src="https://web.mypasel.com/img/motorcycle.5fd1da12.png"
                height="40px"
                width="100px"
              ></b-img-lazy>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6 dm-price">
              <span>{{ pricingDetails.currency }} {{ pricingDetails.bike }}</span>
            </div>
          </div>
        </label>
      </div>
      <!-- bicycle -->
      <div class="col-md-4 col-6 col-lg-4 col-sm-6">
        <input
          type="radio"
          name="deliveryMode"
          id="bicycle"
          class="input-hidden"
          value="bicycle"
          :disabled="disabled"
          v-model="pricing"
        />
        <label for="bicycle">
          <div class="row dm-price-container">
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
              <b-img-lazy class="dm-image" src="https://web.mypasel.com/img/bicycle.0748b2e5.png" height="40px" width="100px"></b-img-lazy>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6 dm-price">
              <span>{{ pricingDetails.currency }} {{ pricingDetails.bicycle }}</span>
            </div>
          </div>
        </label>
      </div>
      <!-- sedan car model -->
      <div class="col-md-4 col-6 col-lg-4 col-sm-6">
        <input
          type="radio"
          name="deliveryMode"
          id="car"
          class="input-hidden"
          value="car"
          :disabled="disabled"
          v-model="pricing"
        />
        <label for="car">
          <div class="row dm-price-container">
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
              <b-img-lazy
                class="dm-image"
                src="https://web.mypasel.com/img/sedan-car-model.4f46e160.png"
                height="40px"
                width="100px"
              ></b-img-lazy>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6 dm-price">
              <span>{{ pricingDetails.currency }} {{ pricingDetails.car }}</span>
            </div>
          </div>
        </label>
      </div>
      <!-- delivery van -->
      <div class="col-md-4 col-6 col-lg-4 col-sm-6">
        <input
          type="radio"
          name="deliveryMode"
          id="van"
          class="input-hidden"
          value="van"
          :disabled="disabled"
          v-model="pricing"
        />
        <label for="van">
          <div class="row dm-price-container">
            <div class="col-md-6 col-lg-6 col-sm-6 col-6">
              <b-img-lazy
                class="dm-image"                
                src="https://web.mypasel.com/img/delivery-truck.png"
                height="40px"
                width="100px"
              ></b-img-lazy>
            </div>
            <div class="col-md-6 col-lg-6 col-sm-6 col-6 dm-price">
              <span>{{ pricingDetails.currency }} {{ pricingDetails.van }}</span>
            </div>
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PricingResults",
  props: {
    pricingDetails: null
  },
  data() {
    return {
      pricing: null,
      disabled: true,
    };
  },
  methods: {},
  watch: {
    // watch pricing radio change and emit appropriate option selected
    pricing: function(val) {
      this.$emit("selected_pricing_option", val);
    },
    // watch the pricing results and enable and disable accordingly
    pricingDetails: function(val) {
      if (val) {
        this.disabled = false;
        this.activeColor = "#5b89d3";
      } else {
        this.activeColor = "#d0d3d8";
        this.disabled = true;
      }
    }
  },
  mount(){

  },
};
</script>

<style lang="css" scoped>

.v-name-container{
text-align: left;
}

.v-pricing-row{
  margin-bottom: 12px;
  /* border-bottom: solid #d4d8dd 1px; */
}

.v-button-container{
  text-align: right;
}

.v-name {
  text-align: left;
}

#v-color {
  color: #5b89d3;
}

.v-price {
  text-align: left;
  font-family: 'Sans';
}

.pricing-header {
  margin-top: 8px;
  margin-bottom: 20px;
  text-align: left;
  color: #4286f4;
  font-size: 110%;
  /* font-weight: bold; */
}

.pricing-div {
    border: solid #d4d8dd 1px;
    height: 230px;
    border-radius: 2px;
    background-color: #fff;
    padding: 12px;
    margin-bottom: 15px;
  }

  /* input radio */
  input[type=radio] + label {
    /* border: 1px dashed #444; */
    /* width: 130px; */
    height: 60px;
    border: solid #ccc 1px;
    border-radius: 1px;
  }

  .input-hidden {
    position: absolute;
    left: -9999px;
  }

  input[type=radio]:checked + label {
    border: 1px solid #42d1f5;
    -webkit-box-shadow: 0px 1px 5px 0px rgba(11,123,252,1);
  -moz-box-shadow: 0px 1px 5px 0px rgba(11,123,252,1);
  box-shadow: 0px 1px 5px 0px rgba(11,123,252,1);
  }

.dm-image {
  height: 50px;
  width: 50px;
}

.dm-price-container {
  padding: 5px;
}

.dm-price {
  padding-top: 5px;
  font-size: 90%;
  color: green;
}
</style>
