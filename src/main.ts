import './styles/base.css';
import { WebGLScene } from './webgl/WebGLScene';
import { Cursor } from './ui/Cursor';
import gsap from 'gsap';

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('💎 PLATO RUG: Initializing Vanilla JS...');

  // 1. Initialize WebGL Scene
  try {
    new WebGLScene('webgl-container');
    console.log('✅ WebGL Scene Started');
  } catch (e) {
    console.error('❌ WebGL Error:', e);
  }

  // 2. Initialize Custom Cursor
  new Cursor();
  console.log('✅ Custom Cursor Started');

  // 3. Intro Animation with GSAP
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('#hero-title', {
    y: 0,
    opacity: 1,
    duration: 1.5,
    delay: 0.5
  })
  .to('#hero-subtitle', {
    y: 0,
    opacity: 1,
    duration: 1,
  }, '-=1.0');
  
});