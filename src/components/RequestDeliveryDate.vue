<template lang="html">
  <div class="courierNeedDiv">
    <h6 class="courierNeedTimeHeader">When do you need the courier?</h6>
    <!-- <div class="radio-btn-group">
          <div class="radio">
            <input type="radio" name="deliveryDateOption" value="now" checked v-model="deliveryDateOption" id="now"/>
            <label for="now">Now</label>
          </div>
          <div class="radio">
            <input type="radio" name="deliveryDateOption" value="later" v-model="deliveryDateOption" id="later"/>
            <label for="later">Later</label>
          </div>
       </div> -->
    <!-- <h5 class="show m-t-2">Currently checked value: <span>{{ deliveryDateOption }}</span></h5> -->
    <!-- date picker -->
    <div class="dateSelect">
      <vue-ctk-date-time-picker
        v-model="selectedDate"
        :min-date="dateOptions.minimumDate"
        :no-weekends-days="dateOptions.noWeekendDays"
        :label="dateOptions.label"
        :minute-interval="dateOptions.minuteInterval"
        :error-hint="dateOptions.errorHint"
      >
      </vue-ctk-date-time-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeliveryDate",
  data() {
    return {
      selectedDate: "", // format is: 2019-06-23 03:00 am
      dateOptions: {
        minimumDate: this.getCorrectISODate(),
        noWeekendDays: false,
        label: "Select preferred delivery date and time",
        minuteInterval: 5,
        errorHint: true
      },
      finalData: null
    };
  },
  methods: {
    // get the correct ISO date to set the minimum date
    getCorrectISODate() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      today = yyyy + "-" + mm + "-" + dd;
      return today;
    }
  },
  watch: {
    selectedDate: function(date) {
      const dateData = Date.parse(date);
      this.$emit("selected_delivery_option", dateData);
    }
  },
  created() {}
};
</script>

<style lang="css" scoped>

.courierNeedDiv {
  margin-top: 10px;
}

.courierNeedTimeHeader {
  margin-bottom: 5px;
  font-size: 100%;
  color: #4286f4;
}

.dateSelect {
  width: 94%;
  margin-left: 16px;
}

/* :root {
  font-size: 16px;
} */

/* * {
  box-sizing: border-box;
} */

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.radio-btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
}
.radio-btn-group .radio {
  margin: 0 .25rem;
}
.radio-btn-group .radio label {
  background: #fff;
  border: 1px solid #ddd;
  padding: .5rem 1.25rem;
  border-radius: 1px;
  cursor: pointer;
  color: #444;
  transition: box-shadow 400ms ease;
}
.radio-btn-group .radio label:hover {
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
.radio-btn-group .radio input[type="radio"] {
  display: none;
}
.radio-btn-group .radio input[type="radio"]:checked + label {
  background: #2196F3;
  color: #fff;
  border-color: #2196F3;
}

.show {
  font-weight: 400;
  color: #444;
}
.show span {
  background: #f5f5f5;
  color: #F44336;
  border-radius: 3px;
  padding: .25rem .5rem;
  font-size: 1.25rem;
  border: 1px solid #f1f1f1;
}
</style>
