import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from 'cannon-es'

//打击音效
const hitAudio = new Audio('assets/hit.mp3')

//创建场景
const scene = new THREE.Scene();
//创建相机
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
//设置相机位置
camera.position.set(0,0,10)
//相机添加到场景中
scene.add(camera)

//创建坐标轴辅助器 AxesHelper(size) size:辅助线长度
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const sphereGeometry = new THREE.SphereGeometry(1,20,20)
const material = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry,material)
sphere.position.set(0,5,0)
sphere.castShadow = true
scene.add(sphere)

const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20,20),
    material
)
floor.position.set(0,-5,0)
floor.rotation.x = -Math.PI/2
floor.receiveShadow = true
scene.add(floor)

//添加环境光和平行光
const light = new THREE.AmbientLight(0xffffff,0.5)
const dirLight = new THREE.DirectionalLight(0xffffff,0.5)
dirLight.castShadow = true
scene.add(dirLight,light)
//初始化渲染器
const renderer = new THREE.WebGLRenderer()
//设置渲染器大小
renderer.setSize(window.innerWidth,window.innerHeight)
renderer.shadowMap.enabled = true
//将webgl挂载到app上
document.getElementById('app').appendChild(renderer.domElement)


//创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement)
//控制器添加阻尼 须在循环时调用update
controls.enableDamping = true


//创建物理世界 使我们绘制的物体拥有真实世界中的属性，如重量，加速度等等
const world = new CANNON.World()
//设置世界的重力加速度
world.gravity.set(0,-9.8,0)

const ballMaterial = new CANNON.Material('ball')
//创建物理世界小球
const worldBall = new CANNON.Body({
    //定义形状
    shape:new CANNON.Sphere(1),
    material:ballMaterial,//定义材质
    mass:1,//小球的质量
    // position:new CANNON.Vec3(0,0,0),//位置
    position:sphere.position as any,//位置
})
const floorMaterial = new CANNON.Material('floor')
//创建平板
const worldFloor = new CANNON.Body({
    shape:new CANNON.Plane(),
    material:floorMaterial,
    // position:new CANNON.Vec3(0,-5,0),
    position:floor.position as any,
    mass:0,//质量为0时可以使上面的物体保持不动
})
//四元数描述了 3D 空间中的旋转。四元数在数学上定义为 Q = x i + y j + z*k + w，其中 (i,j,k) 是虚基向量。
// (x,y,z) 可以看作是与旋转轴相关的向量，而实数乘数 w 与旋转量相关。
//setFromAxisAngle 在给定轴和角度的情况下设置四元数分量。
//setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2) 可理解为在x轴上旋转-90deg
worldFloor.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2)
world.addBody(worldBall)
world.addBody(worldFloor)

//材质关联，设置两种材质碰撞后的属性
const defaultContactMaterial = new CANNON.ContactMaterial(
    ballMaterial,floorMaterial,{
    //    摩擦力
        friction:0.1,
    //    弹力
        restitution:0.7
    }
)
world.addContactMaterial(defaultContactMaterial)

//碰撞事件
function onHit (e){
    hitAudio.currentTime = 0.4
    //撞击的力度
    const intensity =e.contact.getImpactVelocityAlongNormal()
    if (intensity<3) return false
    hitAudio.play()
}
worldBall.addEventListener('collide',onHit)

const clock = new THREE.Clock()
function render(){
    //获取上一帧到这一帧的时间
    const time = clock.getDelta()
    //更新物理世界引擎 第一个参数为要使用的固定时间步长
    world.step(1/120,time)
    //绘制的小球绑定物理世界中的小球
    sphere.position.copy(worldBall.position as any)
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