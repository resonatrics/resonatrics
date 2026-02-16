import fragmentShader from "./HalftoneShader.fragment.glsl?raw";
import vertexShader from "./HalftoneShader.vertex.glsl?raw";

const HalftoneShader = {
  name: "HalftoneShader",

  uniforms: {
    tDiffuse: { value: null },
    radius: { value: 5 },
    rotate: { value: Math.PI / 12 },
    width: { value: 1 },
    height: { value: 1 },
    invWidth: { value: 1 },
    invHeight: { value: 1 },
  },

  vertexShader,
  fragmentShader,
};

export { HalftoneShader };
