import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { Octree } from "three/addons/math/Octree.js";
import { Capsule } from "three/addons/math/Capsule.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap";

const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const canvas = document.getElementById("experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Physics
const GRAVITY = 40;
const CAPSULE_RADIUS = 0.35;
const CAPSULE_HEIGHT = 1;
const JUMP_HEIGHT = 6;
const MOVE_SPEED = 4;

let character = {
  instance: null,
  isMoving: false,
  spawnPosition: new THREE.Vector3(),
};
let targetRotation = 0;

const colliderOctree = new Octree();
const playerCollider = new Capsule(
  new THREE.Vector3(0, CAPSULE_RADIUS, 0),
  new THREE.Vector3(0, CAPSULE_HEIGHT, 0),
  CAPSULE_RADIUS
);

let playerVelocity = new THREE.Vector3();
let playerOnFloor = false;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = 2;

const modalContent = {
  Welcome_Bill: {
    title: "Welcome!",
    content:
      "Hello and welcome! I'm Rayan, and you've just stepped into my interactive 3D portfolio. Dive in and explore the projects and designs I've crafted with passion using Three.js and Blender. ps: if you missed it, you can move with WASD or your Arrow Keys",
  },
  Thanks_Bill: {
    title: "Thank You!",
    content:
      "Thank you so much for visiting my portfolio! Creating this experience took about a week of dedication, learning, and creativity. I hope you enjoy exploring it as much as I enjoyed building it.",
  },
  Project_Bill1: {
    title: "Restaurant Website Project",
    content:
      "This project was my first real-world web development challenge: designing and coding a restaurant website as a training exercise after completing my UI/UX course. It was a delicious learning experience!",
  },
  Project_Bill3001: {
    title: "3D Portfolio Project",
    content:
      "You're looking at it right now! This 3D portfolio is my most ambitious project so far. I modeled every element in Blender and brought it all to life with Three.js. Every detail you see is a result of countless hours of creativity and problem-solving.",
  },
  Project_Bill3: {
    title: "Solar System Simulation",
    content:
      "To really get stared with Three.js, I built a dynamic solar system simulation. This project helped me understand 3D graphics, animation, and the wonders of our universe—all while having fun coding planets and orbits!",
  },
  Project_Bill2: {
    title: "IT-Project: Clicker Game",
    content:
      "Created as a graduation class project, this game features our politics teacher as the main character in a Cookie Clicker-inspired adventure. I handled the design in Figma, while the logic was implemented in GameMaker. It was a blast collaborating and bringing this rather funny idea to life!",
    link: "https://gx.games/de/games/3jdbmc/schubishooter/",
  },
  Design_Bill1: {
    title: "Web Design Training",
    content:
      "This project marks the beginning of my design journey. As one of my very first web designs, it taught me the fundamentals of layout, color, and user experience.",
  },
  Design_Bill2: {
    title: "Tracking App Design",
    content:
      "During my UI/UX learning journey, I created this tracking app design with a focus on real-life usability and aesthetics. It’s a showcase of my growth in designing practical, user-friendly interfaces.",
    link: "keks.com",
  },
};
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalProjectDescription = document.querySelector(
  ".modal-project-description"
);

const modalExitButton = document.querySelector(".modal-exit-button");
const modalVisitProjectButton = document.querySelector(
  ".modal-project-visit-button"
);

function showModal(id) {
  const content = modalContent[id];

  if (content) {
    modalTitle.textContent = content.title;
    modalProjectDescription.textContent = content.content;
    if (content.link) {
      modalVisitProjectButton.href = content.link;
      modalVisitProjectButton.classList.remove("hidden");
    } else {
      modalVisitProjectButton.classList.add("hidden");
    }

    modal.classList.toggle("hidden");
  }
}
function hideModal() {
  modal.classList.toggle("hidden");
}

let intersectObject = "";
const intersectObjects = [];
const intersectObjectsNames = [
  "Welcome_Bill",
  "Thanks_Bill",
  "Project_Bill1",
  "Project_Bill3001",
  "Project_Bill3",
  "Project_Bill2",
  "Design_Bill1",
  "Design_Bill2",
];

const loader = new GLTFLoader();
loader.load(
  "/glbFile/Portfolio.glb",

  function (glb) {
    glb.scene.traverse((child) => {
      if (intersectObjectsNames.includes(child.name)) {
        intersectObjects.push(child);
      }
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.name == "Cube187_1") {
          const picture = child.material.map;
          child.material = new THREE.MeshBasicMaterial();
          child.material.map = picture;
        }
      }
      if (child.name === "Character") {
        character.spawnPosition.copy(child.position);
        character.instance = child;
        playerCollider.start
          .copy(child.position)
          .add(new THREE.Vector3(0, CAPSULE_RADIUS, 0));
        playerCollider.end
          .copy(child.position)
          .add(new THREE.Vector3(0, CAPSULE_HEIGHT, 0));
      }
      if (child.name === "Ground_Collider") {
        colliderOctree.fromGraphNode(child);
        child.visible = false;
      }
    });
    scene.add(glb.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const darkColor = new THREE.Color("#FF8C00");
const lightColor = new THREE.Color(0xffffff);
darkColor.name = "darkColor";
lightColor.name = "lightColor";

const sun = new THREE.DirectionalLight(1.5);
sun.color = lightColor;
sun.isDay = true;
sun.castShadow = true;
sun.position.set(-10, 80, -20);
sun.target.position.set(0, 0, 0);
sun.shadow.mapSize.width = 4096;
sun.shadow.mapSize.height = 4096;
sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;
sun.shadow.normalBias = 0.2;
sun.shadow.intensity = 0.5;
scene.add(sun);

const dayNightButton = document.getElementById("day-night-toggle");
const toggleDayNight = () => {
  const targetColor = sun.isDay
    ? new THREE.Color("darkorange")
    : new THREE.Color(0xffffff);
  gsap.to(sun.color, {
    r: targetColor.r,
    g: targetColor.g,
    b: targetColor.b,
    duration: 1.2,
    onUpdate: () => {
      sun.color.needsUpdate = true;
    },
  });
  sun.isDay = !sun.isDay;
};
const onDayNightButtonClick = () => {
  toggleDayNight();
};

// const helper = new THREE.DirectionalLightHelper(sun, 5);
// scene.add(helper);

const light = new THREE.AmbientLight(0x404040, 5);
scene.add(light);

const aspect = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(
  -aspect * 50,
  aspect * 50,
  50,
  -50,
  0.1,
  1000
);
const controls = new OrbitControls(camera, canvas);
controls.update();

camera.position.x = 55;
camera.position.y = 95;
camera.position.z = -72;

const cameraOffset = new THREE.Vector3(80, 98, -72);
camera.zoom = 7;
camera.updateProjectionMatrix();

function onResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  const aspect = sizes.width / sizes.height;

  camera.left = -aspect * 50;
  camera.right = aspect * 50;
  camera.top = 50;
  camera.bottom = -50;

  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function respawnCharacter() {
  character.instance.position.copy(character.spawnPosition);

  playerCollider.start
    .copy(character.spawnPosition)
    .add(new THREE.Vector3(0, CAPSULE_RADIUS, 0));
  playerCollider.end
    .copy(character.spawnPosition)
    .add(new THREE.Vector3(0, CAPSULE_HEIGHT, 0));

  playerVelocity.set(0, 0, 0);
  character.isMoving = false;
}

function playerCollisions() {
  const result = colliderOctree.capsuleIntersect(playerCollider);
  playerOnFloor = false;

  if (result) {
    playerOnFloor = result.normal.y > 0;
    playerCollider.translate(result.normal.multiplyScalar(result.depth));

    if (playerOnFloor) {
      character.isMoving = false;
      playerVelocity.x = 0;
      playerVelocity.z = 0;
    }
  }
}

function onClick() {
  if (intersectObject !== "") {
    showModal(intersectObject);
  }
}

// --- Movement: Use keysPressed for smooth, framerate-independent movement ---
const keysPressed = {};

function onKeyDown(event) {
  keysPressed[event.key.toLowerCase()] = true;
  if (event.key.toLowerCase() === "0") {
    respawnCharacter();
  }
}
function onKeyUp(event) {
  keysPressed[event.key.toLowerCase()] = false;
}
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

const startButton = document.getElementById("start-button");
const startWrapper = document.getElementById("start-screen-wrapper");
const hideStartScreen = () => {
  startWrapper.classList.add("hidden");
};

dayNightButton.addEventListener("click", onDayNightButtonClick);
modalExitButton.addEventListener("click", hideModal);
startButton.addEventListener("click", hideStartScreen);
window.addEventListener("resize", onResize);
window.addEventListener("click", onClick);
window.addEventListener("pointermove", onPointerMove);

// --- Framerate-independent timing ---
let lastTime = performance.now();

function updatePlayer(deltaTime) {
  if (!character.instance) return;

  if (character.instance.position.y < -20) {
    respawnCharacter();
  }

  // Movement logic (runs every frame, framerate-independent)
  let moved = false;
  if ((keysPressed["w"] || keysPressed["arrowup"]) && playerOnFloor) {
    playerVelocity.x -= MOVE_SPEED;
    targetRotation = Math.PI / 2;
    playerVelocity.y = JUMP_HEIGHT;
    moved = true;
  }
  if ((keysPressed["s"] || keysPressed["arrowdown"]) && playerOnFloor) {
    playerVelocity.x += MOVE_SPEED;
    targetRotation = -(Math.PI / 2);
    playerVelocity.y = JUMP_HEIGHT;
    moved = true;
  }
  if ((keysPressed["a"] || keysPressed["arrowleft"]) && playerOnFloor) {
    playerVelocity.z += MOVE_SPEED;
    targetRotation = 0;
    playerVelocity.y = JUMP_HEIGHT;
    moved = true;
  }
  if ((keysPressed["d"] || keysPressed["arrowright"]) && playerOnFloor) {
    playerVelocity.z -= MOVE_SPEED;
    targetRotation = -Math.PI;
    playerVelocity.y = JUMP_HEIGHT;
    moved = true;
  }
  character.isMoving = moved;

  if (!playerOnFloor) {
    playerVelocity.y -= GRAVITY * deltaTime;
  }

  playerCollider.translate(playerVelocity.clone().multiplyScalar(deltaTime));

  playerCollisions();

  character.instance.position.copy(playerCollider.start);
  character.instance.position.y -= CAPSULE_RADIUS;

  let rotationDiff =
    ((((targetRotation - character.instance.rotation.y) % (2 * Math.PI)) +
      3 * Math.PI) %
      (2 * Math.PI)) -
    Math.PI;
  let finalRotation = character.instance.rotation.y + rotationDiff;

  character.instance.rotation.y = THREE.MathUtils.lerp(
    character.instance.rotation.y,
    finalRotation,
    0.3
  );
}

function animate() {
  const now = performance.now();
  const deltaTime = Math.min((now - lastTime) / 1000, 0.1); // seconds, max 0.1s for safety
  lastTime = now;

  updatePlayer(deltaTime);

  if (character.instance) {
    const targetCameraPosition = new THREE.Vector3(
      character.instance.position.x + cameraOffset.x,
      cameraOffset.y,
      character.instance.position.z + cameraOffset.z
    );
    camera.position.copy(targetCameraPosition);
    camera.lookAt(
      character.instance.position.x,
      camera.position.y - 95,
      character.instance.position.z
    );
  }

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(intersectObjects);

  if (intersects.length > 0) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
    intersectObject = "";
  }

  for (let i = 0; i < intersects.length; i++) {
    intersectObject = intersects[0].object.parent.name;
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
