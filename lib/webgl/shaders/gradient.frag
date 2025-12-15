precision highp float;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform float uColorSize;
uniform float uColorSpacing;
uniform float uColorRotation;
uniform float uColorSpread;
uniform vec2 uColorOffset;

uniform float uDisplacement;
uniform float uZoom;
uniform float uSpacing;
uniform float uSeed;
uniform vec2 uViewport;
uniform vec2 uTransformPosition;
uniform vec2 uPointer;
uniform float uNoiseSize;
uniform float uNoiseIntensity;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i + vec2(0.0, 0.0));
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  mat2 m = mat2(1.6, -1.2, 1.2, 1.6);

  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = m * p;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float aspect = uViewport.x / max(uViewport.y, 1.0);

  uv.x *= aspect;
  uv *= uZoom;
  uv += uTransformPosition;
  uv += uColorOffset;

  float angle = uColorRotation;
  mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  uv = rot * uv;

  float baseNoise = fbm(uv * (uSpacing + 0.0001) + uSeed);
  float displacement = (noise(uv * uNoiseSize + uSeed * 1.3) - 0.5) * (uDisplacement + 0.0001);
  uv += displacement;

  vec2 pointer = uPointer * 2.0 - 1.0;
  pointer.x *= aspect;
  pointer = rot * pointer;

  float dist = length(uv - pointer);
  float lens = exp(-dist * 2.6) * (0.35 + uNoiseIntensity * 0.35);
  uv += (uv - pointer) * lens * 0.18 * uDisplacement;

  float wave = sin(uv.x * uColorSize) + cos(uv.y * uColorSpacing);
  float palette = wave + baseNoise * (1.0 + uColorSpread);

  vec3 colA = mix(uColor1, uColor2, smoothstep(-1.0, 1.0, palette));
  vec3 colB = mix(uColor3, uColor4, smoothstep(-1.0, 1.0, -palette + 0.25));
  float mixer = clamp(0.5 + 0.5 * sin((uv.x + uv.y) * 0.75 + baseNoise * 2.0), 0.0, 1.0);

  vec3 color = mix(colA, colB, mixer);
  color += (noise(uv * (uNoiseSize * 2.0) + uSeed * 2.3) - 0.5) * uNoiseIntensity * 0.06;

  gl_FragColor = vec4(color, 1.0);
}
