// Library Imports
import * as THREE from '../../three.js/build/three.module.js'
import {FontLoader} from '../../three.js/examples/jsm/loaders/FontLoader.js' 
import { TextGeometry } from '../../three.js/examples/jsm/geometries/TextGeometry.js'
import PlayerLoader from '../../item/PlayerLoader.js'
import Tribune_l from "../../furniture/bentengan_game_tribune_l.js"
import Tribune_r from "../../furniture/bentengan_game_tribune_r.js"
import Tribune_mid from "../../furniture/bentengan_game_tribune_mid.js"
import finish_line from "../../furniture/game_finish_line.js"

// Variables
const MANAGER = new THREE.LoadingManager();
const CUBE_TEXTURE_LOADER = new THREE.CubeTextureLoader();
const FONT_LOADER = new FontLoader(MANAGER);
const TEXTURE_LOADER = new THREE.TextureLoader();
const FONT_SIZE = 0.08;

const CONTAINER = document.getElementById('canvas-holder');
const UI_CONTAINER = document.getElementById('ui-holder');

const SCENE = new THREE.Scene();
const UI = new THREE.Scene();
const CAMERA = new THREE.OrthographicCamera((-135*(window.innerWidth/window.innerHeight)), (135*(window.innerWidth/window.innerHeight)), 135, -135, -1000,1000)
const UI_CAMERA = new THREE.OrthographicCamera((-135*(window.innerWidth/window.innerHeight)), (135*(window.innerWidth/window.innerHeight)), 135, -135, -1000,1000)
const RENDERER = new THREE.WebGLRenderer({
    antialias: false,
    localClippingEnabled: true
});
const UI_RENDERER = new THREE.WebGLRenderer({
    antialias: false,
    localClippingEnabled: true,
    alpha: true
});
// const CAMERA_CONTROL = new MapControls(CAMERA, RENDERER.domElement)
const RAYCAST = new THREE.Raycaster()

var end_game = false;
const CATCHER_LOADER = [new PlayerLoader(), new PlayerLoader(), new PlayerLoader(), new PlayerLoader(), new PlayerLoader(), new PlayerLoader()]
const PLAYER_LOADER = new PlayerLoader()
var PLAYER_CHOOSE = [];
var PLAYER_POINT = [0,0];
var ONGOING_TURN = false;
var PLAYER_SPECIAL = [Math.floor(Math.random() * 6)+1,Math.floor(Math.random() * 6)+1]


let ui_pink_btn = new THREE.MeshBasicMaterial({
    color: 0xFF3366,
})
let P1_UI = []
let ROW_RING = []
let P2_UI = []
let P2_POINT
let P1_POINT
let FONT_USED
let END_SCREEN =[]
let ui_btn_p1 = []
let ui_btn_p2 = []
let GAME_ROUND = 0;
let ROW = 0;
let PLAYER_POSITION = [82.5,-67.5,-217.5,-367.5,-517.5,-667.5, - 817.5]
let CATCHER_POSITION = [7.5,-142.5,-292.5,-442.5,-592.5,-742.5]
let CAMERA_POSITION = [150,0,-150,-300,-450,-600, -750]


let Catcher = [];
let Player2;

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
    
    UI_RENDERER.setSize(window.innerWidth, window.innerHeight)
    UI_RENDERER.setClearColor(0xFFFFFF, 0)
    UI_RENDERER.shadowMap.enabled = true

}

