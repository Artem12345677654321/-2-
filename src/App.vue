<script setup lang="ts">
import { onMounted } from 'vue';
import WebGlBackground from './components/WebGlBackground.vue';
import CustomCursor from './components/CustomCursor.vue';
import AnimatedHeading from './components/AnimatedHeading.vue';
import ProductViewer3D from './components/ProductViewer3D.vue';
import SectionScroll from './components/SectionScroll.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
    // Optional: Global soft scroll setup could go here if using a library like Lenis.
    // For now, we rely on CSS smooth-scroll and GSAP triggers.
});
</script>

<template>
  <div class="relative w-full min-h-screen text-[#F0F0F0] selection:bg-[#A08A6F] selection:text-white">
    <!-- 1. Immersive WebGL Background -->
    <WebGlBackground />

    <!-- 2. Custom UX Cursor -->
    <CustomCursor />

    <!-- 3. Main Content Layer -->
    <main class="relative z-10 w-full flex flex-col items-center overflow-hidden">
      
      <!-- Navigation -->
      <nav class="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference">
        <div class="text-xl font-serif tracking-widest text-[#A08A6F] interactive-target cursor-pointer hover:opacity-80 transition-opacity">
          PLATO
        </div>
        <div class="hidden md:flex gap-10 text-xs uppercase tracking-widest text-white/80">
          <button 
            v-for="item in ['Collection', 'Atelier', 'About', 'Contact']" 
            :key="item" 
            class="hover:text-[#A08A6F] transition-colors duration-300 interactive-target"
          >
            {{ item }}
          </button>
        </div>
        <button class="text-xs border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 interactive-target uppercase tracking-widest">
          Menu
        </button>
      </nav>

      <!-- Hero Section -->
      <section class="relative w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-20 pt-20">
        <div class="mb-6 overflow-hidden">
          <span class="text-[#A08A6F] text-xs uppercase tracking-[0.3em] inline-block animate-fade-in-up font-medium">
            Imperial Style
          </span>
        </div>
        
        <AnimatedHeading 
          text="Redefining The Art Of Weaving" 
          className="font-serif text-5xl md:text-8xl lg:text-9xl leading-[0.9] text-white mix-blend-screen mb-8 text-center"
          :delay="0.2"
        />

        <div class="mt-8 max-w-lg mx-auto opacity-0 animate-fade-in-up-delay-1 text-center">
          <p class="text-white/60 text-lg leading-relaxed font-light font-sans antialiased">
            Experience the tactile silence of luxury. PLATO RUG combines ancient craftsmanship with digital immersion.
          </p>
        </div>

        <div class="mt-16 opacity-0 animate-fade-in-up-delay-2">
          <button class="interactive-target group relative px-10 py-5 overflow-hidden border border-white/20 rounded-full transition-all duration-500 hover:border-white/40">
            <span class="relative z-10 text-xs uppercase tracking-widest group-hover:text-black transition-colors duration-300 font-medium">
              Explore Collection
            </span>
            <div class="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out"></div>
          </button>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-pulse-slow">
            <span class="text-[10px] uppercase tracking-widest">Scroll</span>
            <div class="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      <!-- 3D Product Showcase Section -->
      <section class="w-full max-w-7xl mx-auto px-6 py-24">
        <div class="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8">
            <div>
                <span class="text-[#A08A6F] text-xs uppercase tracking-widest mb-2 block">Featured Masterpiece</span>
                <h2 class="text-3xl md:text-5xl font-serif">The Imperial Knot</h2>
            </div>
            <div class="mt-4 md:mt-0 max-w-xs text-right text-white/50 text-sm">
                Interact with the model to appreciate the texture and light response.
            </div>
        </div>
        
        <!-- The 3D Viewer Component -->
        <ProductViewer3D />
      </section>

      <!-- Scroll Trigger Parallax Section -->
      <SectionScroll />
      
      <!-- Footer Placeholder -->
      <footer class="w-full py-12 border-t border-white/10 text-center">
         <span class="text-white/30 text-xs uppercase tracking-widest">© 2024 Plato Rug. All Rights Reserved.</span>
      </footer>

    </main>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
}

.animate-fade-in-up-delay-1 {
  animation: fadeInUp 1s ease-out 0.8s forwards;
}

.animate-fade-in-up-delay-2 {
  animation: fadeInUp 1s ease-out 1s forwards;
}

.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.7; }
}
</style>