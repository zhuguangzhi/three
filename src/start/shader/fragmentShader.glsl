void main(){
//    distance 计算两点之间的距离
//    设置渐变圆
    float strength = distance(gl_PointCoord,vec2(0.5,0.5));
// 增强亮点
    strength*=2.0;

//    设置圆点
//    strength = step(0.5,strength);

    strength = 1.0 - strength ;
    gl_FragColor = vec4(strength);

}