function initCamera(){
    CAMERA.position.set(200,110,150)
    CAMERA.zoom = 1.1
    CAMERA.updateProjectionMatrix();
    CAMERA.rotation.order = 'YXZ';
    CAMERA.rotation.y = - Math.PI / 4;
    CAMERA.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
    
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    UI.add(ambientLight);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 20, 10); // x, y, z
    UI.add(dirLight);
    
    const ui_background = new THREE.PlaneGeometry(180,95);
    const ui_padding = new THREE.PlaneGeometry(170,80);
    const ui_status = new THREE.PlaneGeometry(100,35);
    const ui_btn_background = new THREE.PlaneGeometry(40,52);
    let ui_pink = new THREE.MeshBasicMaterial({
        color: 0xFFCECE,
    })
    let ui_pink_light = new THREE.MeshBasicMaterial({
        color: 0xFFF2F2,
    })
    let ui_blue = new THREE.MeshBasicMaterial({
        color: 0xBCE5FB,
    })
    let ui_blue_light = new THREE.MeshBasicMaterial({
        color: 0xEBF8FF,
    })   
    let ui_btn_left = new THREE.MeshBasicMaterial({
        map: TEXTURE_LOADER.load('../../texture/ui/arrow_l.png')
    })
    let ui_btn_right = new THREE.MeshBasicMaterial({
        map: TEXTURE_LOADER.load('../../texture/ui/arrow_r.png')
    })
    FONT_LOADER.load( '../../texture/fonts/Bahnschrift_Regular.json', function ( font ) {
        FONT_USED = font
        let geometry = new TextGeometry("Player Name", {
            font: font,
            size: 10,
            height: 0,
            bevelEnabled: false,
        } );
        let mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(-95,40,49)
        P1_UI.push(mesh)
        UI.add(mesh)
        
        mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(102,40,246)
        P2_UI.push(mesh)
        UI.add(mesh)
        
        geometry = new TextGeometry("Waiting...", {
            font: font,
            size: 10,
            height: 0,
            bevelEnabled: false,
        } );
        mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(-65,60,49)
        P1_UI.push(mesh)
        UI.add(mesh)

        mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(112,75,256)
        P2_UI.push(mesh)
        UI.add(mesh)

        geometry = new TextGeometry("Waiting opponent", {
            font: font,
            size: 8,
            height: 0,
            bevelEnabled: false,
        } );
        mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(-90,72.5,49)
        P1_UI.push(mesh)

        mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(92.5,87.5,264)
        P2_UI.push(mesh)

        geometry = new TextGeometry(PLAYER_POINT[0].toString(), {
            font: font,
            size: 20,
            height: 0,
            bevelEnabled: false,
        } );
        mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(-152.5,85,49)
        P1_POINT = mesh
        UI.add(P1_POINT)

        geometry = new TextGeometry(PLAYER_POINT[1].toString(), {
            font: font,
            size: 20,
            height: 0,
            bevelEnabled: false,
        } );
        mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(45,85,246)
        P2_POINT = mesh
        UI.add(P2_POINT)

        geometry = new THREE.PlaneGeometry(100,105)
        mesh = new THREE.Mesh(geometry,ui_blue_light)
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(0,200,175)
        END_SCREEN.push(mesh)

        geometry = new TextGeometry("Player 1 Win", {
            font: font,
            size: 12,
            height: 0,
            bevelEnabled: false,
        } );
        mesh = new THREE.Mesh(geometry,ui_pink_btn)
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(-70,235,185)
        END_SCREEN.push(mesh)

        geometry = new TextGeometry("Player 2 Win", {
            font: font,
            size: 12,
            height: 0,
            bevelEnabled: false,
        } );
        mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(-75,235,185)
        END_SCREEN.push(mesh)

        geometry = new TextGeometry("Tie Game.", {
            font: font,
            size: 12,
            height: 0,
            bevelEnabled: false,
        } );
        mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
        mesh.rotation.y = -Math.PI/4
        mesh.position.set(-60,230,185)
        END_SCREEN.push(mesh)
    });
    let ui_btn_left_sp = new THREE.MeshBasicMaterial({
        map: TEXTURE_LOADER.load('../../texture/ui/arrow_l_special.png')
    })
    let ui_btn_right_sp = new THREE.MeshBasicMaterial({
        map: TEXTURE_LOADER.load('../../texture/ui/arrow_r_special.png')
    })
    let ui_p1 = new THREE.Mesh(ui_background,ui_pink_light);
    let ui_p1_padding = new THREE.Mesh(ui_padding,ui_pink);
    let ui_p1_status = new THREE.Mesh(ui_status,ui_pink_light);
    let ui_p2 = new THREE.Mesh(ui_background,ui_blue_light);
    let ui_p2_padding = new THREE.Mesh(ui_padding,ui_blue);
    let ui_p2_status = new THREE.Mesh(ui_status,ui_blue_light);
    
    ui_p1.position.set(-25,0,0)
    ui_p1.rotation.y = -Math.PI / 4
    ui_p2.position.set(275,-100,100)
    ui_p2.rotation.y = -Math.PI / 4
    ui_p1_padding.position.set(-50,25,25)
    ui_p1_padding.rotation.y = -Math.PI / 4
    ui_p2_padding.position.set(250,-75,125)
    ui_p2_padding.rotation.y = -Math.PI / 4
    ui_p1_status.position.set(-30,45,48)
    ui_p1_status.rotation.y = -Math.PI / 4
    ui_p2_status.position.set(270,-55,148)
    ui_p2_status.rotation.y = -Math.PI / 4
    
    for (let i = 0; i < 6; i++) {
        let material
        let material_special
        if(i<3){
            material = ui_btn_right
            material_special = ui_btn_right_sp
        } else {
            material = ui_btn_left
            material_special = ui_btn_left_sp
        }
        if(PLAYER_SPECIAL[0]-1 == i){
            ui_btn_p1[i] = new THREE.Mesh(ui_btn_background, material_special);
        } else {
            ui_btn_p1[i] = new THREE.Mesh(ui_btn_background, material);
        }
        ui_btn_p1[i].name = "player1_"+(6-i)
        ui_btn_p1[i].rotation.y = -Math.PI / 4
        ui_btn_p1[i].position.set(25-(Math.floor(i/3)*35),26+((i%3)*59),-62.5-(Math.floor(i/3)*35))        
    }

    for (let i = 0; i < 6; i++) {
        let material
        let material_special
        if(i<3){
            material = ui_btn_right
            material_special = ui_btn_right_sp
        } else {
            material = ui_btn_left
            material_special = ui_btn_left_sp
        }
        if(PLAYER_SPECIAL[1]-1 == i){
            ui_btn_p2[i] = new THREE.Mesh(ui_btn_background, material_special);
        } else {
            ui_btn_p2[i] = new THREE.Mesh(ui_btn_background, material);
        }
        ui_btn_p2[i].rotation.y = -Math.PI / 4
        ui_btn_p2[i].name = "player2_"+(6-i)
        ui_btn_p2[i].position.set(275-(Math.floor(i/3)*35),26+((i%3)*59),187.5-(Math.floor(i/3)*35))        
    }

    UI.add(ui_p1)
    UI.add(ui_p2)
    UI.add(ui_p1_padding)
    UI.add(ui_p2_padding)
    UI.add(ui_p1_status)
    UI.add(ui_p2_status)
    ui_btn_p1.forEach(o => {
        UI.add(o)
    });
    ui_btn_p2.forEach(o => {
        UI.add(o)
    });
}

