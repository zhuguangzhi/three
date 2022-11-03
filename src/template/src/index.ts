//认识顶点着色器
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

// @ts-ignore
import FragmentShader from "../shader/fragment.glsl"
// @ts-ignore
import VertexShader from "../shader/vertex.glsl"

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//创建纹理加载器对象
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("");
const params = {};


const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    uniforms:{},
    side:THREE.DoubleSide,//双面
    transparent:true
})

const renderer = new THREE.WebGLRenderer()
//设置场景的背景色
renderer.setClearColor( 0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById('app').appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
//控制器阻尼
// controls.enableDamping = true

const clock = new THREE.Clock();
function render() {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
//    动画帧，每帧执行一次
    requestAnimationFrame(render)
    //使用渲染器，通过相机将场景渲染进来
    renderer.render(scene, camera)
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