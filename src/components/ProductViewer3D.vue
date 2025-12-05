<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const containerRef = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let debugCube: THREE.Mesh;
let animationFrameId: number;

const initThree = () => {
  if (!containerRef.value) return;

  // 1. Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111111); // Dark background for the card

  // 2. Camera
  camera = new THREE.PerspectiveCamera(45, containerRef.value.clientWidth / containerRef.value.clientHeight, 0.1, 100);
  camera.position.set(3, 3, 5);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  containerRef.value.appendChild(renderer.domElement);

  // 4. Content: DEBUG GREEN CUBE
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  // Using MeshBasicMaterial so we don't need lights for the debug phase
  const material = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true });
  debugCube = new THREE.Mesh(geometry, material);
  scene.add(debugCube);

  // 5. Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 2;
  controls.maxDistance = 10;
  
  console.log("ProductViewer3D: Initialized with Green Cube");
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  
  if (controls) controls.update();
  
  // Optional: Auto-rotate the cube slowly to show it's alive even without interaction
  if (debugCube) {
      debugCube.rotation.y += 0.005;
  }

  if (renderer && scene && camera) {
      renderer.render(scene, camera);
  }
};

onMounted(() => {
  initThree();
  animate();
  
  window.addEventListener('resize', () => {
     if(containerRef.value && camera && renderer) {
         camera.aspect = containerRef.value.clientWidth / containerRef.value.clientHeight;
         camera.updateProjectionMatrix();
         renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
     }
  });
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  if (renderer) renderer.dispose();
  if (controls) controls.dispose();
});
</script>

<template>
  <div class="relative w-full h-[500px] md:h-[600px] bg-[#0a0a0a] rounded-lg overflow-hidden border border-white/10 interactive-target shadow-2xl">
    <div ref="containerRef" class="w-full h-full cursor-move z-10 relative"></div>
    
    <!-- UI Overlay -->
    <div class="absolute bottom-6 left-6 pointer-events-none z-20">
        <h3 class="text-white text-2xl font-serif">Debug Viewer</h3>
        <p class="text-[#A08A6F] text-sm tracking-widest uppercase mt-1">Interactivity Test</p>
    </div>
    <div class="absolute top-6 right-6 pointer-events-none z-20">
        <span class="text-white/30 text-xs uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full">Drag to rotate</span>
    </div>
  </div>
</template>