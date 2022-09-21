uniform float uWaresFrequency;
uniform float uScale;
varying float vElevation;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    float elevation = sin(modelPosition.z * uWaresFrequency)* sin(modelPosition.x * uWaresFrequency);
    vElevation = elevation;
    elevation*=uScale;
    modelPosition.y += elevation;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}
