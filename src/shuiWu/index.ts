import * as dat from 'dat.gui'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import fragmentShader from './Shader/index/fragment.glsl'
// @ts-ignore
import vertexShader from './Shader/index/vertex.glsl'

const gui = new dat.GUI()

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight,
    0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//初始化渲染器
const renderer = new THREE.WebGLRenderer()
//设置渲染器大小
renderer.setSize(window.innerWidth, window.innerHeight)
//将webgl挂载到app上
document.getElementById('app').appendChild(renderer.domElement)

//创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
//控制器添加阻尼 须在循环时调用update
controls.enableDamping = true

const param = {
    uWaresFrequency: 6.6,
    uScale: 0.3,
}

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uWaresFrequency: {
            value: param.uWaresFrequency
        },
        uScale: {
            value: param.uScale
        }
    }
})

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(3, 3, 2048, 2048),
    shaderMaterial
    // new THREE.MeshBasicMaterial({color:0xff0000,side:THREE.DoubleSide})
)
plane.rotation.x = -Math.PI / 2
scene.add(plane)

gui.add(param, "uScale").min(0.1).max(20).step(0.1).name("竖向").onChange((value) => {
    shaderMaterial.uniforms.uScale.value = value
})
gui.add(param, "uWaresFrequency").min(1).max(10).step(0.1).name("横向").onChange((value) => {
    shaderMaterial.uniforms.uWaresFrequency.value = value
})

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
