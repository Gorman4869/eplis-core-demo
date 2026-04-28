<template>
  <div>
    <h1>page19999999</h1>
    <input v-model="content" />
    <div class="content">
      {{ content }}
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import utils from "$common/utils.js";
import "./entry.page1.css";
console.log(utils);
const content = ref("hello world");
</script>
<style scoped lang="less">
h1 {
  color: red;
}
.content {
  color: blue;
}
</style>
