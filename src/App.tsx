import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mountEl = mountRef.current;

    if (!mountEl) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#05060a");

    const camera = new THREE.PerspectiveCamera(55, mountEl.clientWidth / mountEl.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 16);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
    mountEl.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(5, 8, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x66aaff, 0.8);
    rimLight.position.set(-6, -4, -8);
    scene.add(rimLight);

    const tiltGroup = new THREE.Group();
    const spinGroup = new THREE.Group();
    scene.add(tiltGroup);
    tiltGroup.add(spinGroup);

    const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const totalSpheres = 11;
    const ringRadius = 5;

    for (let i = 0; i < totalSpheres; i += 1) {
      const angle = (i / totalSpheres) * Math.PI * 2;
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.25,
        roughness: 0.22,
      });
      const sphere = new THREE.Mesh(sphereGeometry, material);

      sphere.position.set(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0);

      spinGroup.add(sphere);
    }

    tiltGroup.rotation.x = -Math.PI / 2.8;

    let frameId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Spin along the ring's own axis after the initial tilt is applied.
      spinGroup.rotation.z = elapsed * 0.6;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = mountEl.clientWidth;
      const height = mountEl.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(frameId);

      spinGroup.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      sphereGeometry.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    />
  );
}
