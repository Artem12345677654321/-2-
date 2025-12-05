import { WebGLScene } from './WebGLScene.js';
import { Cursor } from './Cursor.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("PLATO RUG: Initializing modules...");
    
    // 1. Initialize main WebGL scene
    const mainScene = new WebGLScene('webgl-canvas');
    mainScene.init();
    mainScene.animate();
    
    // 2. Initialize Custom Cursor
    const customCursor = new Cursor();
    customCursor.init();

    // 3. Scroll Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const sections = document.querySelectorAll('.section');
        
        sections.forEach((section, index) => {
            // Animate content inside section
            const content = section.querySelector('.text-container');
            
            if (content) {
                gsap.from(content, {
                    opacity: 0,
                    y: 100, 
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 75%", // When top of section hits 75% of viewport
                        toggleActions: "play none none reverse" 
                    }
                });
            }
        });
        
        console.log("PLATO RUG: Scroll Animations Ready");
    } else {
        console.warn("GSAP or ScrollTrigger not found");
    }
});