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
export default {
    name: 'Canvas',
    data() {
        return {
            canvas: undefined,
            context: undefined,
            mouseDown: false,
            pixels: new Map(),
            zoom: 1,
            scrollLock: false,
            fillColor: '#bf0303',
            eraser: false,
            cellSize: 6,
            maxCanvasHeight: 6 * 600,
            maxCanvasWidth: 6 * 600,
            touchX: 0,
            touchY: 0,
        };
    },
    methods: {
        listenForControlPanel() {
            this.emitter.on('color', (color) => {
                this.fillColor = color;
            });
            this.emitter.on('scrollLock', (scrollLock) => {
                this.scrollLock = scrollLock;
            });
            this.emitter.on('zoom', (zoom) => {
                this.zoom = zoom;
                this.canvas.style.zoom = `${this.zoom}`;
            });
            this.emitter.on('eraser', (eraser) => {
                this.eraser = eraser;
            });
            this.emitter.on('checkout', () => {
                this.emitter.emit('pixels', this.pixels);
            });
        },
        listenForUserEvents() {
            // Mobile Events
            this.canvas.addEventListener(
                'touchmove',
                (evt) => {
                    if (this.scrollLock) {
                        return;
                    }
                    if (evt.touches && evt.touches.length === 1) {
                        const touch = evt.touches[0]; // Get the information for finger #1
                        const touchPos = this.getSquare(touch.pageX, touch.pageY);
                        this.fillSquare(this.context, touchPos.x, touchPos.y);
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
                    const mousePos = this.getSquare(evt.clientX, evt.clientY);
                    this.fillSquare(this.context, mousePos.x, mousePos.y);
                },
                false
            );
            this.canvas.addEventListener(
                'mousemove',
                (evt) => {
                    if (this.mouseDown) {
                        const mousePos = this.getSquare(evt.clientX, evt.clientY);
                        this.fillSquare(this.context, mousePos.x, mousePos.y);
                    }
                },
                false
            );
        },
        drawGrid(color) {
            this.canvas = document.getElementById('myCanvas');
            this.context = this.canvas.getContext('2d');
            //  this.context.clearRect(0, 0, this.maxCanvasWidth, this.maxCanvasHeight);
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
        fillSquare(context, x, y) {
            const pixelKey = `${x},${y}`;
            if (this.eraser) {
                if (!this.pixels.get(pixelKey)) {
                    return;
                }
                context.clearRect(x, y, this.cellSize - 1, this.cellSize - 1);
                this.pixels.delete(pixelKey);
            } else {
                context.fillStyle = this.fillColor;
                context.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
                this.pixels.set(pixelKey, this.fillColor);
            }
            this.emitter.emit('pixelCount', this.pixels.size);
        },
        getSquare(eventX, eventY) {
            const rect = this.canvas.getBoundingClientRect();
            return {
                x: 1 + (eventX / this.zoom - rect.left) - ((eventX / this.zoom - rect.left) % this.cellSize),
                y: 1 + (eventY / this.zoom - rect.top) - ((eventY / this.zoom - rect.top) % this.cellSize),
            };
        },
    },
    mounted() {
        this.drawGrid('#acacac');
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
