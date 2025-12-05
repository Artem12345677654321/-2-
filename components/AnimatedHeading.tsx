import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AnimatedHeadingProps } from '../types';

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ text, className = "", delay = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to split text into words without external plugins
  const words = text.split(' ');

  useEffect(() => {
    if (!containerRef.current) return;

    const wordElements = containerRef.current.querySelectorAll('.word-wrapper');

    const ctx = gsap.context(() => {
        gsap.fromTo(wordElements, 
            { 
                y: 40, 
                opacity: 0,
                rotateX: -45
            },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 1.2,
                stagger: 0.05,
                delay: delay,
                ease: "power3.out"
            }
        );
    }, containerRef);

    return () => ctx.revert();
  }, [text, delay]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
        {/* We use inline-block wrappers to allow transform animations on words */}
        {words.map((word, index) => (
            <span key={index} className="inline-block overflow-hidden mr-[0.25em] align-top">
                <span className="word-wrapper inline-block will-change-transform">
                    {word}
                </span>
            </span>
        ))}
    </div>
  );
};

export default AnimatedHeading;
