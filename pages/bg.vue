<script>

import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { MaskPass } from "three/examples/jsm/postprocessing/MaskPass";

import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { HorizontalTiltShiftShader } from "three/examples/jsm/shaders/HorizontalTiltShiftShader";
import { VerticalTiltShiftShader } from "three/examples/jsm/shaders/VerticalTiltShiftShader";
import { DigitalGlitch } from "three/examples/jsm/shaders/DigitalGlitch";
import { FilmShader } from "three/examples/jsm/shaders/FilmShader";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";
import { VignetteShader } from "three/examples/jsm/shaders/VignetteShader";




// import '~/shaders/background/postprocessing/EffectComposer';
// import '~/shaders/background/postprocessing/GlitchPass';
// import '~/shaders/background/postprocessing/MaskPass';
// import '~/shaders/background/postprocessing/RenderPass';
// import '~/shaders/background/postprocessing/ShaderPass';
// import '~/shaders/background/shaders/CopyShader';
// import '~/shaders/background/shaders/DigitalGlitch';
// import '~/shaders/background/shaders/FilmShader';
// import '~/shaders/background/shaders/HorizontalTiltShiftShader';
// import '~/shaders/background/shaders/RGBShiftShader';
// import '~/shaders/background/shaders/VerticalTiltShiftShader';
// import '~/shaders/background/shaders/VignetteShader';
// import '~/shaders/background/Detector';
// import '~/shaders/background/ImprovedNoise';
// import '~/shaders/background/three.min.js';
// import '~/shaders/background/three.minx.js';

