// Library Imports
import * as THREE from '../../three.js/build/three.module.js'
import {FontLoader} from '../../three.js/examples/jsm/loaders/FontLoader.js' 
import PlayerLoader from '../../item/PlayerLoader.js';
import FaceDetails from '../../item/FaceDetails.js'

// Variables
const MANAGER = new THREE.LoadingManager();
const FONT_LOADER = new FontLoader(MANAGER);
const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)
const PLAYER_LOADER = new PlayerLoader();
const FONT_SIZE = 0.08;

const CONTAINER = document.getElementById('canvas-holder');
const UI_CONTAINER = document.getElementById('ui-holder');

const SCENE = new THREE.Scene();
const UI = new THREE.Scene();
const CAMERA = new THREE.OrthographicCamera((-135*(window.innerWidth/window.innerHeight)), (135*(window.innerWidth/window.innerHeight)), 135, -135, -1000,1000)
const UI_CAMERA = new THREE.OrthographicCamera((-135*(window.innerWidth/window.innerHeight)), (135*(window.innerWidth/window.innerHeight)), 135, -135, 1,1000)
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
let PAGE = 1;
let PLAYER_PREVIEW
let equippedList = [];
let ui_item_list = [];
let AppearancePart = [];

let ActivePart = 0;
// 0 = Brow, 1 = Eye, 2 = Nose, 3 = Mouth

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
    RENDERER.setClearColor(0xFAFAFA)
    RENDERER.shadowMap.enabled = true
    
    UI_RENDERER.setSize(window.innerWidth, window.innerHeight)
    UI_RENDERER.setClearColor(0xFFFFFF, 0)
    UI_RENDERER.shadowMap.enabled = true

}

function initCamera(){
    CAMERA.position.set(0,0,0)
    CAMERA.zoom = 2.5
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

    let ui_pink_light = new THREE.MeshBasicMaterial({
        color: 0xFFF2F2,
    })
    let ui_pink_btn = new THREE.MeshBasicMaterial({
        color: 0xFF3366,
    })
    const ui_btn_medium = new THREE.PlaneGeometry(100,45);
    
    let ui_btn_save = new THREE.Mesh(ui_btn_medium, ui_pink_btn)
    ui_btn_save.rotation.y = -Math.PI / 4
    ui_btn_save.name = "button_save"
    ui_btn_save.position.set(-70,65,0)

    const ui_btn_small = new THREE.PlaneGeometry(30,39)
    let ui_btn_prev = new THREE.Mesh(ui_btn_small, ui_pink_btn)
    ui_btn_prev.name = "button_prev"
    ui_btn_prev.rotation.y = -Math.PI / 4
    ui_btn_prev.position.set(12.5,110,12.5)

    let ui_btn_next = new THREE.Mesh(ui_btn_small, ui_pink_btn)
    ui_btn_next.rotation.y = -Math.PI / 4
    ui_btn_next.name = "button_next"
    ui_btn_next.position.set(232.5,110,232.5)
    // ui_btn_next.position.set(50,0,50)

    const ui_equip_area = new THREE.PlaneGeometry(650,89)
    let ui_equip_items = new THREE.Mesh(ui_equip_area, ui_pink_light)
    ui_equip_items.rotation.y = -Math.PI / 4
    ui_equip_items.position.set(165,-130,0)
    ui_equip_items.position.set(165,-130,0)

    const ui_btn_list = new THREE.PlaneGeometry(40,52);
    PLAYER_LOADER.LoadAppearanceList(ActivePart, 1).then(e => {
        ActivePart = 0;
        loadPage(e,0)
    });


    UI.add(ui_btn_save)
    UI.add(ui_btn_next)
    UI.add(ui_btn_prev)
    UI.add(ui_equip_items)

    let parts = ["brow","eye","nose","mouth"]
    for (let i = 0; i < 4; i++) {
        let plane = new THREE.PlaneGeometry(40,52)
        let eyeTexture = TEXTURE_LOADER.load('../../texture/ui/appearance_'+parts[i]+'.png')
        let eyeMaterial = new THREE.MeshBasicMaterial({
            map: eyeTexture,
            side: THREE.DoubleSide,
            transparent: true
        })
        let mesh = new THREE.Mesh(plane, eyeMaterial)
        mesh.rotation.y = -Math.PI / 4
        mesh.name = "parts_" + i
        mesh.position.set(-50+(i*35),-50,-50+(i*35))
        AppearancePart.push(mesh)
        UI.add(mesh)
    }




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
                            case "button_next":
                                PLAYER_LOADER.LoadAppearanceList(ActivePart,PAGE+1).then(e => {
                                    loadPage(e,1)
                                })
                                break;
                            case "button_prev":
                                PLAYER_LOADER.LoadAppearanceList(ActivePart,PAGE-1).then(e => {
                                    loadPage(e,-1)
                                })
                                break;
                            case "button_save": break;
                        }
                    } else if(obj_name.startsWith("parts_")){
                        console.log(parseInt(obj_name.charAt(6)))
                        switch(parseInt(obj_name.charAt(6))){
                            case 0: 
                                ActivePart = 0
                            break;
                            case 1: 
                                ActivePart = 1
                            break;
                            case 2: 
                                ActivePart = 2
                            break;
                            case 3:
                                ActivePart = 3
                            break;
                        }
                        PLAYER_LOADER.LoadAppearanceList(ActivePart,1).then(e => {
                            PAGE = 1;
                            loadPage(e,0)
                        })
                    } else if(obj_name.startsWith("appearance_")){
                        console.log("Equipping "+ obj_name)
                        SCENE.remove(PLAYER_PREVIEW)
                        console.log(ActivePart)
                        PLAYER_PREVIEW = PLAYER_LOADER.EquipAppearance(i.object.material,ActivePart)
                        PLAYER_PREVIEW.position.set(-57.5,36,-37.5)
                        SCENE.add(PLAYER_PREVIEW)
                    }
                })
            }
        })

}

