/*
    Local Star

    Coding Guide:
        Imports: Line 12
        Constants: Line 18
        Support Check: Line 44
        Code init: Line 61
*/

// Library Imports
import * as THREE from '../../three.js/build/three.module.js'
import { MapControls } from '../../three.js/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls} from '../../three.js/examples/jsm/controls/PointerLockControls.js';
import {GLTFLoader} from '../../three.js/examples/jsm/loaders/GLTFLoader.js' 
import {FontLoader} from '../../three.js/examples/jsm/loaders/FontLoader.js' 
import { TextGeometry } from '../../three.js/examples/jsm/geometries/TextGeometry.js'
import Congklak_big from "../../furniture/congklak_game_board.js";
import Desk from "../../furniture/desk.js"
import Player from "../../furniture/player.js"

// Variables
const MANAGER = new THREE.LoadingManager();
const FONT_LOADER = new FontLoader(MANAGER);

const CONTAINER = document.getElementById('canvas-holder');
const UI_CONTAINER = document.getElementById('ui-holder');

const SCENE = new THREE.Scene();
const UI = new THREE.Scene();
const CAMERA = new THREE.OrthographicCamera((-135*(window.innerWidth/window.innerHeight)), (135*(window.innerWidth/window.innerHeight)), 135, -135, 1,1000)
const UI_CAMERA = new THREE.OrthographicCamera((-135*(window.innerWidth*0.4/window.innerHeight)), (135*(window.innerWidth*0.4/window.innerHeight)), 135, -135, 1,1000)
const RENDERER = new THREE.WebGLRenderer({
    antialias: false,
    localClippingEnabled: true
});
const UI_RENDERER = new THREE.WebGLRenderer({
    antialias: false,
    localClippingEnabled: true
});
const RAYCAST = new THREE.Raycaster()
const BOARD = new Congklak_big().group
const DESK = new Desk().group

var curr_turn = 1;
var end_game = false;
var PLAYER_CHOOSE;
var ONGOING_TURN = false;
let LOADED_FONT;

let ui_p1;
let ui_p2;
let ui_status = [];

let congklak_row1 = []
let congklak_row2 = []
let congklak_p1 = []
let congklak_p2 = []
let circle_row1 = []
let circle_row2 = []
let big_circle = [];
let counter_p1 = []
let counter_p2 = []
let counter_big = []
let s_circle_p1 = [7,7,7,7,7,7,7];
let b_circle = [0,0];
let s_circle_p2 = [7,7,7,7,7,7,7];
let p1_loc = [32,43,54,65,76,87,98]
let p2_loc = [98,87,76,65,54,43,32]
let p1_big = 115
let p2_big = 15

let skin = new THREE.MeshLambertMaterial({
    color: 0xffdbac
})

let geo_hand = new THREE.BoxGeometry(5,13,5)
const hand = new THREE.Mesh(geo_hand, skin)

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

function init() {
    // Initiate the Game
    initRenderer()
    initCamera()
    initUI()
    initScene()
    initGame()
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
        init()
        document.getElementById('progress').hidden = true;
        console.log('Loading complete!');
    };
}

function load(){
    initManager()
    FONT_LOADER.load( '../../texture/fonts/Bahnschrift_Regular.json', function ( font ) {
        LOADED_FONT = font
    })

}

function initRenderer(){
    RENDERER.setSize(window.innerWidth, window.innerHeight)
    RENDERER.setClearColor(0x90B94F)
    RENDERER.shadowMap.enabled = true
    
    UI_RENDERER.setSize(window.innerWidth*0.4, window.innerHeight)
    UI_RENDERER.setClearColor(0xFFFFFF)
    UI_RENDERER.shadowMap.enabled = true

}

function initCamera(){
    CAMERA.position.set(20,140,150)
    CAMERA.zoom = 2.2;
    CAMERA.updateProjectionMatrix();
    CAMERA.rotation.order = 'YXZ';
    CAMERA.rotation.y = 0;
    CAMERA.rotation.x = -1.5;
    
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
    CONTAINER.appendChild(RENDERER.domElement)
    UI_CONTAINER.appendChild(UI_RENDERER.domElement)
}

