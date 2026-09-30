import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//created scene
const scene = new THREE.Scene();

let dimension = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, dimension.width / dimension.height, 0.1, 100)

camera.position.z = 5



const geometry = new THREE.BoxGeometry(1, 1, 1);

const material = new THREE.MeshBasicMaterial({
    color: 'red',
    // wireframe: true
})

const cube = new THREE.Mesh(geometry, material)

scene.add(cube)



let canvas = document.querySelector("#webgl")

const renderer = new THREE.WebGLRenderer({
    canvas
})


renderer.setSize(dimension.width, dimension.height)
renderer.setPixelRatio(Math.max(2, window.devicePixelRatio))

const controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener("resize", () => {
    dimension.width = window.innerWidth;
    dimension.height = window.innerHeight;
    renderer.setSize(dimension.width, dimension.height)
    camera.updateProjectionMatrix()
    camera.aspect = dimension.width / dimension.height
})

controls.enableDamping = true
controls.update()
const animate = () => {
    // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.01;
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()
