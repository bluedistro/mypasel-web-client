<template lang="html">
  <div class="bar"></div>
</template>

<script>
export default {
  name: "LoaderBar",
  data() {
    return {};
  }
};
</script>

<style lang="css" scoped>
.bar {
   border: solid #545e5a 1px;
   transform: translate(-100%);
   animation: loader-bar 10s ease-in alternate infinite both;
 }

 @keyframes loader-bar {
     0%{border: 1px solid #42f4d1; transform: translate(-100%);}
    25%{border: 1px solid #42f4d1; transform: translate(-75%);}
    50%{border: 1px solid red; transform: translate(-50%);}
    75%{border: 1px solid yellow; transform: translate(-25%);}
    100%{border: 1px solid green; transform: translate(-0%);}
  }
</style>
