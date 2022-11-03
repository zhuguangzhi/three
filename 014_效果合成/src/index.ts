import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui"
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader.js"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

// 导入后期效果合成器
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";

//three框架自带效果
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass"; //渲染通道
import {DotScreenPass} from "three/examples/jsm/postprocessing/DotScreenPass"; //点粒子特效
import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass";
import {SSAARenderPass} from "three/examples/jsm/postprocessing/SSAARenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";

// 创建Gui对象
const gui = new dat.GUI();

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    50)
camera.position.set(0, 0, 3)
//更新摄像头
camera.aspect = window.innerWidth/window.innerHeight
//更新摄像机的投影矩阵
camera.updateProjectionMatrix();
scene.add(camera)

//添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
    "./assets/environmentMaps/px.jpg",
    "./assets/environmentMaps/nx.jpg",
    "./assets/environmentMaps/py.jpg",
    "./assets/environmentMaps/ny.jpg",
    "./assets/environmentMaps/pz.jpg",
    "./assets/environmentMaps/nz.jpg",
])
scene.background = envMapTexture;
scene.environment = envMapTexture;

//添加平行光
const directionLight = new THREE.DirectionalLight("#ffffff",1)
directionLight.castShadow = true; //平行光会产生动态阴影
directionLight.position.set(0,0,200)
scene.add(directionLight)

//模型加载
const gltfLoader = new GLTFLoader();
gltfLoader.load("./assets/DamagedHelmet/glTF/DamagedHelmet.gltf",(gltf)=>{
    console.log(gltf)
    const mesh = gltf.scene.children[0]
    scene.add(mesh)
})

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

const controls = new OrbitControls(camera, renderer.domElement)
//控制器阻尼
controls.enableDamping = true

//合成效果
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(window.innerWidth, window.innerHeight)

//添加渲染通道
const renderPass = new RenderPass(scene,camera)
effectComposer.addPass(renderPass)

//点效果
const dotScreenPass = new DotScreenPass()
dotScreenPass.enabled = false
effectComposer.addPass(dotScreenPass)
//发光效果
// esolution：表示泛光所覆盖的场景大小，是Vector2类型的向量
// strength：表示泛光的强度，值越大明亮的区域越亮，较暗区域变亮的范围越广
// radius：表示泛光散发的半径
// threshold：表示产生泛光的光照强度阈值，如果照在物体上的光照强度大于该值就会产生泛光
const unrealBloomPass = new UnrealBloomPass(
    new THREE.Vector2(256, 256),
    1,
    1.1,
    0.18
);
//抗锯齿效果
const  smaaPass = new SMAAPass(1,1)
effectComposer.addPass(smaaPass)

unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)






const clock = new THREE.Clock();
function render() {
    const elapsedTime = clock.getElapsedTime()
    controls.update()
//    动画帧，每帧执行一次
    requestAnimationFrame(render)
    //使用渲染器，通过相机将场景渲染进来
    // renderer.render(scene, camera)
    effectComposer.render()
}

render()

document.getElementById('app').appendChild(renderer.domElement)

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

    effectComposer.setSize(window.innerWidth,window.innerHeight)
    effectComposer.setPixelRatio(window.devicePixelRatio)
})