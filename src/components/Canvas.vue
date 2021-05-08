<template>
    <div class="canvas-container">
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
            isTouchDevice: false,
            pixels: new Map(),
            confirmedPixels: new Set(),
            maxCanvasHeight: Defaults.CELL_SIZE * 600,
            maxCanvasWidth: Defaults.CELL_SIZE * 600,
            zoom: Defaults.ZOOM,
            cellSize: Defaults.CELL_SIZE,
            fillColor: Defaults.FILL_COLOR,
            isColorOpen: Defaults.COLOR_OPEN,
            showCheckout: Defaults.SHOW_CHECKOUT,
            fillEnabled: Defaults.FILL_ENABLED,
            drawEnabled: Defaults.DRAW_ENABLED,
            eraserEnabled: Defaults.ERASER_ENABLED,
        };
    },
    methods: {
        listenForControlPanel() {
            this.emitter.on(UserEvents.COLOR, (color) => {
                this.fillColor = color;
            });
            this.emitter.on(UserEvents.TOUCH_DEVICE_DETECTED, (isTouchDevice) => {
                this.isTouchDevice = isTouchDevice;
            }),
            this.emitter.on(UserEvents.DRAW_ENABLED, (drawEnabled) => {
                this.drawEnabled = drawEnabled;
            });
            this.emitter.on(UserEvents.ZOOM, (zoom) => {
                this.zoom = zoom;
                this.zoomGrid(zoom);
            });
            this.emitter.on(UserEvents.ERASER, (eraser) => {
                this.eraserEnabled = eraser;
            });
            this.emitter.on(UserEvents.BUCKET_FILL, (bucketFill) => {
                this.fillEnabled = bucketFill;
            });
            this.emitter.on(UserEvents.CHECKOUT, () => {
                this.emitter.emit(UserEvents.CHECKOUT_PIXELS, this.pixels);
            });
            this.emitter.on(UserEvents.PAYMENT_SUCCESS, (pixelsObj) => {
                this.pixels.clear();
                this.emitter.emit(UserEvents.PIXEL_COUNT, this.pixels.size);
                for (const key in pixelsObj) {
                    this.confirmedPixels.add(key);
                }
            });
        },
        canvasEditable() {
            return !this.isTouchDevice || this.drawEnabled || this.fillEnabled || this.eraserEnabled;
        },
        listenForUserEvents() {
            // Mobile Events
            this.canvas.addEventListener(
                'touchmove',
                (evt) => {
                    if (!this.canvasEditable()) {
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
                    if (!this.canvasEditable()) {
                        return;
                    }
                    const mousePos = this.getSquare(evt.clientX, evt.clientY);
                    this.fillEnabled ? this.fillBucket(mousePos.x, mousePos.y) : this.fillSquare(mousePos.x, mousePos.y);
                },
                false
            );
            this.canvas.addEventListener(
                'mousemove',
                (evt) => {
                    if (this.fillEnabled) {
                        return;
                    }
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
        zoomGrid(zoom) {
            this.canvas.style.transform = `scale(${zoom})`;
            this.canvas.style.MozTransform = `scale(${zoom}, ${zoom})`;
        },
        drawGrid(color) {
            this.canvas = document.getElementById('myCanvas');
            this.context = this.canvas.getContext('2d');
            this.zoomGrid(this.zoom);
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
        fillBucket(x, y) {
            const pixelKey = this.makeKey(x, y);
            if (
                this.pixels.get(pixelKey) ||
                this.confirmedPixels.has(pixelKey) ||
                x < 0 ||
                y < 0 ||
                x > this.maxCanvasWidth ||
                y > this.maxCanvasHeight
            ) {
                return;
            }
            this.context.fillStyle = this.fillColor;
            this.context.fillRect(x, y, this.cellSize, this.cellSize);
            this.pixels.set(pixelKey, this.fillColor);
            this.fillBucket(x + this.cellSize, y);
            this.fillBucket(x, y + this.cellSize);
            this.fillBucket(x - this.cellSize, y);
            this.fillBucket(x, y - this.cellSize);
        },
        fillSquare(x, y) {
            const pixelKey = this.makeKey(x, y);
            /* Uneditable pixel */
            if (this.confirmedPixels.has(pixelKey)) {
                return;
            }
            /* Remove pixel */
            if (this.eraserEnabled) {
                if (!this.pixels.get(pixelKey)) {
                    return;
                }
                this.context.clearRect(x, y, this.cellSize, this.cellSize);
                this.pixels.delete(pixelKey);
            } else if (!this.pixels.get(pixelKey) || this.pixels.get(pixelKey) !== this.fillColor) {
                /* New/edit pixel */
                if (this.pixels.get(pixelKey)) {
                    this.context.clearRect(x, y, this.cellSize, this.cellSize);
                }
                this.context.fillStyle = this.fillColor;
                this.context.fillRect(x, y, this.cellSize, this.cellSize);
                this.pixels.set(pixelKey, this.fillColor);
            }
            this.emitter.emit(UserEvents.PIXEL_COUNT, this.pixels.size);
        },
        getSquare(eventX, eventY) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x:
                    eventX / this.zoom -
                    rect.left / this.zoom -
                    ((eventX / this.zoom - rect.left / this.zoom) % this.cellSize),
                y:
                    eventY / this.zoom -
                    rect.top / this.zoom -
                    ((eventY / this.zoom - rect.top / this.zoom) % this.cellSize),
            };
        },
        loadBoard() {
            getBoard()
                .then((data) => {
                    this.confirmedPixels = new Set();
                    for (const key in data.pixels) {
                        const [x, y] = key.split(',');
                        this.confirmedPixels.add(this.makeKey(x, y));
                        this.context.fillStyle = data.pixels[key];
                        this.context.fillRect(x, y, this.cellSize, this.cellSize);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        },
    },
    mounted() {
        this.drawGrid('#c3c3c380');
        this.loadBoard();
        this.listenForUserEvents();
        this.listenForControlPanel();
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.canvas-container {
    margin-left: 56px;
    overflow: scroll;
    height: 100vh;
    display: grid;
    -webkit-user-select: none !important;
}
#myCanvas {
    background: white;
    border-bottom: solid 2px red;
    border-right: solid 2px red;
    -ms-transform-origin: left top;
    -moz-transform-origin: left top;
    -webkit-transform-origin: left top;
}
</style>
