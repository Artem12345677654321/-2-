// src/main.ts
import { createApp } from 'vue';
// Импортируем главный компонент
import App from './App.vue'; 
// Импортируем стили
import './styles/base.css'; 

const mountPoint = document.getElementById('app');

if (!mountPoint) {
  console.error("КРИТИЧЕСКАЯ ОШИБКА: Элемент #app не найден в index.html. Проверьте ID.");
} else {
    // 💥 Монтируем приложение к элементу с id="app"
    createApp(App).mount('#app'); 
}