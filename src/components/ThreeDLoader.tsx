"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeDLoaderProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function ThreeDLoader({
  size = 200,
  primaryColor = "#6366f1",
  secondaryColor = "#a855f7",
}: ThreeDLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let animationId: number;
    const cubes: THREE.Mesh[] = [];
    const particles: THREE.Points[] = [];

    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 6;

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(size, size);
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }

      const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      geometry.computeBoundingBox();

      for (let i = 0; i < 12; i++) {

        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext("2d")!;

        const gradient = context.createLinearGradient(0, 0, 0, 64);
        gradient.addColorStop(0, primaryColor || "#6366f1");
        gradient.addColorStop(1, secondaryColor || "#a855f7");

        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);

        const material = new THREE.MeshPhysicalMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9,
          metalness: 0.3,
          roughness: 0.2,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          emissive: new THREE.Color(primaryColor || "#6366f1"),
          emissiveIntensity: 0.1,
        });

        const cube = new THREE.Mesh(geometry, material);

        const angle = (i / 12) * Math.PI * 2;
        const radius = 2;
        cube.position.x = Math.cos(angle) * radius;
        cube.position.y = Math.sin(angle) * radius;
        cube.position.z = Math.sin(angle * 2) * 0.5;

        cube.castShadow = true;
        cube.receiveShadow = true;

        scene.add(cube);
        cubes.push(cube);
      }

      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 50;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
      }

      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particleMaterial = new THREE.PointsMaterial({
        color: primaryColor || "#6366f1",
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      const particleSystem = new THREE.Points(
        particleGeometry,
        particleMaterial
      );
      scene.add(particleSystem);
      particles.push(particleSystem);

      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      scene.add(directionalLight);

      const pointLight1 = new THREE.PointLight(
        primaryColor || "#6366f1",
        0.8,
        10
      );
      pointLight1.position.set(3, 0, 3);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(
        secondaryColor || "#a855f7",
        0.8,
        10
      );
      pointLight2.position.set(-3, 0, 3);
      scene.add(pointLight2);

      animate();
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.003;

      cubes.forEach((cube, index) => {
        // Smooth rotation
        cube.rotation.x = time * 0.8 + index * 0.2;
        cube.rotation.y = time * 1.2 + index * 0.3;
        cube.rotation.z = time * 0.6 + index * 0.1;

        // Wave-like scaling effect
        const scale = 0.7 + Math.sin(time * 2 + index * 0.8) * 0.4;
        cube.scale.setScalar(scale);

        // Orbital motion with vertical wave
        const angle = time + (index / cubes.length) * Math.PI * 2;
        const radius = 2 + Math.sin(time * 0.5) * 0.3;
        cube.position.x = Math.cos(angle) * radius;
        cube.position.y =
          Math.sin(angle) * radius + Math.sin(time * 1.5 + index) * 0.3;
        cube.position.z = Math.sin(angle * 3 + time) * 0.8;

        // Dynamic opacity with breathing effect
        const opacity = 0.6 + Math.sin(time * 3 + index * 1.2) * 0.3;
        (cube.material as THREE.MeshPhysicalMaterial).opacity = opacity;

        // Subtle emissive intensity variation
        const emissiveIntensity = 0.1 + Math.sin(time * 2 + index * 0.5) * 0.05;
        (cube.material as THREE.MeshPhysicalMaterial).emissiveIntensity =
          emissiveIntensity;
      });

      // Animate particles
      particles.forEach((particle) => {
        particle.rotation.y = time * 0.2;
        particle.rotation.x = time * 0.1;

        const positions = particle.geometry.attributes.position
          .array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time + i) * 0.01;
        }
        particle.geometry.attributes.position.needsUpdate = true;
      });

      // Gentle camera movement
      camera.position.x = Math.sin(time * 0.2) * 0.5;
      camera.position.y = Math.cos(time * 0.15) * 0.3;
      camera.lookAt(0, 0, 0);

      // Slow rotation of entire scene
      scene.rotation.z = time * 0.1;

      renderer.render(scene, camera);
    }

    init();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
      cubes.forEach((cube) => {
        if (cube.material) {
          (cube.material as THREE.Material).dispose();
        }
        if (cube.geometry) {
          cube.geometry.dispose();
        }
      });
      particles.forEach((particle) => {
        if (particle.material) {
          (particle.material as THREE.Material).dispose();
        }
        if (particle.geometry) {
          particle.geometry.dispose();
        }
      });
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [size, primaryColor, secondaryColor]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div
        ref={containerRef}
        className="flex items-center justify-center rounded-lg"
        style={{
          filter: "drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))",
        }}
      />
    </div>
  );
}
