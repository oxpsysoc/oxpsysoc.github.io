// If you're reading this, I'm sorry.
// - Auri

const canvas = document.querySelector("#glcanvas");
var gl = canvas.getContext("webgl2");

const baseUrl = "/";

async function main(gl) {
  const urls = [
    "static/glsl/vertex.glsl",
    "static/glsl/bg.glsl",
  ];

  const data = await Promise.all(urls.map((url) => baseUrl + url).map((url) => fetch(url).then(response => response.text())));

  var vertexShaderSource = data[0];

  var firstPassFragmentShaderSource = data[1];

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  const [firstPassProgram] = data.slice(1).map((source) => {
    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, shader);
    gl.linkProgram(program);

    return program;
  });

  var positionAttributeLocation = gl.getAttribLocation(firstPassProgram, "a_position");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var positions = [
    -1, -1,
    1, -1,
    -1, 1,
    1, 1,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  var lastWidth = gl.canvas.width;
  var lastHeight = gl.canvas.height;

  var frame = 0;

  var mousePos = null;

  var mouseX = null;
  var mouseY = null;

  // Function to update the mouse position
  function updateMousePosition(evt) {
    if (evt.touches != null) {
      evt = e.touches[0];
    }
    const rect = canvas.getBoundingClientRect();
    mouseX = (evt.clientX - rect.left) * window.devicePixelRatio;
    mouseY = (evt.clientY - rect.top) * window.devicePixelRatio;
  }

  function touchMove(e) {
    if (e.touches.length == 1) {
      e.preventDefault();
      updateMousePosition(e.touches[0]);
    }
  }

  // Event listener for mouse movement
  window.addEventListener("mousemove", updateMousePosition);
  window.addEventListener("touchmove", touchMove);
  window.addEventListener("touchstart", touchMove);

  const startTime = performance.now();

  function setupUniforms(gl, program, time) {
    gl.uniform1i(gl.getUniformLocation(program, "u_frame"), frame);
    gl.uniform2f(gl.getUniformLocation(program, "u_res"), gl.canvas.width, gl.canvas.height);
    gl.uniform2f(gl.getUniformLocation(program, "u_mouse"), mouseX === null ? gl.canvas.width * 0.5 : mouseX, mouseY === null ? gl.canvas.width * 0.5 : gl.canvas.height - mouseY);
    gl.uniform1f(gl.getUniformLocation(program, "u_time"), (time - startTime) * 0.001);
    gl.uniform1f(gl.getUniformLocation(program, "u_scroll"), window.scrollY);
  }

  // Render loop
  function render() {

    gl.canvas.width = window.innerWidth * window.devicePixelRatio;
    gl.canvas.height = window.innerHeight * window.devicePixelRatio;

    if (lastWidth != gl.canvas.width || lastHeight != gl.canvas.height) {
      lastWidth = gl.canvas.width;
      lastHeight = gl.canvas.height;
    }

    frame += 1;
    const time = performance.now();

    // First pass
    //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(firstPassProgram);
    gl.viewport(0, 0, lastWidth, lastHeight);
    setupUniforms(gl, firstPassProgram, time);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
  }

  render();
}

if (!gl) {
  console.error("WebGL not supported");
} else {
  main(gl);
}
