import * as THREE from "three";

// Scene setup

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setAnimationLoop(animationLoop);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
scene.background = new THREE.Color("black");

var camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight);
camera.position.set(0, 0, 100);
camera.lookAt(scene.position);

var light = new THREE.PointLight("#D20062", 3, 150, 4),
  helper = new THREE.PointLightHelper(light);
scene.add(light, helper);

window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// Main demo

const N = 500000; // number of points

// geometry and material of a "point"
var geometry = new THREE.TetrahedronGeometry(0.25),
  material = new THREE.MeshPhongMaterial({
    transparent: true,
    opacity: 0.1,
    depthTest: false,
    depthWrite: false,
  });

// the cloud of points as instanced mesh
var cloud = new THREE.InstancedMesh(geometry, material, N);
scene.add(cloud);

// generate all points one by one
var matrix = new THREE.Matrix4();
for (var i = 0; i < N; i++) {
  // think of some random coordinates
  var x = 2 * (Math.random() + Math.random() + Math.random()) - 3,
    y = 2 * (Math.random() + Math.random() + Math.random()) - 3,
    z = 2 * (Math.random() + Math.random() + Math.random()) - 3;

  // convert them into a cloud
  x += 10 * Math.sin(i >> 6) + 10 * Math.cos(i >> 10);
  y += 10 * Math.sin(i >> 7) + 10 * Math.cos(i >> 11);
  z += 10 * Math.cos(i >> 8) + 10 * Math.sin(i >> 12);

  // make the cloud spherical
  let k =
    Math.max(Math.abs(x), Math.abs(y), Math.abs(z)) /
    (x ** 2 + y ** 2 + z ** 2) ** 0.5;
  x *= k;
  y *= k;
  z *= k;

  // we are done, save the position
  matrix.setPosition(x, y, z);
  cloud.setMatrixAt(i, matrix);
}

function animationLoop(t) {
  cloud.rotation.x = t / 2000;
  cloud.rotation.y = t / 3000;

  light.position.set(30 * Math.sin(t / 1000), 0, 20);

  renderer.render(scene, camera);
}
