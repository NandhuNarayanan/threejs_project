'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SpheresScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    const spheres: THREE.Mesh[] = [];

    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

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
      scene.background = new THREE.Color(0xf8e3e7); // soft background

      // 🌟 Glowing, shiny material
      const geometry = new THREE.SphereGeometry(0.15, 32, 32);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xf8e3e7,
        emissive: 0xf8e3e7,
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
        mesh.position.set(
          Math.random() * 10 - 5,
          Math.random() * 10 - 5,
          Math.random() * 10 - 5
        );
        mesh.scale.setScalar(Math.random() * 2 + 0.5);
        scene.add(mesh);
        spheres.push(mesh);
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
        containerRef.current.innerHTML = ''; 
        containerRef.current.appendChild(renderer.domElement);
      }

      window.addEventListener('resize', onWindowResize);
      document.addEventListener('mousemove', onMouseMove);

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

      for (let i = 0; i < spheres.length; i++) {
        const s = spheres[i];
        s.position.x = 5 * Math.cos(timer + i);
        s.position.y = 5 * Math.sin(timer + i * 1.1);
        s.rotation.x += 0.005;
        s.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    }

    init();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      document.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
