import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from "lil-gui"
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

const dimension = {
    height: window.innerHeight,
    width: window.innerWidth
}
let canvas = document.querySelector("#webgl")

const renderer = new THREE.WebGLRenderer({
    canvas
})

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, dimension.width / dimension.height, 0.1, 100)
camera.position.z = 5



///////Texture Loader
let textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("https://tse2.mm.bing.net/th/id/OIP.fAR_8u_abqI5eLbpvMCHuwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3")




// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshStandardMaterial({
//     map: texture
// })

/////////////////light///////////////////
// const ambLight = new THREE.AmbientLight("white");
// const pntLight = new THREE.PointLight("white", 300)
// pntLight.position.set(8, 8, 8);
// scene.add(ambLight);
// scene.add(pntLight)

// const cube = new THREE.Mesh(geometry, material)


// scene.add(cube)


///////////LIL GUI
const gui = new GUI()
const positionFolder = gui.addFolder("Position")

renderer.setSize(dimension.width, dimension.height)

renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))


const orbitControl = new OrbitControls(camera, renderer.domElement)

////////////////////small mesh

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.1,
    metalness: 0.9
})
const cube = new THREE.Mesh(geometry, material)
positionFolder.add(cube.position, "x", -4, 4).name("x-move")
scene.add(cube)

// const count = 100

// const instance = new THREE.InstancedMesh(geometry, material, count)

// scene.add(instance)

// const dummy = new THREE.Object3D()

// // scene.add(cube)

// for (let i = 1; i <= count; i++) {


//     dummy.position.x = 10 * (Math.random() * 2 - 1)
//     dummy.position.y = 5 * (Math.random() * 2 - 1)
//     dummy.position.z = 3 * (Math.random() * 2 - 1)

//     dummy.rotation.x = Math.PI * (Math.random() * 2 - 1)
//     dummy.rotation.y = Math.PI * (Math.random() * 2 - 1)
//     dummy.rotation.z = Math.PI * (Math.random() * 2 - 1)

//     dummy.updateMatrix()

//     instance.setMatrixAt(i, dummy.matrix)
// }


const loader = new HDRLoader();
const envMap = await loader.loadAsync('/env_map.hdr');
envMap.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = envMap;
scene.background = envMap


window.addEventListener("resize", () => {
    dimension.width = window.innerWidth;
    dimension.height = window.innerHeight;

    camera.aspect = dimension.width / dimension.height;
    camera.updateProjectionMatrix();

    renderer.setSize(dimension.width, dimension.height);
});

orbitControl.enableDamping = true
orbitControl.update()
const animate = () => {
    // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.01;
    orbitControl.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()