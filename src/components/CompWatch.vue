<template>
  <h3>count is {{ state.count }}</h3>
  <h3>plusOne is {{ state.plusOne }}</h3>
  <button @click="add">+1</button>
</template>

<script>
import { watch, reactive, computed } from "vue";
export default {
  name: "CompWatch",
  setup() {
    const state = reactive({
      count: 0,
      plusOne: computed(() => state.count + 1),
    });

    function add() {
      state.count++;
    }
    watch(state, (newVal, oldVal) => {
      console.log("newVal", newVal);
      console.log("oldVal", oldVal);
    });
    return { state, add };
  },
};
</script>

<style></style>
