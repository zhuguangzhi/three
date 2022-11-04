varying vec2 v_Uv;
void main(){
    v_Uv = uv;
    gl_Position =projectionMatrix * viewMatrix*modelMatrix* vec4(position,1);
}