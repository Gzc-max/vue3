<template>
  <h1>vue3的组合特性</h1>
  <input type="text" v-model="title" @change="changeText" />
  <li v-for="item in list" :key="item.id">
    {{ item.name }}
  </li>
</template>

<script>
import { reactive, ref } from "vue";
export default {
  name: "CompositionItem",
  // 未响应式数据
  setup(props, context) {
    console.log("props", props);
    console.log("context", context);
    console.log("this", this);

    const title = ref("");
    const list = reactive([
      { id: 0, name: "Tom" },
      { id: 1, name: "Joy" },
      { id: 2, name: "Ming" },
    ]);

    function changeText() {
      console.log(title);
      const tmp = { id: list.length + 1, name: title.value };
      // title.value = "";
      list.push(tmp);
    }
    return { title, list, changeText };
  },

  // 响应式数据
  // setup() {
  //   console.log(this);
  //   console.log("setup");
  //   const title = ref("");
  //   // ref 这个对象值操作的时候，需要使用.value的方式操作
  //   function changeText() {
  //     console.log(title);
  //     const tmp = { id: list.length + 1, name: title.value };
  //     title.value = "";

  //     list.push(tmp);
  //     console.log("changeText");
  //   }
  //   const list = reactive([
  //     { id: 0, name: "Tom" },
  //     { id: 1, name: "Joy" },
  //     { id: 2, name: "Ming" },
  //   ]);

  //   // const obj = {
  //   //   id: 12,
  //   //   username: "Tom",
  //   // };

  //   return {
  //     list,
  //     title,
  //     changeText,
  //     // newObj
  //   };
  // },
};
</script>

<style scoped></style>
