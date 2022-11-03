precision lowp float;
varying vec4 v_Position;
varying vec4 g_Position;
void main (){
        vec4 redColor = vec4(1,0,0,1);
    vec4 yellowColor = vec4(1,1,0.5,1);
    vec4 mixColor = mix(yellowColor,redColor,g_Position.y/3.0);
//    gl_FrontFacing判断正反面
    if(gl_FrontFacing){
//        正面
        gl_FragColor = vec4(mixColor.xyz-v_Position.y/100.0-0.1,1);
    }
    else {
        gl_FragColor = vec4(mixColor.xyz,1);
    }
}