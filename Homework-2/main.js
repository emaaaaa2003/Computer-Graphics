import * as THREE from 'https://unpkg.com/three@0.182.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.182.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.182.0/examples/jsm/loaders/GLTFLoader.js';

console.log('✅ main.js loaded');

// === Scene, Camera, Renderer ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(20, 15, 20);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === Controls ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Lights ===
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// === Texture Loader ===
const textureLoader = new THREE.TextureLoader();

// Ground textures
const grassTexture = textureLoader.load(
  'https://threejs.org/examples/textures/terrain/grasslight-big.jpg'
);
grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(4, 4);

const roadTexture = textureLoader.load(
  'https://threejs.org/examples/textures/brick_diffuse.jpg'
);
roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(1, 4);

// Building textures
const brickTexture = textureLoader.load(
  'https://threejs.org/examples/textures/brick_diffuse.jpg'
);

const glassTexture = textureLoader.load(
  'https://threejs.org/examples/textures/uv_grid_opengl.jpg'
);

// === Ground ===
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshLambertMaterial({ map: grassTexture })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// === Roads ===
const roadMaterial = new THREE.MeshStandardMaterial({ map: roadTexture });
const roadWidth = 4;

const road1 = new THREE.Mesh(
  new THREE.BoxGeometry(roadWidth, 0.1, 40),
  roadMaterial
);
road1.position.y = 0.05;
scene.add(road1);

const road2 = new THREE.Mesh(
  new THREE.BoxGeometry(40, 0.1, roadWidth),
  roadMaterial
);
road2.position.y = 0.05;
scene.add(road2);

// === Buildings ===
const brickMaterial = new THREE.MeshStandardMaterial({ map: brickTexture });
const glassMaterial = new THREE.MeshStandardMaterial({
  map: glassTexture,
  transparent: true,
  opacity: 0.8
});
const plainMaterial = new THREE.MeshStandardMaterial({ color: 0xdcdcdc });

const building1 = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 5),
  brickMaterial.clone()
);
building1.position.set(-6, 1.5, -6);
scene.add(building1);

const building2 = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 5),
  brickMaterial.clone()
);
building2.position.set(6, 1.5, -6);
scene.add(building2);

const building3 = new THREE.Mesh(
  new THREE.BoxGeometry(6, 3, 2.5),
  glassMaterial
);
building3.position.set(6, 1.5, 6);
scene.add(building3);

const building4 = new THREE.Mesh(
  new THREE.BoxGeometry(6, 3, 2.5),
  plainMaterial
);
building4.position.set(-6, 1.5, 6);
scene.add(building4);

const buildings = [building1, building2, building3, building4];

// === GLTF MODEL (External Model Requirement) ===
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(2, 2, 2);
    model.position.set(0, 0, -10);
    scene.add(model);
  }
);

// === Raycasting for Interaction ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED = null;

window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
  if (INTERSECTED) {
    INTERSECTED.material.color.set(Math.random() * 0xffffff);
  }
});

// === Keyboard Interaction ===
let animationEnabled = true;
let lightAngle = 0;

window.addEventListener('keydown', (event) => {
  if (event.key === 'a') {
    animationEnabled = !animationEnabled;
  }
  if (event.key === 'l') {
    directionalLight.visible = !directionalLight.visible;
  }
});

// === Helpers ===
scene.add(new THREE.GridHelper(40, 40));
scene.add(new THREE.AxesHelper(10));

// === Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);

  // Hover highlight
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(buildings);

  if (intersects.length > 0) {
    if (INTERSECTED !== intersects[0].object) {
      if (INTERSECTED) INTERSECTED.material.emissive.set(0x000000);
      INTERSECTED = intersects[0].object;
      INTERSECTED.material.emissive.set(0x333333);
    }
  } else {
    if (INTERSECTED) INTERSECTED.material.emissive.set(0x000000);
    INTERSECTED = null;
  }

  // Animation
  if (animationEnabled) {
    building3.rotation.y += 0.01;
    lightAngle += 0.005;
    directionalLight.position.x = Math.cos(lightAngle) * 20;
    directionalLight.position.z = Math.sin(lightAngle) * 20;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