function initUI(){
    document.getElementById("end-screen").style.display = "none"

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    UI.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 20, 10); // x, y, z
    UI.add(dirLight);


    for (let i = 0; i < 2; i++) {
        let geometry = new TextGeometry( "Player Name", {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        } );
        let mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(100,110-(i*130),50)
        UI.add(mesh)
    }

    const ui_background = new THREE.PlaneGeometry(180,120);
    const ui_padding = new THREE.PlaneGeometry(170,105);
    const ui_status = new THREE.PlaneGeometry(100,50);
    const ui_btn_background = new THREE.PlaneGeometry(180,40);
    let ui_pink = new THREE.MeshBasicMaterial({
        color: 0xFFCECE,
    })
    let ui_pink_light = new THREE.MeshBasicMaterial({
        color: 0xFFF2F2,
    })
    let ui_pink_dark = new THREE.MeshBasicMaterial({
        color: 0xFFCECE,
    })

    let ui_blue = new THREE.MeshBasicMaterial({
        color: 0xBCE5FB,
    })
    let ui_blue_light = new THREE.MeshBasicMaterial({
        color: 0xEBF8FF,
    })
    let ui_blue_dark = new THREE.MeshBasicMaterial({
        color: 0xBCE5FB,
    })
    
    let ui_pink_btn = new THREE.MeshBasicMaterial({
        color: 0xFF3366,
    })
    ui_p1 = new THREE.Mesh(ui_background,ui_pink_dark);
    let ui_p1_padding = new THREE.Mesh(ui_padding,ui_pink);
    let ui_p1_status = new THREE.Mesh(ui_status,ui_pink_light);

    ui_p2 = new THREE.Mesh(ui_background,ui_blue_dark);
    let ui_p2_padding = new THREE.Mesh(ui_padding,ui_blue);
    let ui_p2_status = new THREE.Mesh(ui_status,ui_blue_light);
    let ui_btn = new THREE.Mesh(ui_btn_background, ui_pink_btn);

    ui_p1.position.set(170,85,0)
    ui_p1.rotation.y = -Math.PI / 4
    ui_p2.position.set(170,-45,0)
    ui_p2.rotation.y = -Math.PI / 4
    ui_p1_padding.position.set(145,110,25)
    ui_p1_padding.rotation.y = -Math.PI / 4
    ui_p2_padding.position.set(145,-20,25)
    ui_p2_padding.rotation.y = -Math.PI / 4
    ui_p1_status.position.set(163,130,50)
    ui_p1_status.rotation.y = -Math.PI / 4
    ui_p2_status.position.set(163,0,50)
    ui_p2_status.rotation.y = -Math.PI / 4
    
    ui_btn.rotation.y = -Math.PI / 4
    ui_btn.name = "opt_button"
    ui_btn.position.set(170,-140,0)

    let Player1 = new Player().group
    Player1.position.set(65,145,25)
    Player1.scale.set(1.5,1.5,1.5)
    let Player2 = new Player().group
    Player2.position.set(65,15,25)
    Player2.scale.set(1.5,1.5,1.5)


    UI.add(Player1)
    UI.add(Player2)
    UI.add(ui_p1)
    UI.add(ui_p2)
    UI.add(ui_p1_padding)
    UI.add(ui_p2_padding)
    UI.add(ui_p1_status)
    UI.add(ui_p2_status)
    UI.add(ui_btn)
    // UI.add(mesh)
}
function updateStatus(status1,status2){
    if(ui_status.length > 0){
        ui_status.forEach(e => {
            UI.remove(e)
        });
        ui_status = []
    }
    let statusText = [status1,status2]
    for (let i = 0; i < 2; i++) {
        let geometry = new TextGeometry( statusText[i], {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        } );
        let mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(100,155-(i*130),50)
        ui_status.push(mesh)
        UI.add(mesh)
    }
}

