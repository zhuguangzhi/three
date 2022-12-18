import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
    BufferGeometry,
    CylinderGeometry,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    PointsMaterial,
    Vector3
} from "three";


let scene = new THREE.Scene();
scene.background = new THREE.Color('gray');

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(250, 250, 250);

let renderer = new THREE.WebGLRenderer({ alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

{
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    let light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    let axesHelper = new THREE.AxesHelper(5000);
    scene.add(axesHelper);
}
/************场景布置结束**************/


//添加星空背景
{
    let vertices = [];

    for (let i = 0; i < 10000; i++) {

        let x = THREE.MathUtils.randFloatSpread(2000);
        let y = THREE.MathUtils.randFloatSpread(2000);
        let z = THREE.MathUtils.randFloatSpread(2000);

        vertices.push(x, y, z);

    }

    let geometry6 = new THREE.BufferGeometry();
    geometry6.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    let material6 = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });

    let starPoints = new THREE.Points(geometry6, material6);

    scene.add(starPoints);
}



let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
let geometry = new THREE.CylinderBufferGeometry(0, 10, 50, 12);
geometry.rotateX(Math.PI / 2);
let cone = new THREE.Mesh(geometry, material);
scene.add(cone);




//自定义路径类
class myPath {
    private pointsArr: any[];
    line: THREE.Line<BufferGeometry, LineBasicMaterial>;
    points: THREE.Points<BufferGeometry, PointsMaterial>;
    private pointPercentArr: number[];
    private preUp: Vector3;
    perce: number;
    private speed: number;
    private turnFactor: number;
    private obj: { preUp: Vector3; position: Vector3; turn: boolean; direction: Vector3 };
    private turnSpeedFactor: number;
    private preTime: number;
    private firstTurn: boolean;
    constructor(array) {

        //将传进来的数组转换为Vec3集合
        let pointsArr = [];
        if (array.length % 3 !== 0) {
            console.error('错误，数据的个数非3的整数倍！', array);
            return null;
        }
        for (let index = 0; index < array.length; index += 3) {
            pointsArr.push(new THREE.Vector3(array[index], array[index + 1], array[index + 2]));
        }

        //顶点位置三维向量数组
        this.pointsArr = pointsArr;

        //折线几何体
        this.line = null;
        {
            let lineMaterial = new THREE.LineBasicMaterial({
                color: 0xff00ff
            });
            let lineGeometry = new THREE.BufferGeometry().setFromPoints(pointsArr);
            this.line = new THREE.Line(lineGeometry, lineMaterial);
        }


        //锚点几何体
        this.points = null;
        {
            let pointsBufferGeometry = new THREE.BufferGeometry();
            pointsBufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(array, 3));
            let pointsMaterial = new THREE.PointsMaterial({ color: 0xffff00, size: 10 });
            this.points = new THREE.Points(pointsBufferGeometry, pointsMaterial);
        }


        //计算每个锚点在整条折线上所占的百分比
        this.pointPercentArr = [];
        {
            let distanceArr = []; //每段距离
            let sumDistance = 0;  //总距离
            for (let index = 0; index < pointsArr.length - 1; index++) {
                distanceArr.push(pointsArr[index].distanceTo(pointsArr[index + 1]));
            }
            sumDistance = distanceArr.reduce(function (tmp, item) {
                return tmp + item;
            })


            let disPerSumArr = [0];
            disPerSumArr.push(distanceArr[0]);
            distanceArr.reduce(function (tmp, item) {
                disPerSumArr.push(tmp + item);
                return tmp + item;
            })

            disPerSumArr.forEach((value, index) => {
                disPerSumArr[index] = value / sumDistance;
            })
            this.pointPercentArr = disPerSumArr;
        }
        // console.log(this.pointPercentArr);


        //上一次的朝向
        this.preUp = new THREE.Vector3(0, 0, 0);



        //run函数需要的数据
        this.perce = 0; //控制当前位置占整条线百分比
        this.speed = 0.0005;  //控制是否运动
        this.turnFactor = 0;  //暂停时间因子
        this.turnSpeedFactor = 0.001; //转向速度因子
        this.obj = null;

