<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "~/shaders/vertex.glsl?raw";
import fragmentShader from "~/shaders/fragment.glsl?raw";
import ball from "~/assets/ball.png";
import argo from "~/assets/argo.png";
import bag from "~/assets/bag.png";
import globe from "~/assets/globe.png";
import iceberg from "~/assets/iceberg.png";
import manatees from "~/assets/manatees.png";
import pyramids from "~/assets/pyramids.png";
import tv from "~/assets/tv.png";



export default {
  setup() {
    const pages = useFetch('http://' + useRuntimeConfig().public.domain + '/wp-json/wp/v2/pages?_embed').data

    return {
      pages,
    }
  },
  mounted() {

    class Fish {
      constructor(scene, path, x = 0, y = 0, z = 0, s = 1, r = 0, va = 0, vr = 0, av = 0) {
        this.path = path;
        this.name = path.match(/\/([^\/]+)\.png$/)[1];
        this.v = new THREE.Vector3().setFromSpherical(new THREE.Spherical(vr, THREE.MathUtils.degToRad(-va + 90), THREE.MathUtils.degToRad(90)));
        this.a = new THREE.Vector2(0, 0);
        this.av = THREE.MathUtils.degToRad(av);
        this.maxV = this.v.clone();


        this.geometry = new THREE.PlaneGeometry(0.6, 0.6, 32, 32);
        this.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTime: { value: 0.0 },
            uTexture: { value: new THREE.TextureLoader().load(this.path) }
          },
          transparent: true,
          side: THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        if (window.innerWidth > window.innerHeight) {
          this.mesh.position.set(x / window.innerHeight * window.innerWidth, y, z);
        } else {
          this.mesh.position.set(x, y / window.innerWidth * window.innerHeight, z);
        }
        this.mesh.rotation.set(0, 0, THREE.MathUtils.degToRad(r));
        this.mesh.scale.set(s, s, s);

        scene.add(this.mesh);
      }
    }

    class Gl {
      constructor() {

        this.scene = new THREE.Scene();

        this.camSize = 1;

        if (window.innerWidth > window.innerHeight) {
          this.camHeight = this.camSize;
          this.camWidth = this.camSize / window.innerHeight * window.innerWidth;
        } else {
          this.camWidth = this.camSize;
          this.camHeight = this.camSize / window.innerWidth * window.innerHeight;
        }

        this.camera = new THREE.OrthographicCamera(
          - this.camWidth,
          this.camWidth,
          this.camHeight,
          - this.camHeight,
          0.1,
          100,
        );

        this.camera.position.z = 1;

        this.w = this.camera.right;
        this.h = this.camera.top;

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
        // (scene, path, x = 0, y = 0, z = 0, s = 1, r = 0, va = 0, vr = 0, av = 0)
        this.fish = [
          new Fish(this.scene, ball,      0.09, 0.45, 0.1, 1.2, 0, THREE.MathUtils.randFloat(-180, 180), 0.03, 5),
          new Fish(this.scene, argo,      -0.5, 0.3, 0.2, 1.3, 0, THREE.MathUtils.randFloat(-180, 180), 0, 3),
          new Fish(this.scene, bag,       -0.7, -0.25, 0.3, 0.9, -15, THREE.MathUtils.randFloat(-180, 180), 0.0225, 2),
          new Fish(this.scene, globe,     0.65, -0.3, 0.4, 0.5, 0, THREE.MathUtils.randFloat(-180, 180), 0.0125, 1),
          new Fish(this.scene, iceberg,   0.4, -0.6, 0.5, 0.9, 20, THREE.MathUtils.randFloat(-180, 180), 0, -1),
          new Fish(this.scene, manatees,  0.55, 0.35, 0.6, 1.5, 25, THREE.MathUtils.randFloat(-180, 180), 0, -2),
          new Fish(this.scene, pyramids,  0, -0.1, 0.7, 1.8, -20, THREE.MathUtils.randFloat(-180, 180), 0.045, -1),
          new Fish(this.scene, tv,        -0.2, -0.6, 0.8, 0.8, -15, THREE.MathUtils.randFloat(-180, 180), 0.02, 1),
        ];
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
        const fieldR = 0.18;
        const deltaTime = this.clock.getDelta();

        for (var i = 0; i < this.fish.length; i++) {
          const iFish = this.fish[i];
          var hasAcc = false;

          iFish.material.uniforms.uTime.value += deltaTime;
          iFish.mesh.rotation.z += iFish.av * deltaTime;
          iFish.mesh.position.add(iFish.v.clone().multiplyScalar(deltaTime));
          iFish.v.x += iFish.a.x * deltaTime * iFish.maxV.length();
          iFish.v.y += iFish.a.y * deltaTime * iFish.maxV.length();
          if (iFish.v.length() > iFish.maxV.length()) {
            iFish.v.normalize().multiplyScalar(iFish.maxV.length());
          }

          if (iFish.mesh.position.x > this.camera.right - 0.1) {
            hasAcc = true;
            iFish.a.add(new THREE.Vector2(-1, 0)).normalize();
          } else if (iFish.mesh.position.x < this.camera.left + 0.1) {
            hasAcc = true;
            iFish.a.add(new THREE.Vector2(1, 0)).normalize();
          } else if (iFish.mesh.position.y > this.camera.top - 0.1) {
            hasAcc = true;
            iFish.a.add(new THREE.Vector2(0, -1)).normalize();
          } else if (iFish.mesh.position.y < this.camera.bottom + 0.1) {
            hasAcc = true;
            iFish.a.add(new THREE.Vector2(0, 1)).normalize();
          }

          for (var j = i + 1; j < this.fish.length; j++) {
            const jFish = this.fish[j];
            const jVec = new THREE.Vector2(jFish.mesh.position.x, jFish.mesh.position.y);
            const iVec = new THREE.Vector2(iFish.mesh.position.x, iFish.mesh.position.y);

            if (jVec.distanceTo(iVec) < fieldR * (iFish.mesh.scale.x + jFish.mesh.scale.x)) {
              hasAcc = true;
              iFish.a.add(iVec.clone().sub(jVec).normalize()).normalize();
              jFish.a.add(jVec.clone().sub(iVec).normalize()).normalize();
            }
          }

          if (!hasAcc) {
            iFish.a.x = 0;
            iFish.a.y = 0;
            if (iFish.v.length() < iFish.maxV.length()) {
              iFish.v.normalize().multiplyScalar(iFish.maxV.length());
            }
          }
        }

        this.renderer.render(this.scene, this.camera);
      }

      onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (w > h) {
          this.camera.bottom = - this.camSize;
          this.camera.top = this.camSize;
          this.camera.right = this.camSize / h * w;
          this.camera.left = - this.camSize / h * w;
        } else {
          this.camera.left = - this.camSize;
          this.camera.right = this.camSize;
          this.camera.top = this.camSize / w * h;
          this.camera.bottom = - this.camSize / w * h;
        }

        this.camera.updateProjectionMatrix();

        if (this.fish) {
          for (var i = 0; i < this.fish.length; i++) {
            this.fish[i].mesh.position.x = this.fish[i].mesh.position.x / this.w * this.camera.right;
            this.fish[i].mesh.position.y = this.fish[i].mesh.position.y / this.h * this.camera.top;
          }
        }

        this.renderer.setSize(w, h);
        this.w = this.camera.right;
        this.h = this.camera.top;
      }

      onMouseMove(event) {
        // Calculate normalized device coordinates (NDC) for the mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Perform the raycasting
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Get all intersected objects
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        // Check if there are any intersections
        if (intersects.length > 0) {
          // The mouse is over an object

          // Get the first intersected object (closest to the camera)
          const intersectedObject = intersects[0].object;

          // Check if the pixel at the intersection point is opaque
          const texture = intersectedObject.material.map;
          if (texture) {
            const uv = intersects[0].uv;
            const pixelColor = getPixelColorAtUV(texture, uv.x, uv.y);

            // Check the alpha value (4th component) of the pixel
            if (pixelColor[3] > 0.01) {
              // The pixel is opaque

              // Change the material color to highlight the object
              intersectedObject.material.color = this.highlightColor;
            }
          }
        } else {
          // The mouse is not over any object

          // Reset the highlight for the previously intersected object (if any)
          if (this.intersected) {
            this.intersected.material.color = new THREE.Color(); // Reset to default color
          }
          this.intersected = null;
        }
      }
    }

    const scene = new Gl();
    
    scene.init();

  },
};
</script>

<template>
  
  <canvas id="app"></canvas>

</template>

<style scoped lang="scss">  

#app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
  
</style>