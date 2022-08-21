//设置精度
precision mediump float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
//不同高度设置不同颜色，达到阴影效果
varying float vElevation;

void main(){
    vUv = uv;
    vec4 modelPosition = modelMatrix* vec4(position,1);
//    位置偏移
//    modelPosition.x +=2.0;
//    设置波浪效果
    modelPosition.z = sin(modelPosition.x * 10.0)*0.1;
    modelPosition.z += sin(modelPosition.y * 10.0)*0.1;
    vElevation = modelPosition.z;
    gl_Position =projectionMatrix * viewMatrix*modelPosition;
}