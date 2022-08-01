import * as THREE from  'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

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

//创建物体
// const sphereGeometry = new THREE.SphereGeometry(3,20,20)
//自定义物体形状
const count = 5000;
//设置缓冲区数组
const particlesGeometry = new THREE.BufferGeometry()
//颜色数组 每三构成rgb
const colorList = new Float32Array(count*3)
// 粒子的位置数组 每三个构成xyz
const positions = new Float32Array(count*3)
//设置顶点
for (let i=0;i<count*3;i++){
    positions[i] = (Math.random() - 0.5)*50
    colorList[i] = Math.random()
}
//new THREE.BufferAttribute(positions,3) 每三个数绘制一个顶点
particlesGeometry.setAttribute("position",new THREE.BufferAttribute(positions,3))
particlesGeometry.setAttribute('color',new THREE.BufferAttribute(colorList,3))

//载入纹理贴图
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('assets/image/xuehua.png')

//设置点材质
const pointsMaterial = new THREE.PointsMaterial()
//使用贴图
pointsMaterial.map = texture
//贴图透明度
pointsMaterial.alphaMap = texture
//允许透明 主要用作贴图的透明部分
pointsMaterial.transparent = true
//设置重叠
pointsMaterial.depthWrite = false
//光亮效果叠加
pointsMaterial.blending = THREE.AdditiveBlending;
pointsMaterial.size = 0.05
//  启用顶点颜色设置
pointsMaterial.vertexColors = true
//构建一个由 pointsMaterial 构成的 sphereGeometry
// const point = new THREE.Points(sphereGeometry,pointsMaterial)
const point = new THREE.Points(particlesGeometry,pointsMaterial)
scene.add(point)


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
