<template>
    <Welcome />
    <SidePanel />
    <Canvas />
</template>

<script>
import Welcome from './components/Welcome.vue';
import Canvas from './components/Canvas.vue';
import SidePanel from './components/SidePanel.vue';

export default {
    name: 'App',
    components: {
        Welcome,
        Canvas,
        SidePanel,
    },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600&display=swap');
#app {
    margin: 0;
}
#app,
button {
    font-family: 'Open Sans', sans-serif;
}
body {
    margin: 0;
}
</style>
