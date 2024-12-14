import {
    Vector3,
    MathUtils
} from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js';

export function setupSky(scene, gui) {
    const sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);

    const skyUniforms = sky.material.uniforms;
    const skyParams = {
        turbidity: 10,
        rayleigh: 0.165,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        elevation: 90,
        azimuth: 180
    };

    // Only add GUI controls if gui exists
    if (gui) {
        const skyFolder = gui.addFolder('Sky');
        skyFolder.add(skyParams, 'turbidity', 0, 20, 0.1).onChange(updateSky);
        skyFolder.add(skyParams, 'rayleigh', 0, 4, 0.001).onChange(updateSky);
        skyFolder.add(skyParams, 'mieCoefficient', 0, 0.1, 0.001).onChange(updateSky);
        skyFolder.add(skyParams, 'mieDirectionalG', 0, 1, 0.001).onChange(updateSky);
        skyFolder.add(skyParams, 'elevation', 0, 90, 0.1).onChange(updateSky);
        skyFolder.add(skyParams, 'azimuth', -180, 180, 0.1).onChange(updateSky);
    }

    const sun = new Vector3();

    function updateSky() {
        skyUniforms['turbidity'].value = skyParams.turbidity;
        skyUniforms['rayleigh'].value = skyParams.rayleigh;
        skyUniforms['mieCoefficient'].value = skyParams.mieCoefficient;
        skyUniforms['mieDirectionalG'].value = skyParams.mieDirectionalG;

        const phi = MathUtils.degToRad(90 - skyParams.elevation);
        const theta = MathUtils.degToRad(skyParams.azimuth);
        sun.setFromSphericalCoords(100000, phi, theta);
        skyUniforms['sunPosition'].value.copy(sun);
    }

    // Initial update
    updateSky();

    // Return both sky and sun parameters
    return {
        sky,
        skyParams,
        sun,
        updateSky
    };
}