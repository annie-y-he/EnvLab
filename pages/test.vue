<script>
import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "~/shaders/vertex.glsl?raw";
import fragmentShader from "~/shaders/fragment.glsl?raw";
import img from "/assets/test.png";

export default {
  setup() {
    const pages = useFetch('http://184.72.214.248/wp-json/wp/v2/pages?_embed').data

    return {
      pages,
    }
  },
  mounted() {
    class Gl {
      constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.1,
          100
        );

        this.camera.position.z = 1;
        this.renderer = new THREE.WebGLRenderer({
          canvas: document.querySelector("#app"),
          antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x336633, 0);

        this.clock = new THREE.Clock();

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.onResize();
      }

      init() {
        this.createMesh();
        this.addEvents();
      }

      createMesh() {
        this.geometry = new THREE.PlaneGeometry(0.6, 0.6, 32, 32);
        this.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTime: { value: 0.0 },
            uTexture: { value: new THREE.TextureLoader().load(img) }
          },
          transparent: true,
          side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0.0, 0.0, -1);
        this.scene.add(this.mesh);
      }

      addEvents() {
        window.requestAnimationFrame(this.run.bind(this));
        window.addEventListener("resize", this.onResize.bind(this), false);
      }

      run() {
        requestAnimationFrame(this.run.bind(this));
        this.render();
      }

      render() {
        this.material.uniforms.uTime.value = this.clock.getElapsedTime();
        this.renderer.render(this.scene, this.camera);
      }

      onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h);
      }
    }

    const scene = new Gl();
    
    scene.init();

  },
};
</script>

<template>

  <canvas id="app"></canvas>

  <div class="underlay">
    <img :src="pages.find(page => page.slug === 'home')._embedded['wp:featuredmedia'][0].source_url" alt="Featured Image" class="cover" />
  </div>

</template>

<style scoped lang="scss">  

#app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
}

.underlay {
  width: 100vw;
  height: 100vh;
  z-index: 1;

  .cover {
    margin: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
  
</style>