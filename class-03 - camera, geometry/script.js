import * as THREE from "three";

//created scene
const scene = new THREE.Scene();

const clock = new THREE.Clock()

let dimension = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, dimension.width / dimension.height, 0.1, 100)

// const aspect = dimension.width / dimension.height

// const frustomSize = 10

// const camera = new THREE.OrthographicCamera(-frustomSize * aspect / 2, frustomSize * aspect / 2, frustomSize * aspect, -frustomSize * aspect, 0.1, 100)

camera.position.z = 5

const ambientLight = new THREE.AmbientLight("#ffff", 1)

const directionalLight = new THREE.DirectionalLight("#fff", 3)
directionalLight.position.set(8, 8, 8)

scene.add(ambientLight)

scene.add(directionalLight)


const geometry = new THREE.BoxGeometry(2, 2, 2);

const material = new THREE.MeshStandardMaterial({
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


window.addEventListener("resize", () => {
    dimension.width = window.innerWidth;
    dimension.height = window.innerHeight;
    renderer.setSize(dimension.width, dimension.height)
    camera.updateProjectionMatrix()
    camera.aspect = dimension.width / dimension.height
})


const animate = () => {
    cube.rotation.y -= 0.01;

    const delta = clock.getElapsedTime()
    cube.rotation.x = delta;
    // controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate()
