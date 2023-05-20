import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GrannyKnot } from 'three/examples/jsm/curves/CurveExtras'
var campos, tube

// Set scene and camera
const scene = new THREE.Scene();
const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";

const envMap = new THREE.CubeTextureLoader()
  .setPath(`${assetPath}skybox1_`)
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
 scene.background = envMap;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
campos = 0;

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});

  

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// TODO: Fix initial camera position and rotation
camera.position.set(-17.8, 7.05, 12.14);
camera.lookAt((-16.75, 6.76, 12.62));

renderer.render(scene, camera);

// Set geometries
const geometry = new THREE.TorusGeometry(10, 3, 16,  100);
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347} );
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Add curve
const curve = new GrannyKnot();
const tubeGeometry = new THREE.TubeGeometry(curve, 100, 2, 8, true);
const tubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff, wireframe: true, side: THREE.DoubleSide, transparent: true, opacity: 0});
tube = new THREE.Mesh(tubeGeometry, tubeMaterial);

scene.add(tube);
console.log(tube.geometry.parameters.path.getPointAt(0.0));

// Set lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(-17.8, 7.05, 12.14);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper, gridHelper);

// const controls = new OrbitControls(camera, renderer.domElement);

// Add stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff} );
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Add background texture
// const spaceTexture = new THREE.TextureLoader().load('space.jpg');
// scene.background = spaceTexture;

// Avatar
const kimTexture = new THREE.TextureLoader().load('travel.png');

const kim = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: kimTexture})
);

scene.add(kim);

// Automatic cameraUpdate
function moveCameraForward() {
  if (campos > 1) {
    campos = 0;
  }
  campos += 0.001;
  const t = campos; 

  const pos = tube.geometry.parameters.path.getPointAt(t);
  const pos2 = tube.geometry.parameters.path.getPointAt(t + 0.01);

  camera.position.copy(pos);
  camera.lookAt(pos2);
}

function moveCameraBackward() {

  if (campos < 0) {
    campos = 1;
  }
  campos -= 0.001;
  const t = campos; 

  const pos = tube.geometry.parameters.path.getPointAt(t);
  const pos2 = tube.geometry.parameters.path.getPointAt(t + 0.01);

  camera.position.copy(pos);
  camera.lookAt(pos2);
  console.log(pos2);
}

// Move camera when scrolling
function moveCamera() {

  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollPosition > previousScrollPosition) {
    moveCameraForward();

  } else if (currentScrollPosition < previousScrollPosition) {
    moveCameraBackward();
  }

  // Update the previous scroll position
  previousScrollPosition = currentScrollPosition;

  // kim.rotation.y += 0.01;
  // kim.rotation.z += 0.01;

  // camera.position.z = t * -0.015;
  // camera.position.x = t * -0.002;
  // camera.position.y = t * -0.002;
  // console.log(`Camera Position: x = ${camera.position.x}, y = ${camera.position.y}, z = ${camera.position.z}`);

}

let previousScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
document.body.onscroll = moveCamera;




// Animation function
function animate() {
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.005;

  renderer.render(scene, camera);
}
animate();


// Resize window
window.addEventListener( 'resize', resize, false);

function resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}