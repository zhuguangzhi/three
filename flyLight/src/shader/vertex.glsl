//Three.js的渲染器解析场景和相机参数进行渲染的时候，会从模型对象获得几何体顶点对应的模型矩阵modelMatrix，'
//从相机对象获得视图矩阵viewMatrix和投影矩阵projectionMatrix，
//在着色器中通过获得模型矩阵、视图矩阵、投影矩阵对顶点位置坐标进行矩阵变换。
varying vec4 v_Position;
varying vec4 g_Position;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    v_Position = modelPosition;
    g_Position = vec4(position,1.0);
    gl_Position =projectionMatrix * viewMatrix * modelPosition;
}