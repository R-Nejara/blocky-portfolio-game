import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";

const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const canvas = document.getElementById("experience-canvas");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let character = {
  instance: null,
  moveDistance: 2,
  jumpHeight: 1,
  isMoving: false,
  moveDuration: 0.2,
};

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio = Math.min(window.devicePixelRatio, 2);
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = 1.75;

const modalContent = {
  Welcome_Bill: {
    title: "project One",
    content: "this is project one. hello world",
  },
  Thanks_Bill: {
    title: "project One",
    content: "this is project one. hello world",
  },
  Project_Bill1: {
    title: "project One",
    content: "this is project one. hello world",
  },
  Project_Bill3001: {
    title: "3D Portfolio Project",
    content: "this is 3D Portfolio Project",
  },
  Project_Bill3: {
    title: "project One",
    content: "this is project one. hello world",
  },
  Project_Bill2: {
    title: "project One",
    content: "this is project one. hello world",
  },
  Design_Bill1: {
    title: "project One",
    content: "this is project one. hello world",
  },
  Design_Bill2: {
    title: "project One",
    content: "this is project one. hello world",
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
  "../glbFile/Portfolio.glb",
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
        character.instance = child;
        child.add(new THREE.AxesHelper(5000));
      }
    });
    scene.add(glb.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

const sun = new THREE.DirectionalLight(0xffffff, 1.5);
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

const shadowHelper = new THREE.CameraHelper(sun.shadow.camera);
scene.add(shadowHelper);
console.log(sun.shadow);

const helper = new THREE.DirectionalLightHelper(sun, 5);
scene.add(helper);

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

camera.position.x = 55;
camera.position.y = 65;
camera.position.z = -38;

const controls = new OrbitControls(camera, canvas);
controls.update();

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

function onClick() {
  if (intersectObject !== "") {
    showModal(intersectObject);
    console.log(intersectObject);
  }
}

function moveCharacter(targetPosition, targetRotation) {
  character.isMoving = true;

  const t1 = gsap.timeline({
    onComplete: () => {
      character.isMoving = false;
    },
  });

  t1.to(character.instance.position, {
    x: targetPosition.x,
    z: targetPosition.z,
    duration: character.moveDuration,
  });
  t1.to(
    character.instance.rotation,
    {
      y: targetRotation,
      duration: character.moveDuration,
    },
    0
  );

  t1.to(
    character.instance.position,
    {
      y: character.instance.position.y + character.jumpHeight,
      duration: character.moveDuration / 2,
      yoyo: true,
      repeat: 1,
    },
    0
  );
}

function onKeyDown(event) {
  console.log(character.isMoving);
  if (character.isMoving) return;

  const targetPosition = new THREE.Vector3().copy(character.instance.position);
  let targetRotation = 0;

  switch (event.key.toLowerCase()) {
    case "w":
    case "arrowup":
      targetPosition.x -= character.moveDistance;
      targetRotation = Math.PI / 2;
      break;
    case "s":
    case "arrowdown":
      targetPosition.x += character.moveDistance;
      targetRotation = -(Math.PI / 2);
      break;
    case "a":
    case "arrowleft":
      targetPosition.z += character.moveDistance;
      targetRotation = 0;

      break;
    case "d":
    case "arrowright":
      targetPosition.z -= character.moveDistance;
      targetRotation = -Math.PI;
      break;
    default:
      return;
  }
  moveCharacter(targetPosition, targetRotation);
}

modalExitButton.addEventListener("click", hideModal);
window.addEventListener("resize", onResize);
window.addEventListener("click", onClick);
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("keydown", onKeyDown);

function animate() {
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);
  console.log(camera.position);

  // calculate objects intersecting the picking ray
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

  // console.log(camera.position)
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
