<template>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet">
  <SidePanel />
  <Canvas />
</template>

<script>
import Canvas from './components/Canvas.vue'
import SidePanel from './components/SidePanel.vue'


var colors = {
  hex: '#194d33',
  hex8: '#194D33A8',
  hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
  hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
  rgba: { r: 25, g: 77, b: 51, a: 1 },
  a: 1
}

export default {
  name: 'App',
  components: {
    Canvas,
    SidePanel,
  },
  data () {
    return {
      colors
    }
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
