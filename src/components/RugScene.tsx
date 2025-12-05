import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RugSceneProps {
    cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
    isLoaded: boolean;
}

const createRugTexture = () => {
    const size = 1024;
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    
    // Base
    ctx.fillStyle = '#6e6e6e'; 
    ctx.fillRect(0, 0, size, size);
    
    // Noise
    for (let i = 0; i < 60000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const grey = Math.floor(Math.random() * 60 + 80);
        ctx.fillStyle = `rgba(${grey},${grey},${grey}, 0.15)`;
        ctx.fillRect(x, y, 2, 2);
    }
    
    const texture = new THREE.CanvasTexture(ctx.canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2); 
    return texture;
};

export const RugScene: React.FC<RugSceneProps> = ({ cameraRef, isLoaded }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rugRef = useRef<THREE.Mesh | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // --- SCENE SETUP ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 30, 0); 
        camera.lookAt(0, 0, 0);
        
        // Pass camera reference to parent for GSAP animations
        cameraRef.current = camera;
        
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // --- RUG MESH ---
        const rugTexture = createRugTexture();
        const geometry = new THREE.PlaneGeometry(5, 7, 200, 200);
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff, map: rugTexture, displacementMap: rugTexture,
            displacementScale: 0.2, roughness: 0.8, normalMap: rugTexture,
            normalScale: new THREE.Vector2(1, 1)
        });
        const rugMesh = new THREE.Mesh(geometry, material);
        rugMesh.rotation.x = -Math.PI / 2;
        rugMesh.receiveShadow = true;
        rugMesh.castShadow = true;
        scene.add(rugMesh);
        rugRef.current = rugMesh;

        // --- LIGHTING ---
        scene.add(new THREE.AmbientLight(0xffffff, 0.2));
        const spotLight = new THREE.SpotLight(0xffeeb1, 2.5);
        spotLight.position.set(5, 12, 5);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.bias = -0.0001;
        scene.add(spotLight);

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();
        let requestID: number;
        const animate = () => {
            requestID = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            if (rugRef.current) {
                rugRef.current.position.y = Math.sin(t * 0.3) * 0.02; // Breathing effect
            }
            renderer.render(scene, camera);
        };
        animate();

        // --- RESIZE HANDLER ---
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(requestID);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            rugTexture.dispose();
        };
    }, [cameraRef]);

    // --- INTERACTIVE PARALLAX ---
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isLoaded && cameraRef.current && rugRef.current) {
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;
                
                gsap.to(cameraRef.current.position, {
                    x: x * 0.5,
                    y: 6 + y * 0.5,
                    duration: 1,
                    onUpdate: () => {
                        if (cameraRef.current && rugRef.current) {
                            cameraRef.current.lookAt(0, rugRef.current.position.y, 0);
                        }
                    }
                });
            }
        };

        if (isLoaded) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isLoaded, cameraRef]);

    return <canvas id="webgl-canvas" ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} />;
};