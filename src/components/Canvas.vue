<template>
    <div id="canvas-container">
        <canvas
            id="myCanvas"
            oncontextmenu="return false;"
            v-bind:width="maxCanvasWidth"
            v-bind:height="maxCanvasHeight"
        ></canvas>
    </div>
</template>

<script>
import * as UserEvents from '../constants/app-events';
import * as Defaults from '../constants/app-defaults';
import { getBoard } from '../api';

export default {
    name: 'Canvas',
    data() {
        return {
            canvas: undefined,
            context: undefined,
            mouseDown: false,
            pixels: new Map(),
            confirmedPixels: new Map(),
            cellSize: 6,
            maxCanvasHeight: 6 * 600,
            maxCanvasWidth: 6 * 600,
            zoom: Defaults.ZOOM,
            eraser: Defaults.ERASER,
            fillColor: Defaults.FILL_COLOR,
            screenLock: Defaults.SCREEN_LOCK,
            isColorOpen: Defaults.COLOR_OPEN,
            showCheckout: Defaults.SHOW_CHECKOUT,
        };
    },
    methods: {
        listenForControlPanel() {
            this.emitter.on(UserEvents.COLOR, (color) => {
                this.fillColor = color;
            });
            this.emitter.on(UserEvents.SCREEN_LOCK, (screenLock) => {
                this.screenLock = screenLock;
            });
            this.emitter.on(UserEvents.ZOOM, (zoom) => {
                this.zoom = zoom;
                this.canvas.style.zoom = `${this.zoom}`;
            });
            this.emitter.on(UserEvents.ERASER, (eraser) => {
                this.eraser = eraser;
            });
            this.emitter.on(UserEvents.CHECKOUT, () => {
                this.emitter.emit(UserEvents.CHECKOUT_PIXELS, this.pixels);
            });
        },
        listenForUserEvents() {
            // Mobile Events
            this.canvas.addEventListener(
                'touchmove',
                (evt) => {
                    if (this.screenLock) {
                        return;
                    }
                    if (evt.touches && evt.touches.length === 1) {
                        const touch = evt.touches[0]; // Get the information for finger #1
                        const touchPos = this.getSquare(touch.pageX, touch.pageY);
                        this.fillSquare(touchPos.x, touchPos.y);
                    }
                    evt.preventDefault();
                },
                false
            );
            // Mouse Events
            this.canvas.onmousedown = () => (this.mouseDown = true);
            this.canvas.onmouseup = () => (this.mouseDown = false);
            this.canvas.addEventListener(
                'click',
                (evt) => {
                    if (this.screenLock) {
                        return;
                    }
                    const mousePos = this.getSquare(evt.clientX, evt.clientY);
                    this.fillSquare(mousePos.x, mousePos.y);
                },
                false
            );
            this.canvas.addEventListener(
                'mousemove',
                (evt) => {
                    if (this.mouseDown) {
                        const mousePos = this.getSquare(evt.clientX, evt.clientY);
                        this.fillSquare(mousePos.x, mousePos.y);
                    }
                },
                false
            );
        },
        makeKey(x, y) {
            return `${x},${y}`;
        },
        drawGrid(color) {
            this.canvas = document.getElementById('myCanvas');
            this.context = this.canvas.getContext('2d');
            this.canvas.style.zoom = this.zoom;
            // Draw Grid
            for (let x = 0; x < this.maxCanvasWidth + 1; x += this.cellSize) {
                this.context.moveTo(x, 0);
                this.context.lineTo(x, this.maxCanvasHeight);
            }
            for (let y = 0; y < this.maxCanvasHeight + 1; y += this.cellSize) {
                this.context.moveTo(0, y);
                this.context.lineTo(this.maxCanvasWidth, y);
            }
            this.context.strokeStyle = color;
            this.context.stroke();
        },
        fillSquare(x, y) {
            const pixelKey = this.makeKey(x, y);
            /* Uneditable pixel */
            if (this.confirmedPixels.has(pixelKey)) {
                return;
            }
            /* Remove pixel */
            if (this.eraser) {
                if (!this.pixels.get(pixelKey)) {
                    return;
                }
                this.context.clearRect(x, y, this.cellSize - 1, this.cellSize - 1);
                this.pixels.delete(pixelKey);
            } else if (!this.pixels.get(pixelKey) || this.pixels.get(pixelKey) !== this.fillColor) {
            /* New/edit pixel */
                if (this.pixels.get(pixelKey)) {
                    this.context.clearRect(x, y, this.cellSize - 1, this.cellSize - 1);
                }
                this.context.fillStyle = this.fillColor;
                this.context.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
                this.pixels.set(pixelKey, this.fillColor);
            }
            this.emitter.emit(UserEvents.PIXEL_COUNT, this.pixels.size);
        },
        getSquare(eventX, eventY) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: 1 + (eventX / this.zoom - rect.left) - ((eventX / this.zoom - rect.left) % this.cellSize),
                y: 1 + (eventY / this.zoom - rect.top) - ((eventY / this.zoom - rect.top) % this.cellSize),
            };
        },
        loadBoard() {
            getBoard()
                .then((data) => {
                    for (const key in data) {
                        const [x, y] = key.split(',');
                        this.confirmedPixels.set(key, data[key]);
                        this.context.fillStyle = data[key];
                        this.context.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
    },
    mounted() {
        this.drawGrid('#acacac');
        this.loadBoard();
        this.listenForUserEvents();
        this.listenForControlPanel();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#canvas-container {
    margin-left: 56px;
    overflow: scroll;
    height: 100vh;
}
#myCanvas {
    background: white;
    border-bottom: solid 2px red;
    border-right: solid 2px red;
}
</style>
