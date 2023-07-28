<script>

import Matter from 'matter-js';

export default {

  setup() {
    const pages = useFetch('http://44.207.42.197/wp-json/wp/v2/pages?_embed').data
    const media = useFetch('http://44.207.42.197/wp-json/wp/v2/media').data

    return {
      pages,
      media
    }
  },
  mounted() {

    const { Collision, Engine, Bounds, Detector, Render, Events, Runner, Composites, Common, MouseConstraint, Mouse, Composite, Bodies, Body, Vector} = Matter;
    const pages = JSON.parse(JSON.stringify(this.pages));
    const media = JSON.parse(JSON.stringify(this.media));
    const links = document.getElementById("menu");
    const text = document.getElementById("homePage");


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



    function createBubble(s, p, degV, spdV, angV, nm, gen = '', pgen = '') {
      var tex, lk;

      if (typeof nm == 'string') {
        tex = pages.find(p => p.slug == nm)._embedded['wp:featuredmedia'][0].source_url;
        lk = pages.find(o => o.slug == nm).link;
      } else {
        tex = nm.source_url;
        lk = ''
      }

      const bubble = Bodies.circle(p.x * container.offsetWidth, p.y * container.offsetHeight, s * Math.min(container.offsetHeight, container.offsetWidth), {
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
            texture: tex,
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
      var size, x, y, degree, speed, angSpeed;

      Common._seed = 6;

      media.forEach(item => {
        size = Common.random(0.1, 0.15);
        x = Common.random(0, 0.55);
        y = Common.random(0.15, 0.85);
        degree = Common.random(0, 360);
        speed = Common.random(0, 0.1);
        angSpeed = Common.random(-0.001, 0.001);

        if (pages.find(p => p.slug == 'home').id == item.post && item.id != pages.find(p => p.slug == 'home')._embedded['wp:featuredmedia'][0].id) {
          createBubble(size, { x: x, y: y }, degree, speed, angSpeed, item, 'I');
        }
      });

      size = 0.25;
      x = 0.2;
      y = 0.25;
      degree = 45;
      speed = 0.01;
      angSpeed = 0.001;
      createBubble(size, { x: x, y: y }, degree, speed, angSpeed, 'about', 'I');
    
      size = 0.2;
      x = 0.4;
      y = 0.3;
      degree = -53;
      speed = 0.15;
      angSpeed = 0.0005;
      createBubble(size, { x: x, y: y }, degree, speed, angSpeed, 'team', 'I');
    
      size = 0.15;
      x = 0.8;
      y = 0.45;
      degree = 389;
      speed = 0.0642;
      angSpeed = 0.000234;
      createBubble(size, { x: x, y: y }, degree, speed, angSpeed, 'jjs', 'I');

      size = 0.245;
      x = 0.6;
      y = 0.7;
      degree = 147;
      speed = 0.0478;
      angSpeed = -0.000157;
      createBubble(size, { x: x, y: y }, degree, speed, angSpeed, 'publications', 'I');
    }


    initBubble();

    window.addEventListener('mousedown', clickHandler);

    function clickHandler(event) {
      const { pageX, pageY } = event;
      const clickedPosition = { x: pageX, y: pageY };

      bubbles.bodies.forEach(bubble => {
        if (Bounds.contains(bubble.bounds, clickedPosition) && bubble.linkTo != '' && !text.contains(document.elementFromPoint(pageX, pageY))) {
          window.location.href = bubble.linkTo;
        }
      });
    }

    window.addEventListener('mousemove', hoverHandler);


    function hoverHandler(event) {
      const { pageX, pageY } = event;
      const hoverPosition = { x: pageX, y: pageY };
      if (!text.contains(document.elementFromPoint(pageX, pageY))) {
        container.style.cursor = 'default';
        for (let i = 0; i < links.children.length; i++) {
          links.children[i].style.color = '';
        }
        for (const bubble of bubbles.bodies) {
          if (Bounds.contains(bubble.bounds, hoverPosition) && bubble.linkTo != '' ) {
            container.style.cursor = 'pointer';
            document.getElementById(bubble.name).style.color = 'yellow';
            break;
          }
        }
      } else {
        for (let i = 0; i < links.children.length; i++) {
          links.children[i].style.color = '';
        }
      }

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
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'B', 'R');
          } else if (Collision.collides(bubbleObj, world.bodies[3])) {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'B', 'L');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'B', '');
          }
          
          Body.setPosition(bubble, { x: bubbleObj.position.x, y: bubbleObj.position.y + container.offsetHeight });
          Body.setAngle(bubble, bubbleObj.angle);
        } else if (wallObj.name == 'wallB' && bubbleObj.generator != 'B' && bubbleObj.prevGen != 'B') {
          if (Collision.collides(bubbleObj, world.bodies[2])) {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'T', 'R');
          } else if (Collision.collides(bubbleObj, world.bodies[3])) {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'T', 'L');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, 'T', '');
          }
          Body.setPosition(bubble, { x: bubbleObj.position.x, y: bubbleObj.position.y - container.offsetHeight });
          Body.setAngle(bubble, bubbleObj.angle);
        } else if (wallObj.name == 'wallR' && bubbleObj.generator != 'R' && bubbleObj.prevGen != 'R') {
          if (Collision.collides(bubbleObj, world.bodies[0])) {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'L', 'T');
          } else if (Collision.collides(bubbleObj, world.bodies[1])) {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'L', 'B');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'L', '');
          }
          Body.setPosition(bubble, { x: bubbleObj.position.x - container.offsetWidth, y: bubbleObj.position.y });
          Body.setAngle(bubble, bubbleObj.angle);
        } else if (wallObj.name == 'wallL' && bubbleObj.generator != 'L' && bubbleObj.prevGen != 'L') {
          if (Collision.collides(bubbleObj, world.bodies[0])) {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'R', 'T');
          } else if (Collision.collides(bubbleObj, world.bodies[1])) {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'R', 'B');
          } else {
            var bubble = createBubble(bubbleObj.size, { x: 0.5, y: 0.5 }, bubbleObj.myDegree, bubbleObj.mySpeed, bubbleObj.myAngV, bubbleObj.name, bubbleObj.linkTo, 'R', '');
          }
          Body.setPosition(bubble, { x: bubbleObj.position.x + container.offsetWidth, y: bubbleObj.position.y });
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

    <div id="homePage">
      <div id="left">
        <h1 id="title">
          {{ pages.find(page => page.slug === 'home').title.rendered }}
        </h1>
        <CustomFooter id="homeFooter"/>
      </div>

      <p id="menu">
        <a :href="pages.find(page => page.slug === 'about').link" id="about">
          {{ pages.find(page => page.slug === 'about').title.rendered }}
        </a>
        <a :href="pages.find(page => page.slug === 'jjs').link" id="jjs">
          {{ pages.find(page => page.slug === 'jjs').title.rendered }}
        </a>
        <a :href="pages.find(page => page.slug === 'publications').link" id="publications">
          {{ pages.find(page => page.slug === 'publications').title.rendered }}
        </a>
        <a :href="pages.find(page => page.slug === 'team').link" id="team">
          {{ pages.find(page => page.slug === 'team').title.rendered }}
        </a>
      </p>
    </div>

  </div>

  <div ref="scene" class="physics"></div>

  <div class="underlay">
    <img :src="pages.find(page => page.slug === 'home')._embedded['wp:featuredmedia'][0].source_url" alt="Featured Image" class="cover" />
  </div>

</template>

<style scoped lang="scss">

@import '@/styles/media.scss';

.physics {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 2;
}

.overlay {
  height: 30vh;

  #homePage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: white;

    #left {
      width: 60%;
      height: 100%;
      padding: 10px;
      padding-left: 10%;
      display: flex;
      flex-direction: column;

      @media (max-width: $bpw-phone) {
        padding-left: 0;
      }

      #title {
        height: 3em;
        font-size: 24px;
        flex-basis: 50%;
        text-transform: uppercase;

        @media (max-width: $bpw-phone) {
          padding-left: 10px;
        }

      }
      
      #homeFooter {
        flex-basis: 50%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 20px;
      }
    }

    #menu {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 40%;
      height: 100%;
      padding: 1%;
      padding-right: 10%;

      @media (max-width: $bpw-phone) {
        padding-right: 10px;
      }

      a {
        align-self: flex-end;
        display: block;
        margin: 0.25em;
        width: fit-content;
        height: fit-content;
        text-align: right;
        text-decoration: none;
        text-transform: uppercase;

        &:hover {
          color: rgb(255, 128, 0);
        }
      }
    }
  }
}
</style>