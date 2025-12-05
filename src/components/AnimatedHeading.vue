<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import gsap from 'gsap';

const props = defineProps<{
  text: string;
  delay?: number;
  className?: string;
}>();

const containerRef = ref<HTMLDivElement | null>(null);

// Split text into words for animation
const words = computed(() => props.text.split(' '));

onMounted(() => {
  if (!containerRef.value) return;
  
  const wordElements = containerRef.value.querySelectorAll('.word-wrapper');
  
  gsap.fromTo(wordElements, 
    { 
      y: 50, 
      opacity: 0,
      rotateX: -20
    },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 1.2,
      stagger: 0.05,
      delay: props.delay || 0,
      ease: "power3.out"
    }
  );
});
</script>

<template>
  <div ref="containerRef" :class="['overflow-hidden', className]">
    <span v-for="(word, index) in words" :key="index" class="inline-block overflow-hidden mr-[0.25em] align-top">
      <span class="word-wrapper inline-block will-change-transform">
        {{ word }}
      </span>
    </span>
  </div>
</template>
