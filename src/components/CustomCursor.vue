<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const cursorRef = ref<HTMLDivElement | null>(null);
const cursorInnerRef = ref<HTMLDivElement | null>(null);

const onMouseMove = (e: MouseEvent) => {
  // Outer Ring: Slower, "floaty" feel
  if (cursorRef.value) {
    gsap.to(cursorRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.6, // Increased from 0.2 to 0.6 for more "lag"
      ease: "power2.out"
    });
  }
  
  // Inner Dot: Immediate response
  if (cursorInnerRef.value) {
    gsap.to(cursorInnerRef.value, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1, 
      ease: "power2.out"
    });
  }
};

const onMouseEnter = () => {
  if (cursorRef.value && cursorInnerRef.value) {
    gsap.to(cursorRef.value, { scale: 2, opacity: 0.4, duration: 0.4 });
    gsap.to(cursorInnerRef.value, { scale: 0.5, duration: 0.4 });
  }
};

const onMouseLeave = () => {
  if (cursorRef.value && cursorInnerRef.value) {
    gsap.to(cursorRef.value, { scale: 1, opacity: 1, duration: 0.4 });
    gsap.to(cursorInnerRef.value, { scale: 1, duration: 0.4 });
  }
};

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);

  // Use a timeout to ensure elements are rendered before attaching
  setTimeout(() => {
    const targets = document.querySelectorAll('.interactive-target, a, button');
    targets.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });
  }, 100);
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
      class="fixed top-0 left-0 w-12 h-12 border border-[#A08A6F] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
    ></div>
    <!-- Inner Dot -->
    <div 
      ref="cursorInnerRef"
      class="fixed top-0 left-0 w-2 h-2 bg-[#A08A6F] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
    ></div>
  </div>
</template>