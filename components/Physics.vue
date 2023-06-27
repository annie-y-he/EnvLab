<script lang="ts">

import Matter from 'matter-js';

export default {
  mounted() {
    // create engine
    const { Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies, Body, Vector, Svg, Vertices} = Matter;

    // create engine
    const engine = Engine.create();
    const world = engine.world;

    // world settings
    world.gravity.y = 0;
    
    const container = this.$refs.scene as HTMLElement;


    // create renderer
    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: container.offsetWidth,
        height: container.offsetHeight,
        showAngleIndicator: false,
        wireframes: false,
        background: 'transparent',
      }
    });

    Render.run(render);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    const offset = 10;
    const thickness = 100;
    const options = {
      isStatic: true
    };

    world.bodies = [];

    // these static walls will not be rendered in this sprites example, see options
    Composite.add(world, [
      Bodies.rectangle(container.offsetWidth / 2, -thickness / 2 + offset, container.offsetWidth, thickness, options),
      Bodies.rectangle(container.offsetWidth / 2, container.offsetHeight + thickness / 2 - offset, container.offsetWidth, thickness, options),
      Bodies.rectangle(container.offsetWidth + thickness / 2 - offset, container.offsetHeight / 2, thickness, container.offsetHeight, options),
      Bodies.rectangle(-thickness / 2 + offset, container.offsetHeight / 2, thickness, container.offsetHeight, options),
    ]);

    const resizeHandler = () => {
      // Update options with new dimensions
      render.canvas.width = container.offsetWidth;
      render.canvas.height = container.offsetHeight;

      // Update the positions of the static walls
      Composite.remove(world, world.bodies); // Remove the existing walls

      Composite.add(world, [
        Bodies.rectangle(container.offsetWidth / 2, -thickness / 2 + offset, container.offsetWidth, thickness, options),
        Bodies.rectangle(container.offsetWidth / 2, container.offsetHeight + thickness / 2 - offset, container.offsetWidth, thickness, options),
        Bodies.rectangle(container.offsetWidth + thickness / 2 - offset, container.offsetHeight / 2, thickness, container.offsetHeight, options),
        Bodies.rectangle(-thickness / 2 + offset, container.offsetHeight / 2, thickness, container.offsetHeight, options),
      ]);
    };

    window.addEventListener('resize', resizeHandler);

    const img: string[] = [
      '/img/cover0.png',
      '/img/cover1.png',
      '/img/cover2.png',
      '/img/cover3.png',
      '/img/cover4.png',
      '/img/cover5.png',
      '/img/cover6.png',
      '/img/cover0.png',
      '/img/cover1.png',
      '/img/cover2.png',
      '/img/cover3.png',
      '/img/cover4.png',
      '/img/cover5.png',
      '/img/cover6.png',
      '/img/cover5.png',
      '/img/cover6.png',
    ]

    const numStrings = img.length;
    const gridSize = Math.ceil(Math.sqrt(numStrings));
    let index = 0;

    const stack = Composites.stack(64, 64, gridSize, gridSize, 0, 0, function(x: number, y: number) {

      console.log(index);

      // Check if there's a corresponding string in the array
      if (index < numStrings) {

        const ball = Bodies.circle(x, y, 64, {
          density: 0.0005,
          frictionAir: 0.0001,
          restitution: 0.5,
          friction: 0.5,
          render: {
            strokeStyle: 'transparent',
            sprite: {
              texture: img[index++],
              xScale: 1/8,
              yScale: 1/8,
            }
          }
        });

        const velocity = Vector.create(Common.random(-3, 3), Common.random(-3, 3));
        Body.setVelocity(ball, velocity);

        return ball;
      }
    });

    Composite.add(world, stack);

    // add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: container.offsetWidth, y: container.offsetHeight }
    });

    // context for MatterTools.Demo
    this.engine = engine;
    this.runner = runner;
    this.render = render;
    this.canvas = render.canvas;
  },
  beforeUnmount() {
    // Stop the rendering and the runner when the component is unmounted
    Matter.Render.stop(this.render);
    Matter.Runner.stop(this.runner);
  },
  data() {
    return {
      engine: null as any,
      runner: null as any,
      render: null as any,
      canvas: null as any
    };
  }
};

</script>

<template>

  <div ref="scene" class="physics"></div>

  <div class="overlay">
    <div class="opener">
      <h1>
        Hello Ocean!
      </h1>
    </div>
  </div>

</template>

<style scoped lang="scss">

.physics {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}

.overlay {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  text-align: center;
  z-index: 1;
  background-image: url('/img/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .opener{
    background-color: rgba(44, 89, 78, 0.518);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    width: 300px;
    border-radius: 150px;
  }
  h1 {
    color: white;
  }
}

</style>