import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { HalftoneShader } from "./HalftoneShader";

export interface HalftonePassParams {
  radius: number;
  rotate: number;
}

class HalftonePass extends ShaderPass {
  constructor(params: HalftonePassParams) {
    super(HalftoneShader);

    this.uniforms["radius"].value = params.radius;
    this.uniforms["rotate"].value = params.rotate;
  }

  setSize(width: number, height: number): void {
    this.uniforms["width"].value = width;
    this.uniforms["height"].value = height;
    this.uniforms["invWidth"].value = width > 0 ? 1 / width : 0;
    this.uniforms["invHeight"].value = height > 0 ? 1 / height : 0;
  }
}

export { HalftonePass };
