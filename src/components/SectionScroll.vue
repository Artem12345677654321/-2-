<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!sectionRef.value || !contentRef.value || !imageRef.value) return;

  // 1. Text Entry Animation
  gsap.fromTo(contentRef.value,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top 75%", // When top of section hits 75% of viewport
        toggleActions: "play none none reverse"
      }
    }
  );

  // 2. Parallax Image Effect
  gsap.fromTo(imageRef.value,
    { y: -50 }, // Start slightly up
    {
      y: 50,    // Move down as we scroll
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top bottom",
        end: "bottom top",
        scrub: true // Link animation to scroll bar
      }
    }
  );
});
</script>

<template>
  <section ref="sectionRef" class="relative w-full py-32 px-6 md:px-20 overflow-hidden min-h-screen flex items-center justify-center">
    
    <!-- Background Parallax Image -->
    <div class="absolute inset-0 z-0 opacity-20">
      <div ref="imageRef" class="w-full h-[120%] bg-[url('https://images.unsplash.com/photo-1600166898405-da9535204843?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center -mt-10"></div>
    </div>
    
    <!-- Content -->
    <div ref="contentRef" class="relative z-10 max-w-4xl mx-auto text-center">
      <span class="text-[#A08A6F] text-xs uppercase tracking-[0.4em] mb-4 block">The Atelier</span>
      <h2 class="text-4xl md:text-7xl font-serif text-white mb-8 leading-tight">
        Woven into <br/> <span class="text-[#A08A6F] italic">Eternity</span>
      </h2>
      <p class="text-white/70 text-lg font-light leading-relaxed max-w-2xl mx-auto mb-12">
        Each knot is a testament to patience. Our artisans dedicate months to a single piece, ensuring that the soul of the design is captured in every fiber. It is not just a rug; it is a landscape for your home.
      </p>
      
      <div class="flex justify-center gap-8">
        <div class="flex flex-col items-center">
             <span class="text-3xl font-serif text-white block mb-1">100%</span>
             <span class="text-xs uppercase tracking-widest text-white/50">Silk & Wool</span>
        </div>
        <div class="flex flex-col items-center">
             <span class="text-3xl font-serif text-white block mb-1">4.5k</span>
             <span class="text-xs uppercase tracking-widest text-white/50">Knots / sq in</span>
        </div>
      </div>
    </div>

  </section>
</template>