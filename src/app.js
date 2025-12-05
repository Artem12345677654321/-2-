import { WebGLScene } from './WebGLScene.js';
import { Cursor } from './Cursor.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("PLATO RUG: Initializing modules...");
    
    // 1. Initialize main WebGL scene
    const mainScene = new WebGLScene('webgl-canvas');
    mainScene.init();
    mainScene.animate();
    
    // 2. Initialize Custom Cursor
    const customCursor = new Cursor();
    customCursor.init();

    console.log("PLATO RUG: Все классы успешно инициализированы.");
});