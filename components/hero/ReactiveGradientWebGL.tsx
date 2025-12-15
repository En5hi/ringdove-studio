"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import {
  createFullscreenTriangle,
  createGLContext,
  createProgram,
  setCanvasSize
} from "../../lib/webgl/gl";

export type GradientParams = {
  color1: [number, number, number];
  color2: [number, number, number];
  color3: [number, number, number];
  color4: [number, number, number];
  colorSize: number;
  colorSpacing: number;
  colorRotation: number;
  colorSpread: number;
  colorOffset: [number, number];
  displacement: number;
  zoom: number;
  spacing: number;
  seed: number;
  transformPosition: [number, number];
  noiseSize: number;
  noiseIntensity: number;
};

type ReactiveGradientWebGLProps = {
  className?: string;
  interactive?: boolean;
  noretina?: boolean;
  initialParams?: Partial<GradientParams>;
};

const defaultParams: GradientParams = {
  color1: [0.04, 0.08, 0.18],
  color2: [0.06, 0.16, 0.32],
  color3: [0.18, 0.42, 0.62],
  color4: [0.98, 0.62, 0.36],
  colorSize: 0.9,
  colorSpacing: 1.2,
  colorRotation: 0.6,
  colorSpread: 0.65,
  colorOffset: [0, -0.1],
  displacement: 0.35,
  zoom: 0.85,
  spacing: 1.05,
  seed: 2.4,
  transformPosition: [0, 0],
  noiseSize: 1.4,
  noiseIntensity: 0.55
};

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 1.25;

const vertexShaderSource = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// GLSL fragment shader kept inline for reliable bundling; mirrored in lib/webgl/shaders/gradient.frag.
const fragmentShaderSource = `
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
`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function ReactiveGradientWebGL({
  className,
  interactive = true,
  noretina = false,
  initialParams
}: ReactiveGradientWebGLProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const gl = createGLContext(canvasEl);
    if (!gl) return;

    const params: GradientParams = { ...defaultParams, ...initialParams };
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    const buffer = createFullscreenTriangle(gl);
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    const uniformLocations = {
      color1: gl.getUniformLocation(program, "uColor1"),
      color2: gl.getUniformLocation(program, "uColor2"),
      color3: gl.getUniformLocation(program, "uColor3"),
      color4: gl.getUniformLocation(program, "uColor4"),
      colorSize: gl.getUniformLocation(program, "uColorSize"),
      colorSpacing: gl.getUniformLocation(program, "uColorSpacing"),
      colorRotation: gl.getUniformLocation(program, "uColorRotation"),
      colorSpread: gl.getUniformLocation(program, "uColorSpread"),
      colorOffset: gl.getUniformLocation(program, "uColorOffset"),
      displacement: gl.getUniformLocation(program, "uDisplacement"),
      zoom: gl.getUniformLocation(program, "uZoom"),
      spacing: gl.getUniformLocation(program, "uSpacing"),
      seed: gl.getUniformLocation(program, "uSeed"),
      viewport: gl.getUniformLocation(program, "uViewport"),
      transformPosition: gl.getUniformLocation(program, "uTransformPosition"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      noiseSize: gl.getUniformLocation(program, "uNoiseSize"),
      noiseIntensity: gl.getUniformLocation(program, "uNoiseIntensity")
    };

    const setStaticUniforms = () => {
      gl.useProgram(program);
      gl.uniform3fv(uniformLocations.color1, params.color1);
      gl.uniform3fv(uniformLocations.color2, params.color2);
      gl.uniform3fv(uniformLocations.color3, params.color3);
      gl.uniform3fv(uniformLocations.color4, params.color4);
      gl.uniform1f(uniformLocations.colorSize, params.colorSize);
      gl.uniform1f(uniformLocations.colorSpacing, params.colorSpacing);
      gl.uniform1f(uniformLocations.colorRotation, params.colorRotation);
      gl.uniform1f(uniformLocations.colorSpread, params.colorSpread);
      gl.uniform2fv(uniformLocations.colorOffset, params.colorOffset);
      gl.uniform1f(uniformLocations.displacement, params.displacement);
      gl.uniform1f(uniformLocations.spacing, params.spacing);
      gl.uniform2fv(uniformLocations.transformPosition, params.transformPosition);
      gl.uniform1f(uniformLocations.noiseSize, params.noiseSize);
      gl.uniform1f(uniformLocations.noiseIntensity, params.noiseIntensity);
    };

    setStaticUniforms();

    const pointer = { x: 0.5, y: 0.5 };
    let pointerTarget = { x: 0.5, y: 0.5 };
    let zoom = params.zoom;
    let zoomTarget = params.zoom;
    let frame: number | null = null;
    let visible = true;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReduced = mediaQuery.matches;

    const resize = () => {
      const dpr = noretina ? 1 : window.devicePixelRatio || 1;
      const size = setCanvasSize(gl, canvasEl, dpr);
      gl.uniform2f(uniformLocations.viewport, size.width, size.height);
      scheduleRender();
    };

    resize();

    const handlePointer = (event: PointerEvent) => {
      if (!interactive || prefersReduced) return;
      const rect = canvasEl.getBoundingClientRect();
      const clamp = (value: number) => Math.max(0, Math.min(1, value));
      pointerTarget = {
        x: clamp((event.clientX - rect.left) / rect.width),
        y: clamp((event.clientY - rect.top) / rect.height)
      };
    };

    const handleWheel = (event: WheelEvent) => {
      if (!interactive) return;
      const delta = Math.sign(event.deltaY) * 0.04;
      zoomTarget = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomTarget - delta));
    };

    const handleVisibility = () => {
      visible = !document.hidden;
      if (visible) {
        scheduleRender();
      }
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      prefersReduced = event.matches;
    };

    function render() {
      if (!visible || !gl) {
        frame = null;
        return;
      }
      const dpr = noretina ? 1 : window.devicePixelRatio || 1;
      const size = setCanvasSize(gl, canvasEl, dpr);

      const ease = prefersReduced ? 0.05 : 0.2;
      pointer.x = lerp(pointer.x, pointerTarget.x, ease);
      pointer.y = lerp(pointer.y, pointerTarget.y, ease);
      zoom = lerp(zoom, zoomTarget, prefersReduced ? 0.05 : 0.12);

      gl.useProgram(program);
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uniformLocations.seed, params.seed);
      gl.uniform1f(uniformLocations.zoom, zoom);
      gl.uniform2f(uniformLocations.pointer, pointer.x, 1.0 - pointer.y);
      gl.uniform2f(uniformLocations.viewport, size.width, size.height);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const moving =
        Math.abs(pointer.x - pointerTarget.x) > 0.0005 ||
        Math.abs(pointer.y - pointerTarget.y) > 0.0005 ||
        Math.abs(zoom - zoomTarget) > 0.0005;

      if (moving) {
        frame = requestAnimationFrame(render);
      } else {
        frame = null;
      }
    }

    function scheduleRender() {
      if (frame === null) {
        frame = requestAnimationFrame(render);
      }
    }

    scheduleRender();

    const onPointerMove = (e: PointerEvent) => {
      handlePointer(e);
      scheduleRender();
    };
    const onWheel = (e: WheelEvent) => {
      handleWheel(e);
      scheduleRender();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("wheel", onWheel);
      document.removeEventListener("visibilitychange", handleVisibility);
      mediaQuery.removeEventListener("change", handleMotionChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [interactive, noretina, initialParams]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full pointer-events-none", className)}
    />
  );
}