export default {
  setup() {
  },
  mounted() {
    var Detector = {

      canvas: !! window.CanvasRenderingContext2D,
      webgl: ( function () { try { var canvas = document.createElement( 'canvas' ); return !! ( window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ) ); } catch ( e ) { return false; } } )(),
      workers: !! window.Worker,
      fileapi: window.File && window.FileReader && window.FileList && window.Blob,

      getWebGLErrorMessage: function () {

        var element = document.createElement( 'div' );
        element.id = 'webgl-error-message';
        element.style.fontFamily = 'monospace';
        element.style.fontSize = '13px';
        element.style.fontWeight = 'normal';
        element.style.textAlign = 'center';
        element.style.background = '#fff';
        element.style.color = '#000';
        element.style.padding = '1.5em';
        element.style.width = '400px';
        element.style.margin = '5em auto 0';

        if ( ! this.webgl ) {

          element.innerHTML = window.WebGLRenderingContext ? [
            'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
            'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
          ].join( '\n' ) : [
            'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
            'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
          ].join( '\n' );

        }

        return element;

      },

      addGetWebGLMessage: function ( parameters ) {

        var parent, id, element;

        parameters = parameters || {};

        parent = parameters.parent !== undefined ? parameters.parent : document.body;
        id = parameters.id !== undefined ? parameters.id : 'oldie';

        element = Detector.getWebGLErrorMessage();
        element.id = id;

        parent.appendChild( element );

      }

    };

    if (!Detector.webgl) {
      Detector.addGetWebGLMessage();
    }

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var renderer, camera, scene, moverGroup, floorGeometry, floorMaterial, pointLight, pointLight2, pGeometry;
    var FLOOR_RES = 60;
    var FLOOR_HT = 350;
    var stepCount = 0;
    var noiseScale = 15.5;
    var noiseSeed = Math.random() * 100;
    var FLOOR_WIDTH = 9600;
    var FLOOR_DEPTH = 4800;
    var MOVE_SPD = 2.9;
    var mouseX = 0;
    var mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var ImprovedNoise = function () {

      var p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
        23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
        174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
        133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
        89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
        202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
        248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
        178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
        14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
        93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

      for (var i=0; i < 256 ; i++) {

        p[256+i] = p[i];

      }

      function fade(t) {

        return t * t * t * (t * (t * 6 - 15) + 10);

      }

      function lerp(t, a, b) {

        return a + t * (b - a);

      }

      function grad(hash, x, y, z) {

        var h = hash & 15;
        var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);

      }

      return {

        noise: function (x, y, z) {

          var floorX = ~~x, floorY = ~~y, floorZ = ~~z;

          var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

          x -= floorX;
          y -= floorY;
          z -= floorZ;

          var xMinus1 = x -1, yMinus1 = y - 1, zMinus1 = z - 1;

          var u = fade(x), v = fade(y), w = fade(z);

          var A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;

          return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z), 
                  grad(p[BA], xMinus1, y, z)),
                lerp(u, grad(p[AB], x, yMinus1, z),
                  grad(p[BB], xMinus1, yMinus1, z))),
              lerp(v, lerp(u, grad(p[AA+1], x, y, zMinus1),
                  grad(p[BA+1], xMinus1, y, z-1)),
                lerp(u, grad(p[AB+1], x, yMinus1, zMinus1),
                  grad(p[BB+1], xMinus1, yMinus1, zMinus1))));

        }
      }
    }

    var snoise = new ImprovedNoise();
    var textureLoader = new THREE.TextureLoader();
    var composer, shaderTime = 0, filmPass, renderPass, copyPass, glitchPass, effectVignette;
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    function onDocumentMouseMove(event) {
      mouseX = (event.clientX - (windowHalfX)) * 0.3;
      mouseY = (event.clientY - (windowHalfY)) * 0.3;
    }

    function params(hblur, vblur) {
      var bluriness = 5;
      hblur.uniforms['h'].value = bluriness / window.innerWidth;
      vblur.uniforms['v'].value = bluriness / window.innerHeight;
      hblur.uniforms['r'].value = vblur.uniforms['r'].value = 0.5;
      filmPass.uniforms.grayscale.value = 0;
      filmPass.uniforms['sCount'].value = 2;
      filmPass.uniforms['sIntensity'].value = 0.2;
      filmPass.uniforms['nIntensity'].value = 1;
      effectVignette.uniforms["offset"].value = 1.0;
      effectVignette.uniforms["darkness"].value = 1.3;
    }

    init();
    animate();

    function init() {
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 4000);
      camera.position.z = 2750;

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x1c3c4a, 0.00045);

      var hemisphereLight = new THREE.HemisphereLight(0xe3feff, 0xe6ddc8, 0.7);
      scene.add(hemisphereLight);
      hemisphereLight.position.y = 300;

      //middle light
      var centerLight = new THREE.SpotLight(0xb7f9ff, 1);
      scene.add(centerLight);
      centerLight.position.set(2500, 300, 2000);
      centerLight.penumbra = 1;
      centerLight.decay = 5;

      pointLight = new THREE.PointLight(0xe07bff, 1.5);
      pointLight.position.z = 200;
      scene.add(pointLight);

      pointLight2 = new THREE.PointLight(0xff4e00, 1.2);
      pointLight2.position.z = 200;
      scene.add(pointLight2);

      var path = "/img/";
      var format = '.jpg';
      var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
      ];

      var reflectionCube = new THREE.CubeTextureLoader().load(urls);
      console.log(reflectionCube);
      reflectionCube.format = THREE.RGBFormat;

      var cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x447080,
        // envMap: reflectionCube,
        map: new THREE.TextureLoader().load("/img/px.jpg"),
        combine: THREE.MixOperation,
        side: THREE.DoubleSide,
        reflectivity: 0.5,
        flatShading: true,
      });

      moverGroup = new THREE.Object3D();
      scene.add(moverGroup);
      var floorGroup = new THREE.Object3D();

      var floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xeeeeee, //diffuse							
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        wireframe: true
      });

      //add extra x width
      floorGeometry = new THREE.BufferGeometry(FLOOR_WIDTH + 1200, FLOOR_DEPTH, FLOOR_RES, FLOOR_RES);
      var floorMesh = new THREE.Mesh(floorGeometry, cubeMaterial);
      var floorMesh2 = new THREE.Mesh(floorGeometry, floorMaterial);

      floorMesh2.position.y = 20;
      floorMesh2.position.z = 5;
      floorGroup.add(floorMesh);
      floorGroup.add(floorMesh2);
      scene.add(floorGroup);
      floorMesh.rotation.x = Math.PI / 1.65;
      floorMesh2.rotation.x = Math.PI / 1.65;
      floorGroup.position.y = 180;

      //Particles
      pGeometry = new THREE.PlaneGeometry();
      var sprite = textureLoader.load("/img/sprite.png");
      var pVert = new Float32Array(2000 * 3);
      for (var i = 0; i < 2000; i++) {
        pVert[ i * 3 ] = 4000 * Math.random() - 2000;
        pVert[ i * 3 + 1 ] = -200 + Math.random() * 700;
        pVert[ i * 3 + 2 ] = 5000 * Math.random() - 2000;
        pGeometry.setAttribute( 'position', new THREE.BufferAttribute( pVert, 3 ) );
      }
      var material = new THREE.PointsMaterial({
        size: 10,
        map: sprite,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        alphaTest: 0.5
      });

      var particles = new THREE.Points(pGeometry, material);
      particles.sortParticles = true;
      moverGroup.add(particles);

      // Logo
      // sprite = textureLoader.load("/img/logo.png");
      // pGeometry = new THREE.BufferGeometry(500, 640, 1);
      // material = new THREE.MeshLambertMaterial({
      //   transparent: true,
      //   opacity: 0.8,
      //   blending: THREE.AdditiveBlending,
      //   map: sprite,
      //   side: THREE.DoubleSide
      // });
      // var plane = new THREE.Mesh(pGeometry, material);
      // plane.position.set(0, 70, 1800);
      // scene.add(plane);

      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x1c3c4a);
      document.body.appendChild(renderer.domElement);

      // POST PROCESSING
      // Create Shader Passes
      renderPass = new RenderPass(scene, camera);
      var hblur = new ShaderPass(HorizontalTiltShiftShader);
      var vblur = new ShaderPass(VerticalTiltShiftShader);
      effectVignette = new ShaderPass(VignetteShader);
      copyPass = new ShaderPass(CopyShader);
      filmPass = new ShaderPass(FilmShader);
      glitchPass = new GlitchPass();

      composer = new EffectComposer(renderer);
      composer.addPass(renderPass);
      composer.addPass(hblur);
      composer.addPass(vblur);
      composer.addPass(filmPass);
      composer.addPass(effectVignette);
      composer.addPass(glitchPass);
      composer.addPass(copyPass);
      copyPass.renderToScreen = true;

      params(hblur, vblur);

      setWaves();
      window.addEventListener('resize', onWindowResize, false);
    }

    function setWaves() {
      stepCount++;
      moverGroup.position.z = -MOVE_SPD;
      var ipos;
      var offset = stepCount * MOVE_SPD / FLOOR_DEPTH * FLOOR_RES;

      var vertices = new Float32Array(FLOOR_RES * FLOOR_RES);

      for (var i = 0; i < FLOOR_RES + 1; i++) {
        for (var j = 0; j < FLOOR_RES + 1; j++) {
          ipos = i + offset;
          if ((i > 30) || (j < 12) || (j > 48)) {
            vertices[( i * (FLOOR_RES + 1) + j ) * 3 + 2] = snoise.noise(ipos / FLOOR_RES * noiseScale, j / FLOOR_RES * noiseScale, noiseSeed) * FLOOR_HT;
            vertices[( i * (FLOOR_RES + 1) + j ) * 3 + 2] = snoise.noise(ipos / FLOOR_RES * noiseScale, j / FLOOR_RES * noiseScale, noiseSeed) * FLOOR_HT;
          } else if (i > 25 && i < 30) {
            vertices[( i * (FLOOR_RES + 1) + j ) * 3 + 2] = snoise.noise(ipos / FLOOR_RES * noiseScale, j / FLOOR_RES * noiseScale, noiseSeed) * (FLOOR_HT / 1.2);
          } else {
            vertices[( i * (FLOOR_RES + 1) + j ) * 3 + 2] = snoise.noise(ipos / FLOOR_RES * noiseScale, j / FLOOR_RES * noiseScale, noiseSeed) * (FLOOR_HT / 2);
          }
        }
      }
      floorGeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
      floorGeometry.verticesNeedUpdate = true;
    }


    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {
      var timer = -0.0002 * Date.now();

      pointLight.position.x = 2400 * Math.cos(timer);
      pointLight.position.z = 2400 * Math.sin(timer);

      pointLight2.position.x = 1800 * Math.cos(-timer * 1.5);
      pointLight2.position.z = 1800 * Math.sin(-timer * 1.5);

      camera.position.x += (mouseX - camera.position.x) * .05;
      camera.position.y += (-mouseY - camera.position.y) * .05;
      camera.lookAt(scene.position);

      for (var i = 0; i < 2000; i++) {
        pGeometry.attributes.position.array[i * 3 + 2] += 0.5;
        if (pGeometry.attributes.position.array[i * 3 + 2] > 2700) {
          pGeometry.attributes.position.array[i * 3 + 2] = -2000;
        }
      }

      pGeometry.verticesNeedUpdate = true;

      setWaves();
      composer.render(0.1);
    }
  },
}
</script>

<template>
<div id="canvas"></div>
</template>

<style>
#canvas {
  width: 100vw;
  height: 100vh;
}
</style>