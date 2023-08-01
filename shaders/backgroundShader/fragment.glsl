precision mediump float;

varying vec3 vPos;

void main() {
  gl_FragColor = vec4(1, 1, 1, pow(0.2, -vPos.z) * 0.2);
}