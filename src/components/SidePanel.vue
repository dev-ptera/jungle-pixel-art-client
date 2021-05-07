<template>
    <div class="control-panel" v-bind:class="{ isTouchDevice: isTouchDevice }">
        <button class="material-icons material-icons-outlined" v-on:click="increaseZoom">zoom_in</button>
        <button class="material-icons material-icons-outlined" v-on:click="decreaseZoom">zoom_out</button>
        <button
            v-on:click="toggleEraser"
            style="line-height: 74px"
            :style="{ background: eraser ? '#277125' : '#60c15f' }"
        >
            <img src="../assets/eraser.svg" height="24" />
        </button>
        <button
            style="position: relative"
            class="material-icons material-icons-outlined scroll-lock-button"
            v-if:="isTouchDevice"
            v-bind:class="{ 'screen-lock': screenLock || eraser }"
            v-on:click="toggleScreenLock"
        >
            brush
        </button>
        <button
            class="material-icons material-icons-outlined"
            v-on:click="bucketFill"
            v-bind:class="{ 'button-active': useFill }"
        >
            format_color_fill
        </button>
        <button style="position: relative" class="material-icons material-icons-outlined" v-on:click="showColor">
            palette
            <div class="current-color" :style="{ background: color }"></div>
        </button>
        <div class="swatches">
            <button
                class="material-icons material-icons-outlined"
                v-for="swatch in swatches"
                :key="swatch"
                v-bind:style="{ 'background-color': swatch }"
                v-on:click="selectColor($event, swatch)"
            >
                {{ removeColor ? 'remove_circle_outline' : '' }}
            </button>
            <div>
                <button class="material-icons material-icons-outlined add-swatch" v-on:click="addNewColor()">
                    add
                </button>
                <button
                    class="material-icons material-icons-outlined add-swatch"
                    v-on:click="removeColor = !removeColor"
                    v-bind:class="{ 'button-active': removeColor }"
                >
                    remove
                </button>
            </div>
        </div>
        <div style="display: flex; flex: 1 1 0"></div>
        <button
            style="position: relative"
            class="material-icons material-icons-outlined"
            v-bind:class="{ 'empty-cart': cost === 0 }"
            v-on:click="openCheckout"
        >
            <div v-if="cost" class="shopping-cart-badge">
                {{ cost }}
            </div>
            shopping_cart
        </button>
    </div>

    <color-picker v-if="isColorOpen" :visible-formats="[]" color="#f80b" @color-change="updateColor" />
    <div class="color-picker-backdrop" v-if="isColorOpen" v-on:click="closeColor"></div>

    <Checkout v-show="showCheckout" @close="closeCheckout" />
</template>

<script>
import { ColorPicker } from 'vue-accessible-color-picker';
import Checkout from './Checkout';

import * as UserEvents from '../constants/app-events';
import * as Defaults from '../constants/app-defaults';

