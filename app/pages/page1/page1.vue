<template>
  <div>
    <h1>page1</h1>
    <input v-model="content" />
    <div class="content">
      {{ content }}
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";

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
