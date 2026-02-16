import fragmentShader from "./HalftoneShader.fragment.glsl?raw";
import vertexShader from "./HalftoneShader.vertex.glsl?raw";

const HalftoneShader = {
  name: "HalftoneShader",

  uniforms: {
    tDiffuse: { value: null },
    shape: { value: 1 },
    radius: { value: 4 },
    rotate: { value: Math.PI / 4 },
    scatter: { value: 0 },
    width: { value: 1 },
    height: { value: 1 },
    invWidth: { value: 1 },
    invHeight: { value: 1 },
    blending: { value: 1 },
    blendingMode: { value: 1 },
    disable: { value: false },
  },

  vertexShader,
  fragmentShader,
};

export { HalftoneShader };
