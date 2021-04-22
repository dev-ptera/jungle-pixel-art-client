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
            zoom: 0.5,
            fillColor: '#bf0303',
            eraser: false,
            cellSize: 6,
            maxCanvasHeight: 6 * 340,
            maxCanvasWidth: 6 * 580,
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
            getSquare(canvas, evt, zoom) {
                const rect = canvas.getBoundingClientRect();
                return {
                    x: 1 + (evt.clientX / zoom - rect.left) - ((evt.clientX / zoom - rect.left) % this.cellSize),
                    y: 1 + (evt.clientY / zoom - rect.top) - ((evt.clientY / zoom - rect.top) % this.cellSize),
                };
            },
        };
    },
    methods: {
        listenForControlPanel() {
            this.emitter.on('color', (color) => {
                this.fillColor = color;
            });
            this.emitter.on('grid', (showGrid) => {
                this.drawGrid(showGrid ? 'gray' : 'white');
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
            this.canvas.onmousedown = () => (this.mouseDown = true);
            this.canvas.onmouseup = () => (this.mouseDown = false);
            this.canvas.addEventListener(
                'click',
                (evt) => {
                    const mousePos = this.getSquare(this.canvas, evt, this.zoom);
                    this.fillSquare(this.context, mousePos.x, mousePos.y);
                },
                false
            );
            this.canvas.addEventListener('mousemove', (evt) => {
                if (this.mouseDown) {
                    const mousePos = this.getSquare(this.canvas, evt, this.zoom);
                    this.fillSquare(this.context, mousePos.x, mousePos.y);
                }
            });
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
    },
    mounted() {
        this.drawGrid('gray');
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