        this.preTime = new Date().getTime();
        this.firstTurn = false;


    }

    //获取点，是否转弯，朝向等
    getPoint(percent) {

        let indexP = 0;
        let indexN = 0;
        let turn = false;

        for (let i = 0; i < this.pointPercentArr.length; i++) {
            if (percent >= this.pointPercentArr[i] && percent < this.pointPercentArr[i + 1]) {
                indexN = i + 1;
                indexP = i;
                if (percent === this.pointPercentArr[i]) {
                    turn = true;
                }
            }
        }

        let factor = (percent - this.pointPercentArr[indexP]) / (this.pointPercentArr[indexN] - this.pointPercentArr[indexP]);
        let position = new THREE.Vector3();
        position.lerpVectors(this.pointsArr[indexP], this.pointsArr[indexN], factor); //position的计算完全正确




        //计算朝向
        let up = new THREE.Vector3().subVectors(this.pointsArr[indexN], this.pointsArr[indexP]);
        let preUp = this.preUp;
        if (this.preUp.x != up.x || this.preUp.y != up.y || this.preUp.z != up.z) {

            console.info('当前朝向与上次朝向不等，将turn置为true！');
            turn = true;
        }

        this.preUp = up;


        return {
            position,
            direction: up,

            turn, //是否需要转向
            preUp, //当需要转向时的上次的方向

        };

    }


    //参数：是否运动，运动的对象，是否运动到结尾
    run(animata, camera, end) {

        if (end) {

            this.perce = 0.99999;
            this.obj = this.getPoint(this.perce);

            //修改位置
            let posi = this.obj.position;

            // cone.position.set(posi.x, posi.y, posi.z);
            camera.position.set(posi.x, posi.y, posi.z); //相机漫游2
        }

        else if (animata) {

            //转弯时
            if (this.obj && this.obj.turn) {

                if (this.turnFactor == 0) {
                    this.preTime = new Date().getTime();
                    this.turnFactor += 0.000000001;
                }
                else {
                    let nowTime = new Date().getTime();
                    let timePass = nowTime - this.preTime;
                    this.preTime = nowTime;

                    this.turnFactor += this.turnSpeedFactor * timePass;
                }


                console.log('--->>> 当前需要turn , turnFactor值为 :', this.turnFactor);
                if (this.turnFactor > 1) {
                    this.turnFactor = 0;
                    this.perce += this.speed;

                    this.obj = this.getPoint(this.perce);
                }

                else {

                    //修改朝向 (向量线性插值方式)
                    let interDirec = new THREE.Vector3();
                    interDirec.lerpVectors(this.obj.preUp, this.obj.direction, this.turnFactor);

                    let look = new THREE.Vector3();
                    look = look.add(this.obj.position);
                    look = look.add(interDirec);

                    // cone.lookAt(look);
                    camera.lookAt(look);  //相机漫游1
                }

            }

            //非转弯时
            else {

                this.obj = this.getPoint(this.perce);

                //修改位置
                let posi = this.obj.position;

                // cone.position.set(posi.x, posi.y, posi.z);
                camera.position.set(posi.x, posi.y, posi.z); //相机漫游2


                //当不需要转向时进行
                if (!this.obj.turn) {
                    let look = posi.add(this.obj.direction);

                    // cone.lookAt(look);
                    camera.lookAt(look); //相机漫游3
                }
                this.perce += this.speed;

            }
        }


    }
}




let a = new myPath([
    0, 0, 0,
    500, 0, 0,
    500, 0, 500,
    0, 0, 500,
    0, 500, 500,
    500, 750, 0,
]);

scene.add(a.points);
scene.add(a.line);



let startFlag = true;
let endFlag = false;
let toggleFlag = true;
let runMesh: Mesh<CylinderGeometry, MeshBasicMaterial> | THREE.PerspectiveCamera = cone;

document.getElementById('start').onclick = function timeStart() {
    console.log('点击了start');
    startFlag = true;
    endFlag = false;
};

document.getElementById('stop').onclick = function timeStart() {
    console.log('点击了stop');
    startFlag = false;
};

document.getElementById('end').onclick = function timeStart() {
    console.log('点击了end');
    endFlag = true;
};

document.getElementById('toggle').onclick = function timeStart() {
    console.log('点击了toggle');
    toggleFlag = !toggleFlag;
    if(toggleFlag){
        runMesh = cone;
        camera.position.set(500,500,500);
    }
    else{
        runMesh = camera;
    }

};




let animate = function () {

    requestAnimationFrame(animate);
    controls.update();


    a.run(startFlag, runMesh, endFlag);

    //路程循环
    if (a.perce >= 1) {
        a.perce = 0;
    }


    renderer.render(scene, camera);
};

animate();