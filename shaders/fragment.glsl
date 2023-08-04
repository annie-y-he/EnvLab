precision mediump float;

varying vec2 vUv;
varying float vWave;
uniform sampler2D uTexture;

void main() {
  float wave = vWave * 0.9;
  vec4 textureColor = texture2D(uTexture, vUv);

  if (textureColor.a < 0.01) {
    discard;
  }

  vec4 finalColor = vec4(textureColor.r, texture2D(uTexture, vUv - vec2(wave, 0.0)).g, texture2D(uTexture, vUv + vec2(wave, 0.0)).b, textureColor.a);

  gl_FragColor = finalColor;
}