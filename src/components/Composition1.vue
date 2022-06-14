<template>
  <h1>vue3的组合特性</h1>
  <input type="text" v-model="title" @change="changeText" />
  <li v-for="item in list" :key="item.id">
    {{ item.name }}
  </li>
</template>

<script>
import handleList from "../composition/handleList";
import changeTextFn from "../composition/changeText";

export default {
  name: "CompositionItem1",
  setup() {
    const list = handleList();
    const { title, changeText } = changeTextFn(list);
    return {
      list,
      title,
      changeText,
    };
  },
};
</script>

<style scoped></style>
