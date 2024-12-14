import Scene from './scene'
import './components/UI/dropdown.js';
// import floor1 from '../assets/images/shivalik-wave/floor_1.png'
// import floor2 from '../assets/images/shivalik-wave/floor_2.png'
// import floor3 from '../assets/images/shivalik-wave/floor_3.png'
// import floor4 from '../assets/images/shivalik-wave/floor_4.png'
// import floor5 from '../assets/images/shivalik-wave/floor_5.png'
// import floor6 from '../assets/images/shivalik-wave/floor_6.png'
// import floor7 from '../assets/images/shivalik-wave/floor_7.png'
// import floor8 from '../assets/images/shivalik-wave/floor_8.png'
// import floor9 from '../assets/images/shivalik-wave/floor_9.png'
// import floor10 from '../assets/images/shivalik-wave/floor_10.png'
// import floor11 from '../assets/images/shivalik-wave/floor_11.png'
// import floor12 from '../assets/images/shivalik-wave/floor_12.png'
// import floor13 from '../assets/images/shivalik-wave/floor_13.png'
// import floor14 from '../assets/images/shivalik-wave/floor_14.png'
// import floor15 from '../assets/images/shivalik-wave/floor_15.png'
// import floor16 from '../assets/images/shivalik-wave/floor_16.png'
// import floor17 from '../assets/images/shivalik-wave/floor_17.png'
// import floor18 from '../assets/images/shivalik-wave/floor_18.png'
// import floor19 from '../assets/images/shivalik-wave/floor_19.png'
// import floor20 from '../assets/images/shivalik-wave/floor_20.png'
// import floor21 from '../assets/images/shivalik-wave/floor_21.png'
// import floor22 from '../assets/images/shivalik-wave/floor_22.png'
// import floor23 from '../assets/images/shivalik-wave/floor_23.png'
// import floor24 from '../assets/images/shivalik-wave/floor_24.png'
// import floor25 from '../assets/images/shivalik-wave/floor_25.png'
// import floor26 from '../assets/images/shivalik-wave/floor_26.png'
// import floor27 from '../assets/images/shivalik-wave/floor_27.png'
// import floor28 from '../assets/images/shivalik-wave/floor_28.png'
// import floor29 from '../assets/images/shivalik-wave/floor_29.png'
// import floor30 from '../assets/images/shivalik-wave/floor_30.png'
// import floor_30_glass_grill from '../assets/images/shivalik-wave/floor_30_glass_grill.png'
// import floor_30_grill from '../assets/images/shivalik-wave/floor_30_grill.png'
// import floor_30_glass_grill_accessory from '../assets/images/shivalik-wave/floor_30_glass_grill_accessory.png'
// import floor_30_grill_accessory from '../assets/images/shivalik-wave/floor_30_grill_accessory.png'

const loader = document.getElementById('loader');
const screenshotImage = document.getElementById('screenshot-image');
const radio3d = document.getElementById('radio-3d');
const radio2d = document.getElementById('radio-2d');
const canvas3d = document.getElementById('3d-scene');
const canvas2d = document.getElementById('2d-scene');
const floorNumber = document.getElementById('floorNumber');
const floorSlider = document.getElementById('floorSlider');
const glassCheckbox = document.getElementById('glassCheckbox');
const glassSection = document.getElementById('glassSection');
const grillCheckbox = document.getElementById('grillCheckbox');
const grillSection = document.getElementById('grillSection');
const accessoryCheckbox = document.getElementById('accessoryCheckbox');
const accessorySection = document.getElementById('accessorySection');

const btnScreenshot = document.getElementById('screenshot');

function setImage({ nFloors, isGlass, isGrill, isAccessory, isColor }) {
  let imageNumber = 0;
  switch (true) {
    case isGrill && isGlass && isAccessory:
      imageNumber = 33;
      break;
    case isGrill && isAccessory:
      imageNumber = 32;
      break;
    case isGlass:
      imageNumber = 31;
      break;
    case isGrill:
      imageNumber = 30;
      break;
    default:
      imageNumber = nFloors - 1;
      break;
  }
  const images = [floor1, floor2, floor3, floor4, floor5, floor6, floor7, floor8, floor9, floor10, floor11, floor12, floor13, floor14, floor15, floor16, floor17, floor18, floor19, floor20, floor21, floor22, floor23, floor24, floor25, floor26, floor27, floor28, floor29, floor30,
    floor_30_grill, // 30
    floor_30_glass_grill, // 31
    floor_30_grill_accessory, // 32
    floor_30_glass_grill_accessory]; // 33
  screenshotImage.src = images[imageNumber];
}

function setBuilding(scene, config) {
  scene.setModel(config);
  setImage(config);
}

