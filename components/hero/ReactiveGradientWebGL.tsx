"use client";

import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

type ReactiveGradientWebGLProps = {
  className?: string;
  interactive?: boolean;
};

/**
 * WebGL background inspired by the provided Unicorn Studio layer settings.
 * Layers approximated in a single fragment shader:
 * - Noise Fill (Voronoi black->coral) with mouse bulge and slow drift
 * - Flow field warp (Perlin) influenced by pointer
 * - Liquify warp with slight chromatic shift
 * - Circle with exclusion blend (cyan)
 * - Grain overlay
 * - Base dark wash
 */
export function ReactiveGradientWebGL({
  className,
  interactive = true
}: ReactiveGradientWebGLProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl =
      canvas.getContext("webgl2", { antialias: true }) ??
      canvas.getContext("webgl", { antialias: true });
    if (!gl) return;

    let raf = 0;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    const vertexShaderSrc = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uReduced;

      float hash1(vec2 p) {
        p = fract(p * vec2(123.34, 345.45));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }
      vec3 hash3(vec2 p) {
        vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
                      dot(p, vec2(269.5, 183.3)),
                      dot(p, vec2(419.2, 371.9)));
        return fract(sin(q) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash1(i);
        float b = hash1(i + vec2(1.0, 0.0));
        float c = hash1(i + vec2(0.0, 1.0));
        float d = hash1(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }
      float voronoise(vec2 uv, float skew, float turb, float seed) {
        vec2 s = vec2(skew, 1.0 - skew);
        vec2 x = (uv * s * 2.0);
        vec2 p = floor(x);
        vec2 f = fract(x);
        float k = 1.0 + 63.0 * pow(1.0 - turb, 4.0);
        float va = 0.0;
        float wt = 0.0;
        for (int j = -2; j <= 2; j++) {
          for (int i = -2; i <= 2; i++) {
            vec2 g = vec2(float(i), float(j));
            vec3 o = hash3(p + g + seed) * vec3(1.0, 1.0, 1.0);
            o.xy += 0.5 * vec2(
              sin(uTime * 0.1 + o.x * 6.28),
              cos(uTime * 0.1 + o.y * 6.28)
            );
            vec2 r = g - f + o.xy;
            float d = dot(r, r);
            float ww = pow(1.0 - smoothstep(0.0, 1.414, sqrt(d)), k);
            va += o.z * ww;
            wt += ww;
          }
        }
        return va / wt;
      }
      vec3 blendExclusion(vec3 base, vec3 blend) {
        return base + blend - 2.0 * base * blend;
      }

      void main() {
        vec2 uv = vUv;
        vec2 res = uResolution;
        float t = uTime * (uReduced > 0.5 ? 0.2 : 1.0);

        // Flow field warp (Perlin)
        float flowAmt = 0.38 * 0.01;
        float flowScale = 0.29;
        float flowMix = 0.33;
        float flowAngle = radians(112.0);
        float flowPhase = 0.69 * 5.0 + t / 60.0;
        mat2 rot = mat2(cos(flowAngle), -sin(flowAngle), sin(flowAngle), cos(flowAngle));
        vec2 fuv = rot * ((uv - 0.5) * vec2(res.x / res.y, 1.0) * flowScale + flowPhase);
        vec2 flow = vec2(noise(fuv + 10.0), noise(fuv - 10.0)) - 0.5;
        flow *= flowAmt;
        flow += (uPointer - 0.5) * 0.08;
        uv += flow * flowMix;

        // Liquify warp with chromatic skew
        float liqFreq = 0.3;
        float liqAmp = 0.08;
        float liqMix = 0.8;
        float liqSkew = 0.26;
        vec2 liq = vec2(
          sin((uv.y + uv.x * liqSkew) * 10.0 * liqFreq + t),
          cos((uv.x - uv.y * liqSkew) * 10.0 * liqFreq - t * 0.8)
        ) * liqAmp;
        uv += liq * liqMix;

        // Noise fill (Voronoi) black -> coral
        vec2 cellUv = uv * 6.0;
        float v = voronoise(cellUv + t * 0.5, 0.55, 0.56, 0.0);
        float turb = 0.56 * 2.5;
        v = mix(0.5, v, turb);
        vec3 colorA = vec3(0.0);
        vec3 colorB = vec3(0.9255, 0.3882, 0.3882); // EC6363
        float baseMix = smoothstep(0.0, 0.5, 1.0 - v);
        vec3 col = mix(colorA, colorB, baseMix);

        // Circle exclusion layer
        vec2 circlePos = vec2(0.5, 0.5) + (uPointer - 0.5) * 0.75;
        vec2 cupos = (uv - circlePos);
        cupos.x *= mix(1.0, 1.3, 0.5);
        float radius = 0.43;
        float falloff = 0.7;
        float dist = length(cupos * vec2(res.x / res.y, 1.0));
        float circleMask = smoothstep(radius, radius - falloff * 0.5, dist);
        vec3 circleColor = vec3(0.341, 0.859, 0.992);
        vec3 excluded = blendExclusion(col, circleColor);
        col = mix(col, excluded, circleMask * 0.7);

        // Left/right tint
        float grad = clamp((uv.x - 0.5) * 1.5 + (uv.y - 0.5) * 0.3, -1.0, 1.0);
        vec3 leftTint = vec3(0.05, 0.12, 0.2);
        vec3 rightTint = vec3(0.3, 0.15, 0.05);
        col += mix(leftTint, rightTint, grad * 0.5 + 0.5) * 0.35;

        // Grain overlay (overlay blend approx)
        float grain = hash1(gl_FragCoord.xy + t * 60.0) - 0.5;
        col = mix(col, col + grain * 0.15, 0.15);

        col = clamp(col, 0.0, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const vShader = compile(gl.VERTEX_SHADER, vertexShaderSrc);
    const fShader = compile(gl.FRAGMENT_SHADER, fragmentShaderSrc);
    const program = gl.createProgram()!;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
    }

    const positionLoc = gl.getAttribLocation(program, "aPos");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const uniformResolution = gl.getUniformLocation(program, "uResolution");
    const uniformTime = gl.getUniformLocation(program, "uTime");
    const uniformPointer = gl.getUniformLocation(program, "uPointer");
    const uniformReduced = gl.getUniformLocation(program, "uReduced");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      if (!interactive) return;
      pointer.tx = e.clientX / window.innerWidth;
      pointer.ty = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uniformResolution, canvas.width, canvas.height);
      gl.uniform1f(uniformTime, t);
      gl.uniform2f(uniformPointer, pointer.x, pointer.y);
      gl.uniform1f(uniformReduced, prefersReducedMotion.matches ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
      gl.deleteBuffer(buffer);
    };
  }, [interactive]);

  return <canvas ref={canvasRef} className={cn("absolute inset-0 h-full w-full", className)} />;
}
