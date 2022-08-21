//认识顶点着色器
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// @ts-ignore
import basicFragmentShader from "./shader/fragment.glsl"
// @ts-ignore
import basicVertexShader from "./shader/vertex.glsl"

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//创建原始着色器材质
const rawShaderMaterial = new THREE.RawShaderMaterial({
    vertexShader: basicVertexShader,
    fragmentShader: basicFragmentShader,
    // wireframe:true,//使用类型为线框
    side:THREE.DoubleSide,//设置双面
})

const panel = new THREE.Mesh(
    //设置顶点数 如成为64*64的网格
    new THREE.PlaneBufferGeometry(2, 2,64,64),
    rawShaderMaterial
)
scene.add(panel)


const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('app').appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

function render() {
    controls.update()
    //使用渲染器，通过相机将场景渲染进来
    renderer.render(scene, camera)
//    动画帧，每帧执行一次
    requestAnimationFrame(render)
}

render()
//监听页面变化 更新渲染页面
window.addEventListener('resize', () => {
//    更新摄像头的可视区域横纵比
    camera.aspect = window.innerWidth / window.innerHeight
//    更新摄像头的投影矩阵
    camera.updateProjectionMatrix()
//    更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)
//    设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio)
})