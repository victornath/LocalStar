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
import Congklak_big from "../../furniture/congklak_game_board.js";
import Desk from "../../furniture/desk.js"
import Player from "../../furniture/player.js"

// Variables
const MANAGER = new THREE.LoadingManager();
const GLTF_LOADER = new GLTFLoader(MANAGER);
const CUBE_TEXTURE_LOADER = new THREE.CubeTextureLoader();
const FONT_LOADER = new FontLoader(MANAGER);
const TEXTURE_LOADER = new THREE.TextureLoader();
const FONT_SIZE = 0.08;

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
// const CAMERA_CONTROL = new MapControls(CAMERA, RENDERER.domElement)
const RAYCAST = new THREE.Raycaster()
const BOARD = new Congklak_big().group
const DESK = new Desk().group

var curr_turn = 1;
var end_game = false;
var PLAYER_CHOOSE;
var ONGOING_TURN = false;

let ui_p1;
let ui_p2;

let congklak_row1 = []
let congklak_row2 = []
let congklak_p1 = []
let congklak_p2 = []
let circle_row1 = []
let circle_row2 = []
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
    init();
    gameLoop();
} else {
    let warning = WEBGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
    CONTAINER.remove();
    throw 'WebGL disabled or not supported';
}

function init() {
    // Initiate Loading
    initManager()

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
        console.log('Loading file: ' + managerUrl + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    };
    MANAGER.onLoad = function () {
        // Only allow control once content is fully loaded
        // CANVAS_HOLDER.addEventListener('click', function () {
        //     CONTROLS.lock();
        // }, false);

        console.log('Loading complete!');
    };
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

    const ui_background = new THREE.PlaneGeometry(180,120);
    const ui_padding = new THREE.PlaneGeometry(170,105);
    const ui_status = new THREE.PlaneGeometry(100,50);
    const ui_btn_background = new THREE.PlaneGeometry(180,40);
    let ui_white = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
    })
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
    let ui_black = new THREE.MeshBasicMaterial({
        color: 0x000,
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
                console.log(items)
                items.forEach(i=>{
                    if(PLAYER_CHOOSE == null){
                        if(curr_turn == 1){
                            if(i.object.name.startsWith("player1") && s_circle_p1[parseInt(i.object.name.charAt(12))] > 0){
                                PLAYER_CHOOSE = i.object.name
                                console.log("Player1 choosed:" + PLAYER_CHOOSE)
                            }
                        } else {
                            if(i.object.name.startsWith("player2") && s_circle_p2[parseInt(i.object.name.charAt(12))] > 0){
                                PLAYER_CHOOSE = i.object.name
                                console.log("Player2 choosed:" + PLAYER_CHOOSE)
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
        document.getElementById('player1-status').innerHTML = "Your Turn"
        document.getElementById('player2-status').innerHTML = ""
        ui_p1.material.color = new THREE.Color(0xFF5D79);
        ui_p1.material.needsUpdate = true
        ui_p2.material.color = new THREE.Color(0xBCE5FB);
        ui_p2.material.needsUpdate = true
    } else {
        document.getElementById('player2-status').innerHTML = "Your Turn"
        document.getElementById('player1-status').innerHTML = ""
        ui_p1.material.color = new THREE.Color(0xFFCECE);
        ui_p1.material.needsUpdate = true
        ui_p2.material.color = new THREE.Color(0x0B97F4);
        ui_p2.material.needsUpdate = true
    }

    let congklak_row1_length = 0
    let congklak_row2_length = 0    

    const congklak_seed_geo = new THREE.SphereGeometry(1,6,6);
    let seed = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
    })

    let wood_dark = new THREE.MeshBasicMaterial({
        color: 0x36594E,
    })

    let geo_circle = new THREE.CircleGeometry(5,9);
    let geo_b_circle = new THREE.CircleGeometry(12,12);

    for (let i = 0; i < a1.length; i++) {
        circle_row1[i] = new THREE.Mesh(geo_circle, wood_dark)
        circle_row1[i].position.set(p1_loc[i],10.1,135)
        circle_row1[i].rotation.x = -Math.PI/2
        circle_row1[i].name = "player1_row_"+i
        SCENE.add(circle_row1[i])
        for (let j = 0; j < a1[i]; j++){
            congklak_row1[congklak_row1_length] = new THREE.Mesh(congklak_seed_geo, seed)
            congklak_row1[congklak_row1_length].position.set((Math.random()*6)+p1_loc[i]-3,10.2+j/10,(Math.random()*5)+133)
            SCENE.add(congklak_row1[congklak_row1_length])
            congklak_row1_length++
        }
    }
    for (let i = 0; i < b1.length; i++) {
        circle_row2[i] = new THREE.Mesh(geo_circle, wood_dark)
        circle_row2[i].position.set(p2_loc[i],10.1,150)
        circle_row2[i].rotation.x = -Math.PI/2
        circle_row2[i].name = "player2_row_"+i
        SCENE.add(circle_row2[i])
        for (let j = 0; j < b1[i]; j++){
            congklak_row2[congklak_row2_length] = new THREE.Mesh(congklak_seed_geo, seed)
            congklak_row2[congklak_row2_length].position.set((Math.random()*6)+p2_loc[i]-3,10.2+j/10,(Math.random()*5)+148)

            SCENE.add(congklak_row2[congklak_row2_length])
            congklak_row2_length++
        }
    }
    const b_circle_1 = new THREE.Mesh(geo_b_circle, wood_dark)
    b_circle_1.position.set(p1_big,10.1,142)
    b_circle_1.rotation.x = -Math.PI/2
    SCENE.add(b_circle_1)
    for (let i = 0; i < a2; i++) {
        congklak_p1[i] = new THREE.Mesh(congklak_seed_geo,seed)
        congklak_p1[i].position.set((Math.random()*10)+p1_big-5,10+i/10,(Math.random()*15)+135)
        SCENE.add(congklak_p1[i])
    }
    const b_circle_2 = new THREE.Mesh(geo_b_circle, wood_dark)
    b_circle_2.position.set(p2_big,10.1,142)
    b_circle_2.rotation.x = -Math.PI/2
    SCENE.add(b_circle_2)
    for (let i = 0; i < b2; i++) {
        congklak_p2[i] = new THREE.Mesh(congklak_seed_geo,seed)
        congklak_p2[i].position.set((Math.random()*10)+p2_big-5,10+i/10,(Math.random()*15)+135)
        SCENE.add(congklak_p2[i])
    }
}

function removeSeeds(){
    for (let i = 0; i < congklak_row1.length; i++) {
        SCENE.remove(congklak_row1[i])
    }
    for (let i = 0; i < congklak_row2.length; i++) {
        SCENE.remove(congklak_row2[i])
    }
    for (let i = 0; i < congklak_p1.length; i++) {
        SCENE.remove(congklak_p1[i])
    }
    for (let i = 0; i < congklak_p2.length; i++) {
        SCENE.remove(congklak_p2[i])
    }
    for (let i = 0; i < circle_row1.length; i++) {
        SCENE.remove(circle_row1[i])
        SCENE.remove(circle_row2[i])
    }
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
                removeSeeds()
                distributeSeed(s_circle_p1,b_circle[0],s_circle_p2,b_circle[1]);
                i--
                j++;
            } else if (((player_input+j)%15) == 7){
                big[player-1]++;
                hand.position.set(loc_big,50,hand_z_big)
                removeSeeds()
                distributeSeed(s_circle_p1,b_circle[0],s_circle_p2,b_circle[1]);
                i--
                j++;
            } else {
                enemy_array[(((player_input+j)%15)%8)]++;
                hand.position.set(enemy_loc[(((player_input+j)%15)%8)],50,hand_enemy_z)
                removeSeeds()
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
    removeSeeds()
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

function onWindowResize(){
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();
    RENDERER.setSize(window.innerWidth, window.innerHeight);
}