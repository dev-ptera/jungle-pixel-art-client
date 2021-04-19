<template>
  <div id="control-panel">
    <button class="material-icons material-icons-outlined"
            v-on:click="adjustZoom(zoom *= 1.25)">zoom_in</button>
    <button class="material-icons material-icons-outlined"
            v-on:click="adjustZoom(zoom /= 1.25)">zoom_out</button>
    <button><img src="../assets/eraser.svg" height="24" /></button>
    <button class="material-icons material-icons-outlined"
      v-on:click="isColorOpen=!isColorOpen">brush</button>
  </div>

  <color-picker v-if="isColorOpen"
                :visible-formats="['hex']"
                color="#f80b" @color-change="updateColor">
    <template v-slot:copy-button>asdf</template>
  </color-picker>
  <div id="overlay" v-if="isColorOpen" v-on:click="closeColor()"></div>
</template>

<script>
import { ColorPicker } from 'vue-accessible-color-picker';

  export default {
    name: 'SidePanel',
    components: {
      ColorPicker
    },
    data() {
      return {
        zoom: .5,
        isColorOpen: false,
        isEraserOn: false,
      }
    },
    methods: {
      adjustZoom(newZoom) {
        this.emitter.emit("zoom", newZoom);
      },
      toggleEraser(isEraserOn) {
        this.emitter.emit("eraser", isEraserOn)
      },
      updateColor (eventData) {
        console.log(eventData)
      },
      closeColor() {
        this.isColorOpen = false;
      }
    }
  }


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #control-panel {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    height: 100vh;
    width: 56px;
    text-align: center;
    background-color: white;
    border-right: solid 1px darkslategray;
    border-left: solid 1px darkslategray;
  }
  #control-panel button {
    width: 100%;
    text-align: center;
    height: 56px;
    width: 56px;
    padding: 0;
    margin: 0;
    line-height: 56px;
    background: yellowgreen;
  }
  .vacp-color-picker {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
  }
  /deep/ .vacp-copy-button {
    display: none;
  }
  #overlay {
    position: fixed; /* Sit on top of the page content */
    width: 100%; /* Full width (cover the whole page) */
    height: 100%; /* Full height (cover the whole page) */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.5); /* Black background with opacity */
    z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
    cursor: pointer; /* Add a pointer on hover */
  }
</style>

