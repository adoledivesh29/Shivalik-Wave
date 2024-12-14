import { Color, WebGLRenderer, Scene, AxesHelper, Raycaster, Vector2, ACESFilmicToneMapping, ReinhardToneMapping, PCFSoftShadowMap, CullFaceNone, SRGBColorSpace, PlaneGeometry, MeshStandardMaterial, Mesh, DoubleSide, EquirectangularReflectionMapping, PMREMGenerator } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import LoaderManager from '@/js/managers/LoaderManager'
import GUI from 'lil-gui'
import { Camera } from './components/Three/camera'
import { Light } from './components/Three/lights'
import { setupSky } from './components/Three/sky'
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import shivalik from '../assets/models/SHIVALIK_WAVE.glb';
import environment from '../assets/environments/shanghai_riverside_2k.exr';

export default class MainScene {
  canvas
  renderer
  scene
  camera
  controls
  stats
  width
  height
  scene1
  composer
  renderPass
  sky

  constructor() {
    this.canvas = document.querySelector('.scene')
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.building = null;
    this.is3d = true;
    this.aFloors = ['F_0001', 'F_1001', 'F_2001', 'F_3001', 'F_4001', 'F_5001', 'F_6001', 'F_7001', 'F_8001', 'F_9001', 'F_10001',
      'F_11001', 'F_12001', 'F_13001', 'F_14001', 'F_15001', 'F_16001', 'F_17001', 'F_18', 'F_19', 'F_20',
      'F_21', 'F_22', 'F_23', 'F_24', 'F_25', 'F_26', 'F_27', 'F_28', 'F_29'
    ];
  }

  init = async (config) => {
    const assets = [
      {
        name: 'model1',
        gltf: shivalik,
      },
      {
        name: 'environment',
        texture: environment,
      }
    ]

    await LoaderManager.load(assets)
    this.setScene();
    this.camera = new Camera(this.scene);
    this.setRender();

    const envMap = LoaderManager.assets['environment'].texture
    envMap.mapping = EquirectangularReflectionMapping;
    envMap.colorSpace = SRGBColorSpace;
    envMap.intensity = 0.5;

    const pmremGenerator = new PMREMGenerator(this.renderer);
    const envMapProcessed = pmremGenerator.fromEquirectangular(envMap).texture;
    envMapProcessed.intensity = 0.5;
    pmremGenerator.dispose();

    this.scene.environment = envMapProcessed;
    // this.scene.background = envMap;
    const lights = new Light(this.scene);
    // const sky = setupSky(this.scene);
    this.modelSetUp(config);
    this.setControls()
    this.handleResize()
    this.events()
  }

  setRender() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      antialias: true,
      stencil: false,
      depth: true,
      toneMapping: ACESFilmicToneMapping,
      toneMappingExposure: 0.5,
      outputColorSpace: SRGBColorSpace,
    });

    // Enable shadow map
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera.camera);
    const bloomEffect = new BloomEffect({
      intensity: 1.5,
      luminanceThreshold: 0.4,
      luminanceSmoothing: 0.7,
      mipmapBlur: true
    });
    // const bloomPass = new EffectPass(this.camera.camera, bloomEffect);
    // this.composer.addPass(bloomPass);
    this.composer.addPass(this.renderPass);
  }

  setScene() {
    this.scene = new Scene();
    this.scene.background = new Color('#6f7781');
  }

  setControls() {
    this.controls = new OrbitControls(this.camera.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.enablePan = false
    this.controls.dampingFactor = 0.05 // Reduced for even smoother damping
    this.controls.rotateSpeed = 0.5
    this.controls.zoomSpeed = 0.5
    this.controls.panSpeed = 0.5
    this.controls.minDistance = 5
    this.controls.maxDistance = 4 // 4 to take screenshot
    this.controls.maxPolarAngle = Math.PI / 1.75
    this.controls.minPolarAngle = 0
    // this.controls.enable = true; // to take screenshot
  }

  modelSetUp(config) {
    this.scene1 = LoaderManager.assets[`model1`].gltf.scene;
    this.building = this.scene1.children[0].children;
    this.scene1.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name === 'GLASSW1') {
          child.material.metalness = 0.2;
          child.material.transparent = true;
          child.material.opacity = 0.75;
          child.material.roughness = 0.2;
        }
      }
    });

    this.scene.add(this.scene1);
    this.scene1.position.set(0, -1.7, 0);
    this.scene1.scale.set(0.1, 0.1, 0.1);
    this.setModel(config);

    const planeGeometry = new PlaneGeometry(5000, 5000);
    const planeMaterial = new MeshStandardMaterial({
      color: 0x808080,
      side: DoubleSide
    });
    const plane = new Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1.7;
    plane.receiveShadow = true;
    this.scene.add(plane);
  }

  setModel({ nFloors = 1, isGlass = false, isGrill = false, isAccessory = false, isColor = false }) {
    if (!this.building) return;
    const aSelectedFloors = this.aFloors.slice(0, nFloors);
    const aGlasses = ['GLASS', 'glass', 'GLASSW1', 'GLASSW2', 'GLASSW3', 'GLASSW7', 'Brand', 'BANNER'];
    const aGrills = ['GRILL', 'Grill', 'Grill2'];
    const aAccessories = ['Side', 'Terrace', 'final_model__1__Component_766_002', 'final_model__1__Component_896_002'];
    this.building.forEach(component => {
      if (!isGlass || !isGrill || !isAccessory) {
        if (component.name == 'FLOOR') {
          const floors = component.children;
          floors.forEach((floor, index) => {
            if (aSelectedFloors.includes(floor.name)) {
              floor.material.roughness = 1;
              floor.material.metalness = 0.25;
              // floor.material.opacity = 0.15;
              floor.visible = true;
              if (isColor) {
                floor.material.color = new Color('#FFFFFF');
              }
            } else {
              floor.visible = false;
            }
          })
        } else if (aGlasses.includes(component.name)) {
          component.visible = isGlass;
        } else if (aGrills.includes(component.name)) {
          component.visible = isGrill;
        } else if (aAccessories.includes(component.name)) {
          component.visible = isAccessory;
        } else {
          component.visible = false;
        }
      } else {
        component.visible = true;
      }
    })
  }

  events() {
    window.addEventListener('resize', this.handleResize, { passive: true })
    this.draw()
  }

  draw = () => {
    if (this.is3d) {
      this.controls?.update();
      this.composer?.render();
    }
    this.raf = window.requestAnimationFrame(this.draw)
  }

  handleResize = () => {
    this.width = window.innerWidth
    this.height = window.innerHeight

    // Update camera
    this.camera.camera.aspect = this.width / this.height
    this.camera.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }
}