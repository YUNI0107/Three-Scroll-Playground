const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Scene setting
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfefdfd);
const cubemap = new THREE.CubeTextureLoader()
  .setPath("./assets/textures/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

// Render setting
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;
document.querySelector(".model").appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.5, 50);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-5, 10, 5);
scene.add(directionalLight);

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

// Render
const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.fromCubemap(cubemap);
scene.environment = pmremGenerator.texture;

// Load Model
let model;
const modelPosition = new THREE.Vector3();
const loader = new THREE.GLTFLoader();
loader.load("./assets/coke_can.glb", (gltf) => {
  const group = new THREE.Group();
  const coke = gltf.scene;
  group.add(coke);
  model = group;
  scene.add(model);

  coke.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.material) {
        child.material.envMap = cubemap;
        child.material.envMapIntensity = 2.5;
        child.material.metalness = 0.8;
        child.material.needsUpdate = true;
      }
    }
  });

  const box = new THREE.Box3().setFromObject(coke);
  const center = box.getCenter(new THREE.Vector3());
  coke.position.sub(center);
  modelPosition.copy(model.position);

  const size = box.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);
  camera.position.z = maxSize * 1.5;

  // Animation
  model.scale.set(0, 0, 0);
  playInitialAnimation(model);
  cancelAnimationFrame(render);
  animate();
});

// ScrollTrigger
const floatAmplitude = 0.2;
const floatSpeed = 1.5;
const rotationSpeed = 0.3;
let isFloating = true;
let currentScroll = 0;

const scannerSection = document.querySelector(".scanner");
const scanContainer = document.querySelector(".scan-container");
let stickyHeight = window.innerHeight;
let scannerPosition = scannerSection.offsetTop;
const scanSound = new Audio("./assets/sound.mp3");
gsap.set(scanContainer, { scale: 0 });

const playInitialAnimation = (model) => {
  gsap.to(model.scale, {
    duration: 1,
    x: 1,
    y: 1,
    z: 1,
    ease: "power2.out",
  });

  gsap.to(scanContainer, {
    scale: 1,
    duration: 1,
    ease: "power2.out",
  });
};

ScrollTrigger.create({
  trigger: document.body,
  start: "top top",
  end: "top -10",
  onEnterBack: () => {
    if (model) {
      playInitialAnimation(model);
      isFloating = true;
    }
  },
});

ScrollTrigger.create({
  trigger: ".scanner",
  start: "top top",
  end: `${stickyHeight}px`,
  pin: true,
  onEnter: () => {
    isFloating = false;

    setTimeout(() => {
      scanSound.currentTime = 0;
      scanSound.play();
    }, 500);

    if (!model) return;
    model.position.y = modelPosition.y;
    gsap.to(model.rotation, {
      duration: 1,
      y: model.rotation.y + Math.PI * 2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(model.scale, {
          duration: 0.5,
          x: 0,
          y: 0,
          z: 0,
          ease: "power2.in",
          onComplete: () => {
            gsap.to(scanContainer, {
              scale: 0,
              duration: 0.5,
              ease: "power2.in",
            });
          },
        });
      },
    });
  },
  onLeaveBack: () => {
    gsap.set(scanContainer, { scale: 0 });
    gsap.to(scanContainer, {
      duration: 1,
      scale: 1,
      ease: "power2.out",
    });
  },
});

// Lenis Scroll
lenis.on("scroll", (e) => {
  currentScroll = e.scroll;
});

const animate = () => {
  if (isFloating) {
    const floatOffset =
      Math.sin(Date.now() * 0.001 * floatSpeed) * floatAmplitude;
    model.position.y = modelPosition.y + floatOffset;
  }

  const scrollProgress = Math.min(currentScroll / scannerPosition, 1);
  if (scrollProgress < 1) {
    model.rotation.x = scrollProgress * Math.PI * 2;
  }

  if (scrollProgress < 1) {
    model.rotation.y += 0.01 * rotationSpeed;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  stickyHeight = window.innerHeight;
  scannerPosition = scannerSection.offsetTop;
});
