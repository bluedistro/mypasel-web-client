<template lang="html">
  <div class="mb-2">
    <span class="no-activity-text" v-if="message !== 'Loading...'">{{ message }}</span>
    <span class="no-activity-text" v-if="message === 'Loading...'">
      <b-spinner :variant="'info'" class="spinner-decor"></b-spinner>
    </span>
  </div>
</template>

<script>
export default {
  name: "NoActivity",
  props: {
    message: {
      type: String
    }
  }
};
</script>

<style lang="css" scoped>

.mb-2 {
  margin-top: 100px;
}

.no-activity-text {
  font-family: "Lucida Console", Monaco, monospace;
  font-size: 20px;
  letter-spacing: 1.6px;
  word-spacing: -1.6px;
  color: #525B66;
  font-weight: 400;
  text-decoration: none solid rgb(68, 68, 68);
  font-style: normal;
  font-variant: normal;
  text-transform: none;
}

.spinner-decor {
  width: 4em;
  height: 4em;
}

</style>