function initGame(){
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    SCENE.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 20, 10); // x, y, z
    SCENE.add(dirLight);

    BOARD.position.set(10,0,130)
    DESK.position.set(65,-90,145)
    DESK.scale.set(3,3,3)
    hand.position.set(0,0,0)
    hand.rotation.x = - Math.PI/2
    hand.scale.set(1.7,1.7,1.7)

    for (let i = 0; i < 8; i++) {
        const box_geometry = RoundedRectangle(-5,20,15,15)
        let mesh = new THREE.Mesh(box_geometry, new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.scale.set(0.25,0.25,0.25)
        mesh.rotation.x = -Math.PI/2
        if(i == 0){
            mesh.position.set(p2_big,10.2,162)
        } else {
            if(i%2 == 1){
                mesh.position.set(p1_loc[i-1],10.2,162)
            } else {
                mesh.position.set(p1_loc[i-1],10.2,172)
            }
        }
        SCENE.add(mesh)
        mesh = new THREE.Mesh(box_geometry, new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.scale.set(0.25,0.25,0.25)
        mesh.rotation.x = -Math.PI/2
        if(i == 0){
            mesh.position.set(p1_big,10.2,123)
        } else {
            if(i%2 == 1){
                mesh.position.set(p1_loc[i-1],10.2,123)
            } else {
                mesh.position.set(p1_loc[i-1],10.2,113)
            }
        }
        SCENE.add(mesh)
    }


    SCENE.add(BOARD)
    SCENE.add(hand)
    SCENE.add(DESK)

    distributeSeed(s_circle_p1,b_circle[0],s_circle_p2,b_circle[1]);
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
                items.forEach(i=>{
                    if(PLAYER_CHOOSE == null){
                        if(curr_turn == 1){
                            if(i.object.name.startsWith("player1") && s_circle_p1[parseInt(i.object.name.charAt(12))] > 0){
                                PLAYER_CHOOSE = i.object.name
                            }
                        } else {
                            if(i.object.name.startsWith("player2") && s_circle_p2[parseInt(i.object.name.charAt(12))] > 0){
                                PLAYER_CHOOSE = i.object.name
                            }
                        }
                    } else {
                        console.log("PLAYER_CHOOSE is not empty")
                    }
                })
            }
        })
}

