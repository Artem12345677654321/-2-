export class WebGLScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas #${canvasId} not found`);
        }
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.carpetPlane = null;
        this.controls = null;
    }

    init() {
        if (!this.canvas) return;

        // 1. Scene
        this.scene = new THREE.Scene();

        // 2. Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 4, 4); // Position camera above and back
        this.camera.lookAt(0, 0, 0);

        // 3. Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 4. Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // 5. Object (Carpet Plane)
        const geometry = new THREE.PlaneGeometry(6, 4);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x888888, 
            side: THREE.DoubleSide,
            shininess: 10
        });
        this.carpetPlane = new THREE.Mesh(geometry, material);
        this.carpetPlane.rotation.x = -Math.PI / 2; // Lay flat
        this.scene.add(this.carpetPlane);

        // 6. OrbitControls
        // Assumes THREE.OrbitControls is available via global script in index.html
        if (THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.minPolarAngle = 0; // Allow full rotation
            this.controls.maxPolarAngle = Math.PI / 2 - 0.1; // Don't go below ground
        } else {
            console.warn("OrbitControls not loaded");
        }

        // Resize Listener
        window.addEventListener('resize', () => this.onResize());
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update Controls
        if (this.controls) {
            this.controls.update();
        }

        // Subtle idle animation
        if (this.carpetPlane) {
           // this.carpetPlane.rotation.z += 0.001; 
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