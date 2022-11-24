<script setup lang="ts">
import * as THREE from "three"
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {MeshBasicMaterial} from "three";

const container = ref<HTMLElement|null>(null)
//初始化场景
const scene = new THREE.Scene()
//初始化相机
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
)
camera.position.set(0,0,0.2)
//初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight)


//请求动画帧
const render = ()=>{
  renderer.render(scene,camera)
  requestAnimationFrame(render)
}
// //使用立方体完成3D全景
// const geometry = new THREE.BoxGeometry(10,10,10)
// //贴图
// let boxMaterials:MeshBasicMaterial[] = []
// // const imageList = ["back","bottom","front","left","top","right"]
// const imageList = ["left","right","top","bottom","front","back"]
// imageList.forEach((img)=>{
//   let texture = new THREE.TextureLoader().load(`public/image/${img}.png`)
// //  创建材质
//   boxMaterials.push(new THREE.MeshBasicMaterial({map:texture}))
// })
// console.log('boxMaterials',boxMaterials)
// const cube = new THREE.Mesh(geometry,boxMaterials)
// cube.geometry.scale(1,1,-1)
// sceneInit.add(cube)

//使用球体完成3D渲染
const geometry = new THREE.SphereGeometry(5,32,32)
const texture = new THREE.TextureLoader().load("public/image/livingRoom.jpg")
const material = new THREE.MeshBasicMaterial({map:texture})
const cube = new THREE.Mesh(geometry,material)
cube.geometry.scale(1,1,-1)
scene.add(cube)

onMounted(()=>{
  //添加控制器
  const controls = new OrbitControls(camera,container.value as HTMLElement)
  controls.enableDamping = true
  container.value?.appendChild(renderer.domElement)
  render()
})
</script>

<template>
  <div ref="container" class="container"></div>
</template>

<style>
*{
  padding: 0!important;
  margin: 0!important;
}
.container {
  width: 100vw;
  height: 100vh;
}
</style>
