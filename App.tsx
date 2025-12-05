import React, { useState, useEffect } from 'react';
import WebGlBackground from './components/WebGlBackground';
import CustomCursor from './components/CustomCursor';
import AnimatedHeading from './components/AnimatedHeading';
import { MousePosition } from './types';

const App: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  // Centralized mouse tracking for WebGL performance (debounced or throttled in real app, here raw for smoothness)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full min-h-screen font-sans selection:bg-[#8A725A] selection:text-white">
      {/* 1. Immersive WebGL Background */}
      <WebGlBackground mousePosition={mousePosition} />

      {/* 2. Custom UX Cursor */}
      <CustomCursor />

      {/* 3. Main Content Layer */}
      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-6 md:px-20">
        
        {/* Navigation Placeholder */}
        <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center mix-blend-difference z-50">
            <div className="text-xl font-serif tracking-widest text-[#8A725A] interactive-target cursor-pointer">
                PLATO
            </div>
            <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest text-white/80">
                {['Collection', 'Atelier', 'About', 'Contact'].map((item) => (
                    <button key={item} className="hover:text-[#8A725A] transition-colors duration-300 interactive-target">
                        {item}
                    </button>
                ))}
            </div>
            <button className="text-sm border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 interactive-target">
                Menu
            </button>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center max-w-5xl mx-auto mt-20">
            <div className="mb-4">
                <span className="text-[#8A725A] text-xs uppercase tracking-[0.3em]">Imperial Style</span>
            </div>
            
            <AnimatedHeading 
                text="Redefining The Art Of Weaving" 
                className="font-serif text-5xl md:text-8xl lg:text-9xl leading-[0.9] text-white mix-blend-screen"
                delay={0.2}
            />

            <div className="mt-12 max-w-lg mx-auto">
                 <p className="text-white/60 text-lg leading-relaxed font-light">
                    Experience the tactile silence of luxury. PLATO RUG combines ancient craftsmanship with digital immersion.
                </p>
            </div>

            <div className="mt-16">
                <button className="interactive-target group relative px-8 py-4 overflow-hidden border border-white/20 rounded-full">
                    <span className="relative z-10 text-xs uppercase tracking-widest group-hover:text-black transition-colors duration-300">
                        Explore Collection
                    </span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-out"></div>
                </button>
            </div>
        </section>

        {/* Spacer for scroll indication */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>

      </main>
    </div>
  );
};

export default App;
