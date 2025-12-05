<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

// Debug: Using a container div to strictly follow appendChild pattern
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
  // Debug: Clear background color to ensure visibility if alpha fails (though we want transparent eventually)
  // For now, keep it clear or use a very dark color to see the cube clearly against it.
  // scene.background = new THREE.Color(0x000000); 

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
  
  // Strict Debug: Append canvas to container
  // Clear any existing children first just in case
  while (containerRef.value.firstChild) {
    containerRef.value.removeChild(containerRef.value.firstChild);
  }
  containerRef.value.appendChild(renderer.domElement);

  // 4. Content: DEBUG RED CUBE
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: false });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  console.log("WebGlBackground: Scene initialized with Red Cube");
};

const renderScene = () => {
  animationFrameId = requestAnimationFrame(renderScene);

  // Debug Animation
  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
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
  try {
    initThree();
    renderScene();
    window.addEventListener('resize', handleResize);
  } catch (err) {
    console.error("WebGlBackground Error:", err);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  cancelAnimationFrame(animationFrameId);
  
  if (renderer) {
    renderer.dispose();
    const domElement = renderer.domElement;
    if (domElement && domElement.parentNode) {
      domElement.parentNode.removeChild(domElement);
    }
  }
  
  if (scene) {
    // Basic cleanup
    scene.clear();
  }
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
  background: transparent;
}
</style>