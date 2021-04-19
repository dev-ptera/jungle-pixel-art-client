<template>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet">
  </head>
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
