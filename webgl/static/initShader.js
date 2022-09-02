const initShader = (gl, vsSource, fsSource) => {
    //初始化顶点着色器
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vsSource)
    //编译着色器
    gl.compileShader(vertexShader)
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader, fsSource)
    gl.compileShader(fragmentShader)
//    创建链接程序
    const program = gl.createProgram()
    // 关联着色器
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    console.log('program1', program)

//    连接程序
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log('着色器渲染失败')
        return null
    }
    //启用程序
    gl.useProgram(program)
    return program
}
export default initShader