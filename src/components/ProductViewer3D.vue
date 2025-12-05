<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const containerRef = ref<HTMLDivElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let rugMesh: THREE.Mesh;
let animationFrameId: number;

const initThree = () => {
  if (!containerRef.value) return;

  // 1. Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a); // Dark background for the viewer container

  // 2. Camera
  camera = new THREE.PerspectiveCamera(45, containerRef.value.clientWidth / containerRef.value.clientHeight, 0.1, 100);
  camera.position.set(0, 3, 4);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  containerRef.value.appendChild(renderer.domElement);

  // 4. Lighting (Premium Look)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  scene.add(dirLight);

  const spotLight = new THREE.SpotLight(0xA08A6F, 2);
  spotLight.position.set(-5, 5, 0);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.5;
  scene.add(spotLight);

  // 5. Product (Rug Placeholder)
  // Geometry: Width, Height (thickness), Depth
  const geometry = new THREE.BoxGeometry(2, 0.05, 3);
  
  // Create a procedural texture resembling fabric
  const createFabricTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0,0,512,512);
        
        // Noise
        for(let i=0; i<50000; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#2a2a2a' : '#111111';
            ctx.fillRect(Math.random()*512, Math.random()*512, 2, 2);
        }
        // Pattern
        ctx.strokeStyle = '#A08A6F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0,0); ctx.lineTo(512,512);
        ctx.moveTo(512,0); ctx.lineTo(0,512);
        ctx.stroke();
    }
    const tex = new THREE.Texture(canvas);
    tex.needsUpdate = true;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }

  const material = new THREE.MeshStandardMaterial({ 
    map: createFabricTexture(),
    roughness: 0.9,
    metalness: 0.1,
    color: 0xffffff
  });

  rugMesh = new THREE.Mesh(geometry, material);
  rugMesh.castShadow = true;
  rugMesh.receiveShadow = true;
  scene.add(rugMesh);

  // Ground plane for shadow
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0a0a0a, 
      roughness: 1, 
      metalness: 0 
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.05;
  plane.receiveShadow = true;
  scene.add(plane);

  // 6. Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2 - 0.1; // Don't allow going below ground
  controls.minDistance = 2;
  controls.maxDistance = 8;
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  if (controls) controls.update();
  if (renderer && scene && camera) renderer.render(scene, camera);
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
  <div class="relative w-full h-[600px] md:h-[800px] bg-[#0a0a0a] rounded-lg overflow-hidden border border-white/10 interactive-target">
    <div ref="containerRef" class="w-full h-full cursor-move"></div>
    <div class="absolute bottom-6 left-6 pointer-events-none">
        <h3 class="text-white text-2xl font-serif">Imperial Knot</h3>
        <p class="text-[#A08A6F] text-sm tracking-widest uppercase mt-1">3D Visualization</p>
    </div>
    <div class="absolute top-6 right-6 pointer-events-none">
        <span class="text-white/30 text-xs uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full">Drag to rotate</span>
    </div>
  </div>
</template>