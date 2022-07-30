import gsap from 'gsap';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui'

//变量控制插件
const gui = new dat.GUI()
//创建场景
const scene = new THREE.Scene();
//创建相机
/** THREE.PerspectiveCamera(fov?: number, aspect?: number, near?: number, far?: number)
 * fov:眼球张开的角度，0°时相当于闭眼。
 * aspect:可视区域横纵比。
 * near:眼睛能看到的最近垂直距离。
 * far：眼睛能看到的最远垂直距离。
 * */
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
//设置相机位置
camera.position.set(0,0,10)
//相机添加到场景中
scene.add(camera)

//创建物体
const cubeGeometry = new  THREE.BoxGeometry(1,1,1)
//创建材质
const cubeMaterial = new THREE.MeshMatcapMaterial({color:"hotPink"})
//材质 物体组合
const cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
//设置物体移动
// cube.position.set(2,3, 0)
//缩放
// cube.scale.set(3,2,1)
//旋转 rotation.set(x,y,z,order?="XYZ") order:旋转顺序
// cube.rotation.set(Math.PI/4,0,0,"XYZ")
//物体添加到场景中
scene.add(cube)

//创建坐标轴辅助器 AxesHelper(size) size:辅助线长度
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//初始化渲染器
const renderer = new THREE.WebGLRenderer()
//设置渲染器大小
renderer.setSize(window.innerWidth,window.innerHeight)
//将webgl挂载到app上
document.getElementById('app').appendChild(renderer.domElement)


//创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement)
//控制器添加阻尼 须在循环时调用update
controls.enableDamping = true

//gsap 动画库
const animate1 = gsap.to(cube.position,{
    x:5,
    duration:5,
    ease: "power1.inOut",
    //重复次数
    repeat:-1,
    delay:2,//延迟执行
    yoyo:true,//往返运动
    onComplete:()=>{console.log('执行完成')},
    onStart:()=>{console.log('开始执行')}
})
gsap.to(cube.rotation,{
    x:2*Math.PI,
    repeat:-1,
    duration:5,
    ease: "power1.inOut",
    delay:2,//延迟执行
    yoyo:true,//往返运动
})

window.addEventListener("dblclick",()=>{
    // //判断动画是否在运动
    // if (animate1.isActive())
    //     // 停止
    //     animate1.pause()
    // else animate1.resume()//启动
//    判断是否处于全屏中
    const fullScreenElement = document.fullscreenElement
    if (!fullScreenElement){
    //    进入全屏
        renderer.domElement.requestFullscreen()
    }else document.exitFullscreen()
})

function render(){
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

gui.add(cube.position,"x").min(0)
    .max(5).name('移动x轴').step(0.01)
