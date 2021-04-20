<template>
    <div id="control-panel">
        <button class="material-icons material-icons-outlined" v-on:click="adjustZoom((zoom *= 1.25))">zoom_in</button>
        <button class="material-icons material-icons-outlined" v-on:click="adjustZoom((zoom /= 1.25))">zoom_out</button>
        <button v-on:click="toggleEraser()" style="line-height: 74px">
            <img src="../assets/eraser.svg" height="24" />
        </button>
        <button
            style="position: relative"
            class="material-icons material-icons-outlined"
            v-on:click="isColorOpen = !isColorOpen"
        >
            brush
            <div class="current-color" :style="{ background: color }"></div>
        </button>

        <div class="swatches">
            <button :style="{ background: red }" v-on:click="swatchColor(red)"></button>
            <button :style="{ background: orange }" v-on:click="swatchColor(orange)"></button>
            <button :style="{ background: yellow }" v-on:click="swatchColor(yellow)"></button>
            <button :style="{ background: lime }" v-on:click="swatchColor(lime)"></button>
            <button :style="{ background: green }" v-on:click="swatchColor(green)"></button>
            <button :style="{ background: cyan }" v-on:click="swatchColor(cyan)"></button>
            <button :style="{ background: teal }" v-on:click="swatchColor(teal)"></button>
            <button :style="{ background: blue }" v-on:click="swatchColor(blue)"></button>
            <button :style="{ background: purple }" v-on:click="swatchColor(purple)"></button>
            <button :style="{ background: black }" v-on:click="swatchColor(black)"></button>
            <button :style="{ background: gray }" v-on:click="swatchColor(gray)"></button>
            <button :style="{ background: white }" v-on:click="swatchColor(white)"></button>
        </div>
    </div>

    <color-picker v-if="isColorOpen" :visible-formats="['hex']" color="#f80b" @color-change="updateColor">
    </color-picker>
    <div id="overlay" v-if="isColorOpen" v-on:click="closeColor()"></div>
</template>

<script>
import { ColorPicker } from 'vue-accessible-color-picker';

export default {
    name: 'SidePanel',
    components: {
        ColorPicker,
    },
    data() {
        return {
            zoom: 1,
            red: '#bf0303',
            orange: '#f8be12',
            yellow: '#f6f110',
            lime: '#92ea4c',
            green: '#259a36',
            cyan: '#46eaad',
            teal: '#06a6e5',
            blue: '#193ae7',
            purple: '#651cd7',
            black: '#151515',
            gray: '#8b8b8b',
            white: '#ffffff',
            isColorOpen: false,
            eraser: false,
            color: '#bf0303',
        };
    },
    methods: {
        adjustZoom(newZoom) {
            this.emitter.emit('zoom', newZoom);
        },
        toggleEraser() {
            this.eraser = !this.eraser;
            this.emitter.emit('eraser', this.eraser);
        },
        updateColor(eventData) {
            this.color = eventData.colors.hex;
            this.emitter.emit('color', this.color);
        },
        swatchColor(color) {
            this.color = color;
            this.emitter.emit('color', this.color);
        },
        closeColor() {
            this.isColorOpen = false;
        },
    },
};
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
    background-color: #2a2a2e;
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
    background: #60c15f;
    color: #101010;
}
#control-panel button:hover {
    background: #438d43;
    cursor: pointer;
}
#control-panel .swatches button {
    width: 28px;
    height: 28px;
}
.vacp-color-picker {
    position: fixed;
    top: 200px;
    left: 30px;
    z-index: 3;
}
::v-deep .vacp-copy-button {
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
    background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
    z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
    cursor: pointer; /* Add a pointer on hover */
}
.current-color {
    position: absolute;
    top: 0;
    right: 0;
    height: 8px;
    width: 8px;
    border: solid 1px white;
}
</style>
