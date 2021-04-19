<template>
  <SidePanel />
  <Canvas />
</template>

<script>
import Canvas from './components/Canvas.vue'
import SidePanel from './components/SidePanel.vue'

export default {
  name: 'App',
  components: {
    Canvas,
    SidePanel,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
}
body {
  margin: 0;
}
</style>
