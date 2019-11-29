precision mediump float;

uniform vec3 diffuseColor;
uniform vec3 diffusePosition; // Titik sumber cahaya
uniform vec3 ambientColor;
uniform int gambarCube;

varying vec3 fColor;
varying vec2 fTexCoord;

void main() {
  if(gambarCube == 2){

  }
  else{
    gl_FragColor = vec4(fColor, 1.0); 
  }
}
