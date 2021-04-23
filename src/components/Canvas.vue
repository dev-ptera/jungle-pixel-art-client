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
            maxCanvasHeight: 6 * 600,
            maxCanvasWidth: 6 * 600,
            touchX: 0,
            touchY: 0
        };
    },
    methods: {
        listenForControlPanel() {
            this.emitter.on('color', (color) => {
                this.fillColor = color;
            });
            this.emitter.on('grid', (showGrid) => {
                this.drawGrid(showGrid ? '#acacac' : 'white');
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
            // React to touch events on the canvas
            this.canvas.addEventListener('touchstart', this.sketchpad_touchStart, false);
            this.canvas.addEventListener('touchmove', this.sketchpad_touchMove, false);
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
            }, false);
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
        getSquare(canvas, evt, zoom) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: 1 + (evt.clientX / zoom - rect.left) - ((evt.clientX / zoom - rect.left) % this.cellSize),
                y: 1 + (evt.clientY / zoom - rect.top) - ((evt.clientY / zoom - rect.top) % this.cellSize),
            };
        },
        sketchpad_touchMove(e) {
            // Update the touch co-ordinates
            this.getTouchPos(e);

            // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
            this.drawDot(this.context, this.touchX, this.touchY,12);

            // Prevent a scrolling action as a result of this touchmove triggering.
            event.preventDefault();
        },
        sketchpad_touchStart() {
            this.getTouchPos();
            this.drawDot(this.context, this.touchX, this.touchY,12);

            // Prevents an additional mousedown event being triggered
            event.preventDefault();
        },
        getTouchPos(e) {
            if (e.touches) {
                if (e.touches.length == 1) { // Only deal with one finger
                    var touch = e.touches[0]; // Get the information for finger #1
                    this.touchX=touch.pageX-touch.target.offsetLeft;
                    this.touchY=touch.pageY-touch.target.offsetTop;
                }
            }
        },
        drawDot(ctx,x,y,size) {

            // Select a fill style
            ctx.fillStyle = "black";

            // Draw a filled circle
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI*2, true);
            ctx.closePath();
            ctx.fill();
        }

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
