import * as THREE from  'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

/**
 * 灯光与阴影
 * 1、材质要满足能够对光照有反应
 * 2、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true
 * 3、设置光照投射阴影 directionLight.castShadow = true
 * 4、设置物体投射阴影 sphere.castShadow = true
 * 5、设置物体接收阴影 plane.receiveShadow = true
 * */

//创建场景
const scene = new THREE.Scene()
//创建相机
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.01,1000)
//相机位置
camera.position.set(0,0,10)
scene.add(camera)

//创建坐标轴辅助器 AxesHelper(size) size:辅助线长度
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//创建球体
const sphereGeometry = new THREE.SphereGeometry(1,20,20)
const material = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry,material)
//设置物体投射阴影
sphere.castShadow = true
scene.add(sphere)

//添加平面
const planeGeometry = new THREE.PlaneBufferGeometry(20,20)
const plane = new THREE.Mesh(planeGeometry,material)
plane.position.set(0,-1,0)
plane.rotation.x = -Math.PI/2
//接收阴影
plane.receiveShadow = true
scene.add(plane)

//灯光
//环境光
const light = new THREE.AmbientLight(0xffffff,0.5)
scene.add(light)
//点光源
const pointLight = new THREE.PointLight(0xff0000,0.5)
// pointLight.position.set(2,2,2)
//设置光照投射阴影
pointLight.castShadow = true
//设置阴影模糊度
pointLight.shadow.radius = 20
//设置阴影分辨率 默认512*512
pointLight.shadow.mapSize.set(4096,4096)
//创建一个发光的小球
const lightBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.2,20,20),
    new THREE.MeshMatcapMaterial({color:"#ff0000"})
)
lightBall.position.set(2,2,2)
lightBall.add(pointLight)
scene.add(lightBall)

//初始化渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
//开启阴影计算
renderer.shadowMap.enabled = true

//创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement)
//控制器添加阻尼 须在循环时调用update
controls.enableDamping = true

//将webgl挂载到app上
document.getElementById('app').appendChild(renderer.domElement)
const clock = new THREE.Clock()
function render(){
    let time = clock.getElapsedTime()
    //小球圆周运动
    lightBall.position.x = Math.sin(time)*3
    lightBall.position.z = Math.cos(time)*3
    controls.update()
    //使用渲染器，通过相机将场景渲染进来
    renderer.render(scene,camera)
//    动画帧，每帧执行一次
    requestAnimationFrame(render)
}
render()

//监听页面变化 更新渲染页面
window.addEventListener('resize',()=>{
//    更新摄像头的可视区域横纵比
    camera.aspect = window.innerWidth/window.innerHeight
//    更新摄像头的投影矩阵
    camera.updateProjectionMatrix()
//    更新渲染器
    renderer.setSize(window.innerWidth,window.innerHeight)
//    设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio)
})
