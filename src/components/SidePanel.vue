<template>
    <div id="control-panel">
        <button class="material-icons material-icons-outlined" v-on:click="adjustZoom((zoom *= 1.25))">zoom_in</button>
        <button class="material-icons material-icons-outlined" v-on:click="adjustZoom((zoom /= 1.25))">zoom_out</button>
        <button
            v-on:click="toggleEraser()"
            style="line-height: 74px"
            :style="{ background: eraser ? '#277125' : '#60c15f' }"
        >
            <img src="../assets/eraser.svg" height="24" />
        </button>
        <button class="material-icons material-icons-outlined" v-on:click="toggleGrid()">grid_4x4</button>
        <button style="position: relative" class="material-icons material-icons-outlined" v-on:click="showColor">
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
        <div style="display: flex; flex: 1 1 0"></div>
        <button style="position: relative" class="material-icons material-icons-outlined" v-on:click="openCheckout">
            <div class="shopping-cart-badge" v-if="pixelCount">{{ pixelCount }}</div>
            shopping_cart
        </button>
    </div>

    <color-picker v-if="isColorOpen" :visible-formats="['hex']" color="#f80b" @color-change="updateColor" />
    <div id="overlay" v-if="isColorOpen" v-on:click="closeColor"></div>

    <Checkout v-show="showCheckout" @close="closeCheckout" />
</template>

<script>
import { ColorPicker } from 'vue-accessible-color-picker';
import Checkout from './Checkout';

export default {
    name: 'SidePanel',
    components: {
        ColorPicker,
        Checkout,
    },
    data() {
        return {
            zoom: 0.5,
            pixelCount: 0,
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
            showGrid: false,
            showCheckout: false,
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
        toggleGrid() {
            this.showGrid = !this.showGrid;
            this.emitter.emit('grid', this.showGrid);
        },
        updateColor(eventData) {
            this.color = eventData.colors.hex;
            this.emitter.emit('color', this.color);
        },
        swatchColor(color) {
            this.color = color;
            this.emitter.emit('color', this.color);
            this.eraser = false;
            this.emitter.emit('eraser', this.eraser);
        },
        showColor() {
            this.isColorOpen = true;
        },
        closeColor() {
            this.isColorOpen = false;
        },
        openCheckout() {
            if (this.pixelCount > 0) {
                this.showCheckout = true;
                this.emitter.emit('checkout');
            }
        },
        closeCheckout() {
            this.showCheckout = false;
        },
    },
    mounted() {
        this.emitter.on('pixelCount', (pixelCount) => {
            this.pixelCount = pixelCount;
        });
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
.shopping-cart-badge {
    position: absolute;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    top: 4px;
    right: 2px;
    min-height: 10px;
    min-width: 12px;
    font-size: 10px;
    font-weight: 600;
    line-height: 10px;
    padding: 4px;
    text-align: center;
    border: solid 1px white;
    color: white;
    background: #438d43;
    border-radius: 50%;
}
</style>
