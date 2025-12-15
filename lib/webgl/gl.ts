export type GLContext = WebGL2RenderingContext | WebGLRenderingContext;

type GLCanvasSize = {
  width: number;
  height: number;
};

const contextAttributes: WebGLContextAttributes = {
  alpha: true,
  antialias: true,
  depth: false,
  stencil: false,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false
};

export function createGLContext(canvas: HTMLCanvasElement): GLContext | null {
  return (
    canvas.getContext("webgl2", contextAttributes) ||
    canvas.getContext("webgl", contextAttributes)
  );
}

export function compileShader(gl: GLContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Failed to create shader");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${info}`);
  }

  return shader;
}

export function createProgram(
  gl: GLContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram {
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Failed to create program");
  }

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    const info = gl.getProgramInfoLog(program) ?? "Unknown program link error";
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error(`Program link failed: ${info}`);
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

export function createFullscreenTriangle(gl: GLContext): WebGLBuffer {
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error("Failed to create buffer");
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // A single large triangle that covers the viewport.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );

  return buffer;
}

export function setCanvasSize(
  gl: GLContext,
  canvas: HTMLCanvasElement,
  devicePixelRatio: number
): GLCanvasSize {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.floor(rect.width * devicePixelRatio));
  const height = Math.max(1, Math.floor(rect.height * devicePixelRatio));

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  gl.viewport(0, 0, width, height);
  return { width, height };
}
