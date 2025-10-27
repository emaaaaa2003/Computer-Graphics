// Import Three.js and OrbitControls from node_modules
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// === Scene, Camera, Renderer ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // sky blue

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
controls.target.set(0, 0, 0);
controls.update();

// === Lights ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// === Ground (Grass + Roads) ===
const groundGeometry = new THREE.PlaneGeometry(40, 40);
const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x3cb371 });
const grass = new THREE.Mesh(groundGeometry, grassMaterial);
grass.rotation.x = -Math.PI / 2;
scene.add(grass);

// Roads
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const roadWidth = 4;

const road1 = new THREE.Mesh(new THREE.BoxGeometry(roadWidth, 0.1, 40), roadMaterial);
road1.position.y = 0.05;
scene.add(road1);

const road2 = new THREE.Mesh(new THREE.BoxGeometry(40, 0.1, roadWidth), roadMaterial);
road2.position.y = 0.05;
scene.add(road2);

// === Buildings ===
const materials = [
  new THREE.MeshStandardMaterial({ color: 0xffffff }), // white
  new THREE.MeshPhongMaterial({ color: 0x1e90ff }),    // blue
  new THREE.MeshLambertMaterial({ color: 0xffd700 })   // yellow
];

const building1 = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 5), materials[0]);
building1.position.set(-6, 1.5, -6);
scene.add(building1);

const building2 = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 5), materials[0]);
building2.position.set(6, 1.5, -6);
scene.add(building2);

const building3 = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 2.5), materials[1]);
building3.position.set(6, 1.5, 6);
scene.add(building3);

const building4 = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 2.5), materials[2]);
building4.position.set(-6, 1.5, 6);
scene.add(building4);

// === Helpers (for debugging) ===
const gridHelper = new THREE.GridHelper(40, 40);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// === Resize Handler ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// === Animation Loop ===
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
