import gsap from "gsap";
import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const timer = new THREE.Timer();

const heading = document.querySelector(".heading h1");
const Start_btn = document.querySelector(".Start-btn");
const Run_btn = document.querySelector(".Run-btn")

gsap.set(heading, {
    opacity: 0
});
gsap.set(Start_btn, {
    opacity: 0
});
gsap.set(Run_btn, {
    opacity: 0,
    zIndex: -1,
});

const dimension = {
    height: window.innerHeight,
    width: window.innerWidth
}
let canvas = document.querySelector("#webgl")
// let heading = document.querySelector(".heading h1")

const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true
})

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, dimension.width / dimension.height, 0.1, 100)

const changeCameraPosition = (x, y, z) => {

    gsap.to(camera.position, {
        x,
        y,
        z,
        duration: 2,
        ease: "power3.inOut",
        onUpdate: () => {
            camera.lookAt(0, 0, 0);
        }
    });

};

changeCameraPosition(-5, -0.2, 8);

camera.lookAt(new THREE.Vector3(0, 0, 0))

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
let model;

const createGltfModel = (gltf) => {
    model = gltf.scene;

    mixer = new THREE.AnimationMixer(model);

    model.position.y = -2;

    scene.add(model);
}

let gltfActionFunction = (gltf, act = 2) => {

    const animation = gltf.animations[act];
    // console.log(gltf)
    const action = mixer.clipAction(animation);

    action.play();

}


gltfLoader.load("/Soldier.glb", (gltf) => {
    createGltfModel(gltf)
    gltfActionFunction(gltf)
    const intro = gsap.timeline();

    intro
        .to(heading, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out"
        })
        .from(heading, {
            y: 500,
            duration: 1.5,
            ease: "power2.out"
        })
    gsap.timeline().from(model.position, {
        y: 300,
        duration: 1.7,
        ease: "power3.out"
    }, "-=0.5")
        .from(model.rotation, {
            y: -20,
            duration: 1.2,
            ease: "power2.out"
        }, "<");

    gsap.timeline().to(Start_btn, {
        opacity: 1,
        duration: 0.5,
        ease: "power1.out"
    }).from(Start_btn, {
        x: 300,
        duration: 1.7,
        ease: "power1.out"
    })
});


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


//////////animation on click 



const startButton = document.querySelector(".Start-btn button")
Start_btn.addEventListener("click", () => {

    Start_btn.style.pointerEvents = "none";

    startButton.style.backgroundColor = "#8a765f";
    startButton.style.color = "#4a4035";
    startButton.style.borderColor = "#4a4035";
    startButton.style.boxShadow = "4px 4px 0 #4a4035";

    Start_btn.style.opacity = 0

    changeCameraPosition(0, 0, 6);

    gltfLoader.load("/Soldier.glb", (gltf) => {
        gltfActionFunction(gltf, 12)
    });

    gsap.to(Run_btn, {
        opacity: 1,
        zIndex: 10
    })
});

Run_btn.addEventListener("click", () => {
    Run_btn.style.pointerEvents = "none";

    Run_btn.style.backgroundColor = "#8a765f";
    Run_btn.style.color = "#4a4035";
    Run_btn.style.borderColor = "#4a4035";
    Run_btn.style.boxShadow = "4px 4px 0 #4a4035";
    changeCameraPosition(-4, 2, -7)
    setTimeout(() => {
        gltfLoader.load("/Soldier.glb", (gltf) => {
            gltfActionFunction(gltf, 6)
        })
    }, 2000);
})