(() => {
  const scene = new Scene();
  scene.is3d = true;
  radio3d.addEventListener('change', () => {
    scene.is3d = true;
    canvas3d.style.display = 'block';
    canvas2d.style.display = 'none';
    setBuilding(scene, { nFloors: floorSlider.value, isGlass: glassCheckbox.checked, isGrill: grillCheckbox.checked, isAccessory: accessoryCheckbox.checked, isColor: false });
  });
  radio2d.addEventListener('change', () => {
    scene.is3d = false;
    canvas3d.style.display = 'none';
    canvas2d.style.display = 'block';
    setBuilding(scene, { nFloors: floorSlider.value, isGlass: glassCheckbox.checked, isGrill: grillCheckbox.checked, isAccessory: accessoryCheckbox.checked, isColor: false });
  });


  function takeScreenshot() {
    scene.renderer.render(scene.scene, scene.camera.camera);
    const link = document.createElement('a');
    let name = `floor_${floorSlider.value}`;
    if (glassCheckbox.checked) {
      name += '_glass';
    }
    if (grillCheckbox.checked) {
      name += '_grill';
    }
    if (accessoryCheckbox.checked) {
      name += '_accessory';
    }
    link.download = `${name}.png`;
    link.href = scene.canvas.toDataURL();
    link.click();
  }
  let floor = 1;
  btnScreenshot.addEventListener('click', () => {
    if (floorSlider.value < 30) {
      const interval = setInterval(() => {
        floorSlider.value = floor;
        floorNumber.textContent = floorSlider.value;
        floorNumber.textContent = floorSlider.value;
        if (floorSlider.value == '30') {
          glassCheckbox.disabled = false;
          grillCheckbox.disabled = false;
          grillSection.classList.remove('disabled');
        } else {
          glassCheckbox.disabled = true;
          glassCheckbox.checked = false;
          glassSection.classList.add('disabled');

          grillCheckbox.disabled = true;
          grillCheckbox.checked = false;
          grillSection.classList.add('disabled');

          accessoryCheckbox.disabled = true;
          accessoryCheckbox.checked = false;
          accessorySection.classList.add('disabled');
        }
        setBuilding(scene, { nFloors: floorSlider.value, isGlass: glassCheckbox.checked, isGrill: grillCheckbox.checked, isAccessory: accessoryCheckbox.checked, isColor: false });
        takeScreenshot();
        floor++;
        if (floor > 30) {
          clearInterval(interval);
        }
      }, 1000);
    } else {
      takeScreenshot();
    }
  });

  floorNumber.textContent = floorSlider.value;
  scene.init({ nFloors: floorSlider.value, isGlass: glassCheckbox.checked, isGrill: grillCheckbox.checked, isAccessory: accessoryCheckbox.checked, isColor: false })
    .then(() => {
      loader.style.display = 'none';
    });

  floorSlider.addEventListener('input', () => {
    floorNumber.textContent = floorSlider.value;
    if (floorSlider.value == '30') {
      glassCheckbox.disabled = false;
      grillCheckbox.disabled = false;
      grillSection.classList.remove('disabled');
    } else {
      glassCheckbox.disabled = true;
      glassCheckbox.checked = false;
      glassSection.classList.add('disabled');

      grillCheckbox.disabled = true;
      grillCheckbox.checked = false;
      grillSection.classList.add('disabled');

      accessoryCheckbox.disabled = true;
      accessoryCheckbox.checked = false;
      accessorySection.classList.add('disabled');
    }
    setBuilding(scene, { nFloors: floorSlider.value, isGlass: glassCheckbox.checked, isGrill: grillCheckbox.checked, isAccessory: accessoryCheckbox.checked, isColor: false });
  });

  grillCheckbox.addEventListener('change', () => {
    if (grillCheckbox.checked) {
      glassSection.classList.remove('disabled');
      accessorySection.classList.remove('disabled');
      glassCheckbox.disabled = false;
      accessoryCheckbox.disabled = false;
    } else {
      glassCheckbox.checked = false;
      glassSection.classList.add('disabled');
      glassCheckbox.disabled = true;

      accessoryCheckbox.checked = false;
      accessorySection.classList.add('disabled');
      accessoryCheckbox.disabled = true;
    }
    setBuilding(scene, { nFloors: floorSlider.value, isGlass: glassCheckbox.checked, isGrill: grillCheckbox.checked, isAccessory: accessoryCheckbox.checked, isColor: false });
  });

  glassCheckbox.addEventListener('change', () => {
    setBuilding(scene, { nFloors: floorSlider.value, isGlass: glassCheckbox.checked, isGrill: grillCheckbox.checked, isAccessory: accessoryCheckbox.checked, isColor: false });
  });

  accessoryCheckbox.addEventListener('change', () => {
    setBuilding(scene, { nFloors: floorSlider.value, isGlass: glassCheckbox.checked, isGrill: grillCheckbox.checked, isAccessory: accessoryCheckbox.checked, isColor: false });
  });

})()
