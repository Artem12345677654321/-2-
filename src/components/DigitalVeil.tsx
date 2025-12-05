import * as THREE from 'three';
import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

// --- GLSL SHADERS ---
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform vec2 u_mouse;
    uniform float u_reveal_radius;
    uniform vec2 u_flash_pos;
    uniform float u_flash_radius;
    
    varying vec2 vUv;
    
    void main() {
        // 1. Mouse Reveal Mask
        float dist_mouse = distance(vUv, u_mouse);
        float mouse_mask = smoothstep(u_reveal_radius, u_reveal_radius + 0.1, dist_mouse); 

        // 2. Random Flash Mask
        float dist_flash = distance(vUv, u_flash_pos);
        float flash_mask = smoothstep(u_flash_radius, u_flash_radius - 0.05, dist_flash);

        // 3. Combine
        float total_mask = max(mouse_mask, 1.0 - flash_mask);

        // Final color
        gl_FragColor = vec4(vec3(0.0), total_mask);
    }
`;

export const DigitalVeil: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniforms = useRef<any>(null);

    // --- RANDOM FLASH LOGIC ---
    const triggerRandomFlash = useCallback(() => {
        if (!uniforms.current) return;
        
        const randomX = Math.random() * 0.6 + 0.2;
        const randomY = Math.random() * 0.6 + 0.2;
        
        uniforms.current.u_flash_pos.value.set(randomX, randomY);
        uniforms.current.u_flash_radius.value = 0.0;
        
        // Schedule next flash after this one completes
        const onComplete = () => {
             const delay = Math.random() * 10 + 5; 
             gsap.delayedCall(delay, triggerRandomFlash);
        };
        
        gsap.timeline({ onComplete })
            .to(uniforms.current.u_flash_radius, {
                value: 0.6,
                duration: 0.8,
                ease: "power2.out"
            })
            .to(uniforms.current.u_flash_radius, {
                value: 0.0,
                duration: 0.8,
                ease: "power2.in"
            }, 0.2); 
    }, []);

    // --- WEBGL SETUP ---
    useEffect(() => {
        if (!canvasRef.current) return;

        const vRenderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
        vRenderer.setSize(window.innerWidth, window.innerHeight);
        vRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const vScene = new THREE.Scene();
        const vCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        vCamera.position.z = 1;

        // Initialize uniforms
        const initialUniforms = {
            u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
            u_reveal_radius: { value: 0.12 }, 
            u_flash_pos: { value: new THREE.Vector2(0.5, 0.5) },
            u_flash_radius: { value: 0.0 }
        };
        uniforms.current = initialUniforms;

        const veilMaterial = new THREE.ShaderMaterial({
            uniforms: initialUniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            depthWrite: false
        });

        const plane = new THREE.PlaneGeometry(2, 2);
        const veilMesh = new THREE.Mesh(plane, veilMaterial);
        vScene.add(veilMesh);

        // --- MOUSE MOVEMENT HANDLER ---
        const handleMouseMove = (e: MouseEvent) => {
            if (uniforms.current) {
                uniforms.current.u_mouse.value.x = e.clientX / window.innerWidth;
                uniforms.current.u_mouse.value.y = 1.0 - (e.clientY / window.innerHeight); 
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        // --- ANIMATION LOOP ---
        let requestID: number;
        const animate = () => {
            requestID = requestAnimationFrame(animate);
            vRenderer.render(vScene, vCamera);
        };
        animate();
        
        // --- RESIZE HANDLER ---
        const handleResize = () => {
            vRenderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Start flash loop
        const delay = Math.random() * 5 + 2; 
        gsap.delayedCall(delay, triggerRandomFlash);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(requestID);
            vRenderer.dispose();
            plane.dispose();
            veilMaterial.dispose();
        };
    }, [triggerRandomFlash]);


    return <canvas id="veil-canvas" ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none' }} />;
};