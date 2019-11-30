precision mediump float;

varying vec3 fColor;
varying vec3 fNormal;
varying vec3 fPosition;

// Variabel Flag
uniform int fgambarCube;

uniform vec3 diffuseColor;
varying vec3 fdiffusePosition; // Titik sumber cahaya
uniform vec3 ambientColor;

void main() {
  // if(fgambarCube == 2)
  // {
    // Arah cahaya = lokasi titik vertex - lokasi sumber cahaya
    vec3 diffuseDirection = normalize(fdiffusePosition - fPosition);

    // Nilai intensitas cahaya = 
    // nilai cos sudut antara arah datang cahaya dengan arah vektor normal
    // dot product dari vector arah datang cahaya . arah vektor normal
    float normalDotLight = max(dot(fNormal, diffuseDirection), 0.0);
    vec3 diffuse = diffuseColor * fColor * normalDotLight;
    vec3 ambient = ambientColor * fColor;

    gl_FragColor = vec4(diffuse + ambient, 1.0);
  // }
  // else{
    // gl_FragColor = vec4(fColor, 1.0); 
  // }
}
