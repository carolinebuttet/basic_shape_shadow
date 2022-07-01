console.log('main!', THREE)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor('white');
renderer.shadowMap.enabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );


// Custom global variables
var mouse = {
  x: 0,
  y: 0
};

function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}

const enableControls = !isTouchDevice();
console.log('enableControls', enableControls);

// orbit controls 
let controls = null;
if(enableControls) controls = new THREE.OrbitControls( camera, renderer.domElement );


// Mouse stuff
// Create a circle around the mouse and move it
// The sphere has opacity 0
  var mouseGeometry = new THREE.SphereGeometry(0.5, 10, 10);
  var mouseMaterial = new THREE.MeshLambertMaterial({});
  mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
  mouseMesh.castShadow = true;
  mouseMesh.receiveShadow = true;

  mouseMesh.position.set(0, 0, 0);
  // scene.add(mouseMesh);

  // When the mouse moves, call the given function
  document.addEventListener('mousemove', onMouseMove, false);


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.castShadow = true;
pointLight.shadowDarkness = 0.5;
pointLight.shadowCameraVisible = true;
pointLight.shadowMapWidth = 2048; // default is 512
pointLight.shadowMapHeight = 2048; // default is 512


// Pointlight helper
const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
scene.add( pointLightHelper );


scene.add(pointLight)

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial({
  side: THREE.DoubleSide,
})
material.roughness = 0.4

// Objects
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)
cube.castShadow = true;
cube.receiveShadow = true;

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    material
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = - 0.65

floor.receiveShadow = true;
floor.receiveShadow = true;
// Backdrop
const backDrop = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    material
)
backDrop.rotation.x = 0
backDrop.position.z = -1.5
backDrop.position.y = 1
backDrop.rotation.x = - Math.PI * 0.25

backDrop.receiveShadow = true

camera.position.z = 5;

// scene.add(cube, floor, backDrop);
scene.add(backDrop)
// scene.add(floor)


// GLTF Loader
var loader = new THREE.GLTFLoader();
loader.load( './../models/eikon.svg_5mm.gltf', function ( gltf ) {
  gltf.scene.scale.x = 0.05;
  gltf.scene.scale.y = 0.05;
  gltf.scene.scale.z = 0;
  gltf.scene.position.x = -1.5;
  gltf.scene.traverse( function( node ) {
      if ( node.isMesh ) { 
        node.castShadow = true; 
        node.material.opacity = 0.2;
        node.material.transparent = true;
        console.log('node is ', node)
      }
  } );
  gltf.scene.rotation.x =  Math.PI * 0.5
	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );


function animate() {
  requestAnimationFrame( animate );

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  if(enableControls) controls.update();

  renderer.render( scene, camera );
};

// Follows the mouse event
function onMouseMove(event) {

  // Update the mouse variable
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Make the sphere follow the mouse
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var distance = -camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));
  //mouseMesh.position.copy(pos);

  pointLight.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z + 2));
};

animate();