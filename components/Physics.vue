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

    var text = document.getElementById("text") as HTMLElement;
    var title = document.getElementById("title") as HTMLElement;
    var content = document.getElementById("content") as HTMLElement;


    var end = false;

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
      if(!event.body.isStatic && !end) {
        selectedBody = event.body;
        selectedBody.collisionFilter.mask = 0x0001;
      } else if(!event.body.isStatic && end) {
        text.style.pointerEvents = "none";
      }
    });

    Events.on(mouseConstraint, 'enddrag', function() {
      if(selectedBody != null && Collision.collides(selectedBody, opener2) != null && Collision.collides(selectedBody, opener2).collided) {
        end = true;
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
      } else if(selectedBody != null && end) {
        text.style.pointerEvents = "auto";
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

        content.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in fermentum erat. Cras vehicula nisl feugiat massa sollicitudin, at eleifend est faucibus. Proin sit amet ultricies tellus, vitae dapibus diam. Sed hendrerit orci purus, vitae convallis sapien viverra nec. Proin venenatis sapien id lectus consectetur rhoncus. Mauris at fringilla nunc. Nunc non lacus et tellus tristique lacinia. Cras maximus ex mi, sit amet suscipit felis gravida ut. Integer porttitor hendrerit placerat. Donec imperdiet metus nec lectus consectetur, sit amet sagittis tortor cursus. Sed a nisi malesuada, fermentum dui nec, rhoncus dui. Cras nec malesuada felis, id ullamcorper risus. Morbi vestibulum venenatis tellus, at lacinia enim facilisis a. Sed sagittis est sed lacus porta sollicitudin. Vivamus laoreet ligula vitae ante porttitor pharetra.<br><br>Morbi nulla diam, semper a nibh nec, accumsan venenatis tellus. Sed at leo id tellus pellentesque faucibus. Phasellus auctor non nisi vitae placerat. Sed est tellus, porta et purus elementum, vestibulum ornare nibh. Nam blandit velit non vehicula congue. Curabitur vehicula nisl a eros molestie imperdiet. Nullam cursus vel magna at varius. Sed ut tempor leo. Aenean facilisis urna vitae augue condimentum, ac eleifend lectus fringilla. In iaculis dolor in augue hendrerit, quis volutpat enim rhoncus. Nam et diam diam. Aenean eu iaculis nisl.<br><br>Morbi rhoncus convallis quam, a sagittis felis imperdiet at. Vivamus placerat urna elit, et finibus turpis viverra bibendum. Integer consequat id mauris ut finibus. Nulla eget metus turpis. Vestibulum vitae tellus ornare, pulvinar augue quis, feugiat tellus. Suspendisse interdum varius orci, ac tincidunt enim feugiat eu. Donec pretium accumsan ornare. Duis aliquet tortor sit amet tincidunt vulputate. Vestibulum ac gravida orci, eu sollicitudin massa. Sed aliquam, eros id suscipit euismod, metus augue venenatis ex, id condimentum risus libero at orci. Integer accumsan aliquam nisl, non pretium quam tempus id.<br><br>Vivamus at feugiat ex. Sed aliquam est lectus, ac dignissim eros tincidunt eget. Sed eleifend sapien id dui accumsan pretium. Donec pretium mauris elit, sit amet ullamcorper nisl fermentum vel. Pellentesque sed felis massa. Vestibulum a lectus metus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec sodales ex. Ut sodales in massa in volutpat.<br><br>Etiam fringilla eget nisi vitae tincidunt. Fusce pulvinar condimentum dignissim. Curabitur ultrices, mi ac dapibus condimentum, magna sapien varius lorem, bibendum facilisis turpis leo sed lorem. Phasellus suscipit auctor tempor. Nulla sed bibendum dui. Maecenas semper ante tortor, eget pulvinar dolor malesuada vel. Ut vestibulum ex et purus varius placerat. Nunc sit amet tortor ipsum. Morbi dapibus odio nulla, feugiat sodales ex maximus quis. Phasellus interdum nulla id erat volutpat rhoncus. Donec eget tellus commodo, tempus magna sed, faucibus nisl. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras commodo justo in urna suscipit, quis interdum nunc placerat. Etiam massa justo, dapibus nec vehicula in, pharetra nec libero.<br><br>Mauris augue metus, sodales nec nibh vel, hendrerit scelerisque elit. In arcu ipsum, efficitur vitae porta eget, imperdiet nec quam. Etiam quis purus faucibus, accumsan nisi ut, sollicitudin nisl. In nisi ligula, condimentum ac faucibus sit amet, ultricies vel lectus. Nulla in metus accumsan, rhoncus lorem ut, lacinia lorem. Vestibulum feugiat laoreet libero sollicitudin viverra. Aliquam quis nulla quis nunc facilisis pellentesque. Nulla facilisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam semper interdum nisl, at tristique justo malesuada nec. Phasellus mattis ultrices dui eu ullamcorper. Suspendisse efficitur velit scelerisque urna blandit, at cursus tortor commodo. Sed vel odio id augue posuere mattis. Proin nunc purus, sollicitudin sed massa eget, rutrum pretium metus.<br><br>Nullam in commodo mi, ac ullamcorper neque. Pellentesque vehicula eget ante tempus viverra. Aenean ac eleifend massa. Cras volutpat ex et eros ullamcorper, eget gravida purus consectetur. Donec et tempus ligula. Ut interdum massa magna, quis laoreet est posuere nec. Pellentesque sed pellentesque leo. Ut dignissim erat non iaculis vestibulum. Sed non felis enim. Nam tellus erat, efficitur a turpis ac, feugiat facilisis sem. Maecenas efficitur nibh in porta semper.<br><br>Morbi dictum tortor aliquet pharetra pellentesque. Curabitur in felis vel sem faucibus feugiat eu ut ex. Mauris pretium pulvinar libero. Vestibulum nulla est, lacinia nec odio nec, scelerisque venenatis neque. Nunc et egestas nunc. Nunc dignissim ex sed tellus mattis, ut tempus enim elementum. Praesent aliquam venenatis felis ut vulputate. Aenean tristique eros efficitur dolor condimentum dignissim. Cras varius egestas posuere. Integer ac rutrum neque. Praesent eu dui metus. Aliquam ultricies tellus ac elit gravida, eu ullamcorper ipsum pellentesque. Sed quis nulla sed eros fringilla consectetur ut nec ligula.<br><br>Aliquam semper lacus eu porta vehicula. Mauris fringilla ante arcu, eget laoreet mi luctus ac. Etiam eu metus eget nulla consectetur condimentum a eget mi. Phasellus sollicitudin malesuada justo non pretium. Mauris consequat in justo vel convallis. Nulla facilisi. Integer malesuada dolor nulla, ut pharetra nulla faucibus et. Donec in pretium orci. Quisque mattis tempus augue, sit amet tincidunt nisl maximus nec. Fusce venenatis, felis vitae euismod fringilla, lorem erat dictum augue, ut laoreet tellus lorem vitae dolor. Etiam egestas ligula ante, ut euismod lectus cursus et. Vivamus eleifend sagittis libero, quis mollis sapien aliquet at. Nulla et interdum odio, sit amet mattis lorem.<br><br>Nunc tristique semper posuere. Phasellus eu ligula ipsum. Quisque a lacus congue, commodo quam at, tincidunt sem. Nullam id neque dictum, accumsan leo ac, aliquam turpis. Quisque quis imperdiet est, nec convallis ipsum. In non ullamcorper est. Morbi eu venenatis tellus. Integer faucibus sapien nec viverra rutrum. Aliquam vel erat et tellus maximus iaculis. Sed posuere ex vehicula purus blandit imperdiet. Praesent posuere ligula lectus. Aenean sodales molestie maximus. Nullam porttitor erat et eros euismod, pretium posuere lacus porta. In in bibendum mauris. Pellentesque ullamcorper libero quis turpis cursus, et accumsan neque auctor. Curabitur facilisis, mi sit amet consectetur pellentesque, risus ante luctus orci, at lobortis nulla tellus quis libero.";

        text.style.width = "70vw";
        text.style.height = "60vh";
        text.style.overflowY = "scroll";
        text.style.pointerEvents = "auto";
        text.style.textAlign = "left";
        text.style.position = "relative";
        text.style.alignItems = "none";
        text.style.justifyContent = "none";
        text.style.display = "block";

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
  
  // .opener {
  //   position: fixed;
  //   background-color: rgba(0, 0, 0, 0.5);
  //   width: calc(min(100vh, 100vw) / 2.5);
  //   height: calc(min(100vh, 100vw) / 2.5);
  //   border-radius: 50%;
  // }

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