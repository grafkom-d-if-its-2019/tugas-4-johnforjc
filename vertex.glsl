precision mediump float;

attribute vec2 vPosition;
attribute vec3 vPositionCubePlane;
attribute vec3 vPositionCubeLine;
attribute vec3 vColor;
attribute vec3 vColorCubePlane;
attribute vec3 vColorCubeLine;
varying vec3 fColor;
uniform float scaleX;
uniform float constant;
uniform float jalanX;
uniform float jalanY;
uniform float jalanZ;
uniform int gambarCube;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main() {
  mat4 translasi = mat4
    (constant, 0.0, 0.0, 0.0,
     0.0, constant, 0.0, 0.0,
     0.0, 0.0, 1.0, 0.0,
     jalanX, jalanY, jalanZ, 1.0 
  );

  mat4 scalationMatrix = mat4(
    scaleX, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
  );
  if(gambarCube==0) {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * translasi  * scalationMatrix * vec4(vPosition, 0.0, 1.0);
    fColor = vColor;
  }
  else if(gambarCube==1){
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPositionCubeLine, 1.0);
    fColor = vColorCubeLine;
  }
  else if(gambarCube==2)
  {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vPositionCubePlane, 1.0);
    fColor = vColorCubeLine;
  }
}