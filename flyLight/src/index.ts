import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"
import gsap from 'gsap';
// @ts-ignore
import FragmentShader from "./shader/fragment.glsl"
// @ts-ignore
import VertexShader from "./shader/vertex.glsl"

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

// const axesHelper = new THREE.AxesHelper(5)
// sceneInit.add(axesHelper)

//创建环境纹理
const rgbeLoader = new RGBELoader();
//异步加载图片
rgbeLoader.loadAsync("./assets/2k.hdr").then((texture)=>{
    //按照圆柱的方式进行映射
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
})

//导入孔明灯模型
const gltfLoader = new GLTFLoader();
let lightBox = null
gltfLoader.load("./assets/flyLight.glb",(gltf)=>{
    lightBox = gltf.scene.children[1]
    lightBox.material = shaderMaterial

    for (let i=0;i<150;i++){
        // 为true代表克隆子元素
        let flyLight = gltf.scene.clone(true)
        let x = (Math.random() - 0.5)*300;
        let z = (Math.random() - 0.5)*300;
        let y = Math.random()*60 + 25;
        flyLight.position.set(x,y,z);
        gsap.to(flyLight.rotation,{
            y:2*Math.PI,
            duration:10 + Math.random() * 30,
            repeat:-1
        })
        gsap.to(flyLight.position,{
            x:"+=" + Math.random() * 5,
            y:"+=" + Math.random() * 20,
            yoyo:true,
            duration: 5 + Math.random() * 10,
            repeat:-1
        })

        scene.add(flyLight)

    }
})

const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    uniforms:{},
    side:THREE.DoubleSide,//双面
    transparent:false //是否透明
})

const renderer = new THREE.WebGLRenderer()
//设置场景的背景色
renderer.setClearColor( 0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight)
//设置为RGBE的编码格式
renderer.outputEncoding = THREE.sRGBEncoding
//设置色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping;
//设置曝光度
renderer.toneMappingExposure = 0.2;

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