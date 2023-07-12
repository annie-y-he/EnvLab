<script>

import Matter from 'matter-js';

export default {


  setup() {
    const pages = useFetch('http://184.72.214.248/wp-json/wp/v2/pages?_embed').data

    return {
      pages
    }
  },
  mounted() {

    const { Collision, Engine, Bounds, Detector, Render, Events, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies, Body, Vector} = Matter;
    const pages = JSON.parse(JSON.stringify(this.pages));
    const engine = Engine.create();
    const world = engine.world;

    world.gravity.y = 0;

    const container = this.$refs.scene;

    var wall= null;

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

    const runner = Runner.create();
    Runner.run(runner, engine);

    const wallOptions = {
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

    const bubbles = Composite.create();
    Composite.add(world, bubbles);

    var resizeHandler = function() {
      render.canvas.width = container.offsetWidth;
      render.canvas.height = container.offsetHeight;
      updateWall();
      bubbles.bodies.forEach((b) => updateBubble(b));
    };

    window.addEventListener('resize', resizeHandler);

    function calcV(deg, spd) {
      var rad = deg * (Math.PI / 180);

      var xComponent = Math.cos(rad);
      var yComponent = Math.sin(rad);

      var vec = Vector.mult(Vector.normalise(Vector.create(xComponent, yComponent)), spd);

      return vec;
    }



    function createBubble(s, p, degV, spdV, angV, nm, lk, gen = '', pgen = '') {
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
        linkTo: lk,

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

      Composite.add(bubbles, bubble);

      return bubble;
    }

    function updateBubble(b) {
      if (b.label == 'bubble') {
        b.circleRadius = b.size * Math.min(container.offsetHeight, container.offsetWidth);
        b.render.sprite.xScale = 0.25 * b.size * Math.min(container.offsetHeight, container.offsetWidth) / 128;
        b.render.sprite.yScale = 0.25 * b.size * Math.min(container.offsetHeight, container.offsetWidth) / 128;
      }
    }

    function initBubble(){
      var size = 0.25;
      var x = Common.random(0, 1);
      var y = Common.random(0, 1);
      var degree = 45;
      var speed = 0.01;
      var angSpeed = 0.001;
      createBubble(size, { x: (container.offsetWidth) * x, y: (container.offsetHeight) * y }, degree, speed, angSpeed, '8ball', pages.find(o => o.slug == "about").link, 'I');
    
      size = 0.2;
      x = Common.random(0, 1);
      y = Common.random(0, 1);
      degree = 20;
      speed = 0.1;
      angSpeed = 0.0005;
      createBubble(size, { x: (container.offsetWidth) * x, y: (container.offsetHeight) * y }, degree, speed, angSpeed, 'manatee1', pages.find(o => o.slug == "team").link, 'I');
    
      size = 0.2;
      x = Common.random(0, 1);
      y = Common.random(0, 1);
      degree = -120;
      speed = 0.08;
      angSpeed = 0.0007;
      createBubble(size, { x: (container.offsetWidth) * x, y: (container.offsetHeight) * y }, degree, speed, angSpeed, 'manatee2', pages.find(o => o.slug == "team").link, 'I');
    
      size = 0.2;
      x = Common.random(0, 1);
      y = Common.random(0, 1);
      degree = -68;
      speed = 0.04;
      angSpeed = 0.0003;
      createBubble(size, { x: (container.offsetWidth) * x, y: (container.offsetHeight) * y }, degree, speed, angSpeed, 'manatee3', pages.find(o => o.slug == "team").link, 'I');
    

      size = 0.264;
      x = Common.random(0, 1);
      y = Common.random(0, 1);
      degree = 389;
      speed = 0.0642;
      angSpeed = 0.000234;
      createBubble(size, { x: (container.offsetWidth) * x, y: (container.offsetHeight) * y }, degree, speed, angSpeed, 'argonaut', pages.find(o => o.slug == "jjs").link, 'I');

      size = 0.245;
      x = Common.random(0, 1);
      y = Common.random(0, 1);
      degree = 147;
      speed = 0.0478;
      angSpeed = -0.000157;
      createBubble(size, { x: (container.offsetWidth) * x, y: (container.offsetHeight) * y }, degree, speed, angSpeed, 'warming', pages.find(o => o.slug == "publications").link, 'I');

      size = 0.245;
      x = Common.random(0, 1);
      y = Common.random(0, 1);
      degree = Common.random(0, 360);
      speed = Common.random(0, 0.005);
      angSpeed = Common.random(-0.0003, 0.0003);
      createBubble(size, { x: (container.offsetWidth) * x, y: (container.offsetHeight) * y }, degree, speed, angSpeed, 'pyramid', pages.find(o => o.slug == "team").link, 'I');
    }

    Events.on(engine, 'beforeUpdate', function() {
      if (bubbles.bodies.length < 4 ) {
        initBubble();
      }
    })

    window.addEventListener('mousedown', clickHandler);

    function clickHandler(event) {
      const { pageX, pageY } = event;
      const clickedPosition = { x: pageX, y: pageY };

      bubbles.bodies.forEach(bubble => {
        if (Bounds.contains(bubble.bounds, clickedPosition)) {
          window.location.href = bubble.linkTo;
        }
      });

    }

    window.addEventListener('mousemove', hoverHandler);

    function hoverHandler(event) {
      container.style.cursor = 'default';
      const { pageX, pageY } = event;
      const hoverPosition = { x: pageX, y: pageY };

      bubbles.bodies.forEach(bubble => {
        if (Bounds.contains(bubble.bounds, hoverPosition)) {
          container.style.cursor = 'pointer';
        }
      });
    }


    Events.on(engine, 'collisionStart', function(event) {
      for (var i = 0; i < event.pairs.length; i++) {
        var bubbleObj;
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
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'B', 'R');
          } else if (Collision.collides(bubbleObj, world.bodies[3])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'B', 'L');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'B', '');
          }
          
          Body.setPosition(bubble, { x: bubbleObj.position.x, y: bubbleObj.position.y + container.offsetHeight });
          // Body.setVelocity(bubble, bubbleObj.velocity);
          Body.setAngle(bubble, bubbleObj.angle);
        } else if (wallObj.name == 'wallB' && bubbleObj.generator != 'B' && bubbleObj.prevGen != 'B') {
          if (Collision.collides(bubbleObj, world.bodies[2])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'T', 'R');
          } else if (Collision.collides(bubbleObj, world.bodies[3])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'T', 'L');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'T', '');
          }
          Body.setPosition(bubble, { x: bubbleObj.position.x, y: bubbleObj.position.y - container.offsetHeight });
          // Body.setVelocity(bubble, bubbleObj.velocity);
          Body.setAngle(bubble, bubbleObj.angle);
        } else if (wallObj.name == 'wallR' && bubbleObj.generator != 'R' && bubbleObj.prevGen != 'R') {
          if (Collision.collides(bubbleObj, world.bodies[0])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'L', 'T');
          } else if (Collision.collides(bubbleObj, world.bodies[1])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'L', 'B');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'L', '');
          }
          Body.setPosition(bubble, { x: bubbleObj.position.x - container.offsetWidth, y: bubbleObj.position.y });
          // Body.setVelocity(bubble, bubbleObj.velocity);
          Body.setAngle(bubble, bubbleObj.angle);
        } else if (wallObj.name == 'wallL' && bubbleObj.generator != 'L' && bubbleObj.prevGen != 'L') {
          if (Collision.collides(bubbleObj, world.bodies[0])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'R', 'T');
          } else if (Collision.collides(bubbleObj, world.bodies[1])) {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'R', 'B');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: container.offsetWidth/2, y: container.offsetHeight/2 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'R', '');
          }
          Body.setPosition(bubble, { x: bubbleObj.position.x + container.offsetWidth, y: bubbleObj.position.y });
          // Body.setVelocity(bubble, bubbleObj.velocity);
          Body.setAngle(bubble, bubbleObj.angle);

        }
      }

    });

    Events.on(engine, 'collisionEnd', function(event) {
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

        if (wallObj.name == 'wallT' && bubbleObj.generator != 'T' && bubbleObj.prevGen != 'T' && bubbleObj.generator != 'I') {
          Composite.remove(bubbles, bubbleObj);
        } else if (wallObj.name == 'wallB' && bubbleObj.generator != 'B' && bubbleObj.prevGen != 'B' && bubbleObj.generator != 'I') {
          Composite.remove(bubbles, bubbleObj);
        } else if (wallObj.name == 'wallR' && bubbleObj.generator != 'R' && bubbleObj.prevGen != 'R' && bubbleObj.generator != 'I') {
          Composite.remove(bubbles, bubbleObj);
        } else if (wallObj.name == 'wallL' && bubbleObj.generator != 'L' && bubbleObj.prevGen != 'L' && bubbleObj.generator != 'I') {
          Composite.remove(bubbles, bubbleObj);
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
      engine: null,
      runner: null,
      render: null,
      canvas: null,
    };
  }
};

</script>

<template>

  <div class="overlay">

    <div class="text" id="text">
      <h1 id="title">
        {{ pages.find(page => page.slug === 'home').title.rendered }}
      </h1>
      <p id="content">
        drag and drop to open
      </p>
    </div>

  </div>

  <div ref="scene" class="physics"></div>

  <div class="underlay">
    <img :src="pages.find(page => page.slug === 'home')._embedded['wp:featuredmedia'][0].source_url" alt="Featured Image" class="cover" />
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
  .cover {
    margin: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

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