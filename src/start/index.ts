import * as dat from 'dat.gui'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import fsShader from './shader/fragmentShader.glsl'
// @ts-ignore
import vsShader from './shader/vertexShader.glsl'

// const gui = new dat.GUI()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    120,window.innerWidth/window.innerHeight,
    0.1,1000
)
camera.position.set(0,0,10)
scene.add(camera)
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

//初始化渲染器
const renderer = new THREE.WebGLRenderer()
//    设置渲染器大小
renderer.setSize(window.innerWidth,window.innerHeight)
document.getElementById('app').appendChild(renderer.domElement)
// 创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement)
//    控制器添加阻尼 在循环时需要调用update
controls.enableDamping = true

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position',new THREE.BufferAttribute(
    new Float32Array([
        0,0,0
    ]),3
))
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader:vsShader,
    fragmentShader:fsShader,
    transparent:true
})



const points = new THREE.Points(
    geometry,shaderMaterial
)


scene.add(points)
function render() {
    controls.update()
    //使用渲染器，通过相机将场景渲染进来
    renderer.render(scene, camera)
//    动画帧，每帧执行一次
    requestAnimationFrame(render)
}

render()