function initGame(){
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    SCENE.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 20, 10); // x, y, z
    SCENE.add(dirLight);

    let ui_btn_left_disabled = new THREE.MeshBasicMaterial({
        map: TEXTURE_LOADER.load('../../texture/ui/arrow_l_disabled.png')
    })
    let ui_btn_right_disabled = new THREE.MeshBasicMaterial({
        map: TEXTURE_LOADER.load('../../texture/ui/arrow_r_disabled.png')
    })
    let white = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
    })
    
    for (let i = 0; i < 6; i++) {
        Catcher[i] = CATCHER_LOADER[i].Load()
        Catcher[i].position.set(320,30,CATCHER_POSITION[i])
    }
    Player2 = PLAYER_LOADER.Load()
    Player2.position.set(295,30,82.5)
    Player2.rotation.y = -Math.PI

    let Tribune_right = []
    Tribune_right[0] = new Tribune_l().group
    Tribune_right[0].position.set(512.5,30,-725)
    Tribune_right[0].rotation.y = -Math.PI/2
    for (let i = 0; i < 16; i++) {
        Tribune_right[i+1] = new Tribune_mid().group
        Tribune_right[i+1].position.set(512.5,30,-725 + (i*50))
        Tribune_right[i+1].rotation.y = -Math.PI/2
    }
    Tribune_right[17] = new Tribune_r().group
    Tribune_right[17].position.set(512.5,30,75)
    Tribune_right[17].rotation.y = -Math.PI/2

    let Tribune_left = []
    Tribune_left[0] = new Tribune_r().group
    Tribune_left[0].position.set(75,30,-725)
    Tribune_left[0].rotation.y = Math.PI/2
    for (let i = 0; i < 16; i++) {
        Tribune_left[i+1] = new Tribune_mid().group
        Tribune_left[i+1].position.set(75,30,-725 + (i*50))
        Tribune_left[i+1].rotation.y = Math.PI/2
    }
    Tribune_left[17] = new Tribune_l().group
    Tribune_left[17].position.set(75,30,75)
    Tribune_left[17].rotation.y = Math.PI/2


    Catcher.forEach(e => {
        SCENE.add(e)
    });
    SCENE.add(Player2)
    Tribune_right.forEach(e => {
        SCENE.add(e)
    })
    Tribune_left.forEach(e => {
        SCENE.add(e)
    })
    
    let white_strip_long = new THREE.PlaneGeometry(25,750)
    let white_strip_short = new THREE.PlaneGeometry(275,25)    
    let finish = new finish_line().group
    finish.position.set(325,0,-817.5)

    let strip_side = [];

    for (let i = 0; i < 6; i++) {        
        strip_side[i] = new THREE.Mesh(white_strip_short,white)
        strip_side[i].position.set(325,0,25-(i*150))
        strip_side[i].rotation.x = -Math.PI/2
    }
    
    let strip_long_l = new THREE.Mesh(white_strip_long,white)
    strip_long_l.position.set(200,0,-337.5)
    strip_long_l.rotation.x = -Math.PI/2
    
    let strip_long_r = new THREE.Mesh(white_strip_long,white)
    strip_long_r.position.set(450,0,-337.5)
    strip_long_r.rotation.x = -Math.PI/2

    strip_side.forEach(e => {
        SCENE.add(e)
    });

    SCENE.add(strip_long_l)
    SCENE.add(finish)
    SCENE.add(strip_long_r)

    let indicator_ring = new THREE.RingGeometry(11,15,25,25)
    let turn_ring = new THREE.Mesh(indicator_ring,new THREE.MeshBasicMaterial({color: 0xFF3366}))
    turn_ring.rotation.x = -Math.PI/2
    turn_ring.position.set(320,5.4,CATCHER_POSITION[ROW])
    ROW_RING.push(turn_ring)
    
    SCENE.add(turn_ring)

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
                // console.log(CAMERA.zoom)
                let items = RAYCAST.intersectObjects(UI.children,false)
                console.log(items)
                items.forEach(i=>{
                    console.log(i.object.name)
                    if(i.object.name.startsWith("player1") && !i.object.name.endsWith("_disabled")){
                        if(PLAYER_CHOOSE[0] == null){
                            PLAYER_CHOOSE[0] = parseInt(i.object.name.charAt(8))
                            if(PLAYER_CHOOSE[0]<4){
                                ui_btn_p1[6-PLAYER_CHOOSE[0]].material = ui_btn_left_disabled
                            } else {
                                ui_btn_p1[6-PLAYER_CHOOSE[0]].material = ui_btn_right_disabled
                            }
                            ui_btn_p1[6-PLAYER_CHOOSE[0]].name += "_disabled"
                            UI.remove(P1_UI[1])
                            UI.add(P1_UI[2])
                            console.log("Player1 choosed: " + PLAYER_CHOOSE[0])
                        }
                    } else if(i.object.name.startsWith("player2")){
                        if(PLAYER_CHOOSE[1] == null){
                            PLAYER_CHOOSE[1] = parseInt(i.object.name.charAt(8))
                            if(PLAYER_CHOOSE[1]<4){
                                ui_btn_p2[6-PLAYER_CHOOSE[1]].material = ui_btn_left_disabled
                            } else {
                                ui_btn_p2[6-PLAYER_CHOOSE[1]].material = ui_btn_right_disabled
                            }
                            ui_btn_p2[6-PLAYER_CHOOSE[1]].name += "_disabled"
                            console.log("Player2 choosed:" + PLAYER_CHOOSE[1])
                            UI.remove(P2_UI[1])
                            UI.add(P2_UI[2])
                        }
                    }
                })
            }
        })
}

