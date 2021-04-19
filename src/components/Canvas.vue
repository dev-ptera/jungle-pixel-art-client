<template>
    <div id="canvas-container">
      <canvas id="myCanvas" v-bind:width="maxCanvasSize" v-bind:height="maxCanvasSize"></canvas>
    </div>
</template>

<script>
export default {
  name: 'Canvas',
  data() {
    return {
      canvas:undefined,
      context: undefined,
      mouseDown: false,
      zoom: .5,
      cellSize: 8,
      maxCanvasSize: 8 * 500,
      fillSquare(context, x, y) {
        context.fillStyle = 'gray';
        context.fillRect(x, y, this.cellSize-1, this.cellSize-1);
      },
      getSquare(canvas, evt, zoom) {
        const rect = canvas.getBoundingClientRect();
        return {
          x: 1 + (evt.clientX/zoom - rect.left) - (evt.clientX/zoom - rect.left)%this.cellSize,
          y: 1 + (evt.clientY/zoom - rect.top) - (evt.clientY/zoom - rect.top)%this.cellSize
        }
      },
    }
  },
  mounted() {
    this.emitter.on("zoom", zoom => {
      this.zoom = zoom;
      this.canvas.style.zoom = `${this.zoom }`;
    });

    // https://stackoverflow.com/questions/28576966/draw-clickable-grid-of-1-million-squares
    this.canvas = document.getElementById('myCanvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.style.zoom = this.zoom;
    // Draw Grid
    for (let x = 0; x < this.maxCanvasSize + 1; x += this.cellSize) {
      this.context.moveTo(x, 0);
      this.context.lineTo(x, this.maxCanvasSize);
    }
    for (let y = 0; y < this.maxCanvasSize + 1; y += this.cellSize) {
      this.context.moveTo(0, y);
      this.context.lineTo(this.maxCanvasSize, y);
    }

    this.canvas.addEventListener('mousemove', (evt) => {
      if (this.mouseDown) {
        const mousePos = this.getSquare(this.canvas, evt, this.zoom);
        this.fillSquare(this.context, mousePos.x, mousePos.y)
      }
    })

    this.canvas.onmousedown = () => this.mouseDown = true;
    this.canvas.onmouseup = () => this.mouseDown = false;
    this.context.strokeStyle = 'gray';
    this.context.stroke();
    this.canvas.addEventListener('click', (evt => {
      const mousePos = this.getSquare(this.canvas, evt, this.zoom);
      this.fillSquare(this.context, mousePos.x, mousePos.y)
    }), false);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#canvas-container {
  margin-left: 56px;
}

</style>
