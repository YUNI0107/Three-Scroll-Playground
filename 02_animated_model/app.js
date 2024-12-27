import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let mixer = null;
const camera = new THREE.PerspectiveCamera(
  10,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 15;

const scene = new THREE.Scene();
let bird = null;
new GLTFLoader().load("./assets/models/bird.glb", (gltf) => {
  bird = gltf.scene;
  bird.scale.set(0.8, 0.8, 0.8);
  scene.add(bird);

  modelTransformMove();

  mixer = new THREE.AnimationMixer(bird);
  mixer.clipAction(gltf.animations[0]).play();
});

//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 0, 2);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.querySelector("#container3D").appendChild(renderer.domElement);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

const clock = new THREE.Clock();
const reRender3D = () => {
  requestAnimationFrame(reRender3D);

  const delta = clock.getDelta();
  // controls.update();
  renderer.render(scene, camera);
  if (mixer) mixer.update(delta);
};

reRender3D();

let transforms = [
  {
    id: "banner",
    position: { x: 0, y: -1, z: 0 },
    rotation: { x: 0, y: 1.5, z: 0 },
  },
  {
    id: "intro",
    position: { x: 1, y: -1, z: -5 },
    rotation: { x: 0.5, y: -0.5, z: 0 },
  },
  {
    id: "description",
    position: { x: -1, y: -1, z: -5 },
    rotation: { x: 0, y: 0.5, z: 0 },
  },
  {
    id: "contact",
    position: { x: 0.8, y: -1, z: 0 },
    rotation: { x: 0.3, y: -0.5, z: 0 },
  },
];

const modelTransformMove = () => {
  if (!bird) return;

  const sections = document.querySelectorAll(".section");
  let currentSection = "";
  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < window.innerHeight / 2) {
      currentSection = section.id;
    }
  });

  const transform = transforms.find((pos) => pos.id === currentSection);
  gsap.to(bird.position, {
    x: transform.position.x,
    y: transform.position.y,
    z: transform.position.z,
    duration: 3,
    ease: "power1.out",
  });
  gsap.to(bird.rotation, {
    x: transform.rotation.x,
    y: transform.rotation.y,
    z: transform.rotation.z,
    duration: 3,
    ease: "power1.out",
  });
};

window.addEventListener("scroll", () => {
  modelTransformMove();
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
