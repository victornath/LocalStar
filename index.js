/*
    Local Star

    Coding Guide:
        Imports: Line 12
        Constants: Line 18
        Support Check: Line 44
        Code init: Line 61
*/

// Library Imports
import * as THREE from './three.js/build/three.module.js'
import Rooms from './room/test_room.js';
import PLAYER_OBJ from './furniture/player.js';
import { MapControls } from './three.js/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls} from './three.js/examples/jsm/controls/PointerLockControls.js';
import {GLTFLoader} from './three.js/examples/jsm/loaders/GLTFLoader.js' 
import {FontLoader} from './three.js/examples/jsm/loaders/FontLoader.js' 
// import * as PF from 'pathfinding'

// Variables
const MANAGER = new THREE.LoadingManager();
const GLTF_LOADER = new GLTFLoader(MANAGER);
const CUBE_TEXTURE_LOADER = new THREE.CubeTextureLoader();
const FONT_LOADER = new FontLoader(MANAGER);
const TEXTURE_LOADER = new THREE.TextureLoader();
const FONT_SIZE = 0.08;

const CONTAINER = document.getElementById('canvas-holder');

const SCENE = new THREE.Scene();
const CAMERA = new THREE.OrthographicCamera((-135*(window.innerWidth/window.innerHeight)), (135*(window.innerWidth/window.innerHeight)), 135, -135, 1,1000)
const RENDERER = new THREE.WebGLRenderer({
    antialias: false,
    localClippingEnabled: true
});
const CAMERA_CONTROL = new MapControls(CAMERA, RENDERER.domElement)
const RAYCAST = new THREE.Raycaster()
const ROOM = new Rooms()
let ROOM_GRID
let WALK_FINDER
let PLAYER_MOVE = []
let PLAYER
let PIVOTx = 0
let PIVOTz = 0

var time, delta, moveTimer = 0;
var useDeltaTiming = true, weirdTiming = 0;
var prevTime = performance.now();


// Support check
if (!('getContext' in document.createElement('canvas'))) {
    alert('Sorry, it looks like your browser does not support canvas!');
}

// Also make sure webgl is enabled on the current machine
if (WEBGL.isWebGLAvailable()) {
    // If everything is possible, start the app, otherwise show an error
    init();
    gameLoop();
} else {
    let warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
    CANVAS_HOLDER.remove();
    throw 'WebGL disabled or not supported';
}

function init() {
    // Initiate Loading
    initManager()

    // Initiate the Room
    initRenderer()
    initCamera()
    initScene()
    initRoom(ROOM)
    initPlayer()
    window.addEventListener('resize', onWindowResize, false);
}

