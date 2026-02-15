import { ShaderMaterial, UniformsUtils, WebGLRenderer, WebGLRenderTarget, type IUniform } from "three";
import { Pass, FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import { HalftoneShader } from "./HalftoneShader";

export interface HalftonePassParams {
  shape?: number;
  radius?: number;
  rotate?: number;
  scatter?: number;
  blending?: number;
  blendingMode?: number;
  disable?: boolean;
  [key: string]: any;
}

class HalftonePass extends Pass {
  public uniforms: { [uniform: string]: IUniform };
  public material: ShaderMaterial;
  private _fsQuad: FullScreenQuad;

  constructor(params: HalftonePassParams = {}) {
    super();

    this.uniforms = UniformsUtils.clone(HalftoneShader.uniforms);

    this.material = new ShaderMaterial({
      uniforms: this.uniforms,
      fragmentShader: HalftoneShader.fragmentShader,
      vertexShader: HalftoneShader.vertexShader,
    });

    for (const key in params) {
      if (
        Object.prototype.hasOwnProperty.call(params, key) &&
        Object.prototype.hasOwnProperty.call(this.uniforms, key)
      ) {
        this.uniforms[key].value = params[key];
      }
    }

    this._fsQuad = new FullScreenQuad(this.material);
  }

  render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget): void {
    this.material.uniforms["tDiffuse"].value = readBuffer.texture;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this._fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this._fsQuad.render(renderer);
    }
  }

  setSize(width: number, height: number): void {
    this.uniforms["width"].value = width;
    this.uniforms["height"].value = height;
  }

  dispose(): void {
    this.material.dispose();
    this._fsQuad.dispose();
  }
}

export { HalftonePass };
