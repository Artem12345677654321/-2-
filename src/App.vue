<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import WebGlBackground from './components/WebGlBackground.vue';
import CustomCursor from './components/CustomCursor.vue';
import AnimatedHeading from './components/AnimatedHeading.vue';

// Logic for cursor: pass mouse position to background
const mousePosition = reactive({ x: 0, y: 0 });

onMounted(() => {
  window.addEventListener('mousemove', (e) => {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
  });
});
</script>

<template>
  <CustomCursor />
  <WebGlBackground :mousePosition="mousePosition" /> 
  
  <div style="position: relative; z-index: 10; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center;">
      <AnimatedHeading text="PLATO RUG: Тест WebGL" className="text-5xl md:text-7xl font-serif text-white text-center" />
  </div>
</template>