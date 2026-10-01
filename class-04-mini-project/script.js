import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const timer = new THREE.Timer();

const dimension = {
    height: window.innerHeight,
    width: window.innerWidth
}
let canvas = document.querySelector("#webgl")

const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, dimension.width / dimension.height, 0.1, 100)
camera.position.z = 5



renderer.setSize(dimension.width, dimension.height)

renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))


const orbitControl = new OrbitControls(camera, renderer.domElement)


////////////////////HDRI loader
const loader = new HDRLoader();
const envMap = await loader.loadAsync('/env_map.hdr');
envMap.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = envMap;


/////////////////////GLTF loader///////////////////////////
let mixer;
const gltfLoader = new GLTFLoader();
gltfLoader.load("/Soldier.glb", (gltf) => {

    const model = gltf.scene

    mixer = new THREE.AnimationMixer(model)
    console.log(gltf)

    const animation = gltf.animations[0]

    const action = mixer.clipAction(animation);

    action.play()

    model.position.y = -2

    scene.add(model)
})


///making a flat surface
const surface = new THREE.PlaneGeometry(100, 100)
const surfaceMaterial = new THREE.MeshStandardMaterial({
    color: "white",
    side: THREE.DoubleSide
})

const floor = new THREE.Mesh(surface, surfaceMaterial)
floor.rotation.x = -Math.PI / 2
floor.position.y = -2.024

scene.add(floor)


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
    timer.update()

    if (mixer) {
        mixer.update(timer.getDelta())
    }

    orbitControl.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()