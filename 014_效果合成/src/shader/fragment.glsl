uniform sampler2D tDiffuse;
uniform vec3 uColor;
varying vec2 v_Uv;
void main (){
    vec4 color = texture2D(tDiffuse,v_Uv);
    color.rgb+=uColor;
    gl_FragColor = color;
}