var moveChara = (obj_loader, obj_chara, loc) => new Promise(resolve => {
    let pos = obj_chara.position
    let dx
    let dz
    if (loc.x - pos.x > 0){
        dx = 1
    } else dx = -1
    if (loc.z - pos.z > 0){
        dz = 1
    } else dz = -1

    console.log(dx, dz)
    let interval = setInterval(function(){
        if((loc.z - pos.z != 0) || (loc.x - pos.x != 0)){
            if(obj_loader != null){
                obj_loader.PlayerWalk()
            }
            if(loc.z - pos.z != 0){
                obj_chara.position.z += dz
                pos = obj_chara.position
            }
            if(loc.x - pos.x != 0){
                obj_chara.position.x += dx
                pos = obj_chara.position
            }
        } else {
            if(obj_loader != null){
                obj_loader.PlayerStop()
            }
            clearInterval(interval)
            resolve()
        }
    },25)
})

var distributeChara = (player_direction) => new Promise(resolve => {
    let obj = [];
    let loader = [];
    let location = [];
    if(player_direction[0]==-1){
        obj[0] = Catcher[ROW]
        loader[0] = CATCHER_LOADER[ROW]
        location[0] = {
            x: 320+(player_direction[0]*75),
            y: 30,
            z: CATCHER_POSITION[ROW]
        }
    } else{
        obj[0] = Catcher[ROW]
        loader[0] = CATCHER_LOADER[ROW]
        location[0] = {
            x: 320+(player_direction[0]*50),
            y: 30,
            z: CATCHER_POSITION[ROW]
        }
    }
    if(player_direction[1]==-1){
        obj[1] = Player2
        loader[1] = PLAYER_LOADER
        location[1] = {
            x: 295+(player_direction[1]*50),
            y: 30,
            z: PLAYER_POSITION[ROW]-50
        }
    } else {
        obj[1] = Player2
        loader[1] = PLAYER_LOADER
        location[1] = {
            x: 295+(player_direction[1]*75),
            y: 30,
            z: PLAYER_POSITION[ROW]-50
        }
    }
    Promise.all([moveChara(loader[0],obj[0],location[0]),moveChara(loader[1],obj[1],location[1])]).then(result => {
        resolve(null)
    })
})