function distributeSeed(a1,a2,b1,b2){
    console.log(s_circle_p1,b_circle[0],s_circle_p2,b_circle[1])
    if(curr_turn == 1){
       updateStatus("Your Turn","Waiting")
        ui_p1.material.color = new THREE.Color(0xFF5D79);
        ui_p1.material.needsUpdate = true
        ui_p2.material.color = new THREE.Color(0xBCE5FB);
        ui_p2.material.needsUpdate = true
    } else {
       updateStatus("Waiting","Your Turn")
        ui_p1.material.color = new THREE.Color(0xFFCECE);
        ui_p1.material.needsUpdate = true
        ui_p2.material.color = new THREE.Color(0x0B97F4);
        ui_p2.material.needsUpdate = true
    }


    if(counter_p1.length > 0){
        counter_p1.forEach(e =>{
            SCENE.remove(e)
        })
        counter_p1 = []
    }
    for (let i = 0; i < a1.length; i++) {
        const geometry = new TextGeometry(a1[i].toString(),{
            font: LOADED_FONT,
            size: 5,
            height: 0,
            bevelEnabled: false,
        } );
        let mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0xffffff}))
        mesh.rotation.x = -Math.PI/2
        if(i%2 == 0){
            mesh.position.set(p1_loc[i]-5,10.3,125)
        } else {
            mesh.position.set(p1_loc[i]-5,10.3,115)
        }
        counter_p1.push(mesh)
        SCENE.add(mesh)
    }
    if(counter_p2.length > 0){
        counter_p2.forEach(e =>{
            SCENE.remove(e)
        })
        counter_p2 = []
    }
    for (let i = 0; i < b1.length; i++) {
        const geometry = new TextGeometry(b1[i].toString(),{
            font: LOADED_FONT,
            size: 5,
            height: 0,
            bevelEnabled: false,
        } );
        let mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0xffffff}))
        mesh.rotation.x = -Math.PI/2
        if(i%2 == 0){
            mesh.position.set(p2_loc[i]-5,10.3,165)
        } else {
            mesh.position.set(p2_loc[i]-5,10.3,175)
        }
        counter_p2.push(mesh)
        SCENE.add(mesh)
    }

    if(counter_big.length > 0){
        counter_big.forEach(e =>{
            SCENE.remove(e)
        })
        counter_big = []
    }
    let text = [a2,b2]
    for (let i = 0; i < 2; i++) {
        const geometry = new TextGeometry(text[i].toString(),{
            font: LOADED_FONT,
            size: 5,
            height: 0,
            bevelEnabled: false,
        } );
        let mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0xffffff}))
        mesh.rotation.x = -Math.PI/2
        if(i == 0){
            mesh.position.set(p1_big-5,10.3,125)
        } else {
            mesh.position.set(p2_big-5,10.3,165)
        }
        counter_big.push(mesh)
        SCENE.add(mesh)
    }
    
    const congklak_seed_geo = new THREE.SphereGeometry(1,6,6);
    let seed = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
    })

    let wood_dark = new THREE.MeshBasicMaterial({
        color: 0x36594E,
    })
    
    if(big_circle.length == 0){
        let geo_b_circle = new THREE.CircleGeometry(12,12);

        const b_circle_1 = new THREE.Mesh(geo_b_circle, wood_dark)
        b_circle_1.position.set(p1_big,10.1,142)
        b_circle_1.rotation.x = -Math.PI/2
        big_circle.push(b_circle_1)
        SCENE.add(b_circle_1)
        
        const b_circle_2 = new THREE.Mesh(geo_b_circle, wood_dark)
        b_circle_2.position.set(p2_big,10.1,142)
        b_circle_2.rotation.x = -Math.PI/2
        big_circle.push(b_circle_2)
        SCENE.add(b_circle_2)
    }

    if(congklak_p1.length != a2){
        congklak_p1.forEach(e => {
            SCENE.remove(e)
        });
        congklak_p1 = [];
        for (let i = 0; i < a2; i++) {
            let congklak = new THREE.Mesh(congklak_seed_geo,seed)
            congklak.position.set((Math.random()*10)+p1_big-5,10+i/10,(Math.random()*15)+135)
            congklak_p1.push(congklak)
            SCENE.add(congklak)
        }
    }
    if(congklak_p2.length != b2){
        congklak_p2.forEach(e => {
            SCENE.remove(e)
        })
        for (let i = 0; i < b2; i++) {
            congklak_p2[i] = new THREE.Mesh(congklak_seed_geo,seed)
            congklak_p2[i].position.set((Math.random()*10)+p2_big-5,10+i/10,(Math.random()*15)+135)
            SCENE.add(congklak_p2[i])
        }
    }

    if(circle_row1.length == 0){
        let geo_circle = new THREE.CircleGeometry(5,9);
        for (let i = 0; i < 7; i++) {
        let circle = new THREE.Mesh(geo_circle, wood_dark)
            circle.position.set(p1_loc[i],10.1,135)
            circle.rotation.x = -Math.PI/2
            circle.name = "player1_row_"+i
            circle_row1.push(circle)
            SCENE.add(circle)
            let arrayTemp = []
            for (let j = 0; j < 7; j++) {
                let congklak = new THREE.Mesh(congklak_seed_geo, seed)
                congklak.position.set((Math.random()*6)+p1_loc[i]-3,10.2+(j/10),(Math.random()*5)+133)
                SCENE.add(congklak)
                arrayTemp.push(congklak)                    
            }
            congklak_row1.push(arrayTemp)
        }
    }

    for (let i = 0; i < 7; i++) {
        if(congklak_row1[i].length != a1[i]){
            let arrayTemp = []
            congklak_row1[i].forEach(e => {
                SCENE.remove(e)
            })
            congklak_row1[i] = []
            for (let j = 0; j < a1[i]; j++){
                let congklak = new THREE.Mesh(congklak_seed_geo, seed)
                congklak.position.set((Math.random()*6)+p1_loc[i]-3,10.2+(j/10),(Math.random()*5)+133)
                SCENE.add(congklak)
                arrayTemp.push(congklak)
            }
            congklak_row1[i] = arrayTemp
        }
    }


    if(circle_row2.length == 0){
        let geo_circle = new THREE.CircleGeometry(5,9);
        for (let i = 0; i < 7; i++) {
        let circle = new THREE.Mesh(geo_circle, wood_dark)
            circle.position.set(p2_loc[i],10.1,150)
            circle.rotation.x = -Math.PI/2
            circle.name = "player2_row_"+i
            circle_row2.push(circle)
            SCENE.add(circle)
            let arrayTemp = []
            for (let j = 0; j < 7; j++) {
                let congklak = new THREE.Mesh(congklak_seed_geo, seed)
                congklak.position.set((Math.random()*6)+p2_loc[i]-3,10.2+j/10,(Math.random()*5)+148)
                SCENE.add(congklak)
                arrayTemp.push(congklak)                    
            }
            congklak_row2.push(arrayTemp)
        }
    }

    for (let i = 0; i < 7; i++) {
        if(congklak_row2[i].length != b1[i]){
            let arrayTemp = []
            congklak_row2[i].forEach(e => {
                SCENE.remove(e)
            })
            congklak_row2[i] = []
            for (let j = 0; j < b1[i]; j++){
                let congklak = new THREE.Mesh(congklak_seed_geo, seed)
                congklak.position.set((Math.random()*6)+p2_loc[i]-3,10.2+j/10,(Math.random()*5)+148)
                SCENE.add(congklak)
                arrayTemp.push(congklak)
            }
            congklak_row2[i] = arrayTemp
        }
    }
}

