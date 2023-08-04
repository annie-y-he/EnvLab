<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "~/shaders/backgroundShader/vertex.glsl?raw";
import fragmentShader from "~/shaders/backgroundShader/fragment.glsl?raw";

export default {
  setup() {
    const pages = useFetch('http://' + useRuntimeConfig().public.domain + '/wp-json/wp/v2/pages?_embed').data

    return {
      pages,
    }
  },
  mounted() {

    class Gl {
      constructor() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

        this.camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.1,
          100
        );

        this.camera.position.z = 1;
        this.renderer = new THREE.WebGLRenderer({
          canvas: document.querySelector("#bg"),
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
        this.geometry = new THREE.PlaneGeometry(6, 6, 64, 64);
        this.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTime: { value: 0 },
          },
          transparent: true,
          wireframe: true,
        });
        this.floor = new THREE.Mesh(this.geometry, this.material);
        this.floor.position.set(0.0, -0.3, -1);
        this.floor.rotation.set(THREE.MathUtils.degToRad(-90), 0, THREE.MathUtils.degToRad(0));

        this.ceiling = new THREE.Mesh(this.geometry, this.material);
        this.ceiling.position.set(0.0, 0.4, -1);
        this.ceiling.rotation.set(THREE.MathUtils.degToRad(90), 0, THREE.MathUtils.degToRad(180));

        this.scene.add(this.floor);
        this.scene.add(this.ceiling);
      }

      addEvents() {
        window.requestAnimationFrame(this.run.bind(this));
        window.addEventListener("resize", this.onResize.bind(this), false);
        // window.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
      }

      run() {
        requestAnimationFrame(this.run.bind(this));
        this.render();
      }

      render() {
        this.material.uniforms.uTime.value = this.clock.getElapsedTime();
        this.renderer.render(this.scene, this.camera);
        this.camera.rotation.y += (this.mouseX - this.camera.rotation.y) * .000005;
        this.camera.rotation.x += (this.mouseY - this.camera.rotation.x) * .000005;
        // this.camera.lookAt(this.scene.position);
      }

      onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(w, h);
      }

      onDocumentMouseMove(event) {
        this.mouseX = (event.clientX - (window.innerWidth / 2)) * 0.3;
        this.mouseY = (event.clientY - (window.innerHeight / 2)) * 0.3;
      }
    }
    
    const scene = new Gl();
    
    scene.init();

  },
};
</script>

<template>

  <div id="gradient"></div>

  <canvas id="bg"></canvas>

</template>

<style scoped lang="scss">  

#bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

#gradient {
  position: fixed;
  background-image: linear-gradient(rgb(19, 27, 39), rgb(27, 37, 53), rgb(14, 20, 29));
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
  
</style>