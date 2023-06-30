<script lang="ts">

import Matter from 'matter-js';

export default {
  mounted() {
    // create engine
    const { Collision, Engine, Detector, Render, Events, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies, Body, Vector} = Matter;

    // create engine
    const engine = Engine.create();
    const world = engine.world;

    // world settings
    world.gravity.y = 0;

    // variables
    const container = this.$refs.scene as HTMLElement;

    var selectedBody: any = null;

    var wall: any = null;

    var opener: any = null;
    var opener2: any = null;

    var title = document.getElementById("title") as HTMLElement;

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

    var wallOptions = {
      isStatic: true,
      collisionFilter: {
        category: 0x0001,
        mask: 0x0001
      }
    };

    const thickness = 100;
    const offset = 0;

    function addOpener() {
      opener = Bodies.circle(container.offsetWidth / 2, container.offsetHeight / 2, Math.min(container.offsetHeight, container.offsetWidth) / 5, {
        isStatic: true, 
        render: {
          fillStyle: 'rgba(0, 0, 0, 0.5)'
        }, 
        collisionFilter: {
          category: 0x0002,
          mask: 0x0001
        }
      })
      opener2 = Bodies.circle(container.offsetWidth / 2, container.offsetHeight / 2, Math.min(container.offsetHeight, container.offsetWidth) / 5, {
        isSensor: true,
        isStatic: true, 
        render: {
          fillStyle: 'transparent'
        }, 
        collisionFilter: {
          category: 0x0002,
          mask: 0x0001
        }
      })
      Composite.add(world, opener);
      Composite.add(world, opener2);

    }

    function addWall() {
      wall = [
        Bodies.rectangle(container.offsetWidth / 2, -thickness / 2 + offset, container.offsetWidth, thickness, wallOptions),
        Bodies.rectangle(container.offsetWidth / 2, container.offsetHeight + thickness / 2 - offset, container.offsetWidth, thickness, wallOptions),
        Bodies.rectangle(container.offsetWidth + thickness / 2 - offset, container.offsetHeight / 2, thickness, container.offsetHeight, wallOptions),
        Bodies.rectangle(-thickness / 2 + offset, container.offsetHeight / 2, thickness, container.offsetHeight, wallOptions),
      ];
      Composite.add(world, wall);
    }

    addOpener();
    addWall();

    var resizeHandler = function() {
      render.canvas.width = container.offsetWidth;
      render.canvas.height = container.offsetHeight;

      Composite.remove(world, wall);
      Composite.remove(world, opener);
      Composite.remove(world, opener2);

      addOpener();
      addWall();
    };

    var resizeHandler2 = function() {
      render.canvas.width = container.offsetWidth;
      render.canvas.height = container.offsetHeight;

      Composite.remove(world, wall);
      addWall();
    }

    window.addEventListener('resize', resizeHandler);

    const img: string[] = [
      '/img/cover0.png',
      '/img/cover1.png',
      '/img/cover2.png',
      '/img/cover3.png',
      '/img/cover4.png',
      '/img/cover5.png',
      '/img/cover6.png',
      '/img/cover7.png',
      '/img/cover8.png',
      '/img/cover9.png',
      '/img/cover10.png',
      '/img/cover11.png',
      '/img/cover12.png',
      '/img/cover13.png',
      '/img/cover14.png',
      '/img/cover15.png',
    ]

    let index = 0;

    const bubbles = Composites.stack(64, 64, Math.ceil(Math.sqrt(img.length)), Math.ceil(Math.sqrt(img.length)), 0, 0, function(x: number, y: number) {

      // Check if there's a corresponding string in the array
      if (index < img.length) {

        const bubble = Bodies.circle(x, y, 64, {
          name: 'Object ' + index,
          label: 'bubble',
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
        Body.setVelocity(bubble, velocity);

        return bubble;
      }
    });

    Composite.add(world, bubbles);

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

    

    function checkOverlap() {
      if(selectedBody != null && Collision.collides(selectedBody, opener2) != null && Collision.collides(selectedBody, opener2).collided) {
        title.textContent = selectedBody.name;
      }
      else {
        title.textContent = "Hello Ocean!";
      }
    }

    document.addEventListener("mousemove", checkOverlap);
    document.addEventListener("touchmove", checkOverlap);


    Events.on(mouseConstraint, 'startdrag', function(event: any) {
      if(!event.body.isStatic) {
        selectedBody = event.body;
        selectedBody.collisionFilter.mask = 0x0001;
      }
    });

    Events.on(mouseConstraint, 'enddrag', function() {
      if(selectedBody != null && Collision.collides(selectedBody, opener2) != null && Collision.collides(selectedBody, opener2).collided) {
        Composite.remove(world, opener2);
        window.removeEventListener('resize', resizeHandler);
        document.removeEventListener("mousemove", checkOverlap);
        document.removeEventListener("touchmove", checkOverlap);

        Composite.remove(world, wall);

        selectedBody.collisionFilter.category = 0x0004;
        wallOptions.collisionFilter.mask = 0x0004;
        addWall();
        animate();

        window.addEventListener('resize', resizeHandler2);
      }
      else {
        selectedBody.collisionFilter.mask = 0x0003;
        selectedBody = null;
      }
    });

    function animate() {
      if (opener.circleRadius < Math.sqrt(container.offsetWidth * container.offsetWidth + container.offsetHeight * container.offsetHeight)) {
        const scaleSpeed = 1.01;
        // Set the scale of the object
        Body.scale(opener, scaleSpeed, scaleSpeed, opener.position);
        // Render the changes
        Render.world(render);
        // Request the next animation frame
        requestAnimationFrame(animate);
      } else {
        Composite.remove(world, opener);
        render.options.background = 'rgba(0, 0, 0, 0.5)';

        Composite.allBodies(bubbles).forEach((b: any) => {

          if(b.collisionFilter.category != 0x0004) {
            Composite.remove(bubbles, b);
          }
        })
      }
    }

    this.engine = engine;
    this.runner = runner;
    this.render = render;
    this.canvas = render.canvas;
  },
  beforeUnmount() {
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
      <h1 id="title">
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
  
  // .opener {
  //   position: fixed;
  //   background-color: rgba(0, 0, 0, 0.5);
  //   width: calc(min(100vh, 100vw) / 2.5);
  //   height: calc(min(100vh, 100vw) / 2.5);
  //   border-radius: 50%;
  // }

  .text {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(min(100vh, 100vw) / 2.5);
    height: calc(min(100vh, 100vw) / 2.5);
    color: white;
    text-align: center;
  }
}
</style>