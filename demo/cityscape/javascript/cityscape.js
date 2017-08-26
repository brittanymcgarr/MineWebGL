var container;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 500;
	camera.position.y = 500;

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
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapEnabled = true;
	container.appendChild( renderer.domElement );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function setupScene() {
  // Floor
  var geo = new THREE.PlaneGeometry(2000, 2000, 20, 20);
  var mat = new THREE.MeshBasicMaterial({color: 0x9db3b5, overdraw: true});
  var floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = -90 * Math.PI / 180;
  floor.receiveShadow = true;
  scene.add(floor);

  // Original building
  var geometry = new THREE.CubeGeometry(1, 1, 1);
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
  var material = new THREE.MeshPhongMaterial({color: 0x555555, overdraw: true});

  var cityGeometry = new THREE.Geometry();

  for (var i = 0; i < 300; i++) {
    var building = new THREE.Mesh(geometry.clone());
    building.position.x = Math.floor(Math.random() * 200 - 100) * 4;
    building.position.z = Math.floor(Math.random() * 200 - 100) * 4;
    building.scale.x  = Math.random() * 50 + 10;
    building.scale.y  = Math.random() * building.scale.x * 8 + 8;
    building.scale.z  = building.scale.x;
    THREE.GeometryUtils.merge(cityGeometry, building);
  }

  var city = new THREE.Mesh(cityGeometry, material);
  city.castShadow = true;
  city.receiveShadow = true;
  scene.add(city);

  var light = new THREE.DirectionalLight(0xf6e86d, 1);
  light.position.set(1, 3, 2);
  light.castShadow = true;
  light.shadowDarkness = 0.5;
  light.shadowMapWidth = 2048;
  light.shadowMapHeight = 2048;
  light.position.set(500, 1500, 1000); 
  light.shadowCameraFar = 2500; 
  // DirectionalLight only; not necessary for PointLight
  light.shadowCameraLeft = -1000;
  light.shadowCameraRight = 1000;
  light.shadowCameraTop = 1000;
  light.shadowCameraBottom = -1000;
  scene.add(light);

  scene.fog = new THREE.FogExp2(0x9db3b5, 0.002);
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;
}

//
function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	camera.position.x += ( mouseX - camera.position.x ) * .005;
	camera.position.y += ( - mouseY - camera.position.y ) * .005;
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}