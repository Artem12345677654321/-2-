import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three'; 
import { RugScene } from './components/RugScene';
import { DigitalVeil } from './components/DigitalVeil';
import './App.css';

export const App: React.FC = () => {
    // --- REFS (Safe DOM Access) ---
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const loaderContainerRef = useRef<HTMLDivElement>(null);
    const kpsiElRef = useRef<HTMLSpanElement>(null);
    const statusElRef = useRef<HTMLSpanElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const uiLayerRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorCircleRef = useRef<HTMLDivElement>(null);

    // --- STATE ---
    const [isLoaded, setIsLoaded] = useState(false);

    // --- CURSOR LOGIC ---
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (cursorDotRef.current && cursorCircleRef.current) {
                gsap.to(cursorDotRef.current, { x: e.clientX - 3, y: e.clientY - 3, duration: 0.1 });
                gsap.to(cursorCircleRef.current, { x: e.clientX - 20, y: e.clientY - 20, duration: 0.4 });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // --- MAIN ANIMATION SEQUENCE (Handles Loader & UI) ---
    useEffect(() => {
        const loaderContainer = loaderContainerRef.current;
        const uiLayer = uiLayerRef.current;
        
        if (!loaderContainer || !uiLayer) return;

        let progress = { value: 0 };
        
        const tl = gsap.timeline({
            paused: true,
            onComplete: () => {
                setIsLoaded(true); // Enable interactivity
            }
        });

        // 1. Digital Loom Animation (3.0s duration)
        tl.to(progress, {
            value: 100,
            duration: 3.0,
            ease: "power2.inOut",
            onUpdate: function() {
                // Animate the 'fill' effect via CSS variable on the parent element
                if (titleRef.current) {
                    titleRef.current.style.setProperty('--loader-width', (this.progress() * 100) + '%');
                }
                
                // Update Numeric Data
                const knots = Math.floor(progress.value * 18);
                if (kpsiElRef.current) kpsiElRef.current.textContent = knots.toString().padStart(4, '0');
                
                // Update Status Text
                if (statusElRef.current) {
                    if (progress.value > 30 && progress.value < 60) statusElRef.current.textContent = "WEAVING GEOMETRY";
                    if (progress.value > 60 && progress.value < 90) statusElRef.current.textContent = "APPLYING TEXTURES";
                    if (progress.value > 90) statusElRef.current.textContent = "FINALIZING MASTERPIECE";
                }
            }
        });
        
        // 2. Transition Fade (0.5s duration)
        tl.to(loaderContainer, { opacity: 0, duration: 0.5 }, "+=0.3"); // Starts at 3.3s

        // 3. UI Fade In (1.0s duration)
        tl.to(uiLayer, { opacity: 1, duration: 1.0 }, "-=1.0");
        
        // 4. Stagger UI Text appearance
        tl.from("h1", { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5")
          .from(".hero-desc", { x: -20, opacity: 0, duration: 1 }, "-=0.8");

        tl.play();

        return () => {
            tl.kill();
            gsap.set(loaderContainer, { display: 'none' });
        };
    }, []); // Run once on mount

    // --- EFFECT: CAMERA DROP SEQUENCE (Runs when cameraRef is ready) ---
    useEffect(() => {
        const camera = cameraRef.current;
        // CRITICAL CHECK: Wait until camera is initialized by RugScene
        if (!camera) return; 

        // Start animation with delay to sync with loader (3.3s)
        gsap.timeline({ 
            delay: 3.3, 
            onComplete: () => {
                 if (loaderContainerRef.current) {
                     gsap.set(loaderContainerRef.current, { display: 'none' });
                 }
            }
        })
        .to(camera.position, 
            { y: 6, z: 3, x: 0, duration: 2.0, ease: "expo.out" }, 
            0 
        )
        .to(camera.rotation,
            { x: -0.8, duration: 2.0, ease: "expo.out" },
            0 
        );

    }, [cameraRef.current]);

    return (
        <>
            {/* 1. RUG SCENE (WebGL 1) */}
            <RugScene cameraRef={cameraRef} isLoaded={isLoaded} />

            {/* 2. DIGITAL VEIL (WebGL 2, Shader Mask) */}
            <DigitalVeil />

            {/* 3. UI LAYER */}
            <div id="ui-layer" ref={uiLayerRef}>
                <nav>
                    <div className="logo-mark">PLATO</div>
                    <div className="nav-links">
                        <span>COLLECTION 2025</span>
                        <span>BESPOKE STUDIO</span>
                        <span>THE ATELIER</span>
                    </div>
                </nav>
                <div className="hero-content">
                    <h1>Weaving <br/> <i>Silence & Time</i></h1>
                    <p className="hero-desc">
                        Процедурная генерация текстур ручной работы.<br/>
                        Каждая нить уникальна. Искусство цифрового ремесла.
                    </p>
                </div>
            </div>

            {/* 4. PRELOADER */}
            <div id="loader-container" ref={loaderContainerRef}>
                <div className="loader-content">
                    {/* titleRef used to set CSS variable for ::after width */}
                    <div className="loader-title" data-text="PLATO" ref={titleRef}>PLATO</div>
                    <div className="loader-status">
                        <span id="loader-phase" ref={statusElRef}>INITIALIZING LOOM</span>
                    </div>
                    <div className="tech-data">
                        <span id="kpsi-counter" ref={kpsiElRef}>0000</span> KNOTS / SQ.INCH
                    </div>
                </div>
            </div>

            {/* 5. CURSOR */}
            <div ref={cursorDotRef} className="cursor-dot"></div>
            <div ref={cursorCircleRef} className="cursor-circle"></div>
        </>
    );
};

export default App;