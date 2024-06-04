<template>
  <div id="app">
    <IndexTop />
    <IndexCont />
  </div>
</template>

<script>
import IndexCont from "./components/IndexCont.vue";
import IndexTop from "./components/IndexTop.vue";

export default {
  name: "App",
  components: {
    IndexCont,
    IndexTop
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  flex-direction: column;
  min-width: 500px;
}
#particles-js {
  width: 100vw !important;

  height: 100%;

  position: absolute;
}

.particles-js-canvas-el {
  width: 100vw !important;
  height: 100vh !important;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
