<template>
  <h1>生命周期函数</h1>
  <p>{{ number }}</p>
  <button @click="fn">点击+1</button>
</template>

<script>
// 在vue3里面，生命周期函数的名称发生了变化，api调用方式也发生变化
import { ref, onMounted, onUpdated } from "vue";
export default {
  name: "CompLife",
  setup() {
    console.log("setup");
    const number = ref(0);
    function fn() {
      number.value++;
    }
    onMounted(() => {
      console.log("onMounted");
      number.value = 2;
    });

    onUpdated(() => {
      console.log("onUpdated");
      console.log("number", number.value);
    });
    return { number, fn };
  },
};
</script>

<style></style>
