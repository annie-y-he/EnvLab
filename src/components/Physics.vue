<script>

  import Matter from 'matter-js';

  export default {
    mounted() {
      // create engine
      const { Engine, Render, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies, Vector } = Matter;
      const engine = Engine.create();
      const world = engine.world;
      world.gravity.y = 0;

      // create renderer
      const render = Render.create({
        element: this.$refs.scene,
        engine: engine,
        options: {
          width: 800,
          height: 600,
          showAngleIndicator: false,
          wireframes: false
        }
      });

      Render.run(render);

      // create runner
      const runner = Runner.create();
      Runner.run(runner, engine);

      // add bodies
      const offset = 10;
      const options = {
        isStatic: true
      };

      world.bodies = [];

      // these static walls will not be rendered in this sprites example, see options
      Composite.add(world, [
        Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, options),
        Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
        Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, options),
        Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options)
      ]);

      const stack = Composites.stack(20, 20, 10, 4, 0, 0, function(x, y) {
        if (Common.random() > 0.35) {
          const box = Bodies.rectangle(x, y, 64, 64, {
            density: 0.0005,
            frictionAir: 0,
            restitution: 1,
            friction: 0,
            render: {
              strokeStyle: 'transparent',
              sprite: {
                texture: './src/components/img/box.png'
              }
            }
          });

          const velocity = Vector.create(Common.random(-2, 2), Common.random(-2, 2));
          Matter.Body.setVelocity(box, velocity);

          return box;
        } else {
          const ball = Bodies.circle(x, y, 46, {
            density: 0.0005,
            frictionAir: 0,
            restitution: 1,
            friction: 0,
            render: {
              strokeStyle: 'transparent',
              sprite: {
                texture: './src/components/img/ball.png'
              }
            }
          });

          const velocity = Vector.create(Common.random(-2, 2), Common.random(-2, 2));
          Matter.Body.setVelocity(ball, velocity);

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
        max: { x: 800, y: 600 }
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
        engine: null,
        runner: null,
        render: null,
        canvas: null
      };
    }
  };

</script>

<template>

  <div ref="scene"></div>

</template>

<style scoped>

  #app {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>