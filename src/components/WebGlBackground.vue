<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const containerRef = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cube: THREE.Mesh;
let animationFrameId: number;

const initThree = () => {
  if (!containerRef.value) {
    console.error("WebGlBackground: Container not found");
    return;
  }

  // 1. Scene
  scene = new THREE.Scene();
  // Keep background transparent to blend with CSS, but ensure scene exists
  
  // 2. Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Clean container
  while (containerRef.value.firstChild) {
    containerRef.value.removeChild(containerRef.value.firstChild);
  }
  containerRef.value.appendChild(renderer.domElement);

  // 4. Content: DEBUG RED CUBE
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  console.log("WebGlBackground: Scene initialized with Red Cube");
};

const renderScene = () => {
  animationFrameId = requestAnimationFrame(renderScene);

  // Debug Animation
  if (cube) {
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
};

const handleResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
};

onMounted(() => {
  initThree();
  renderScene();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrameId);
  if (renderer) renderer.dispose();
  if (scene) scene.clear();
});
</script>

<template>
  <div ref="containerRef" class="webgl-canvas-container"></div>
</template>

<style scoped>
.webgl-canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0; 
  pointer-events: none;
}
</style>