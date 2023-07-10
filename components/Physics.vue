<script lang="ts">

import Matter from 'matter-js';

export default {
  mounted() {
    const { Collision, Engine, Detector, Render, Events, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies, Body, Vector} = Matter;

    const engine = Engine.create();
    const world = engine.world;

    world.gravity.y = 0;

    const container = this.$refs.scene as HTMLElement;

    var wall: any = null;

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
      label: 'wall',
      isStatic: true,
      isSensor: true,
      collisionFilter: {
        category: 0x0001,
        mask: 0x0002
      },
      frictionAir: 0,
      restitution: 1,
      friction: 0,
    };

    const thickness = 100;
    const offset = 0;

    function addWall() {
      wall = [
        Bodies.rectangle(
          container.offsetWidth / 2, 
          -thickness / 2 + offset, 
          container.offsetWidth, 
          thickness, 
          {...wallOptions, name: 'wallT'}
        ),
        Bodies.rectangle(
          container.offsetWidth / 2, 
          container.offsetHeight + thickness / 2 - offset, 
          container.offsetWidth, thickness, 
          {...wallOptions, name: 'wallB'}
        ),
        Bodies.rectangle(container.offsetWidth + thickness / 2 - offset,
          container.offsetHeight / 2,
          thickness,
          container.offsetHeight,
          {...wallOptions, name: 'wallR'}
        ),
        Bodies.rectangle(-thickness / 2 + offset,
          container.offsetHeight / 2,
          thickness,
          container.offsetHeight,
          {...wallOptions, name: 'wallL'}
        ),
      ];
      Composite.add(world, wall);
    }

    addWall();

    function updateWall() {

      const H = container.offsetHeight;
      const W = container.offsetWidth;
      const T = thickness;
      const O = offset;

      world.bodies[0].vertices = [
        {x: 0, y: -T + O}, 
        {x: W, y: -T + O}, 
        {x: W, y: O}, 
        {x: 0, y: O}
      ];
      world.bodies[1].vertices = [
        {x: 0, y: H - O}, 
        {x: W, y: H - O}, 
        {x: W, y: H+T-O}, 
        {x: 0, y: H+T-O}
      ];
      world.bodies[2].vertices = [
        {x: W - O, y: 0}, 
        {x: W + T - O, y: 0}, 
        {x: W + T - O, y: H}, 
        {x: W - O, y: H}
      ];
      world.bodies[3].vertices = [
        {x: -T + O, y: 0}, 
        {x: O, y: 0}, 
        {x: O, y: H}, 
        {x: -T + O, y: H}
      ];

    }

    var resizeHandler = function() {
      render.canvas.width = container.offsetWidth;
      render.canvas.height = container.offsetHeight;
      updateWall();
      world.bodies.forEach((b: any) => updateSize(b));
    };

    window.addEventListener('resize', resizeHandler);

    function calcV(deg: number, spd: number) {
      var rad = deg * (Math.PI / 180);

      var xComponent = Math.cos(rad);
      var yComponent = Math.sin(rad);

      var vec = Vector.mult(Vector.normalise(Vector.create(xComponent, yComponent)), spd);

      console.log(vec);
      console.log(spd);

      return vec;
    }

    function createBubble(s: number, p: any, degV: number, spdV: number, angV: number, nm: string, gen: string = '', pgen: string = '') {
      const bubble = Bodies.circle(p.x, p.y, s * Math.min(container.offsetHeight, container.offsetWidth), {
        name: nm,
        angle: 0,
        label: 'bubble',
        generator: gen,
        prevGen: pgen,
        size: s,
        myDegree: degV,
        mySpeed: spdV,
        myAngV: angV,

        density: 0.0005,
        frictionAir: 0,
        restitution: 1,
        friction: 0,
        
        render: {
          strokeStyle: 'transparent',
          sprite: {
            texture: '/img/' + nm + '.png',
            xScale: 0.25 * s * Math.min(container.offsetHeight, container.offsetWidth) / 128,
            yScale: 0.25 * s * Math.min(container.offsetHeight, container.offsetWidth) / 128,
          }
        },
        collisionFilter: {
          category: 0x0002,
          mask: 0x0001,
        },
      });
      Body.setVelocity(bubble, calcV(degV, spdV));
      Body.setAngularVelocity(bubble, angV);

      Composite.add(world, bubble);

      return bubble;
    }

    function updateSize(b: any) {
      if (b.label == 'bubble') {
        b.circleRadius = b.size * Math.min(container.offsetHeight, container.offsetWidth);
        b.render.sprite.xScale = 0.25 * b.size * Math.min(container.offsetHeight, container.offsetWidth) / 128;
        b.render.sprite.yScale = 0.25 * b.size * Math.min(container.offsetHeight, container.offsetWidth) / 128;
      }
    }


    for (var i = 0; i < 8; i++) {
      const margin = 200;
      const degree = 45;
      const speed = 0.5;
      const angSpeed = 0.001;
      createBubble(Common.random(0.1, 0.3), { x: Common.random(margin, container.offsetWidth - margin), y: Common.random(margin, container.offsetHeight - margin) }, Common.random(-degree, degree), Common.random(-speed, speed), Common.random(-angSpeed, angSpeed), '8ball');

    }

    Events.on(engine, 'collisionStart', function(event: any) {
      for (var i = 0; i < event.pairs.length; i++) {
        var bubbleObj: any;
        var wallObj;
        if (event.pairs[i].bodyA.label == 'bubble' && event.pairs[i].bodyB.label == 'wall') {
          bubbleObj = event.pairs[i].bodyA;
          wallObj = event.pairs[i].bodyB;
        }
        else if (event.pairs[i].bodyB.label == 'bubble' && event.pairs[i].bodyA.label == 'wall') {
          bubbleObj = event.pairs[i].bodyB;
          wallObj = event.pairs[i].bodyA;
        }

        if (wallObj.name == 'wallT' && bubbleObj.generator != 'T' && bubbleObj.prevGen != 'T') {
          if (Collision.collides(bubbleObj, world.bodies[2])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'B', 'R');
          } else if (Collision.collides(bubbleObj, world.bodies[3])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'B', 'L');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'B', '');
          }
          
          Body.setPosition(bubble, { x: bubbleObj.position.x, y: bubbleObj.position.y + container.offsetHeight });
          // Body.setVelocity(bubble, bubbleObj.velocity);
          Body.setAngle(bubble, bubbleObj.angle);
        } else if (wallObj.name == 'wallB' && bubbleObj.generator != 'B' && bubbleObj.prevGen != 'B') {
          if (Collision.collides(bubbleObj, world.bodies[2])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'T', 'R');
          } else if (Collision.collides(bubbleObj, world.bodies[3])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'T', 'L');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'T', '');
          }
          Body.setPosition(bubble, { x: bubbleObj.position.x, y: bubbleObj.position.y - container.offsetHeight });
          // Body.setVelocity(bubble, bubbleObj.velocity);
          Body.setAngle(bubble, bubbleObj.angle);
        } else if (wallObj.name == 'wallR' && bubbleObj.generator != 'R' && bubbleObj.prevGen != 'R') {
          if (Collision.collides(bubbleObj, world.bodies[0])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'L', 'T');
          } else if (Collision.collides(bubbleObj, world.bodies[1])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'L', 'B');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'L', '');
          }
          Body.setPosition(bubble, { x: bubbleObj.position.x - container.offsetWidth, y: bubbleObj.position.y });
          // Body.setVelocity(bubble, bubbleObj.velocity);
          Body.setAngle(bubble, bubbleObj.angle);
        } else if (wallObj.name == 'wallL' && bubbleObj.generator != 'L' && bubbleObj.prevGen != 'L') {
          if (Collision.collides(bubbleObj, world.bodies[0])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'R', 'T');
          } else if (Collision.collides(bubbleObj, world.bodies[1])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'R', 'B');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'R', '');
          }
          Body.setPosition(bubble, { x: bubbleObj.position.x + container.offsetWidth, y: bubbleObj.position.y });
          // Body.setVelocity(bubble, bubbleObj.velocity);
          Body.setAngle(bubble, bubbleObj.angle);

        }
      }

    });

    Events.on(engine, 'collisionEnd', function(event: any) {
      for (var i = 0; i < event.pairs.length; i++) {
        var bubbleObj;
        var wallObj;
        if (event.pairs[i].bodyA.label == 'bubble') {
          bubbleObj = event.pairs[i].bodyA;
          wallObj = event.pairs[i].bodyB;
        }
        else {
          bubbleObj = event.pairs[i].bodyB;
          wallObj = event.pairs[i].bodyA;
        }

        if (wallObj.name == 'wallT' && bubbleObj.generator != 'T' && bubbleObj.prevGen != 'T') {
          Composite.remove(world, bubbleObj);
        } else if (wallObj.name == 'wallB' && bubbleObj.generator != 'B' && bubbleObj.prevGen != 'B') {
          Composite.remove(world, bubbleObj);
        } else if (wallObj.name == 'wallR' && bubbleObj.generator != 'R' && bubbleObj.prevGen != 'R') {
          Composite.remove(world, bubbleObj);
        } else if (wallObj.name == 'wallL' && bubbleObj.generator != 'L' && bubbleObj.prevGen != 'L') {
          Composite.remove(world, bubbleObj);
        }
      }
    });

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

    <div class="text" id="text">
      <h1 id="title">
        Hello Ocean!
      </h1>
      <p id="content">
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

  .text {
    padding: 2vw;
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(min(100vh, 100vw) / 2.5);
    height: calc(min(100vh, 100vw) / 2.5);
    color: white;
    text-align: center;
    scrollbar-width: 5px;
  }
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #ffffffb0;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #000000a4;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #000000;
}
</style>