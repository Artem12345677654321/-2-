<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const cursorRef = ref<HTMLDivElement | null>(null);
const cursorInnerRef = ref<HTMLDivElement | null>(null);

const onMouseMove = (e: MouseEvent) => {
  if (cursorRef.value) {
    // Outer cursor with smooth lerping via GSAP
    gsap.to(cursorRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.2,
      ease: "power2.out"
    });
  }
  
  if (cursorInnerRef.value) {
    // Inner dot follows instantly (or very fast)
    gsap.to(cursorInnerRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0,
    });
  }
};

const onMouseEnter = () => {
  if (cursorRef.value && cursorInnerRef.value) {
    gsap.to(cursorRef.value, { scale: 1.5, opacity: 0.5, duration: 0.3 });
    gsap.to(cursorInnerRef.value, { scale: 0.5, duration: 0.3 });
  }
};

const onMouseLeave = () => {
  if (cursorRef.value && cursorInnerRef.value) {
    gsap.to(cursorRef.value, { scale: 1, opacity: 1, duration: 0.3 });
    gsap.to(cursorInnerRef.value, { scale: 1, duration: 0.3 });
  }
};

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);

  // Add listeners to interactive elements
  const targets = document.querySelectorAll('.interactive-target, a, button');
  targets.forEach(el => {
    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
  });
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  
  const targets = document.querySelectorAll('.interactive-target, a, button');
  targets.forEach(el => {
    el.removeEventListener('mouseenter', onMouseEnter);
    el.removeEventListener('mouseleave', onMouseLeave);
  });
});
</script>

<template>
  <div>
    <!-- Outer Ring -->
    <div 
      ref="cursorRef"
      class="fixed top-0 left-0 w-10 h-10 border border-[#A08A6F] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    ></div>
    <!-- Inner Dot -->
    <div 
      ref="cursorInnerRef"
      class="fixed top-0 left-0 w-2 h-2 bg-[#A08A6F] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
    ></div>
  </div>
</template>
