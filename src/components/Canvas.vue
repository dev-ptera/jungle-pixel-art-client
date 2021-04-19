<template>
    <div id="canvas-container">
      <canvas id="myCanvas" width="10000" height="10000">sdgasd</canvas>
    </div>
</template>

<script>
export default {
  name: 'Canvas',
  data() {
    return {
      zoom: .5,
      fillSquare(context, x, y) {
        context.fillStyle = 'gray';
        context.fillRect(x, y, 9, 9);
      },
      getSquare(canvas, evt, zoom) {
        const rect = canvas.getBoundingClientRect();
        console.log(rect);
        return {
          x: 1 + (evt.clientX/zoom - rect.left) - (evt.clientX/zoom - rect.left)%10,
          y: 1 + (evt.clientY/zoom - rect.top) - (evt.clientY/zoom - rect.top)%10
        }
      },
    }
  },
  mounted() {
    this.emitter.on("zoom", zoom => {
      this.zoom = zoom;
      const canvas = document.getElementById('myCanvas');
      canvas.style.zoom = `${this.zoom }`;
    });

    // https://stackoverflow.com/questions/28576966/draw-clickable-grid-of-1-million-squares
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    canvas.style.zoom = this.zoom;
    this.canvas = canvas;
    this.context = context;
    // Draw Grid
    for (let x = 0; x < 10001; x += 10) {
      context.moveTo(x, 0);
      context.lineTo(x, 10000);
    }
    for (let y = 0; y < 10001; y += 10) {
      context.moveTo(0, y);
      context.lineTo(10000, y);
    }

    context.strokeStyle = 'green';
    context.stroke();
    canvas.addEventListener('click', (evt => {
      const mousePos = this.getSquare(canvas, evt, this.zoom);
      this.fillSquare(context, mousePos.x, mousePos.y)
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
