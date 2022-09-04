export default class Sky {
    constructor(gl_) {
        this.gl = gl_
        this.children=[]
    }
//    添加子对象
    add(obj) {
        obj.gl = this.gl
        this.children.push(obj)
    }
    updateVertices(params) {
        this.children.forEach(ele=>{
            ele.updateVertices(params)
        })
    }
    draw(){
        this.children.forEach(ele=>{
            ele.init()
            ele.draw()
        })
    }
}