function loadPage(e,i){
    if(e != null){
        const ui_btn_list = new THREE.PlaneGeometry(40,52);
        let ui_item_material = e
        let counter = 0
        let ui_item_page = []
        for (let i = 0; i < 5; i++) {
            for(let j = 0; j< 6;j++){
                let ui_btn_left = ui_item_material[counter]
                let mesh = new THREE.Mesh(ui_btn_list,ui_btn_left)
                mesh.name = "appearance_"
                mesh.rotation.y = -Math.PI / 4
                mesh.position.set(50+(j*30),212.5-(i*45),50+(j*30))        
                counter++;
                ui_item_page.push(mesh)
            }
        }
        console.log(ui_item_list)
        if(ui_item_list.length > 0){
            ui_item_list[0].forEach(e => {
                UI.remove(e)
            })
            ui_item_list.shift()
        }
        ui_item_list.push(ui_item_page)
        ui_item_page.forEach(e => {
            UI.add(e)
        })
        PAGE += i;
    }
}

function initGame(){
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    SCENE.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 20, 10); // x, y, z
    SCENE.add(dirLight);

    PLAYER_PREVIEW = PLAYER_LOADER.Load()
    PLAYER_PREVIEW.position.set(-57.5,36,-37.5)
    SCENE.add(PLAYER_PREVIEW)
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


        // if(PLAYER_CHOOSE[0] != null && PLAYER_CHOOSE[1] != null){
        //     bentenganGame(PLAYER_CHOOSE)
        // }

        RENDERER.render(SCENE, CAMERA);
        UI_RENDERER.render(UI, UI_CAMERA);
}

/*
function addEquipped(obj){
    let plane = new THREE.PlaneGeometry(40,52)
    let mesh = new THREE.Mesh(plane, obj.material)
    mesh.rotation.y = -Math.PI / 4
    mesh.name = "equipped_" + obj.name
    let i = 0;
    equippedList.forEach(e => {
        UI.remove(e)
        equippedList.shift()
    })
    equippedList.push(mesh)
    for (let i = 0; i < equippedList.length; i++) {
        equippedList[i].position.set(-50+(i*25),-50,-50+(i*25))
        UI.add(equippedList[i])
    }

} */

function onWindowResize(){
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();
    UI_CAMERA.aspect = window.innerWidth / window.innerHeight;
    UI_CAMERA.updateProjectionMatrix();
    RENDERER.setSize(window.innerWidth, window.innerHeight);
}