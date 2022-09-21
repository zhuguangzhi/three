varying float vElevation;

void main() {
    float opicty = (vElevation + 1.0)/2.0;
    gl_FragColor = vec4(1.0*opicty,1.0*opicty,0.0,1.0);
}
