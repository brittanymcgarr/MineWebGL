var container;
var camera, scene, renderer;
var controls, clock;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

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
  controls.movementSpeed = 5;
  controls.lookSpeed = 0.07;

	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function setupScene() {
  // Floor
  var geo = new THREE.PlaneGeometry(200, 200, 2, 2);
  var mat = new THREE.MeshBasicMaterial({color: 0x0077AA, overdraw: true});
  var floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = -90 * Math.PI / 180;
  floor.receiveShadow = true;
  scene.add(floor);

  // Base block
  var geometry = new THREE.CubeGeometry(1, 1, 1);
  geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
  var material = new THREE.MeshPhongMaterial({color: 0x00AA44, overdraw: true});

  var cityGeometry = new THREE.Geometry();

  // Box Blur map
  var map = new Array(100);
  for (var index = 0; index < 100; index++) {
    map[index] = new Array(100);

    for (var column = 0; column < 100; column++) {
      map[index][column] = Math.random(0, 1000);
    }
  }

  for (var row = 0; row < 100; row++) {
    for (var column = 0; column < 100; column++) {
      if (row > 0 && row < 99 && column > 0 && column < 99) {
        var average = map[row-1][column-1];
        average += map[row-1][column];
        average += map[row-1][column+1];
        average += map[row][column];
        average += map[row][column+1];
        average += map[row][column];
        average += map[row+1][column+1];
        average += map[row+1][column];
        average += map[row+1][column+1];

        average = average / 9;
        map[row][column] = average;
      }
    }
  }

  for (var row = 0; row < 100; row++) {
    for (var column = 0; column < 100; column++) {
      var building = new THREE.Mesh(geometry.clone());
      building.position.x = row;
      building.position.z = column;
      building.scale.y  = map[row][column];
      THREE.GeometryUtils.merge(cityGeometry, building);
    }
  }

  var city = new THREE.Mesh(cityGeometry, material);
  city.castShadow = true;
  city.receiveShadow = true;
  scene.add(city);

  var light = new THREE.DirectionalLight(0xf6e86d, 1);
  light.castShadow = true;
  light.shadowDarkness = 0.5;
  light.shadowMapWidth = 2048;
  light.shadowMapHeight = 2048;
  light.position.set(50, 150, 50); 
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

//
function animate() {
	requestAnimationFrame( animate );
	controls.update(clock.getDelta());
	render();
}

function render() {
	renderer.render( scene, camera );
}