function randomizeSeedLocation(){

}

var distribute = (player_input, player, congklak_temp) => new Promise(resolve => {
    let array;
    let big;
    let loc;
    let loc_big;
    let enemy_array;
    let enemy_loc;
    let hand_z
    let hand_enemy_z
    let hand_z_big
    let j = 0;
    switch (player) {
        case 1:
            array = s_circle_p1
            big = b_circle
            loc = p1_loc
            enemy_array = s_circle_p2
            enemy_loc = p2_loc
            loc_big = p1_big;
            hand_z = 131
            hand_enemy_z = 141
            hand_z_big = 136
            break;
        case 2:
            array = s_circle_p2
            big = b_circle
            loc = p2_loc
            enemy_array = s_circle_p1
            enemy_loc = p1_loc
            loc_big = p2_big
            hand_z = 160
            hand_enemy_z = 150
            hand_z_big = 155
            break;
    }
    let i = congklak_temp
    // array[player_input-1] = 0
    let interval = setInterval(function(){
        // while (i > 0){
            if(i == 0){
                hand.position.set(0,0,0)
                console.log("Done distribute")
                clearInterval(interval);
                resolve(j);
                return;
            }
            if((player_input+j)%15 < 7){
                array[(player_input+j)%15]++;
                hand.position.set(loc[(player_input+j)%15],50,hand_z)
                distributeSeed(s_circle_p1,b_circle[0],s_circle_p2,b_circle[1]);
                i--
                j++;
            } else if (((player_input+j)%15) == 7){
                big[player-1]++;
                hand.position.set(loc_big,50,hand_z_big)
                distributeSeed(s_circle_p1,b_circle[0],s_circle_p2,b_circle[1]);
                i--
                j++;
            } else {
                enemy_array[(((player_input+j)%15)%8)]++;
                hand.position.set(enemy_loc[(((player_input+j)%15)%8)],50,hand_enemy_z)
                distributeSeed(s_circle_p1,b_circle[0],s_circle_p2,b_circle[1]);
                i--
                j++;
            }
        }, 300)
})