export default {
    name: 'SidePanel',
    components: {
        ColorPicker,
        Checkout,
    },
    data() {
        return {
            color: '#bf0303',
            swatches: [
                '#bf0303',
                '#f8be12',
                '#f6f110',
                '#92ea4c',
                '#259a36',
                '#46eaad',
                '#06a6e5',
                '#193ae7',
                '#651cd7',
                '#151515',
                '#8b8b8b',
                '#ffffff',
            ],
            cost: 0,
            costModifier: 1,
            zoom: Defaults.ZOOM,
            eraser: Defaults.ERASER,
            screenLock: false /* Edits enabled */,
            isColorOpen: Defaults.COLOR_OPEN,
            showCheckout: Defaults.SHOW_CHECKOUT,
            useFill: Defaults.BUCKET_FILL,
            isTouchDevice: undefined,
            removeColor: false,
        };
    },
    methods: {
        increaseZoom(evt) {
            this.adjustZoom((this.zoom *= 1.25), evt);
        },
        decreaseZoom(evt) {
            this.adjustZoom((this.zoom /= 1.25), evt);
        },
        adjustZoom(zoom, evt) {
            this.emitter.emit(UserEvents.ZOOM, zoom);
            evt.preventDefault();
        },
        toggleEraser(evt) {
            this.eraser = !this.eraser;
            if (this.eraser) {
                this.screenLock = false;
            }
            if (!this.eraser) {
                this.screenLock = true;
            }
            this.emitter.emit(UserEvents.ERASER, this.eraser);
            this.emitter.emit(UserEvents.SCREEN_LOCK, this.screenLock);
            evt.preventDefault();
        },
        bucketFill(evt) {
            this.useFill = !this.useFill;
            this.emitter.emit(UserEvents.BUCKET_FILL, this.useFill);
            evt.preventDefault();
        },
        toggleScreenLock(evt) {
            if (this.eraser) {
                this.screenLock = false;
                this.eraser = false;
            } else {
                this.screenLock = !this.screenLock;
            }
            this.emitter.emit(UserEvents.ERASER, this.eraser);
            this.emitter.emit(UserEvents.SCREEN_LOCK, this.screenLock);
            evt.preventDefault();
        },
        updateColor(eventData) {
            this.color = eventData.colors.hex;
            this.emitter.emit(UserEvents.COLOR, this.color);
        },
        selectColor(evt, color) {
            if (this.removeColor) {
                const index = this.swatches.indexOf(color);
                if (index > -1) {
                    this.swatches.splice(index, 1);
                }
                evt.preventDefault();
                return;
            }
            this.color = color;
            this.eraser = false;
            this.emitter.emit(UserEvents.COLOR, this.color);
            this.emitter.emit(UserEvents.ERASER, this.eraser);
            evt.preventDefault();
        },
        addNewColor() {
            this.saveColor = true;
            this.isColorOpen = true;
        },
        showColor(evt) {
            this.isColorOpen = true;
            evt.preventDefault();
        },
        closeColor(evt) {
            if (this.saveColor) {
                this.swatches.push(this.color);
                this.saveColor = false;
            }
            this.isColorOpen = false;
            evt.preventDefault();
        },
        openCheckout(evt) {
            if (this.cost > 0) {
                this.showCheckout = true;
                this.emitter.emit(UserEvents.CHECKOUT);
            }
            evt.preventDefault();
        },
        closeCheckout() {
            this.showCheckout = false;
        },
    },
    mounted() {
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        this.emitter.on(UserEvents.COST_PER_PIXEL_LOADED, (costModifier) => {
            this.costModifier = costModifier;
        });
        this.emitter.on(UserEvents.PIXEL_COUNT, (pixelCount) => {
            this.cost = Math.ceil(this.costModifier * pixelCount);
        });
        /* Enable screen lock for touch devices on load. */
        if (this.isTouchDevice) {
            setTimeout(() => {
                this.screenLock = true;
                this.emitter.emit(UserEvents.SCREEN_LOCK, this.screenLock);
            });
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.control-panel {
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
.control-panel button {
    width: 100%;
    text-align: center;
    height: 56px;
    width: 56px;
    padding: 0;
    margin: 0;
    line-height: 56px;
    background: #60c15f;
    color: #101010;
    border: solid 1px #1d1d1d;
}
.control-panel * {
    -webkit-user-select: none !important;
}
.control-panel:not(.isTouchDevice) button:hover,
.control-panel .scroll-lock-button:not(.screen-lock) {
    background: #277125;
    cursor: pointer;
}
.control-panel .button-active {
    background: #277125;
}
.control-panel .scroll-lock-button.screen-lock {
    background: #60c15f;
}
.swatches {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.control-panel .swatches button {
    width: 27px;
    height: 27px;
    border: solid 2px #2f2f2f;
    font-size: 18px;
    line-height: 18px;
}
.vacp-color-picker {
    position: fixed;
    top: 200px;
    left: 30px;
    width: 300px;
    z-index: 3;
}
::v-deep .vacp-copy-button,
::v-deep .vacp-color-input-group {
    display: none;
}
.color-picker-backdrop {
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
.empty-cart {
    opacity: 0.3;
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
.control-panel .add-swatch {
    line-height: 16px;
}
</style>
