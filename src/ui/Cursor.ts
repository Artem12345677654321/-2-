import gsap from 'gsap';

export class Cursor {
  private outer: HTMLDivElement;
  private inner: HTMLDivElement;
  private mouse = { x: 0, y: 0 };
  
  constructor() {
    // Create elements dynamically
    this.outer = document.createElement('div');
    this.outer.className = 'cursor-outer';
    
    this.inner = document.createElement('div');
    this.inner.className = 'cursor-inner';

    document.body.appendChild(this.outer);
    document.body.appendChild(this.inner);

    this.initListeners();
    this.animate();
  }

  private initListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      
      // Direct update for inner dot (instant)
      gsap.set(this.inner, {
        x: this.mouse.x,
        y: this.mouse.y
      });
    });

    // Add hover effects for interactive elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('interactive-target')) {
        gsap.to(this.outer, { scale: 1.5, opacity: 0.5, duration: 0.3 });
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('interactive-target')) {
        gsap.to(this.outer, { scale: 1, opacity: 1, duration: 0.3 });
      }
    });
  }

  private animate = () => {
    // Smooth follow for outer ring
    gsap.to(this.outer, {
      x: this.mouse.x,
      y: this.mouse.y,
      duration: 0.5,
      ease: 'power2.out'
    });
    
    requestAnimationFrame(this.animate);
  }
}