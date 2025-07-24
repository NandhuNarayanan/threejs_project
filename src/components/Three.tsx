"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

interface ThreeCarSceneProps {
  uploadStatus: "idle" | "uploading" | "done";
  uploadProgress: number;
}

export default function ThreeScene({
  uploadStatus,
  uploadProgress,
}: ThreeCarSceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<THREE.Group | null>(null);
  const cubeRefs = useRef<THREE.Mesh[]>([]);
  const frameId = useRef<number>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [fillProgress, setFillProgress] = useState(0);

  useEffect(() => {
    if (uploadStatus === "uploading") {
      setFillProgress(0);
      cubeRefs.current.forEach((cube) => containerRef.current?.remove(cube));
      cubeRefs.current = [];
    }
  }, [uploadStatus]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controlsRef.current = controls;

    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load("/textures/grass.jpg");
    grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(50, 50);

    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ map: grassTexture, roughness: 1 })
    );
    grass.rotation.x = -Math.PI / 2;
    scene.add(grass);

    const boxContainer = new THREE.Group();

    const containerWidth = 4.8;
    const containerHeight = 2.7;
    const containerDepth = 2.7;

    const wallMaterial = new THREE.MeshStandardMaterial({ color: "#B22222" });
    const panelWidth = 0.1;
    const panelDepth = 0.05;

    for (let i = -containerWidth / 2 + 0.1; i <= containerWidth / 2 - 0.1; i += 0.12) {
      const leftPanel = new THREE.Mesh(
        new THREE.BoxGeometry(panelWidth, containerHeight, panelDepth),
        wallMaterial
      );
      leftPanel.position.set(i, containerHeight / 2, -containerDepth / 2);
      boxContainer.add(leftPanel);

      const rightPanel = new THREE.Mesh(
        new THREE.BoxGeometry(panelWidth, containerHeight, panelDepth),
        wallMaterial
      );
      rightPanel.position.set(i, containerHeight / 2, containerDepth / 2);
      boxContainer.add(rightPanel);
    }

    for (let i = -containerDepth / 2 + 0.1; i <= containerDepth / 2 - 0.1; i += 0.12) {
      const backPanel = new THREE.Mesh(
        new THREE.BoxGeometry(panelDepth, containerHeight, panelWidth),
        wallMaterial
      );
      backPanel.position.set(-containerWidth / 2, containerHeight / 2, i);
      boxContainer.add(backPanel);
    }

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(containerWidth, 0.1, containerDepth),
      new THREE.MeshStandardMaterial({ color: "#8B0000" })
    );
    base.position.y = 0.05;
    boxContainer.add(base);

    // Top split lid (left and right panels)
    const topLeft = new THREE.Mesh(
      new THREE.BoxGeometry(containerWidth / 2, 0.05, containerDepth),
      new THREE.MeshStandardMaterial({ color: "#8B0000" })
    );
    topLeft.position.set(-containerWidth / 4, containerHeight + 0.025, 0);
    boxContainer.add(topLeft);

    const topRight = new THREE.Mesh(
      new THREE.BoxGeometry(containerWidth / 2, 0.05, containerDepth),
      new THREE.MeshStandardMaterial({ color: "#8B0000" })
    );
    topRight.position.set(containerWidth / 4, containerHeight + 0.025, 0);
    boxContainer.add(topRight);

    // Side lid
    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, containerHeight, containerDepth),
      new THREE.MeshStandardMaterial({ color: "#8B0000" })
    );
    lid.position.set(containerWidth / 2 + 0.05, containerHeight / 2, 0);
    boxContainer.add(lid);

    scene.add(boxContainer);
    containerRef.current = boxContainer;

    const animate = () => {
      frameId.current = requestAnimationFrame(animate);
      controls.update();

      if (uploadStatus === "uploading") {
        const targetCubes = Math.floor(uploadProgress / 3.3);
        if (fillProgress < targetCubes) {
          const cube = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.MeshStandardMaterial({ color: 0x00ff99 })
          );
          cube.position.set(6, 0.5, 0);
          scene.add(cube);

          const targetX = -2 + (cubeRefs.current.length % 10) * 0.4;
          const targetY = 0.2 + Math.floor(cubeRefs.current.length / 10) * 0.25;
          const targetZ = (Math.random() - 0.5) * containerDepth * 0.8;

          const animateCube = () => {
            if (!cube) return;
            const dx = (targetX - cube.position.x) * 0.1;
            const dy = (targetY - cube.position.y) * 0.1;
            const dz = (targetZ - cube.position.z) * 0.1;
            cube.position.x += dx;
            cube.position.y += dy;
            cube.position.z += dz;

            if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01 && Math.abs(dz) < 0.01) {
              cube.position.set(targetX, targetY, targetZ);
              scene.remove(cube);
              containerRef.current?.add(cube);
              cubeRefs.current.push(cube);
              setFillProgress((prev) => prev + 1);
            } else {
              requestAnimationFrame(animateCube);
            }
          };

          animateCube();
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [uploadStatus, uploadProgress, fillProgress]);

  return (
    <div className="relative w-full md:aspect-video rounded-xl overflow-hidden shadow-lg">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}