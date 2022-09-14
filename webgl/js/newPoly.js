const defAttr = ()=>({
    gl:null,
    type:"POINTS",
    source:[],//数据源
    sourceSize:0,//顶点数量
    elementBytes:4,//元素字节数
    categorySize:0,//类目尺寸
    attributes:{}, //attribute属性集合
    uniforms:{},//uniform属性集合
})

class NewPoly {
    constructor(attr) {
        Object.assign(this,defAttr(),attr)
        this.init()
    }
    init(){
        if (!this.gl){return false;}
        this.calculateSourceSize()
        this.updateAttribute()
        this.updateUniform()
    }
//    基于数据源计算类目尺寸、类目字节数、顶点总数
    calculateSourceSize(){
        const {attributes,elementBytes,source} = this
        let categorySize = 0
        Object.values(attributes).forEach(ele=>{
            // ele:  a_Position: {size: 3,index:0}
            const {size,index} = ele
            categorySize = size
            ele.byteIndex = index*elementBytes
        })
        this.categorySize = categorySize
        this.categoryBytes = categorySize * elementBytes
        this.sourceSize = source.length / categorySize
    }
//    更新attribute变量
    updateAttribute() {
        const {gl,attributes,categoryBytes,source} = this
        const sourceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,sourceBuffer,new Float32Array(source),gl.STATIC_DRAW)
        for (let [key,{size,byteIndex}] of Object.entries(attributes)){
            const attr = gl.getAttribLocation(gl.program,key)
            gl.vertexAttribPointer(
                attr,
                size,
                gl.FLOAT,
                false,
                categoryBytes,
                byteIndex
            )
            gl.enableVertexAttribArray(attr)
        }
    }
    updateUniform() {
        const {gl,uniforms}=this
        for (let [key, val] of Object.entries(uniforms)) {
            const { type, value } = val
            const u = gl.getUniformLocation(gl.program, key)
            if (type.includes('Matrix')) {
                gl[type](u,false,value)
            } else {
                gl[type](u,value)
            }
        }
    }
    draw(type = this.type) {
        const { gl, sourceSize } = this
        gl.drawArrays(gl[type],0,sourceSize);
    }
}