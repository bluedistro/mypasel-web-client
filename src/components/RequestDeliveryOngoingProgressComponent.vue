<template lang="html">
  <div class="root">
    <div class="container">
      <ul class="progressbar">
        <li :class="step1" :key="i">
          <div class="" v-if="step1 === 'active'">
            <!-- {{ message1 }} -->
          </div>
        </li>
        <li :class="step2">
          <div class="" v-if="step2 === 'active'">
            <!-- {{ message2 }} -->
          </div>
        </li>
        <li :class="step3">
          <div class="" v-if="step3 === 'active'">
            <!-- {{ message3 }} -->
          </div>
        </li>
        <!-- <li :class="step4">
                <div class="" v-if="step4 === 'active'">
                  {{ message4 }}
                </div>
              </li> -->
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressSteps",
  props: {
    step1: null,
    step2: null,
    step3: null
    // step4: null,
    // message1: null,
    // message2: null,
    // message3: null,
    // message4: null,
    // length: null,
  },
  data() {
    return {};
  }
};
</script>

<style lang="css" scoped>
.container {
  /* width: 100%; */
  margin-left: -40px;
  /* position: absolute; */
  z-index: 1;
}

ul {
  list-style-type: none;
}

.progressbar li {
  float: left;
  width: 30%;
  position: relative;
  text-align: center;
}

.progressbar li:before {
  content: counter(step);
  counter-increment: step;
  width: 30px;
  height: 30px;
  border: solid #bebebe 2px;
  display: block;
  margin: 0 auto 10px auto;
  border-radius: 50%;
  line-height: 27px;
  background: white;
  color: #bebebe;
  text-align: center;
  font-weight: bold;
}

.progressbar {
  counter-reset: step;
}

.progressbar li:after {
  content: '';
  position:absolute;
  width: 100%;
  height: 3px;
  background: #979797;
  top: 15px;
  left: -50%;
  z-index: -1;
}

.progressbar li.active:before{
 border-color: #3aac5d;
 background: #3aac5d;
 color: white
}

.progressbar li:first-child:after {
  content: none;
}

.progressbar li.active + li:after{
  background: #3aac5d;
}

.progressbar li.active - li:before {
  border-color: #3aac5d;
  background: #3aac5d;
  color: #fff;
}

.progressbar li:first-child:after{
 content: none;
}
</style>
