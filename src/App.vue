<template>
  <!-- <HelloWorld msg="hello" /> -->
  <!-- <Composition /> -->
  <!-- <Composition1 /> -->
  <!-- <CompLife /> -->
  <CompWatch />
  1111
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue";
// import Composition from "./components/Composition.vue";
// import Composition1 from "./components/Composition1.vue";
// import CompLife from "./components/CompLife.vue";
import CompWatch from "./components/CompWatch.vue";
export default {
  name: "App",
  components: {
    // HelloWorld,
    // Composition,
    // Composition1,
    // CompLife,
    CompWatch,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
