"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

interface SpheresSceneProps {
  uploadStatus?: "idle" | "uploading" | "done";
  uploadProgress?: number;
}

export default function SpheresScene({
  uploadStatus = "idle",
  uploadProgress = 0,
}: SpheresSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    const spheres: THREE.Mesh[] = [];
    const sphereData: Array<{
      mesh: THREE.Mesh;
      originalPosition: THREE.Vector3;
      targetPosition: THREE.Vector3;
      explosionVelocity: THREE.Vector3;
    }> = [];

    let mouseX = 0,
      mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    // Animation states
    let animationPhase = "normal"; // 'normal', 'gathering', 'exploding'
    let phaseStartTime = 0;
    const GATHER_DURATION = 1500; // 1.5 seconds to gather
    const EXPLOSION_DURATION = 2000; // 2 seconds explosion

    function onMouseMove(event: MouseEvent) {
      mouseX = (event.clientX - windowHalfX) / 100;
      mouseY = (event.clientY - windowHalfY) / 100;
    }

    function init() {
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      camera.position.z = 5;

      scene = new THREE.Scene();

  // Create black gradient background using canvas
const canvas = document.createElement("canvas");
canvas.width = 1;
canvas.height = 512;

const ctx = canvas.getContext("2d")!;
const gradient = ctx.createLinearGradient(0, 512, 0, 0);

gradient.addColorStop(0, "#242124"); 
gradient.addColorStop(1, "#003366"); 

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 1, 512);

const texture = new THREE.CanvasTexture(canvas);
scene.background = texture;


      // 🌟 Glowing, shiny material
      const geometry = new THREE.SphereGeometry(0.15, 32, 32);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x0b2bb5,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.6,
        roughness: 0.15,
        metalness: 0.7,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        transmission: 0.3,
        thickness: 1,
        reflectivity: 1,
      });

      for (let i = 0; i < 300; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        const originalPos = new THREE.Vector3(
          Math.random() * 10 - 5,
          Math.random() * 10 - 5,
          Math.random() * 10 - 5
        );
        mesh.position.copy(originalPos);
        mesh.scale.setScalar(Math.random() * 2 + 0.5);
        scene.add(mesh);
        spheres.push(mesh);

        // Store sphere data for animations
        sphereData.push({
          mesh,
          originalPosition: originalPos.clone(),
          targetPosition: new THREE.Vector3(0, 0, 0), // Center point for gathering
          explosionVelocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
          ),
        });
      }

      // 💡 Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 2, 100);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(renderer.domElement);
      }

      window.addEventListener("resize", onWindowResize);
      document.addEventListener("mousemove", onMouseMove);

      animate();
    }

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);

      const timer = 0.0001 * Date.now();
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      const currentTime = Date.now();

      for (let i = 0; i < sphereData.length; i++) {
        const data = sphereData[i];
        const s = data.mesh;

        if (animationPhase === "normal") {
          // Original circular motion
          s.position.x = 5 * Math.cos(timer + i);
          s.position.y = 5 * Math.sin(timer + i * 1.1);
        } else if (animationPhase === "gathering") {
          // Lerp towards center
          const progress = Math.min(
            (currentTime - phaseStartTime) / GATHER_DURATION,
            1
          );
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

          const startPos = new THREE.Vector3(
            5 * Math.cos(timer + i),
            5 * Math.sin(timer + i * 1.1),
            data.originalPosition.z
          );

          s.position.lerpVectors(startPos, data.targetPosition, easeProgress);
        } else if (animationPhase === "exploding") {
          // Explosion outward
          const progress = (currentTime - phaseStartTime) / EXPLOSION_DURATION;
          const explosionForce = progress * progress * 20; // Quadratic acceleration

          s.position.x = data.explosionVelocity.x * explosionForce;
          s.position.y = data.explosionVelocity.y * explosionForce;
          s.position.z = data.explosionVelocity.z * explosionForce;

          // Add some rotation during explosion
          s.rotation.x += 0.02;
          s.rotation.y += 0.03;
          s.rotation.z += 0.01;
        }

        // Always rotate spheres
        if (animationPhase !== "exploding") {
          s.rotation.x += 0.005;
          s.rotation.y += 0.01;
        }
      }

      renderer.render(scene, camera);
    }

    init();

    // Handle upload state changes
    const handleUploadStates = () => {
      if (uploadStatus === "uploading" && animationPhase === "normal") {
        // Start gathering when upload begins
        animationPhase = "gathering";
        phaseStartTime = Date.now();
      } else if (uploadStatus === "done" && animationPhase === "gathering") {
        // Start explosion when upload completes
        animationPhase = "exploding";
        phaseStartTime = Date.now();

        // Reset to normal after explosion
        setTimeout(() => {
          animationPhase = "normal";
          // Reset sphere positions to original pattern
          for (let i = 0; i < sphereData.length; i++) {
            const data = sphereData[i];
            data.mesh.position.copy(data.originalPosition);
          }
        }, EXPLOSION_DURATION);
      }
    };

    handleUploadStates();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
    };
  }, [uploadStatus, uploadProgress]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