var checkTurn = (player_input, player, congklak_temp, j) => new Promise(resolve => {
    let array;
    let big;
    let loc;
    let enemy_array;
    let enemy_loc;
    let enemy_turn;
    switch (player) {
        case 1:
            array = s_circle_p1
            big = b_circle
            loc = p1_loc
            enemy_array = s_circle_p2
            enemy_loc = p2_loc
            enemy_turn = 2
            break;
        case 2:
            array = s_circle_p2
            big = b_circle 
            loc = p2_loc
            enemy_array = s_circle_p1
            enemy_loc = p1_loc
            enemy_turn = 1
            break;
        default:
            break;
    }
    if((player_input+j-1)%15 == 7){
        console.log("// Turn changed to P1 (Ended in P1's House)");
        ONGOING_TURN = false
        PLAYER_CHOOSE = null
    } else if((player_input+j-1)%15 < 7){
        let input_temp = (player_input+j-1)%15;
        if(array[input_temp]>1){
            player_input = input_temp+1;
            congklak_temp = array[input_temp];
            array[input_temp] = 0;
            j = 0;
        } else if(enemy_array[6-(input_temp%8)]>0) {
            let temp_add = array[input_temp] + enemy_array[6-input_temp];
            array[input_temp] = 0;
            enemy_array[6-input_temp] = 0;
            big[player-1] += temp_add;
            console.log("// Turn Changed to P2 (P1 Stole P2's)\n");
            curr_turn = enemy_turn;
            ONGOING_TURN = false
            PLAYER_CHOOSE = null
        } else {
            curr_turn = enemy_turn;
            console.log("// Turn Changed to P2 (P1 ended in empty P1's hole.)\n");
            ONGOING_TURN = false
            PLAYER_CHOOSE = null
        }
    } else {
        let input_temp = (player_input+j-1)%15;
        if(enemy_array[input_temp%8]>1){
            player_input = input_temp+1;
            congklak_temp = enemy_array[input_temp%8];
            enemy_array[input_temp%8] = 0;
            j = 0
        } else {
            curr_turn = enemy_turn;
            console.log("// Turn Changed to P2 (P1 ended in empty P2's hole.)\n");
            ONGOING_TURN = false
            PLAYER_CHOOSE = null    
        }
    }
    let p1_row_sum = 0;
    let p2_row_sum = 0;
    for (let i = 0; i < s_circle_p1.length; i++) {
        p1_row_sum += s_circle_p1[i]
    }
    for (let i = 0; i < s_circle_p2.length; i++) {
        p2_row_sum += s_circle_p2[i]
    }
    if(curr_turn == 2 && p2_row_sum == 0){
        curr_turn = 1
        console.log("// Turn Changed to P1 (P2 Row is empty)")
        ONGOING_TURN = false
        PLAYER_CHOOSE = null
    }
    if(curr_turn == 1 && p1_row_sum == 0){
        curr_turn = 2
        console.log("// Turn Changed to P2 (P1 Row is empty)")
        ONGOING_TURN = false
        PLAYER_CHOOSE = null
    }
    distributeSeed(s_circle_p1,b_circle[0],s_circle_p2,b_circle[1]);
    resolve([PLAYER_CHOOSE,player_input, curr_turn, congklak_temp]);
    return;
})

var repeatTurnUntilFinish = (player_input, curr_turn, congklak_temp) => new Promise(resolve => {
    (function loop(res, input, turn, c_temp) {
        if (res == null){
            return;
        }
        distribute(input, turn, c_temp).then(result =>{
            checkTurn(input, turn, c_temp, result).then(res =>{
                console.log(res)
                if((b_circle[0] + b_circle[1]) == 98){
                    end_game = true;
                    let string
                    document.getElementById("end-screen").style.display = "block"
                    if(b_circle[0]>b_circle[1]){
                        string = "Player 1 Win!"
                    } else if (b_circle[0]<b_circle[1]){
                        string = "Player 2 Win!"
                    } else {
                        string = "Tie."
                    }
                    document.getElementById("end-screen").innerHTML = string
                    console.log("Game Ended")
                }
                loop(res[0],res[1],res[2], res[3]);
            })
        })
    })(PLAYER_CHOOSE, player_input, curr_turn, congklak_temp);
})

