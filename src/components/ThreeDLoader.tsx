"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import React from "react";

function Model() {
  const gltf = useGLTF("/models/loading.glb");
  const { mixer } = useAnimations(gltf.animations, gltf.scene);

  React.useEffect(() => {
    if (gltf.animations && gltf.animations.length) {
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
      return () => {
        action.stop();
      };
    }
    return undefined;
  }, [gltf.animations, mixer]);

  return <primitive object={gltf.scene} scale={1.5} position={[0, -1, 0]} />;
}

export default function ThreeDLoader() {
  return (
    <div className="absolute top-0 right-0 w-screen h-screen z-[9999] flex items-center justify-center backdrop-blur-md bg-black/10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5] }}
        gl={{ alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[8, 5, 5]} intensity={1} />
        <Model />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
