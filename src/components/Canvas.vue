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
            zoom: .5,
            fillColor: 'gray',
            eraser: false,
            cellSize: 7,
            maxCanvasSize: 7 * 500,
            maxCanvasHeight: 7 * 300,
            maxCanvasWidth: 7 * 540,
            fillSquare(context, x, y) {
                if (this.eraser) {
                    context.clearRect(x, y, this.cellSize - 1, this.cellSize - 1);
                } else {
                    context.fillStyle = this.fillColor;
                    context.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
                }
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
            this.emitter.on('zoom', (zoom) => {
                this.zoom = zoom;
                this.canvas.style.zoom = `${this.zoom}`;
            });
            this.emitter.on('eraser', (eraser) => {
                this.eraser = eraser;
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
        drawGrid() {
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
            this.context.strokeStyle = 'gray';
            this.context.stroke();
        },
    },
    mounted() {
        this.drawGrid();
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
