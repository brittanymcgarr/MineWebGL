// The detector will show a warning if the current browser does not support WebGL.
if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}

// Window properties and scene variables
var container;
var camera, controls, scene, renderer;
var lighting, ambient, keyLight, fillLight, backLight;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 3;

    scene = new THREE.Scene();
    ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
    keyLight.position.set(-100, 0, 100);
    
    fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
    fillLight.position.set(100, 0, 100);
    
    backLight = new THREE.DirectionalLight(0xffffff, 1.0);
    backLight.position.set(100, 0, -100).normalize();
    
    scene.add(keyLight);
    scene.add(fillLight);
    scene.add(backLight);

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setBaseUrl('models/');
    mtlLoader.setPath('models/');
    mtlLoader.load('giraffe.mtl', function (materials) {

        materials.preload();

        materials.materials.default.map.magFilter = THREE.NearestFilter;
        materials.materials.default.map.minFilter = THREE.LinearFilter;

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/');
        objLoader.load('giraffe.obj', function (object) {
            scene.add(object);
        });
    });

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));
    
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
}

function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
