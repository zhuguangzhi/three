/*
attributes 数据结构:{
  a_Position: {
    size: 3,
    index:0
  }
}
uniforms 数据结构:{
  u_Color: {
    type: 'uniform1f',
    value:1
  },
}
maps 数据结构:{
  u_Sampler:{
    image,
    format,
    wrapS,
    wrapT,
    magFilter,
    minFilter
  },
}
*/
const defAttr = ()=>({
    gl:null,
    type:"POINTS",
    source:[],//数据源
    sourceSize:0,//顶点数量
    elementBytes:4,//元素字节数
    categorySize:0,//类目尺寸
    attributes:{}, //attribute属性集合
    uniforms:{},//uniform属性集合
    maps:{},//贴图集合
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
        this.updateMaps()
    }
//    基于数据源计算类目尺寸、类目字节数、顶点总数
    calculateSourceSize(){
        const {attributes,elementBytes,source} = this
        let categorySize = 0
        Object.values(attributes).forEach(ele=>{
            // ele:  a_Position: {size: 3,index:0}
            const {size,index} = ele
            categorySize += size
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
        gl.bindBuffer(gl.ARRAY_BUFFER,sourceBuffer)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(source),gl.STATIC_DRAW)
        for (let [key,{size,index}] of Object.entries(attributes)){
            const attr = gl.getAttribLocation(gl.program,key)
            gl.vertexAttribPointer(
                attr,
                size,
                gl.FLOAT,
                false,
                categoryBytes,
                index
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
    updateMaps(){
        const {gl,maps} = this
        Object.entries(maps).forEach(([key,val],ind)=>{
            const { format = gl.RGB,
                image,
                wrapS,
                wrapT,
                magFilter,
                minFilter} = val

            //对纹理图像垂直翻转
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1)
            //    激活指定的纹理单元
            gl.activeTexture(gl[`TEXTURE${ind}`])

            const texture = gl.createTexture()
            gl.bindTexture(gl.TEXTURE_2D,texture)

            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                format,
                format,
                gl.UNSIGNED_BYTE,
                image
            )
            wrapS && gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_S,
                wrapS
            )
            wrapT && gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_WRAP_T,
                wrapT
            )

            magFilter && gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MAG_FILTER,
                magFilter
            )
            minFilter && gl.texParameteri(
                gl.TEXTURE_2D,
                gl.TEXTURE_MIN_FILTER,
                minFilter
            )

            const u = gl.getUniformLocation(gl.program,key)
            gl.uniforms(u, ind)
        })
    }
    draw(type = this.type) {
        const { gl, sourceSize } = this
        gl.drawArrays(gl[type],0,sourceSize);
    }
}
export default NewPoly