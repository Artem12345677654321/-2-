import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor: React.FC = () => {
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const previousMouse = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      
      // Immediate update for inner dot
      if (cursorInnerRef.current) {
        gsap.set(cursorInnerRef.current, {
            x: e.clientX,
            y: e.clientY
        });
      }
    };

    // Smooth follow loop for outer circle
    const animateOuterCursor = () => {
      if (cursorOuterRef.current) {
        // Lerp logic for smooth delay
        previousMouse.current.x += (mouse.current.x - previousMouse.current.x) * 0.15;
        previousMouse.current.y += (mouse.current.y - previousMouse.current.y) * 0.15;
        
        gsap.set(cursorOuterRef.current, {
            x: previousMouse.current.x,
            y: previousMouse.current.y
        });
      }
      requestRef.current = requestAnimationFrame(animateOuterCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animateOuterCursor);

    // Interactive Elements Hover Logic
    const handleMouseEnter = () => {
        gsap.to(cursorOuterRef.current, { scale: 2.5, opacity: 0.5, duration: 0.3 });
        gsap.to(cursorInnerRef.current, { scale: 0, duration: 0.3 });
    };

    const handleMouseLeave = () => {
        gsap.to(cursorOuterRef.current, { scale: 1, opacity: 1, duration: 0.3 });
        gsap.to(cursorInnerRef.current, { scale: 1, duration: 0.3 });
    };

    const interactiveElements = document.querySelectorAll('a, button, .interactive-target');
    interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorOuterRef} 
        className="fixed top-0 left-0 w-10 h-10 border border-[#8A725A] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div 
        ref={cursorInnerRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-[#8A725A] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};

export default CustomCursor;
