// Library Imports
import * as THREE from '../../three.js/build/three.module.js'
import {FontLoader} from '../../three.js/examples/jsm/loaders/FontLoader.js' 
import { TextGeometry } from '../../three.js/examples/jsm/geometries/TextGeometry.js'
import Friend_UI from '../furniture/friend_ui.js';
import ShopLoader from '../../item/ShopLoader.js';

// Variables
const MANAGER = new THREE.LoadingManager();
const FONT_LOADER = new FontLoader(MANAGER);
const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)
const FONT_SIZE = 0.08;


const CONTAINER = document.getElementById('canvas-holder');
const UI_CONTAINER = document.getElementById('ui-holder');

const UI = new THREE.Scene();
const UI_CAMERA = new THREE.OrthographicCamera((-135*(window.innerWidth/window.innerHeight)), (135*(window.innerWidth/window.innerHeight)), 135, -135, -1000,1000)
const UI_RENDERER = new THREE.WebGLRenderer({
    antialias: false,
    localClippingEnabled: true,
    alpha: true
});
// const CAMERA_CONTROL = new MapControls(CAMERA, RENDERER.domElement)
const RAYCAST = new THREE.Raycaster()
let TOP_MENU = [];
let LOADED_TEXTURE = []
let LOADED_FONT
let FRIEND = [];

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
    load();
    gameLoop();
} else {
    let warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
    CONTAINER.remove();
    throw 'WebGL disabled or not supported';
}

function load(){
    initManager()
    TEXTURE_LOADER.load('../../texture/ui/currency_bg.png', function(texture){
        LOADED_TEXTURE["buttons"]= texture
    })
    FONT_LOADER.load( '../../texture/fonts/Bahnschrift_Regular.json', function ( font ) {
        LOADED_FONT = font
    })
    TEXTURE_LOADER.load('../../texture/ui/close_btn.png', function(texture){
        LOADED_TEXTURE["close"]=texture
    })
}


function init() {
    // Initiate the Game
    initRenderer()
    initCamera()
    initUI()
    initScene()
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
        init();
        document.getElementById('progress').hidden = true;
        console.log('Loading complete!');
    };
}

function initRenderer(){
    UI_RENDERER.setSize(window.innerWidth, window.innerHeight)
    UI_RENDERER.setClearColor(0xFFFFFF, 0)
    UI_RENDERER.shadowMap.enabled = true

}

function initCamera(){
    UI_CAMERA.position.set(20,140,150)
    UI_CAMERA.updateProjectionMatrix();
    UI_CAMERA.rotation.order = 'YXZ';
    UI_CAMERA.rotation.y = - Math.PI / 4;
    UI_CAMERA.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
    // UI_CAMERA.rotation.y = 0;
    // UI_CAMERA.rotation.x = -0.75;
    // CAMERA_CONTROL.enableDamping = false;
}

function initScene(){
    UI_CONTAINER.appendChild(UI_RENDERER.domElement)
}

function initUI(){
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    UI.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 20, 10); // x, y, z
    UI.add(dirLight);

    loadFriendlist()

    let material = new THREE.MeshBasicMaterial({
        map: LOADED_TEXTURE["buttons"],
        side: THREE.DoubleSide,
        transparent: true
    })
    let text = ["Friend List", "Friend Request", "Outgoing Request"]
    for (let i = 0; i < 3; i++) {
        let player_background = new THREE.Mesh(new THREE.PlaneGeometry(130,50), material)
        player_background.rotation.y = -Math.PI/4
        player_background.position.set(-25+(i*97.5),225,-25+(i*97.5))
        player_background.name = "menu_"+(i+1)
        TOP_MENU.push(player_background)
        UI.add(player_background)

        const geometry = new TextGeometry( text[i], {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        } );
        let mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0xffffff}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(-62.5+(i*92),227.5,-42.5+(i*92))
        TOP_MENU.push(mesh)
        UI.add(mesh)
    }


    material = new THREE.MeshBasicMaterial({
        map: LOADED_TEXTURE["close"],
        side: THREE.DoubleSide,
        transparent: true
    })
    let player_background = new THREE.Mesh(new THREE.PlaneGeometry(30,50), material)
    player_background.rotation.y = -Math.PI/4
    player_background.position.set(233,230,233)
    player_background.name = "button_back"
    TOP_MENU.push(player_background)
    UI.add(player_background)


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
            
                RAYCAST.setFromCamera(mouse,UI_CAMERA)
                let items = RAYCAST.intersectObjects(UI.children,false)
                console.log(items)
                items.forEach(i=>{
                    console.log(i.object.name)
                    let obj_name = i.object.name
                    if(obj_name.startsWith("button_")){
                        switch(obj_name){
                            case "button_back":
                                window.open("../pages/lobby.html", "_self")
                                break;
                        }
                    } else if(obj_name.startsWith("menu_")){
                        switch(parseInt(obj_name.charAt(5))){
                            case 1: 
                                loadFriendlist()
                            break;
                            case 2: 
                                loadRequest()
                            break;
                            case 3: 
                                loadOutgoing()
                            break;
                        }
                    }
                })
            }
        })

}

function loadFriendlist(){
    if(FRIEND.length > 0){
        FRIEND.forEach(e => {
            UI.remove(e)
        });
        FRIEND = []
    }
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
            let friendUI = new Friend_UI().group
            friendUI.rotation.y = -Math.PI/2
            friendUI.position.set(-15+(j*67.5),65-(i*115),-15+(j*67.5))
            FRIEND.push(friendUI)
            UI.add(friendUI)
        }        
    }
}

function loadRequest(){
    if(FRIEND.length > 0){
        FRIEND.forEach(e => {
            UI.remove(e)
        });
        FRIEND = []
    }

}

function loadOutgoing(){
    if(FRIEND.length > 0){
        FRIEND.forEach(e => {
            UI.remove(e)
        });
        FRIEND = []
    }

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
        prevTime = time;

        UI_RENDERER.render(UI, UI_CAMERA);
}

function onWindowResize(){
    UI_CAMERA.aspect = window.innerWidth / window.innerHeight;
    UI_CAMERA.updateProjectionMatrix();
}