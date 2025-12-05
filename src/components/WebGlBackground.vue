<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const canvasRef = ref<HTMLCanvasElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let particles: THREE.Points;
let animationFrameId: number;

const initThree = () => {
  if (!canvasRef.current) return;

  // 1. Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.002);

  // 2. Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.current,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 4. Content (Particles)
  const geometry = new THREE.BufferGeometry();
  const count = 1500;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Create texture programmatically
  const getTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  const material = new THREE.PointsMaterial({
    size: 0.06,
    map: getTexture(),
    transparent: true,
    opacity: 0.3,
    color: 0xA08A6F, // Premium Accent Color
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
};

const renderScene = () => {
  animationFrameId = requestAnimationFrame(renderScene);

  if (particles) {
    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;
  }

  renderer.render(scene, camera);
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
});
</script>

<template>
  <canvas ref="canvasRef" class="webgl-canvas"></canvas>
</template>

<style scoped>
.webgl-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>
