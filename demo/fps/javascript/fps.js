var container;
var camera, scene, renderer;
var controls, clock;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var map = "XXXXXXX  \n" +
          "X     X  \n" +
          "X  S  X  \n" +
          "X     X  \n" +
          "X   S XXX\n" +
          "XXX     X\n" +
          "  XX  S X\n" +
          "   X    X\n" +
          "   XXXXXX";
map = map.split("\n");
var HORIZONTAL_UNIT = 100,
    VERTICAL_UNIT   = 100,
    ZSIZE = map.length * HORIZONTAL_UNIT,
    XSIZE = map[0].length * HORIZONTAL_UNIT;

animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1;
	camera.position.y = 5;

	// scene
	scene = new THREE.Scene();
	var ambient = new THREE.AmbientLight( 0xC0C0C0 );
	scene.add( ambient );
	var directionalLight = new THREE.DirectionalLight( 0xCECECE );
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );

	var onError = function ( xhr ) {};

  setupScene();

	//
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;
	container.appendChild( renderer.domElement );

  clock = new THREE.Clock();
  controls = new THREE.FirstPersonControls(camera);
  controls.movementSpeed = 50;
  controls.lookSpeed = 0.7;

	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function setupScene() {
  // Floor
  var geo = new THREE.PlaneGeometry(2000, 2000, VERTICAL_UNIT, 2);
  var mat = new THREE.MeshBasicMaterial({color: 0x0044AA, overdraw: true});
  var floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = -90 * Math.PI / 180;
  floor.receiveShadow = true;
  scene.add(floor);

    for (var i = 0, rows = map.length; i < rows; i++) {
      for (var j = 0, cols = map[i].length; j < cols; j++) {
        addVoxel(map[i].charAt(j), i, j);
      }
    }

  var light = new THREE.DirectionalLight(0xf6e86d, 0.75);
  light.castShadow = true;
  light.shadowDarkness = 0.5;
  light.shadowMapWidth = 2048;
  light.shadowMapHeight = 2048;
  light.position.set(0, 150, 0); 
  light.shadowCameraFar = 2500; 
  // DirectionalLight only; not necessary for PointLight
  light.shadowCameraLeft = -1000;
  light.shadowCameraRight = 1000;
  light.shadowCameraTop = 1000;
  light.shadowCameraBottom = -1000;
  scene.add(light);

  scene.fog = new THREE.FogExp2(0x9db3b5, 0.0005);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

//
function animate() {
	requestAnimationFrame( animate );
	controls.update(clock.getDelta());
	render();
}

function render() {
	renderer.render( scene, camera );
}

function clamp(min, max, term) {
  if (term < min) {
    return min;
  } else if (term > max) {
    return max;
  } else {
    return term;
  }
}

function addVoxel(type, row, col) {
  var z = (row+1) * HORIZONTAL_UNIT - ZSIZE * 0.5,
      x = (col+1) * HORIZONTAL_UNIT - XSIZE * 0.5;
  switch(type) {
    case ' ': break;
    case 'S':
      break;
    case 'X':
      var geo = new THREE.CubeGeometry(HORIZONTAL_UNIT, VERTICAL_UNIT, HORIZONTAL_UNIT);
      var material = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff
      });
      var mesh = new THREE.Mesh(geo, material);
      mesh.position.set(x, VERTICAL_UNIT*0.5, z);
      scene.add(mesh);
      break;
  }
}