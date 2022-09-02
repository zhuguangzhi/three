// 封装多边形对象
const defAttr = () => ({
    gl: null, //webgl上下文对象
    vertices: [],//顶点位置集合
    geoData: [],//模型数据，对象数组，可解析出vertices顶点数据
    size: 2,//顶点分量的数目
    attrName: "a_Position",//attribute 顶点位置 变量名
    count: 0,//顶点数量
    types: ['POINTS'],//绘图方式，可用多种绘图方式
})
export default class Poly {
    //接受默认值
    constructor(attr) {
        Object.assign(this, defAttr(), attr)
        this.init()
    }

    init() {
        const {attrName, size, gl} = this
        if (!gl) return false;
        //  创建缓冲区对象
        const vertexBuffer = gl.createBuffer()
        //  写入数据
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        this.updateBuffer()
        //获取顶点地址
        const a_Position = gl.getAttribLocation(gl.program, attrName)
        gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0)
        //    批处理
        gl.enableVertexAttribArray(a_Position)
    }
    // 添加一个顶点
    addVertices (...params){
        this.vertices.push(...params)
        this.updateBuffer()
    }
    // 删除最后一个顶点
    popVertices(){
        const {vertices,size} = this
        const len = vertices.length
        vertices.splice(len-size,len)
        this.updateCount()
    }
    // 根据索引位置设置顶点
    setVertices(index,...params){
        const { vertices,size } = this
        const i = index*size
        params.forEach((param,index)=>{
            vertices[i+index] = param
        })
    }
    //更新缓冲区数据，同时更新顶点数量
    updateBuffer() {
        const {gl, vertices} = this
        this.updateCount()
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW)
    }
    //更新顶点数量
    updateCount(){
        this.count = this.vertices.length/this.size
    }
    // 基于geoData 解析出vertices 数据
    updateVertices(params){
        const {geoData} = this
        const vertices = []
        geoData.forEach(data=>{
            params.forEach(key=>{
                vertices.push(data[key])
            })
        })
        this.vertices = vertices
    }
    draw(types=this.types){
        const {gl,count} = this
        for (let type of types) {
            gl.drawArrays(gl[type],0,count)
        }
    }
}