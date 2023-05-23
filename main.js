import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GrannyKnot } from 'three/examples/jsm/curves/CurveExtras'
var campos, tube, height

// Set scene and camera
const scene = new THREE.Scene();
const assetPath = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/";

// Space background
const envMap = new THREE.CubeTextureLoader()
  .setPath(`${assetPath}skybox1_`)
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
 scene.background = envMap;

const camera = new THREE.PerspectiveCamera(75, (window.innerWidth / window.innerHeight), 0.1, 1000);
height = -5553;
campos = document.body.getBoundingClientRect().top / height;

const renderer = new THREE.WebGL1Renderer({antialias: true});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

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

// Set lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(-17.8, 7.05, 12.14);

// const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
scene.add(pointLight);

// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);

scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

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

// Avatar
const kimTexture = new THREE.TextureLoader().load('./imgs/travel.png');

const kim = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( { map: kimTexture})
);

scene.add(kim);

// Move camera when scrolling
function updateCamera() {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScrollPosition > previousScrollPosition) {
    if (campos > 1) campos=0;

  } else if (currentScrollPosition < previousScrollPosition) {
    if (campos < 0) campos=1;
  }

  previousScrollPosition = currentScrollPosition;

  campos = document.body.getBoundingClientRect().top / height;
  const t = campos; 

  const pos = tube.geometry.parameters.path.getPointAt(t);
  const pos2 = tube.geometry.parameters.path.getPointAt(t + 0.01);

  camera.position.copy(pos);
  camera.lookAt(pos2);

  console.log(document.body.getBoundingClientRect().top);
}

let previousScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
document.body.onscroll = updateCamera;


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