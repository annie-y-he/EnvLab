<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "~/shaders/vertex.glsl?raw";
import fragmentShader from "~/shaders/fragment.glsl?raw";

export default {
  props: {
    fishEnv: Array,
  },
  mounted() {
    class Fish {
      constructor(scene, path, glow, name, x = 0, y = 0, z = 0, s = 1, r = 0, va = 0, vr = 0, av = 0, sel = false) {
        this.name = name;
        this.v = new THREE.Vector3().setFromSpherical(new THREE.Spherical(vr, THREE.MathUtils.degToRad(-va + 90), THREE.MathUtils.degToRad(90)));
        this.a = new THREE.Vector2(0, 0);
        this.av = THREE.MathUtils.degToRad(av);
        this.maxV = this.v.clone();
        this.texture = new THREE.TextureLoader().load(path)
        this.glow = new THREE.TextureLoader().load(glow);
        this.selectable = sel;

        this.texture.name = this.name;
        this.glow.name = this.name + "Glow";

        this.geometry = new THREE.PlaneGeometry(0.6, 0.6, 32, 32);
        this.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTime: { value: 0.0 },
            uTexture: { value: this.texture }
          },
          transparent: true,
          side: THREE.DoubleSide,
          name: this.name,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = this.name;
        this.material.name = this.name;
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
        this.fish = [];
        if (window.getComputedStyle(document.getElementById("menuMobile")).display == "flex") {
          this.menu = Array.from(document.getElementById("menuMobile").children);
        } else {
          this.menu = Array.from(document.getElementById("menu").children);
        }

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

        this.counter = 0;

        this.camera.position.z = 1;

        this.w = this.camera.right;
        this.h = this.camera.top;

        this.raycaster = new THREE.Raycaster();

        this.mouse = new THREE.Vector2(999, 999);

        this.selected = null;
        this.onTop = null;

        this.raycaster.setFromCamera(this.mouse, this.camera);

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

      init(env) {
        this.createMesh(env);
        this.addEvents();
      }

      createMesh(env) {
        env.forEach(f => {
          this.fish.push(new Fish(this.scene, f.path, f.glow, f.name, f.x, f.y, f.z, f.s, f.r, THREE.MathUtils.randFloat(-180, 180), f.vr, f.av, f.sel));
        });
      }

      addEvents() {
        window.requestAnimationFrame(this.run.bind(this));
        window.addEventListener("resize", this.onResize.bind(this), false);
        window.addEventListener('mousemove', this.updateMouse.bind(this));
        window.addEventListener('touchstart', this.updateMouse.bind(this));
        window.addEventListener('touchmove', this.updateMouse.bind(this));
        window.addEventListener("touchend", this.handleClick.bind(this));
        window.addEventListener("mouseup", this.handleClick.bind(this));
        document.addEventListener("visibilitychange", () => {
          if (!document.hidden) {
            this.clock.getDelta();
          }
        });
      }

      run() {
        requestAnimationFrame(this.run.bind(this));
        this.render();
      }

      handleClick(event) {
        if (this.selected) {
          switch (this.selected.name) {
            case "manatees":
              this.menu.find((item) => item.textContent === "Team").click();
              break;
            case "pyramids":
              this.menu.find((item) => item.textContent === "About").click();
              break;
            case "ball":
              this.menu.find((item) => item.textContent === "Team").click();
              break;
            case "tv":
              this.menu.find((item) => item.textContent === "Publications").click();
              break;
            case "argo":
              this.menu.find((item) => item.textContent === "Jennifer Jacquet").click();
              break;
            case "bag":
              this.menu.find((item) => item.textContent === "About").click();
              break;
            case "globe":
              this.menu.find((item) => item.textContent === "Jennifer Jacquet").click();
              break;
            case "iceberg":
              this.menu.find((item) => item.textContent === "Publications").click();
              break;
          }
        }

        if (event.type == "touchend") {
          this.mouse.x = -999;
          this.mouse.y = -999;
        }
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
          } else if (iFish.mesh.position.y > this.camera.top - 0.2) {
            hasAcc = true;
            iFish.a.add(new THREE.Vector2(0, -1)).normalize();
          } else if (iFish.mesh.position.y < this.camera.bottom + 0.2) {
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

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
          for (var i = 0; i < intersects.length; i++) {
            const img = intersects[i].object.material.uniforms.uTexture.value.image;
            const uv = intersects[i].uv;
            if(img) {
              var canvas = document.getElementById("buffer");
              var context = canvas.getContext('2d', { willReadFrequently: true });
              if (!this.selected || this.selected.name != intersects[i].object.name) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0);
              }
              var pixelData = context.getImageData(uv.x * 1024, (1 - uv.y) * 1024, 1, 1).data;

              if (this.onTop && pixelData[3] != 0 && this.onTop.id == "app" && this.fish.find((f) => f.name === intersects[i].object.name).selectable) {
                document.body.style.cursor = "pointer";
                if (this.selected && this.selected != intersects[i].object) {
                  this.selected.material.uniforms.uTexture.value = this.fish.find((f) => f.name === this.selected.name).texture;
                  this.menu.forEach((item) => {
                    item.style.removeProperty('color');
                    item.style.removeProperty('font-weight');
                  });
                }
                this.selected = intersects[i].object;
                this.selected.material.uniforms.uTexture.value = this.fish.find((f) => f.name === this.selected.name).glow;

                switch (this.selected.name) {
                  case "manatees":
                    this.menu.find((item) => item.textContent === "Team").style.color = "var(--hover-color)";
                    this.menu.find((item) => item.textContent === "Team").style.fontWeight = "bold";
                    break;
                  case "pyramids":
                    this.menu.find((item) => item.textContent === "About").style.color = "var(--hover-color)";
                    this.menu.find((item) => item.textContent === "About").style.fontWeight = "bold";
                    break;
                  case "ball":
                    this.menu.find((item) => item.textContent === "Team").style.color = "var(--hover-color)";
                    this.menu.find((item) => item.textContent === "Team").style.fontWeight = "bold";
                    break;
                  case "tv":
                    this.menu.find((item) => item.textContent === "Publications").style.color = "var(--hover-color)";
                    this.menu.find((item) => item.textContent === "Publications").style.fontWeight = "bold";
                    break;
                  case "argo":
                    this.menu.find((item) => item.textContent === "Jennifer Jacquet").style.color = "var(--hover-color)";
                    this.menu.find((item) => item.textContent === "Jennifer Jacquet").style.fontWeight = "bold";
                    break;
                  case "bag":
                    this.menu.find((item) => item.textContent === "About").style.color = "var(--hover-color)";
                    this.menu.find((item) => item.textContent === "About").style.fontWeight = "bold";
                    break;
                  case "globe":
                    this.menu.find((item) => item.textContent === "Jennifer Jacquet").style.color = "var(--hover-color)";
                    this.menu.find((item) => item.textContent === "Jennifer Jacquet").style.fontWeight = "bold";
                    break;
                  case "iceberg":
                    this.menu.find((item) => item.textContent === "Publications").style.color = "var(--hover-color)";
                    this.menu.find((item) => item.textContent === "Publications").style.fontWeight = "bold";
                    break;
                }

                break;
              } else {
                document.body.style.cursor = "default";
                intersects[i].object.material.uniforms.uTexture.value = this.fish.find((f) => f.name === intersects[i].object.name).texture;
                this.selected = null;
                this.menu.forEach((item) => {
                  item.style.removeProperty('color');
                  item.style.removeProperty('font-weight');
                });
              }
            }
          }
        } 
      }

      onResize() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (window.getComputedStyle(document.getElementById("menuMobile")).display == "flex") {
          this.menu = Array.from(document.getElementById("menuMobile").children);
        } else {
          this.menu = Array.from(document.getElementById("menu").children);
        }

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

      updateMouse(event) {
        if (event.type == "touchstart" || event.type == "touchmove") {
          this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
          this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
          this.onTop = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
        } else if (event.type == "mousemove" && this.mouse.x != -999) {
          this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
          this.onTop = document.elementFromPoint(event.clientX, event.clientY);
        }
      }
    }

    const scene = new Gl();
    
    scene.init(this.fishEnv);

  },
};
</script>

<template>
  
  <canvas id="app"></canvas>
  <canvas id="buffer" width="1024" height="1024"></canvas>

</template>

<style scoped lang="scss">  

#app {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  user-select: none;
}

#buffer {
  display: none;
}
  
</style>