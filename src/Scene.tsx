import { Suspense, useEffect, useMemo, useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group } from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { HalftonePass } from "./postprocessing/HalftonePass";

const SphereRing = () => {
  const ringRef = useRef<Group>(null);
  const sphereCount = 8;
  const ringRadius = 3.4;
  const sphereRadius = 0.6;
  const spheres = Array.from({ length: sphereCount }, (_, index) => {
    const angle = (index / sphereCount) * Math.PI * 2;
    return [Math.cos(angle) * ringRadius, 0, Math.sin(angle) * ringRadius] as const;
  });

  useFrame((_, delta) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      <group ref={ringRef}>
        {spheres.map((position, index) => (
          <mesh key={index} position={position}>
            <sphereGeometry args={[sphereRadius, 32, 32]} />
            <meshStandardMaterial color="#cfcfcf" roughness={1} metalness={0} />
          </mesh>
        ))}
      </group>
    </>
  );
};

const HalftoneComposer = () => {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    const effectComposer = new EffectComposer(gl);
    effectComposer.addPass(new RenderPass(scene, camera));
    effectComposer.addPass(
      new HalftonePass({
        shape: 4,
        radius: 5,
        rotate: Math.PI / 12,
        scatter: 0,
        blending: 1,
        blendingMode: 1,
        greyscale: false,
      }),
    );

    return effectComposer;
  }, [camera, gl, scene]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
  }, [composer, size]);

  useFrame((_, delta) => {
    composer.render(delta);
  }, 1);

  useEffect(() => {
    return () => composer.dispose();
  }, [composer]);

  return null;
};

const Scene = () => {
  return (
    <div className="scene">
      <Canvas dpr={[1, 1]}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.12} />
          <directionalLight position={[0, 18, 5]} intensity={2.2} />
          <SphereRing />
          <HalftoneComposer />
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} onUpdate={(camera) => camera.lookAt(0, 0, 0)} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export { Scene };
