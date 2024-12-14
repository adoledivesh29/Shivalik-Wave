import {
    DirectionalLight,
    AmbientLight,
    HemisphereLight,
    Color
} from 'three'

export class Light {
    scene
    constructor(scene, gui) {
        this.scene = scene;

        this.mainLight = new DirectionalLight(new Color(1, 1, 1, 1), 1); // front
        this.mainLight.position.set(0, 5, 5);
        this.scene.add(this.mainLight);

        // this.mainLight2 = new DirectionalLight(new Color(1, 1, 1, 1), 0.5); // back
        // this.mainLight2.position.set(-10, -5, -50);
        // this.scene.add(this.mainLight2);

        // this.mainLight3 = new DirectionalLight(new Color(1, 1, 1, 1), 0.5); // left
        // this.mainLight3.position.set(-10, 20, -50);
        // this.scene.add(this.mainLight3);

        // this.mainLight4 = new DirectionalLight(new Color(1, 1, 1, 1), 0.5); // right
        // this.mainLight4.position.set(-10, 20, 50);
        // this.scene.add(this.mainLight4);

        // this.ambientLight = new AmbientLight(new Color(1, 1, 1, 1), 2);
        // this.scene.add(this.ambientLight);

        this.mainLight.castShadow = true;
        this.mainLight.shadow.mapSize.width = 256; // Adjust for performance/quality
        this.mainLight.shadow.mapSize.height = 256;
        this.mainLight.shadow.camera.near = 0.5;
        this.mainLight.shadow.camera.far = 50;

        if (gui) {
            const lightFolder = gui.addFolder('Lights');

            const dirLightFolder = lightFolder.addFolder('Directional Light');
            dirLightFolder.add(this.mainLight.position, 'x').min(-10).max(10).step(0.1);
            dirLightFolder.add(this.mainLight.position, 'y').min(-10).max(10).step(0.1);
            dirLightFolder.add(this.mainLight.position, 'z').min(-10).max(10).step(0.1);
            dirLightFolder.add(this.mainLight, 'intensity').min(0).max(10).step(0.1);

            const ambLightFolder = lightFolder.addFolder('Ambient Light');
            ambLightFolder.add(this.ambientLight.position, 'x').min(-10).max(10).step(0.1);
            ambLightFolder.add(this.ambientLight.position, 'y').min(-10).max(10).step(0.1);
            ambLightFolder.add(this.ambientLight.position, 'z').min(-10).max(10).step(0.1);
            ambLightFolder.add(this.ambientLight, 'intensity').min(0).max(10).step(0.1);
        }
    }
}