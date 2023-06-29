<script lang="ts">

import Matter from 'matter-js';

export default {
  mounted() {
    // create engine
    const { Engine, Render, Events, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies, Body, Vector, Svg, Vertices} = Matter;

    // create engine
    const engine = Engine.create();
    const world = engine.world;

    // world settings
    world.gravity.y = 0;
    
    const container = this.$refs.scene as HTMLElement;

    let selectedBody: any = null;


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

    world.bodies = [];

    function addStatic(offset: number, thickness: number) {
      const wallOptions = {
        isStatic: true,
        collisionFilter: {
          category: 0x0001,
          mask: 0x0001
        }
      };

      Composite.add(world, [
        Bodies.rectangle(container.offsetWidth / 2, -thickness / 2 + offset, container.offsetWidth, thickness, wallOptions),
        Bodies.rectangle(container.offsetWidth / 2, container.offsetHeight + thickness / 2 - offset, container.offsetWidth, thickness, wallOptions),
        Bodies.rectangle(container.offsetWidth + thickness / 2 - offset, container.offsetHeight / 2, thickness, container.offsetHeight, wallOptions),
        Bodies.rectangle(-thickness / 2 + offset, container.offsetHeight / 2, thickness, container.offsetHeight, wallOptions),
        Bodies.circle(container.offsetWidth / 2, container.offsetHeight / 2, Math.min(container.offsetHeight, container.offsetWidth) / 5, {
          isStatic: true, 
          render: {
            fillStyle: 'transparent'
          }, 
          collisionFilter: {
            category: 0x0002,
            mask: 0x0001
          }
        }),
      ]);
    }

    addStatic(0, 100);

    const resizeHandler = () => {
      render.canvas.width = container.offsetWidth;
      render.canvas.height = container.offsetHeight;

      Composite.remove(world, world.bodies);

      addStatic(0, 100);
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

    let index = 0;

    const stack = Composites.stack(64, 64, Math.ceil(Math.sqrt(img.length)), Math.ceil(Math.sqrt(img.length)), 0, 0, function(x: number, y: number) {

      console.log(index);

      // Check if there's a corresponding string in the array
      if (index < img.length) {

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
          },
          collisionFilter: {
            category: 0x0001, // Assign a custom collision group
            mask: 0x0003, // Assign a custom collision mask
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
        },
        collisionFilter: {
          category: 0x0001,
          mask: 0x0001
        }
      }
    });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    Events.on(engine, 'beforeUpdate', function() {
      if (selectedBody != null) {
        // Ignore collisions between selectedBody and the circle
        selectedBody.collisionFilter.mask = 0x0001;
      } else {
        // Allow collisions between all bodies
        Composite.allBodies(stack).forEach((body: any) => {
          body.collisionFilter.mask = 0x0003;
        });
      }
    });

    Events.on(mouseConstraint, 'startdrag', function(event: any) {
      selectedBody = event.body;
    });

    Events.on(mouseConstraint, 'enddrag', function() {
      selectedBody = null;
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

  <div class="overlay">

    <div class="opener"></div>

    <div class="text">
      <h1>
        Hello Ocean!
      </h1>
      <p>
        drag and drop to open
      </p>
    </div>

  </div>

  <div ref="scene" class="physics"></div>

  <div class="underlay">
  </div>

</template>

<style scoped lang="scss">

.physics {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 2;
}

.underlay {
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
}

.overlay {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 10;
  
  .opener {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.5);
    width: calc(min(100vh, 100vw) / 2.5);
    height: calc(min(100vh, 100vw) / 2.5);
    border-radius: 50%;
  }

  .text {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(min(100vh, 100vw) / 2.5);
    height: calc(min(100vh, 100vw) / 2.5);
    color: white;
  }
}
</style>