function bentenganGame(player_input){
    if(!ONGOING_TURN){
        SCENE.remove(ROW_RING[0])
        ROW_RING.pop()
        ONGOING_TURN = true
        let player_direction = [0,0];
        for (let i = 0; i < 2; i++) {            
            switch(player_input[i]){
                case 1: case 2: case 3:
                    player_direction[i] = -1
                    break;
                case 4: case 5: case 6:
                    player_direction[i] = 1
                    break;
            }
        }
        let promiseArray = []

        distributeChara(player_direction).then(result =>{
            console.log("udah masuk then distribute")
            if(player_direction[0] == player_direction[1]){
                if(7-player_input[0] == PLAYER_SPECIAL[0]){
                    console.log("Player 1 catches Player 2 (SP)")
                    PLAYER_POINT[0] += 3;
                } else {
                    console.log("Player 1 catches Player 2")
                    PLAYER_POINT[0]++;
                }
                promiseArray.push(
                    moveChara(PLAYER_LOADER, Player2, {
                        x: 295,
                        y: 30,
                        z: PLAYER_POSITION[ROW]
                    }),
                    moveChara(CATCHER_LOADER[ROW], Catcher[ROW], {
                        x: 320,
                        y: 30,
                        z: CATCHER_POSITION[ROW]
                    })
                )
            } else {
                if(7-player_input[1] == PLAYER_SPECIAL[1]){
                    console.log("Player 2 passed Player 1 (SP)")
                    PLAYER_POINT[1] += 3;
                } else{
                    console.log("Player 2 passed Player 1")
                    PLAYER_POINT[1]++;
                }
                ROW++;
                promiseArray.push(
                    moveChara(PLAYER_LOADER, Player2,{
                        x: 295,
                        y: 30,
                        z: PLAYER_POSITION[ROW]
                    }),
                    moveChara(null, CAMERA,{
                        x: 200,
                        y: 110,
                        z: CAMERA_POSITION[ROW]
                    })
                )
            }
            Promise.all(promiseArray).then(result => {
                let geometry = new TextGeometry(PLAYER_POINT[0].toString(), {
                    font: FONT_USED,
                    size: 20,
                    height: 0,
                    bevelEnabled: false,
                } );
                let mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
                mesh.rotation.y = -Math.PI/4
                mesh.position.set(-152.5,85,49)
                UI.remove(P1_POINT)
                P1_POINT = mesh
                UI.add(P1_POINT)
        
                geometry = new TextGeometry(PLAYER_POINT[1].toString(), {
                    font: FONT_USED,
                    size: 20,
                    height: 0,
                    bevelEnabled: false,
                } );
                mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
                mesh.rotation.y = -Math.PI/4
                mesh.position.set(45,85,246)
                UI.remove(P2_POINT)
                P2_POINT = mesh
                UI.add(P2_POINT)

                let indicator_ring = new THREE.RingGeometry(11,15,25,25)
                let turn_ring = new THREE.Mesh(indicator_ring,new THREE.MeshBasicMaterial({color: 0xFF3366}))
                turn_ring.rotation.x = -Math.PI/2
                turn_ring.position.set(320,5.4,CATCHER_POSITION[ROW])
                ROW_RING.push(turn_ring)
                
                SCENE.add(turn_ring)
            

                UI.remove(P1_UI[2])
                UI.remove(P2_UI[2])
                UI.add(P1_UI[1])
                UI.add(P2_UI[1])

                PLAYER_CHOOSE = [null,null];
                GAME_ROUND++;
                ONGOING_TURN = false;
                console.log(GAME_ROUND)
                if(GAME_ROUND == 6){
                    end_game = true
                    UI.add(END_SCREEN[0])
                    if(PLAYER_POINT[0]>PLAYER_POINT[1]){
                        UI.add(END_SCREEN[1])
                    } else if (PLAYER_POINT[0]<PLAYER_POINT[1]){
                        UI.add(END_SCREEN[2])
                    } else {
                        UI.add(END_SCREEN[3])
                    }
                    console.log("Game Ended")
                }
            })
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

        if(PLAYER_CHOOSE[0] != null && PLAYER_CHOOSE[1] != null){
            bentenganGame(PLAYER_CHOOSE)
        }

        RENDERER.render(SCENE, CAMERA);
        UI_RENDERER.render(UI, UI_CAMERA);
}

function onWindowResize(){
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();
    UI_CAMERA.aspect = window.innerWidth / window.innerHeight;
    UI_CAMERA.updateProjectionMatrix();
    RENDERER.setSize(window.innerWidth, window.innerHeight);
}