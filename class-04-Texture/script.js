import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from "lil-gui"

const dimension={
    height:window.innerHeight,
    width:window.innerWidth
}
let canvas=document.querySelector("#webgl")

const renderer=new THREE.WebGLRenderer({
    canvas
})

const scene=new THREE.Scene()

const camera= new THREE.PerspectiveCamera(75,dimension.width/dimension.height,0.1,100)
camera.position.z=5



///////Texture Loader
let textureLoader=new THREE.TextureLoader()
const texture=textureLoader.load("https://tse2.mm.bing.net/th/id/OIP.fAR_8u_abqI5eLbpvMCHuwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3")




const geometry=new THREE.BoxGeometry(1,1,1)
const material=new THREE.MeshStandardMaterial({
    map:texture
})
const ambLight = new THREE.AmbientLight("white");

const pntLight=new THREE.PointLight("white",300)
pntLight.position.set(8, 8, 8);
scene.add(ambLight);
scene.add(pntLight)

const cube=new THREE.Mesh(geometry,material)


scene.add(cube)


///////////LIL GUI
const gui=new GUI()
const positionFolder=gui.addFolder("Position")
positionFolder.add(cube.position,"x",-4,4).name("x-move")


renderer.setSize(dimension.width,dimension.height)

renderer.setPixelRatio(Math.min(2,window.devicePixelRatio))


const orbitControl=new OrbitControls(camera,renderer.domElement)


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