function congklakGame(player_input_raw){
    if(!ONGOING_TURN){
        ONGOING_TURN = true
        let player_input = parseInt(player_input_raw.charAt(12))+1
        let congklak_temp
        switch (curr_turn) {
            case 1:
                hand.position.set(p1_loc[player_input-1],50,131)
                congklak_temp = s_circle_p1[player_input-1]
                s_circle_p1[player_input-1] = 0
                break;
            case 2:
                hand.position.set(p2_loc[player_input-1],50,160)
                congklak_temp = s_circle_p2[player_input-1]
                s_circle_p2[player_input-1] = 0
                break;
            default:
                break;
        }
        repeatTurnUntilFinish(player_input,curr_turn, congklak_temp).then(result =>{
            console.log(s_circle_p1,b_circle[0],s_circle_p2,b_circle[1])
        })
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

        if(PLAYER_CHOOSE != null){
            congklakGame(PLAYER_CHOOSE)
        }

        RENDERER.render(SCENE, CAMERA);
        UI_RENDERER.render(UI, UI_CAMERA);
}

function RoundedRectangle( w, h, r, s ) { // width, height, radius corner, smoothness
		
    // helper const's
    const wi = w / 2 - r;		// inner width
    const hi = h / 2 - r;		// inner height
    const w2 = w / 2;			// half width
    const h2 = h / 2;			// half height
    const ul = r / w;			// u left
    const ur = ( w - r ) / w;	// u right
    const vl = r / h;			// v low
    const vh = ( h - r ) / h;	// v high	
    
    let positions = [
    
         wi, hi, 0, -wi, hi, 0, -wi, -hi, 0, wi, -hi, 0
         
    ];
    
    let uvs = [
        
        ur, vh, ul, vh, ul, vl, ur, vl
        
    ];
    
    let n = [
        
        3 * ( s + 1 ) + 3,  3 * ( s + 1 ) + 4,  s + 4,  s + 5,
        2 * ( s + 1 ) + 4,  2,  1,  2 * ( s + 1 ) + 3,
        3,  4 * ( s + 1 ) + 3,  4, 0
        
    ];
    
    let indices = [
        
        n[0], n[1], n[2],  n[0], n[2],  n[3],
        n[4], n[5], n[6],  n[4], n[6],  n[7],
        n[8], n[9], n[10], n[8], n[10], n[11]
        
    ];
    
    let phi, cos, sin, xc, yc, uc, vc, idx;
    
    for ( let i = 0; i < 4; i ++ ) {
    
        xc = i < 1 || i > 2 ? -wi : wi;
        yc = i < 2 ? -hi : hi;
        
        uc = i < 1 || i > 2 ? ur : ul;
        vc = i < 2 ? vh : vl;
            
        for ( let j = 0; j <= s; j ++ ) {
        
            phi = Math.PI / 2  *  ( i + j / s );
            cos = Math.cos( phi );
            sin = Math.sin( phi );

            positions.push( xc + r * cos, yc + r * sin, 0 );

            uvs.push( uc + ul * cos, vc + vl * sin );
                    
            if ( j < s ) {
            
                idx =  ( s + 1 ) * i + j + 4;
                indices.push( i, idx, idx + 1 );
                
            }
            
        }
        
    }
        
    const geometry = new THREE.BufferGeometry( );
    geometry.setIndex( new THREE.BufferAttribute( new Uint32Array( indices ), 1 ) );
    geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );
    geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );
    
    return geometry;	
    
}


function onWindowResize(){
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();
    RENDERER.setSize(window.innerWidth, window.innerHeight);
}