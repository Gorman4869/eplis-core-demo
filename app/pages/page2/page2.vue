<template>
  <div>
    <h1>page2</h1>
    <input v-model="content" />
    <div class="content">
      {{ content }}
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import utils from "$common/utils.js";
console.log(utils);
const content = ref("hello world");
</script>
<style scoped lang="less">
h1 {
  color: green;
}
.content {
  color: blue;
}
</style>
