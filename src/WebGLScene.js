export class WebGLScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas #${canvasId} not found`);
        }
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cube = null;
    }

    init() {
        if (!this.canvas) return;

        // 1. Scene
        this.scene = new THREE.Scene();

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 4. Test Object (Red Cube)
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshBasicMaterial({ color: 0xFF0000, wireframe: true });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        // Resize Listener
        window.addEventListener('resize', () => this.onResize());
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Animation Logic
        if (this.cube) {
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;
        }

        // Render
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onResize() {
        if (this.camera && this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}