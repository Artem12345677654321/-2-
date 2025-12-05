<script setup lang="ts">
// Импорты Three.js и GSAP временно убраны для отладки
</script>

<template>
  <div class="test-container">
    <h1 class="test-text">
      ✅ VUE-ДВИЖОК ЗАПУЩЕН. ГОТОВЫ К WEBGL
    </h1>
  </div>
</template>

<style scoped>
.test-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #050505; /* Фон PLATO RUG */
}
.test-text {
  font-family: 'Playfair Display', serif;
  color: #A08A6F; /* Акцентный цвет PLATO RUG */
  font-size: 3em;
  text-align: center;
  z-index: 100;
}
</style>