import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Validate Environment
    if (!THREE || !gsap) {
        document.body.innerHTML = '<h1>❌ Error: Modules not loaded.</h1>';
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    console.log("💎 PLATO RUG: Modules Loaded");

    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // === WEBGL LOGIC (RED CUBE) ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // === SCROLL LOGIC (ScrollTrigger) ===
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => {
        gsap.from(section.children, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse"
            }
        });
    });
    
    // Optional: Rotate cube faster on scroll
    ScrollTrigger.create({
        trigger: "#content",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
            cube.rotation.z = self.progress * Math.PI * 2;
        }
    });
});