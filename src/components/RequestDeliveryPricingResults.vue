<template lang="html">
  <div class="pricing-div">
      <h5 class="pricing-header">Pricing</h5>
      <div class="row v-pricing-row">
          <div class="col-md-6 col-8 v-name-container">
            <div class="row">
                <div class="col-3 v-name" v-bind:style="{color: activeColor}">
                  <font-awesome-icon icon="walking" size="2x" />
                </div>
                <div class="col-9 v-price">
                  {{ pricingDetails.currency }} {{ pricingDetails.walking }}
                </div>
            </div>
          </div>
          <div class="col-md-6 col-4 v-button-container">
            <input type="radio"
                   v-model="pricing"
                   :disabled="disabled"
                   name="pricing"
                   value="walk">
          </div>
      </div>
      <!-- bicycle -->
      <div class="row v-pricing-row">
          <div class="col-md-6 col-8 v-name-container">
            <div class="row">
                <div class="col-3 v-name" v-bind:style="{color: activeColor}">
                  <font-awesome-icon icon="bicycle" size="2x" />
                </div>
                <div class="col-9 v-price">
                  {{ pricingDetails.currency }} {{ pricingDetails.bicycle }}
                </div>
            </div>
          </div>
          <div class="col-md-6 col-4 v-button-container">
            <input type="radio"
                   name="pricing"
                   :disabled="disabled"
                   value="bicycle"
                   v-model="pricing">
          </div>
      </div>
      <!-- motor -->
      <div class="row v-pricing-row">
          <div class="col-md-6 col-8 v-name-container">
            <div class="row">
                <div class="col-3 v-name" v-bind:style="{color: activeColor}">
                  <font-awesome-icon icon="motorcycle" size="2x" />
                </div>
                <div class="col-9 v-price">
                  {{ pricingDetails.currency }} {{ pricingDetails.bike }}
                </div>
            </div>
          </div>
          <div class="col-md-6 col-4 v-button-container">
            <input type="radio"
                   name="pricing"
                   :disabled="disabled"
                   value="bike"
                   v-model="pricing">
          </div>
      </div>
      <!-- sedan -->
      <div class="row v-pricing-row">
          <div class="col-md-6 col-8 v-name-container">
            <div class="row">
                <div class="col-3 v-name" v-bind:style="{color: activeColor}">
                  <font-awesome-icon icon="shuttle-van" size="2x" />
                </div>
                <div class="col-9 v-price">
                  {{ pricingDetails.currency }} {{ pricingDetails.van }}
                </div>
            </div>
          </div>
          <div class="col-md-6 col-4 v-button-container">
            <input type="radio"
                   name="pricing"
                   :disabled="disabled"
                   value="van"
                   v-model="pricing">
          </div>
      </div>
      <!-- pick up -->
      <div class="row v-pricing-row">
          <div class="col-md-6 col-8 v-name-container">
            <div class="row">
                <div class="col-3 v-name" v-bind:style="{color: activeColor}">
                  <font-awesome-icon icon="truck-pickup" size="2x" />
                </div>
                <div class="col-9 v-price">
                  {{ pricingDetails.currency }} {{ pricingDetails.truck }}
                </div>
            </div>
          </div>
          <div class="col-md-6 col-4 v-button-container">
            <input type="radio"
                   :disabled="disabled"
                   name="pricing"
                   value="truck"
                   v-model="pricing">
          </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'PricingResults',
  props: {
    pricingDetails: null,
  },
  data(){
    return {
      pricing: null,
      disabled: true,
      activeColor: '#d0d3d8',
    }
  },
  methods: {

  },
  watch: {
    // watch pricing radio change and emit appropriate option selected
    pricing: function(val){
      this.$emit('selected_pricing_option', val)
    },
    // watch the pricing results and enable and disable accordingly
    pricingDetails: function(val){
      if(val){
        this.disabled = false;
        this.activeColor = '#5b89d3';
      }else{
        this.activeColor = '#d0d3d8';
        this.disabled = true;
      }
    }
  }
}
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
    height: 300px;
    border-radius: 1px;
    background-color: #fff;
    padding: 12px;
    margin-bottom: 15px;
  }
</style>
