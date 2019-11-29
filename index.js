(function(){
    var canvas, gl, program, nWord, pindahX =0.0053, pindahY = 0.0053, pindahZ=0.0053;

    glUtils.SL.init({ callback:function() { main(); } });

    function main() {
        // Get canvas element and check if WebGL enabled
        canvas = document.getElementById("glcanvas");
        gl = glUtils.checkWebGL(canvas);

        initGlSize();

        // Initialize the shaders and program
        var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
        fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
        program = glUtils.createProgram(gl, vertexShader, fragmentShader);
        gl.useProgram(program);

        nWord = initWordVertices();
        initCubeVertices();

        // Definisi untuk matriks model
        var mmLoc = gl.getUniformLocation(program, 'modelMatrix');
        var mm = glMatrix.mat4.create();
        glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);
        gl.uniformMatrix4fv(mmLoc, false, mm);  

        // Definisi untuk matrix view dan projection
        var vmLoc = gl.getUniformLocation(program, 'viewMatrix');
        var vm = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(vm,
            [0.0, 0.0, 0.0], // di mana posisi kamera (posisi)
            [0.0, 0.0, -2.0], // ke mana kamera menghadap (vektor)
            [0.0, 1.0, 0.0]  // ke mana arah atas kamera (vektor)
          );
          gl.uniformMatrix4fv(vmLoc, false, vm);
        var pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
        var pm = glMatrix.mat4.create();
        var camera = {x: 0.0, y: 0.0, z:0.0};
        glMatrix.mat4.perspective(pm,
        glMatrix.glMatrix.toRadian(90), // fovy dalam radian
        canvas.width/canvas.height,     // aspect ratio
        0.5,  // near
        10.0, // far  
        );
        gl.uniformMatrix4fv(pmLoc, false, pm);

        var dcLoc = gl.getUniformLocation(program, 'diffuseColor');
        var dc = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);  // rgb
        gl.uniform3fv(dcLoc, dc);
        var ddLoc = gl.getUniformLocation(program, 'diffusePosition');
        var dd = glMatrix.vec3.fromValues(0.5, 3.0, 4.0);  // xyz
        gl.uniform3fv(ddLoc, dd);
        var acLoc = gl.getUniformLocation(program, 'ambientColor');
        var ac = glMatrix.vec3.fromValues(0.2, 0.2, 0.2);
        gl.uniform3fv(acLoc, ac);

        var scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
        var scaleX = 1.0;
        gl.uniform1f(scaleXUniformLocation, scaleX);

        var constantUniformLocation = gl.getUniformLocation(program, 'constant');
        var constant = 0.5;
        gl.uniform1f(constantUniformLocation, constant);

        var jalanXUniformLocation = gl.getUniformLocation(program, 'jalanX');
        var jalanX = 0.00;
        gl.uniform1f(jalanXUniformLocation, jalanX);

        var jalanYUniformLocation = gl.getUniformLocation(program, 'jalanY');
        var jalanY = 0.00;
        gl.uniform1f(jalanYUniformLocation, jalanY);

        var jalanZUniformLocation = gl.getUniformLocation(program, 'jalanZ');
        var jalanZ = 0.00;
        gl.uniform1f(jalanZUniformLocation, jalanZ);

        var gambarCubeUniformLocation = gl.getUniformLocation(program, 'gambarCube');
        var gambarCube = 1;
        gl.uniform1i(gambarCubeUniformLocation, gambarCube);

        render();
        window.addEventListener('resize', resizer);

        var vertexKiriTerjauh  = -0.35;
        var vertexKananTerjauh = 0.15;
        var vertexAtasTerjauh  = 0.30;
        var vertexBawahTerjauh = -0.6;
        var ukuranTerjauh = 0.5;
        var depan=0, kanan=1, belakang=2, bawah=3, kiri=4, atas=5;

        function bounceChecking(){
            // Checking X koordinat
            if(constant*scaleX*vertexKiriTerjauh+jalanX>=ukuranTerjauh)
            {
                jalanX = ukuranTerjauh - constant*scaleX*vertexKiriTerjauh;
                pindahX = -1*pindahX;
            }
            else if(constant*scaleX*vertexKananTerjauh+jalanX>=ukuranTerjauh)
            {
                jalanX = ukuranTerjauh - constant*scaleX*vertexKananTerjauh;
                pindahX = -1*pindahX;
            }
            else if(constant*scaleX*vertexKiriTerjauh+jalanX<= -1*ukuranTerjauh)
            {
                jalanX = (-1 * ukuranTerjauh - constant*scaleX*vertexKiriTerjauh);
                pindahX = -1*pindahX;
            }
            else if(constant*scaleX*vertexKananTerjauh+jalanX<= -1*ukuranTerjauh)
            {
                jalanX = (-1 * ukuranTerjauh - constant*scaleX*vertexKananTerjauh);
                pindahX = -1*pindahX;
            }

            // Checking Y koordinat
            if(constant * vertexAtasTerjauh +jalanY>=ukuranTerjauh)
            {
                jalanY = ukuranTerjauh - constant*vertexAtasTerjauh;
                pindahY = -1*pindahY;
            }
            else if(constant * vertexBawahTerjauh+jalanY<= -1*ukuranTerjauh)
            {
                jalanY = (-1 * ukuranTerjauh - constant*vertexBawahTerjauh);
                pindahY = -1*pindahY;
            }

            // Checking Z koordinat
            if(jalanZ>=ukuranTerjauh)
            {
                jalanZ = ukuranTerjauh;
                pindahZ = -1*pindahZ;
            }
            else if(jalanZ<= -1*ukuranTerjauh)
            {
                jalanZ = (-1 * ukuranTerjauh);
                pindahZ = -1*pindahZ;
            }
        }

        function render(){
            gl.clearColor(0.364, 0.305, 1, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            if (scaleX >= 1.0) melebar = -1.0;
            else if (scaleX <= -1.0) melebar = 1.0;
            scaleX += 0.0053 * melebar;

            jalanX += pindahX;
            jalanY += pindahY;
            jalanZ += pindahZ;

            bounceChecking();

            gl.uniform1f(jalanYUniformLocation, jalanY);
            gl.uniform1f(jalanXUniformLocation, jalanX);
            gl.uniform1f(jalanZUniformLocation, jalanZ);

            gl.uniform1f(scaleXUniformLocation, scaleX);

            gambarCube=0;
            gl.uniform1i(gambarCubeUniformLocation, gambarCube);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, nWord);

            gambarCube=2;
            gl.uniform1i(gambarCubeUniformLocation, gambarCube);
            gl.drawArrays(gl.TRIANGLES, 0, 30);

            gl.enable(gl.DEPTH_TEST);
    
            requestAnimationFrame(render);
          }
    
        function initGlSize() {
            var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
            // Fullscreen if not set
            if (width) {
                gl.maxWidth = width;
            }
            if (height) {
                gl.maxHeight = height;
            }
        }

        function initWordVertices() {
            var vertices=[];
            var bagian_atas=[
                -0.15 , +0.30, 0.866, 0.968, 1,
                -0.15 , +0.20, 0.866, 0.968, 1,
                +0.15 , +0.20, 0.866, 0.968, 1,
                +0.15 , +0.30, 0.866, 0.968, 1,
                -0.15 , +0.30, 0.866, 0.968, 1,
            ];
            
            var bagian_tegak=[
                -0.05 , +0.30, 0.866, 0.968, 1,
                +0.05 , +0.30, 0.866, 0.968, 1,
                +0.05 , -0.40, 0.866, 0.968, 1,
                -0.05 , -0.40, 0.866, 0.968, 1,
                -0.05 , +0.30, 0.866, 0.968, 1,
            ];
            
            var lingkaran =[];
            var vertexBuffer = gl.createBuffer();

            
            for (var i=90.0; i<=270; i+=1) {
                var j = i * Math.PI / 180;
                var vert1 = [
                    Math.sin(j)*0.2-0.15,
                    Math.cos(j)*0.2-0.40,
                    0.866, 0.968, 1,
                ];
                lingkaran=lingkaran.concat(vert1);
                
                var vert2 = [
                    Math.sin(j)*0.1-0.15,
                    Math.cos(j)*0.1-0.40,
                    0.866, 0.968, 1,
                ];
                lingkaran=lingkaran.concat(vert2);

                if(i==90 || i==180 || i==270) console.log(i, vert1, vert2)
            }
            bagian_atas=bagian_atas.concat(bagian_tegak);
            vertices=vertices.concat(bagian_atas);
            vertices=vertices.concat(lingkaran);
            
            var n = vertices.length / 5;
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            
            var vPosition = gl.getAttribLocation(program, 'vPosition');
            var vColor = gl.getAttribLocation(program, 'vColor');
            gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE,
                5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(vPosition);
            gl.enableVertexAttribArray(vColor);
            
            return n;
        }

        function initCubeVertices() {
            var verticesCubePlane = [];
            var verticesCubeLine = [];
            // console.log(verticesCubeLine);
            var cubePoints = [
                [ -0.5, -0.5,  0.5 ],
                [ -0.5,  0.5,  0.5 ],
                [  0.5,  0.5,  0.5 ],
                [  0.5, -0.5,  0.5 ],
                [ -0.5, -0.5, -0.5 ],
                [ -0.5,  0.5, -0.5 ],
                [  0.5,  0.5, -0.5 ],
                [  0.5, -0.5, -0.5 ]
              ];
              var cubeColors = [
                [],
                [1.0, 0.0, 0.0], // merah
                [0.0, 1.0, 0.0], // hijau
                [0.0, 0.0, 1.0], // biru
                [1.0, 0.0, 0.0], // putih
                [1.0, 0.5, 0.0], // oranye
                [1.0, 1.0, 0.0], // kuning
                []
              ];
            //   var cubeNormals = [
            //     [],
            //     [  0.0,  0.0,  1.0 ], // depan
            //     [  1.0,  0.0,  0.0 ], // kanan
            //     [  0.0, -1.0,  0.0 ], // bawah
            //     [  0.0,  0.0, -1.0 ], // belakang
            //     [ -1.0,  0.0,  0.0 ], // kiri
            //     [  0.0,  1.0,  0.0 ], // atas
            //     []
            //   ];
              
              function quad(a, b, c, d) {
                var indices = [a, b, c, a, c, d];
                for (var i=0; i < indices.length; i++) {
                    for (var j=0; j < 3; j++) {
                        verticesCubePlane.push(cubePoints[indices[i]][j]);
                    }
                    for (var j=0; j < 3; j++) {
                        verticesCubePlane.push(cubeColors[a][j]);
                    }
                    for (var j=0; j < 3; j++) {
                        verticesCubePlane.push(cubeNormals[a][j]);
                    }
                    switch (indices[i]) {
                        case a:
                            verticesCubePlane.push(0.0);
                            verticesCubePlane.push(0.0);
                        break;
                        case b:
                            verticesCubePlane.push(0.0);
                            verticesCubePlane.push(1.0);
                        break;
                        case c:
                            verticesCubePlane.push(1.0);
                            verticesCubePlane.push(1.0);
                        break;
                        case d:
                            verticesCubePlane.push(1.0);
                            verticesCubePlane.push(0.0);
                        break;
                    
                        default:
                        break;
                    }
                }
              }
            //   quad(1, 0, 3, 2);
              quad(2, 3, 7, 6);
              quad(3, 0, 4, 7);
              quad(4, 5, 6, 7);
              quad(5, 4, 0, 1);
              quad(6, 5, 1, 2);

            // Membuat vertex buffer object (CPU Memory <==> GPU Memory)
            var vertexBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesCubePlane), gl.STATIC_DRAW);

            // Membuat sambungan untuk attribute
            var vPositionCubePlane = gl.getAttribLocation(program, 'vPositionCubePlane');
            // var vColorCubePlane = gl.getAttribLocation(program, 'vColorCubePlane');
            var vCubePlaneNormal = gl.getAttribLocation(program, 'vCubePlaneNormal');
            var vCubePlaneTexCoord = gl.getAttribLocation(program, 'vCubePlaneTexCoord');
            gl.vertexAttribPointer(
                vPositionCubePlane,    // variabel yang memegang posisi attribute di shader
                3,            // jumlah elemen per atribut
                gl.FLOAT,     // tipe data atribut
                gl.FALSE, 
                11 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
                0                                   // offset dari posisi elemen di array
            );
            // gl.vertexAttribPointer(vColorCubePlane, 3, gl.FLOAT, gl.FALSE,
            //     11 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
            gl.vertexAttribPointer(vCubePlaneNormal, 3, gl.FLOAT, gl.FALSE,
                11 * Float32Array.BYTES_PER_ELEMENT, 6 * Float32Array.BYTES_PER_ELEMENT);
            gl.vertexAttribPointer(vCubePlaneTexCoord, 2, gl.FLOAT, gl.FALSE,
                11 * Float32Array.BYTES_PER_ELEMENT, 9 * Float32Array.BYTES_PER_ELEMENT);
            gl.enableVertexAttribArray(vPosition);
            gl.enableVertexAttribArray(vPositionCubePlane);
            // gl.enableVertexAttribArray(vColorCubePlane);
            gl.enableVertexAttribArray(vCubePlaneNormal);
            gl.enableVertexAttribArray(vCubePlaneTexCoord);

            // var vertexBuffer2 = gl.createBuffer();

            // gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer2);
            // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesCubeLine), gl.STATIC_DRAW);

            // var vPositionCubeLine = gl.getAttribLocation(program, 'vPositionCubeLine');
            // var vColorCubeLine = gl.getAttribLocation(program, 'vColorCubeLine');
            // gl.vertexAttribPointer(
            //     vPositionCubeLine,    // variabel yang memegang posisi attribute di shader
            //     3,            // jumlah elemen per atribut
            //     gl.FLOAT,     // tipe data atribut
            //     gl.FALSE, 
            //     6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap verteks (overall) 
            //     0                                   // offset dari posisi elemen di array
            // );
            // gl.vertexAttribPointer(vColorCubeLine, 3, gl.FLOAT, gl.FALSE,
            // 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
            // gl.enableVertexAttribArray(vPositionCubeLine);
            // gl.enableVertexAttribArray(vColorCubeLine);
        }
    
        function resizer() {
            var width = canvas.getAttribute("width"), height = canvas.getAttribute("height");
            if (!width || width < 0) {
                canvas.width = window.innerWidth;
                gl.maxWidth = window.innerWidth;
            }
            if (!height || height < 0) {
                canvas.height = window.innerHeight;
                gl.maxHeight = window.innerHeight;
            }
            
            var min = Math.min.apply( Math, [gl.maxWidth, gl.maxHeight, window.innerWidth, window.innerHeight]);
            canvas.width = min;
            canvas.height = min;
            
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
    }   
}) ();