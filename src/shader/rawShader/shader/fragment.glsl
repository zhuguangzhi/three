//设置精度
precision mediump float;
varying vec2 vUv;
//不同高度设置不同颜色，达到阴影效果
varying float vElevation;
void main (){
//    gl_FragColor = vec4(vUv,0.0,1.0);
    float hieight = vElevation+0.5;
    gl_FragColor = vec4(1.0*hieight,0.0,0.0,1.0);
}