function initManager() {
    MANAGER.onStart = function(managerUrl, itemsLoaded, itemsTotal) {
        console.log('Started loading: ' + managerUrl + '\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };

    MANAGER.onProgress = function(managerUrl, itemsLoaded, itemsTotal) {
        document.getElementById('progress-bar').style.width = (itemsLoaded / itemsTotal * 100) + '%';
        console.log('Loading file: ' + managerUrl + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };
    MANAGER.onLoad = function () {
        // Only allow control once content is fully loaded
        // CANVAS_HOLDER.addEventListener('click', function () {
        //     CONTROLS.lock();
        // }, false);

        console.log('Loading complete!');
        document.getElementById('progress').hidden = true;
    };
    document.getElementById('progress').hidden = true;
}

function initRenderer(){
    RENDERER.setSize(window.innerWidth, window.innerHeight)
    RENDERER.setClearColor(0x303030)
    RENDERER.shadowMap.enabled = true
}

function initCamera(){
    CAMERA.position.set(150,150,150)
    CAMERA.rotation.order = 'YXZ';
    CAMERA.rotation.y = - Math.PI / 4;
    CAMERA.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );

    // CAMERA_CONTROL.minZoom = 1000;
    // CAMERA_CONTROL.maxZoom = 100;
    CAMERA_CONTROL.enableDamping = false;
    // console.log(CAMERA_CONTROL.getDistance())
}

function initScene(){
    // RAYCAST.layers.set(1)
        
    // ThirdPersonCamControl = new MapControls(ThirdPersonCam, RENDERER.domElement)

    // ThirdPersonCamControl.maxDistance = 600;
    // ThirdPersonCamControl.minDistance = 150;
    // ThirdPersonCamControl.enableDamping = false;

    CONTAINER.appendChild(RENDERER.domElement)
}

function initRoom(Room){
    // Ground
    let ground = new THREE.PlaneGeometry((Room.room.x*25),(Room.room.y*25))
    let ground_texture = TEXTURE_LOADER.load('./texture/ground/'+Room.room.floor+'.png')
    ground_texture.wrapS = THREE.RepeatWrapping
    ground_texture.wrapT = THREE.RepeatWrapping
    ground_texture.repeat.set(Room.room.x,Room.room.y)
    let ground_material = new THREE.MeshBasicMaterial({
        map: ground_texture,
        side: THREE.DoubleSide
    })
    const ground_mesh = new THREE.Mesh(ground,ground_material)
    ground_mesh.position.set((Room.room.x*25)/2,0,(Room.room.y*25)/2)
    ground_mesh.rotation.x = -Math.PI / 2
    // ground_mesh.layers.set(1)
    SCENE.add(ground_mesh)

    /* Wall
        R = kanan
        L = kiri
    */
    let wall_r = new THREE.PlaneGeometry(Room.room.x*25,100)
    let wall_r_texture = TEXTURE_LOADER.load('./texture/wall/'+Room.room.wall+'.png')
    wall_r_texture.wrapS = THREE.RepeatWrapping
    wall_r_texture.wrapT = THREE.RepeatWrapping
    wall_r_texture.repeat.set(Room.room.x,1)
    let wall_r_material = new THREE.MeshBasicMaterial({
        map: wall_r_texture,
        side: THREE.DoubleSide
    })
    const wall_r_mesh = new THREE.Mesh(wall_r, wall_r_material)
    wall_r_mesh.position.set((Room.room.x*25)/2,50,0)
    SCENE.add(wall_r_mesh)

    let wall_l = new THREE.PlaneGeometry(Room.room.y*25,100)
    let wall_l_texture = TEXTURE_LOADER.load('./texture/wall/'+Room.room.wall+'.png')
    wall_l_texture.wrapS = THREE.RepeatWrapping
    wall_l_texture.wrapT = THREE.RepeatWrapping
    wall_l_texture.repeat.set(Room.room.y,1)
    let wall_l_material = new THREE.MeshBasicMaterial({
        map: wall_l_texture,
        side: THREE.DoubleSide
    })
    const wall_l_mesh = new THREE.Mesh(wall_l, wall_l_material)
    wall_l_mesh.position.set(0,50,(Room.room.y*25)/2)
    wall_l_mesh.rotation.y = -Math.PI / 2
    SCENE.add(wall_l_mesh)

    // grid helper
    let gridHelper = new THREE.GridHelper( (Room.room.x*25), Room.room.x );
    gridHelper.position.set((Room.room.x*25)/2,0,(Room.room.y*25)/2);
    SCENE.add(gridHelper)
    ROOM_GRID = new PF.Grid(Room.room.x, Room.room.y)
    WALK_FINDER = new PF.AStarFinder({
        allowDiagonal: true
    });

    //lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    SCENE.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 20, 10); // x, y, z
    SCENE.add(dirLight);
    
    //objects
    Room.objects.forEach(element => {
        element.mesh.position.set((element.position_x)*25,element.position_y,(element.position_z)*25)
        SCENE.add(element.mesh)
        for (let index = 0; index < element.size_x; index++) {
            for (let index2 = 0; index2 < element.size_z; index2++) {
                ROOM_GRID.setWalkableAt(element.position_x+index-1,element.position_z+index2-1,false)
                console.log("Position: ("+(element.position_x+index)+","+(element.position_z+index2)+") is blocked")
            }
        }
    });


    console.log(PF)
 
}

function initPlayer(){
    PLAYER = new PLAYER_OBJ().group

    PLAYER.position.set(137.5,25,12.5);
    PLAYER.speedMultiplier = 1
    SCENE.add(PLAYER);

    document.addEventListener("click", function(event){
    /* which = 1 itu click kiri */
    /* which = 2 itu scroll click */
    /* which = 3 itu click kanan */
        if(event.which == 1){
            let mouse = {}
            let w = window.innerWidth
            let h = window.innerHeight
            mouse.x = event.clientX/w *2 -1
            mouse.y = event.clientY/h *(-2) + 1
        
            RAYCAST.setFromCamera(mouse,CAMERA)
            // console.log(CAMERA.zoom)
            let items = RAYCAST.intersectObjects(SCENE.children,false)
            // console.log(items)
            items.forEach(i=>{
                let newPoint = {}
                newPoint.x = Math.round(i.point.x/25)
                newPoint.z = Math.round(i.point.z/25)

                if(newPoint.x<0){
                    newPoint.x = 0
                }
                if(newPoint.z<0){
                    newPoint.z = 0
                }

                if(newPoint.x>ROOM.room.x-1){
                    newPoint.x = ROOM.room.x-1
                }
                if(newPoint.z>ROOM.room.y-1){
                    newPoint.z = ROOM.room.y-1
                }

                
                let startPos = {
                    x: Math.floor((PLAYER.position.x+12.5)/25)-1,
                    z: Math.floor((PLAYER.position.z+12.5)/25)-1
                }
                PLAYER_MOVE.pop()
                var gridClone = ROOM_GRID.clone()
                var path = WALK_FINDER.findPath(startPos.x,startPos.z,newPoint.x,newPoint.z, gridClone)
                // PLAYER_MOVE.push([newPoint.x,newPoint.z,startPos.x,startPos.z])
                PLAYER_MOVE.push(path)
                items.pop()

                //rotate player
/*               if(dif.x < 0){
                    player_mesh.rotation.y = -Math.PI/2
                    console.log("x-")
                } else if(dif.x > 0){
                    player_mesh.rotation.y = 0
                    console.log("x+")
                }
                if(dif.z < 0){
                    player_mesh.rotation.y = Math.PI
                    console.log("z-")
                } else if(dif.z > 0){
                    player_mesh.rotation.y = Math.PI/2
                    console.log("Z+")
                }
*/
                // console.log(PLAYER.position)
            })
        }
    })
}

function gameLoop() {
        requestAnimationFrame(gameLoop);
    
        time = performance.now();
        if (useDeltaTiming) {
            delta = (time - prevTime) / 1000;
            // some code that checks if timing is weird and then turns off delta-timing
            // this is specifically for those people running this in firefox with privacy.resistFingerprinting enabled
            if (delta === 0.1) {
                weirdTiming += 1;
                if (weirdTiming === 5) {
                    useDeltaTiming = false;
                    console.warn("HUMAN.Riley: performance.now() warning: The performance API in your browser is returning strange time measurements, perhaps due to a privacy or anti-fingerprinting setting you've enabled. This may affect your performance :(")
                }
            }
        } else {
            delta = 1/FRAMERATE;
        }
    
        // Process player input
        if(PLAYER_MOVE.length > 0) {
            if(PLAYER_MOVE[0].length > 1){
                let start_position = {
                    x: PLAYER_MOVE[0][0][0],
                    z: PLAYER_MOVE[0][0][1]
                }
                let end_position = {
                    x: PLAYER_MOVE[0][1][0],
                    z: PLAYER_MOVE[0][1][1]
                }
                let xMove = 0;
                let zMove = 0;
                if (end_position.x-start_position.x > 0){
                    xMove = 1;
                } else xMove = -1
                
                if (end_position.z-start_position.z > 0){
                    zMove = 1;
                } else zMove = -1
                
                if(PLAYER.position.x !== (end_position.x*25)+12.5){
                    PLAYER.position.x += xMove*PLAYER.speedMultiplier
                } else {
                    PIVOTx++
                }
                if(PLAYER.position.z !== (end_position.z*25)+12.5){
                    PLAYER.position.z += zMove*PLAYER.speedMultiplier
                } else {
                    PIVOTz++
                }
                
                if (PIVOTx !== 0 && PIVOTz !== 0){
                    console.log("Player walks from ("+PLAYER_MOVE[0][0]+") to (" + PLAYER_MOVE[0][1]+")")
                    console.log("Walking Queue: "+PLAYER_MOVE)
                    PLAYER_MOVE[0].shift()
                    PIVOTx = 0
                    PIVOTz = 0
                    if(PLAYER_MOVE[0].length === 1){
                        PLAYER_MOVE.shift()
                    }
                }
            }
            


            // if(!(ROOM.x_map.has(Math.floor(PLAYER.position.x/25)) && ROOM.z_map.has(Math.floor(PLAYER.position.z/25)))){
            //     // console.log(Math.floor(PLAYER.position.x/25))
            // }
            // PLAYER_MOVE -= Math.floor(Math.max(Math.abs(dif.x), Math.abs(dif.y), Math.abs(dif.z)))*delta

            // PLAYER.translateX(dif.x *delta)
            // PLAYER.translateZ(dif.z *delta)
            // PLAYER_MOVE -= Math.floor(Math.max(Math.abs(dif.x), Math.abs(dif.y), Math.abs(dif.z)))*delta
            // console.log(PLAYER_MOVE)
        }
    
        // Broadcast movement to other players n times per second
        // moveTimer += delta;
        // if (moveTimer >= 1/TICKRATE) {
        //     moveTimer = 0;
        //     emitMove();
        // }
    
        // Move other players (interpolate movement)
        // for (let userid in USERS) {
        //     if (USERS[userid] !== undefined) {
        //         let oldPos = USERS[userid].oldPos;
        //         let pos = USERS[userid].pos;
        //         let rot = USERS[userid].rot;
        //         let a = USERS[userid].alpha;
    
        //         if (USERS[userid].mesh !== undefined) {
        //             USERS[userid].mesh.position.lerpVectors(oldPos, pos, a);
        //             USERS[userid].mesh.quaternion.rotateTowards(rot, USERS[userid].mesh.quaternion.angleTo(rot) * (TICKRATE * delta));
        //             if (USERS[userid].text !== undefined) {
        //                 USERS[userid].text.position.copy(USERS[userid].mesh.position);
        //                 USERS[userid].text.rotation.copy(USERS[userid].mesh.rotation);
        //             }
        //         }
    
        //         USERS[userid].alpha = Math.min(a + delta*(TICKRATE-1), 2);
        //     }
        // }
    
        prevTime = time;
        RENDERER.render(SCENE, CAMERA);
}

function onWindowResize(){
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();
    RENDERER.setSize(window.innerWidth, window.innerHeight);
}