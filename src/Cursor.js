export class Cursor {
    constructor() {
        this.outer = null;
        this.inner = null;
        this.mouse = { x: 0, y: 0 };
    }

    init() {
        // Create elements dynamically
        this.outer = document.createElement('div');
        this.outer.classList.add('cursor-outer');
        document.body.appendChild(this.outer);

        this.inner = document.createElement('div');
        this.inner.classList.add('cursor-inner');
        document.body.appendChild(this.inner);

        // Movement Listeners
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Inner Dot: Immediate follow
            gsap.set(this.inner, { x: this.mouse.x, y: this.mouse.y });
            
            // Outer Ring: Smooth Lerp via GSAP duration
            gsap.to(this.outer, { 
                x: this.mouse.x, 
                y: this.mouse.y, 
                duration: 0.2, 
                ease: "power2.out" 
            });
        });

        this.addHoverEffects();
    }

    addHoverEffects() {
        // Find all interactive elements
        const targets = document.querySelectorAll('.interactive-target');
        
        targets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(this.outer, { scale: 1.5, opacity: 0.5, duration: 0.3 });
                gsap.to(this.inner, { scale: 0.5, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(this.outer, { scale: 1, opacity: 1, duration: 0.3 });
                gsap.to(this.inner, { scale: 1, duration: 0.3 });
            });
        });
    }
}