import React from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import ItemLoader from '../../src/character/ItemLoader.js'
import PlayerLoader from '../../src/character/PlayerLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import WebGL from '../WebGL.js';
import { useSelector } from "react-redux";


const Inventory = () => {
const userLogin = useSelector((state) => state.userLogin);
const { userInfo } = userLogin;

// Variables
const MANAGER = new THREE.LoadingManager();
const FONT_LOADER = new FontLoader(MANAGER);
const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)
const PLAYER_LOADER = new PlayerLoader(userInfo._id);
const ITEM_LOADER = new ItemLoader();
const FONT_SIZE = 16;

let CONTAINER
let UI_CONTAINER

const SCENE = new THREE.Scene();
const UI = new THREE.Scene();
const CAMERA = new THREE.OrthographicCamera((-135*(window.innerWidth/window.innerHeight)), (135*(window.innerWidth/window.innerHeight)), 135, -135, -1000,1000)
const UI_CAMERA = new THREE.OrthographicCamera((-135*(window.innerWidth/window.innerHeight)), (135*(window.innerWidth/window.innerHeight)), 135, -135, -1000,1000)
const RENDERER = new THREE.WebGLRenderer({
    antialias: true,
});
const UI_RENDERER = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

let LOADED_FONT
let LOADED_TEXTURE = []
let LOADED_MATERIAL = []
const RAYCAST = new THREE.Raycaster()
RAYCAST.layers.set = 1
let PLAYER_PREVIEW
let CATEGORY = []
let ACTIVE_CATEGORY = 0
let ACTIVE_PAGE = 0
let GAME_NAME = []
let ITEM_LIST = []
let MAIN_UI = []
let TOP_MENU = []
let EQUIPPED = ["","","","",""]
let EQUIPPED_OBJ = [[[],[],[],[],[],[]],[[],[],[],[],[],[]],[[],[],[],[],[],[]],[[],[],[],[],[],[]],[[],[],[],[],[],[]]]
let MAX_PAGE, PLAYER_ITEMS, PLAYER_DATA
let sound_icon
let SOUND_PLAY = false



// Support check
if (!('getContext' in document.createElement('canvas'))) {
    alert('Sorry, it looks like your browser does not support canvas!');
}

// Also make sure webgl is enabled on the current machine
if (WebGL.isWebGLAvailable()) {
    // If everything is possible, start the app, otherwise show an error
    load();
    gameLoop();
} else {
    let warning = WebGL.getWebGLErrorMessage();
    document.body.appendChild(warning);
    CONTAINER.remove();
    UI_CONTAINER.remove();
    throw 'WebGL disabled or not supported';
}

function init() {
    // Initiate Loading

    // Initiate the Game
    initRenderer()
    initCamera()
    loadData("/api/users/getData")
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
        CONTAINER = document.getElementById('canvas-holder');
        UI_CONTAINER = document.getElementById('ui-holder');
        init()
        document.getElementById('progress').hidden = true;
        console.log('Loading complete!');
    };
}

function load(){
    initManager()
    // Font
    FONT_LOADER.load( './Bahnschrift_Regular.json', function ( font ) {
        LOADED_FONT = font
    });

    // Texture
    TEXTURE_LOADER.load('./images/texture/ui/currency/points.png', function ( texture ) {
        LOADED_TEXTURE["point"] = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.3
        })    
    })
    TEXTURE_LOADER.load('./images/texture/ui/currency/gold.png', function ( texture ) {
        LOADED_TEXTURE["gold"] = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.3
        })    
    })
    let itemCategory = ["all","hat","hair","top","bottom","shoes"]
    for (let i = 0; i < itemCategory.length; i++) {
        TEXTURE_LOADER.load('./images/texture/item/category/'+itemCategory[i]+'.png', function ( texture ) {
            LOADED_TEXTURE[itemCategory[i]] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                alphaTest: 0.1
            })    
        })
        TEXTURE_LOADER.load('./images/texture/item/category/'+itemCategory[i]+'_inactive.png', function ( texture ) {
            LOADED_TEXTURE[itemCategory[i]+"_inactive"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                alphaTest: 0.1
            })    
        })
    }
    // TEXTURE_LOADER.load('../../texture/ui/coin.png', function ( texture ) {
    //     LOADED_TEXTURE["point"] = new THREE.MeshBasicMaterial({
    //         map: texture,
    //         side: THREE.DoubleSide,
    //         alphaTest: 1
    //     })    
    // })
    // TEXTURE_LOADER.load('../../texture/ui/gold.png', function ( texture ) {
    //     LOADED_TEXTURE["gold"] = new THREE.MeshBasicMaterial({
    //         map: texture,
    //         side: THREE.DoubleSide,
    //         alphaTest: 1
    //     })    
    // })
    TEXTURE_LOADER.load('./images/texture/ui/sound/sound_on.png', function ( texture ) {
        LOADED_TEXTURE["sound_on"] = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.6
        })    
    })
    TEXTURE_LOADER.load('./images/texture/ui/sound/sound_off.png', function ( texture ) {
        LOADED_TEXTURE["sound_off"] = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.6
        })    
    })
    TEXTURE_LOADER.load('./images/texture/ui/arrow/arrow_l_back.png', function ( texture ) {
        LOADED_TEXTURE["arrow_back"] = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.6
        })    
    })
    TEXTURE_LOADER.load('./images/texture/ui/arrow/arrow_l_2.png', function ( texture ) {
        LOADED_TEXTURE["arrow_l"] = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.6
        })    
    })
    TEXTURE_LOADER.load('./images/texture/ui/arrow/arrow_r_2.png', function ( texture ) {
        LOADED_TEXTURE["arrow_r"] = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.6
        })    
    })

    // Material
    LOADED_MATERIAL.push(
        new THREE.MeshBasicMaterial({color:0xcec3c1}),
        new THREE.MeshBasicMaterial({color:0x240115}),
        new THREE.MeshBasicMaterial({color:0xA5908D}),
        new THREE.MeshBasicMaterial({color:0x2F131E}),
        new THREE.MeshBasicMaterial({color:0x6A5256})
    )
}


async function loadData(url){
    const response = await fetch(url,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + userInfo.token,
            }
        });
    var data = await response.json()
    initUI(data)
    initGame()
}

async function loadItem(itemId){
    return await ITEM_LOADER.load(itemId)
}

async function saveClothes(url){
    const response = await fetch(url,{
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + userInfo.token,
        },
        body: JSON.stringify({
            "hat": EQUIPPED[0],
            "hair": EQUIPPED[1],
            "top": EQUIPPED[2],
            "bottom": EQUIPPED[3],
            "shoes": EQUIPPED[4]
        })
    });
    var data = await response.json()
    if(data){
        window.open('/lobby', "_self")
    }
}

async function getInventory(url){
        const response = await fetch(url,{
                method: 'GET',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + userInfo.token,
                }
            });
        var data = await response.json()
        console.log(data)
        if(response){
            loadPlayerInventory(data[0].item_owned)
        }
}

function loadPlayerInventory(data){
    if(data){
        PLAYER_ITEMS = data
    }
    if(ITEM_LIST.length > 0){
        ITEM_LIST.forEach(e => {
            UI.remove(e)
        })
        ITEM_LIST = []
    }
    if(CATEGORY.length > 0){
        CATEGORY.forEach(e => {
            UI.remove(e)
        })
        CATEGORY = []
    }

    let itemCategory = ["all","hat","hair","top","bottom","shoes"]
    for (let i = 0; i < 6; i++) {
        let category_bg = new THREE.Mesh(new THREE.PlaneGeometry(30,30),LOADED_TEXTURE[itemCategory[i]+"_inactive"])
        if(ACTIVE_CATEGORY == i){
            category_bg.material = LOADED_TEXTURE[itemCategory[i]]
        }
        category_bg.position.set(221,192.5-(i*31),-2)
        category_bg.name = "category_0"+i
        CATEGORY.push(category_bg)
        UI.add(category_bg)
    }

    if(PLAYER_ITEMS.length > 15){
        if((PLAYER_ITEMS.length%15)>0){
            MAX_PAGE = ((PLAYER_ITEMS.length-(PLAYER_ITEMS.length%15))/15)+1
        } else {
            MAX_PAGE = ((PLAYER_ITEMS.length-(PLAYER_ITEMS.length%15))/15)
        }
        for (let j = 0; j < 3; j++) {
            for (let i = 0; i < 5; i++) {  
                if((i+(j*5)+(ACTIVE_PAGE*15)) > (PLAYER_ITEMS.length-1)) break;              
                let item = new THREE.Mesh(new THREE.PlaneGeometry(45,45), LOADED_MATERIAL[3])
                item.position.set(-25+(50*i),180-(j*51.5),2)
                UI.add(item)
                let item_thumbnail = new THREE.Mesh(new THREE.PlaneGeometry(38,38), LOADED_MATERIAL[2])
                item_thumbnail.position.set(-25+(50*i),180-(j*51.5),3)
                ITEM_LIST.push(item)
                ITEM_LIST.push(item_thumbnail)
                UI.add(item_thumbnail)
                loadPreview(PLAYER_ITEMS[(i+(j*5)+(ACTIVE_PAGE*15))],i,j,true)
            }
        }
        let game_next_arrow = new THREE.Mesh(new THREE.PlaneGeometry(15,15), LOADED_TEXTURE["arrow_r"])
        game_next_arrow.position.set(125,35,4)
        ITEM_LIST.push(game_next_arrow)
        UI.add(game_next_arrow)
        let game_prev_arrow = new THREE.Mesh(new THREE.PlaneGeometry(15,15), LOADED_TEXTURE["arrow_l"])
        game_prev_arrow.position.set(25,35,4)
        ITEM_LIST.push(game_prev_arrow)
        UI.add(game_prev_arrow)
        let item_page = new THREE.Mesh(new THREE.PlaneGeometry(25,25),LOADED_MATERIAL[3])
        item_page.position.set(25,35,2)
        item_page.name = "button_prev"
        ITEM_LIST.push(item_page)
        UI.add(item_page)
        item_page = new THREE.Mesh(new THREE.PlaneGeometry(25,25),LOADED_MATERIAL[3])
        item_page.position.set(125,35,2)
        item_page.name = "button_next"
        ITEM_LIST.push(item_page)
        UI.add(item_page)

        let page_text = new TextGeometry((ACTIVE_PAGE+1).toString(), {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false
        })
        let page_number = new THREE.Mesh(page_text,LOADED_MATERIAL[3])
        centerText(page_text, page_number, 75,35,2)
        ITEM_LIST.push(page_number)
        UI.add(page_number)

        // item loader (e)

    } else {
        let i = 0
        let j = 0
        data.forEach(e => {
            let item = new THREE.Mesh(new THREE.PlaneGeometry(45,45), LOADED_MATERIAL[3])
            item.position.set(-25+(50*i),175-(j*57.5),2)
            ITEM_LIST.push(item)
            UI.add(item)

            let item_thumbnail = new THREE.Mesh(new THREE.PlaneGeometry(38,38), LOADED_MATERIAL[2])
            item_thumbnail.position.set(-25+(50*i),175-(j*57.5),3)
            ITEM_LIST.push(item_thumbnail)
            UI.add(item_thumbnail)

            loadPreview(e,i,j, false)

            i++
            if(i == 5){
                j++;
                i = 0;
            }
        })
    }
}

function loadPreview(e,i,j,bool){
    loadItem(e).then(result => {
        let item_preview = new THREE.Mesh(new THREE.PlaneGeometry(38,38), result.texture)
        if(bool){
            item_preview.position.set(-25+(50*i),180-(j*51.5),3)
        } else {
            item_preview.position.set(-25+(50*i),175-(j*57.5),3)
        }
        ITEM_LIST.push(item_preview)
        item_preview.userData.object = result.object
        item_preview.name = "item_"+e
        UI.add(item_preview)
    })
}

function equip(object){
    let category = object.name.substring(object.name.indexOf("_")+1,object.name.indexOf("_",object.name.indexOf("_")+1))
    let category_id
    switch(category){
        case "hat":
            category_id = 0
            break;
        case "hair":
            category_id = 1
            break;
        case "top":
            category_id = 2
            break;
        case "bottom":
            category_id = 3
            break;
        case "shoes":
            category_id = 4
            break;
    }
    console.log(EQUIPPED_OBJ)
    for (let i = 0; i < EQUIPPED_OBJ.length; i++) {
        if(EQUIPPED_OBJ[i]){
            for (let j = 0; j < EQUIPPED_OBJ[i].length; j++) {
                EQUIPPED_OBJ[i][j].forEach(e =>{
                    PLAYER_LOADER.PLAYER.player.children[j].remove(e)
                })
            }
        }
    }
    if(EQUIPPED[category_id].length > 0){
        if(EQUIPPED[category_id] === object.name.substring(object.name.indexOf("_")+1, object.name.length)){
            // unequipped current item
            EQUIPPED[category_id] = ""
            EQUIPPED_OBJ[category_id] = []
        } else {
            // remove existing item
            // then equip the item
            EQUIPPED[category_id] = object.name.substring(object.name.indexOf("_")+1, object.name.length)
            EQUIPPED_OBJ[category_id] = object.userData.object.object
            PLAYER_LOADER.PLAYER.equip[category_id] = object.name.substring(object.name.indexOf("_")+1, object.name.length)
        }
    } else {
        EQUIPPED[category_id] = object.name.substring(object.name.indexOf("_")+1, object.name.length)
        EQUIPPED_OBJ[category_id] = object.userData.object.object
        PLAYER_LOADER.PLAYER.equip[category_id] = object.name.substring(object.name.indexOf("_")+1, object.name.length)
}
    for (let i = 0; i < EQUIPPED_OBJ.length; i++) {
        if(EQUIPPED_OBJ[i]){
            for (let j = 0; j < EQUIPPED_OBJ[i].length; j++) {
                EQUIPPED_OBJ[i][j].forEach(e =>{
                    PLAYER_LOADER.PLAYER.player.children[j].add(e)
                })
            }
        }
    }
}

function initRenderer(){
    RENDERER.setSize(window.innerWidth, window.innerHeight)
    RENDERER.setClearColor(0xcec3c1)
    
    UI_RENDERER.setSize(window.innerWidth, window.innerHeight)
    UI_RENDERER.setClearColor(0xcec3c1, 0)
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
}

function initScene(){
    CONTAINER.appendChild(RENDERER.domElement)
    UI_CONTAINER.appendChild(UI_RENDERER.domElement)
}

function initUI(loadedData){
    PLAYER_DATA = loadedData
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    UI.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 20, 10); // x, y, z
    UI.add(dirLight);

    let page_text = new TextGeometry( "Inventory", {
        font: LOADED_FONT,
        size: 14,
        height: 0,
        bevelEnabled: false,
    } );

    let back = new THREE.Mesh(new THREE.PlaneGeometry(20,20), LOADED_TEXTURE["arrow_back"])
    back.position.set(-190,242,1)
    UI.add(back)

    let page_mesh = new THREE.Mesh(page_text,LOADED_MATERIAL[1])
    centerText(page_text,page_mesh,-122.5,242,0)
    TOP_MENU.push(page_mesh)
    UI.add(page_mesh)

    let back_button = new THREE.Mesh(new THREE.PlaneGeometry(38,38), LOADED_MATERIAL[3])
    back_button.position.set(-190,242,-1)
    back_button.name = "button_back"
    TOP_MENU.push(back_button)
    UI.add(back_button)

    loadUI_currency()

    let save_button = new THREE.Mesh(new THREE.PlaneGeometry(100,30),LOADED_MATERIAL[3])
    save_button.position.set(-142.5,45,3)
    save_button.name = "button_save"
    UI.add(save_button)
    let save_text = new TextGeometry("Save", {
        font: LOADED_FONT,
        size: 10,
        height: 0,
        bevelEnabled: false
    })
    let save_mesh = new THREE.Mesh(save_text, LOADED_MATERIAL[0])
    centerText(save_text,save_mesh, -142.5, 45, 4)
    save_mesh.name = "button_save"
    UI.add(save_mesh)

    // Main UI
    let inventory_bg = new THREE.Mesh(new THREE.PlaneGeometry(270,200), LOADED_MATERIAL[4])
    inventory_bg.position.set(75,115,0)
    MAIN_UI.push(inventory_bg)
    UI.add(inventory_bg)
    inventory_bg = new THREE.Mesh(new THREE.PlaneGeometry(262,192), LOADED_MATERIAL[2])
    inventory_bg.position.set(75,115,1)
    MAIN_UI.push(inventory_bg)
    UI.add(inventory_bg)

    getInventory('/api/users/inventory')

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
                    let choice = parseInt(obj_name.substring(obj_name.length-2,obj_name.length))
                    if(obj_name.startsWith("item_")){
                        equip(i.object)
                        items.splice(1,3)
                    } else if(obj_name.startsWith("category_")){
                        switch(choice){
                            case 0:
                                ACTIVE_CATEGORY= 0
                                getInventory("/api/users/inventory")
                                break;
                            case 1:
                                ACTIVE_CATEGORY= 1
                                getInventory("/api/users/inventory?category=hat")
                                break;
                            case 2:
                                ACTIVE_CATEGORY= 2
                                getInventory("/api/users/inventory?category=hair")
                                break;
                            case 3:
                                ACTIVE_CATEGORY= 3
                                getInventory("/api/users/inventory?category=top")
                                break;
                            case 4:
                                ACTIVE_CATEGORY= 4
                                getInventory("/api/users/inventory?category=bottom")
                                break;
                            case 5:
                                ACTIVE_CATEGORY= 5
                                getInventory("/api/users/inventory?category=shoes")
                                break;
                        }
                    } else {
                        switch(obj_name){
                            case "button_back":
                                window.open("/lobby", "_self")
                                break;
                            case "button_save":
                                saveClothes('/api/users/inventory')
                                break;
                            case "button_next":
                                if(ACTIVE_PAGE<(MAX_PAGE-1)){
                                    ACTIVE_PAGE++;
                                    loadPlayerInventory()
                                }
                                break;
                            case "button_prev":
                                if(ACTIVE_PAGE>0){
                                    ACTIVE_PAGE--;
                                    loadPlayerInventory()
                                }
                            break;
                            case "top_menu_04":
                                if(SOUND_PLAY){
                                    sound_icon.material = LOADED_TEXTURE["sound_off"]
                                    SOUND_PLAY = false
                                } else {
                                    sound_icon.material = LOADED_TEXTURE["sound_on"]
                                    SOUND_PLAY = true
                                }
                            break;
                        }
                    }
                })
            }
        })

}

function initGame(){
    EQUIPPED_OBJ = PLAYER_LOADER.PLAYER.equip_obj
    console.log(EQUIPPED_OBJ)
    EQUIPPED = PLAYER_LOADER.PLAYER.equip
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    SCENE.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(0, 20, 10); // x, y, z
    SCENE.add(dirLight);

    PLAYER_PREVIEW = PLAYER_LOADER.PLAYER.player
    PLAYER_PREVIEW.scale.set(0.85,0.85,0.85)
    PLAYER_PREVIEW.position.set(-56,5,-36)

    let player_background = new THREE.Mesh(new THREE.PlaneGeometry(52,95.5), LOADED_MATERIAL[2])
    player_background.rotation.y = -Math.PI/4
    player_background.position.set(-16.25,-41.5,-76.25)
    SCENE.add(player_background)

    player_background = new THREE.Mesh(new THREE.PlaneGeometry(51,95.5), LOADED_MATERIAL[3])
    player_background.rotation.y = -Math.PI/4
    player_background.position.set(-0.5,-57.5,-88.25)

    SCENE.add(player_background)
    SCENE.add(PLAYER_PREVIEW)
}

function loadUI_currency() {
    let currency_plane = new THREE.PlaneGeometry(115, 31)
    let currency_shadow_plane = new THREE.PlaneGeometry(120, 36)
    let player_background = new THREE.Mesh(currency_plane, LOADED_MATERIAL[2])
    player_background.position.set(0.25, 242, 0)
    player_background.name = "top_menu_02"
    TOP_MENU.push(player_background)
    UI.add(player_background)
    player_background = new THREE.Mesh(currency_shadow_plane, LOADED_MATERIAL[3])
    player_background.position.set(0.25, 242, -1)
    player_background.name = "top_menu_02"
    TOP_MENU.push(player_background)
    UI.add(player_background)

    let point_geometry = new TextGeometry(PLAYER_DATA.point.toString(), {
        font: LOADED_FONT,
        size: 10,
        height: 0,
        bevelEnabled: false,
    });
    let mesh = new THREE.Mesh(point_geometry, LOADED_MATERIAL[1])
    alignText(point_geometry, mesh, 27.5, 242, 1)
    GAME_NAME.push(mesh)
    UI.add(mesh)

    let currency_logo = new THREE.Mesh(new THREE.PlaneGeometry(30,30), LOADED_TEXTURE["point"])
    currency_logo.position.set(42.5, 242, 2)
    UI.add(currency_logo)
    currency_logo = new THREE.Mesh(new THREE.PlaneGeometry(30,30), LOADED_TEXTURE["gold"])
    currency_logo.position.set(172.5, 242, 2)
    UI.add(currency_logo)

    player_background = new THREE.Mesh(currency_plane, LOADED_MATERIAL[2])
    player_background.position.set(129.25, 242, 0)
    player_background.name = "top_menu_03"
    TOP_MENU.push(player_background)
    UI.add(player_background)
    player_background = new THREE.Mesh(currency_shadow_plane, LOADED_MATERIAL[3])
    player_background.position.set(129.25, 242, -1)
    player_background.name = "top_menu_03"
    TOP_MENU.push(player_background)
    UI.add(player_background)


    point_geometry = new TextGeometry(PLAYER_DATA.gold.toString(), {
        font: LOADED_FONT,
        size: 10,
        height: 0,
        bevelEnabled: false,
    });
    mesh = new THREE.Mesh(point_geometry, LOADED_MATERIAL[1])
    alignText(point_geometry, mesh, 157.5, 242, 1)
    GAME_NAME.push(mesh)
    UI.add(mesh)

    sound_icon = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), LOADED_TEXTURE["sound_off"])
    sound_icon.position.set(214.75, 243.5, 1)
    UI.add(sound_icon)

    player_background = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), LOADED_MATERIAL[2])
    player_background.position.set(214.75, 243.5, 0)
    player_background.name = "top_menu_04"
    TOP_MENU.push(player_background)
    UI.add(player_background)
    player_background = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), LOADED_MATERIAL[3])
    player_background.position.set(219.75, 238.5, -1)
    TOP_MENU.push(player_background)
    UI.add(player_background)
}

function gameLoop() {
        requestAnimationFrame(gameLoop);

        RENDERER.render(SCENE, CAMERA);
        UI_RENDERER.render(UI, UI_CAMERA);
}

function alignText(textGeo, textMesh, x,y,z){
    textGeo.computeBoundingBox();
    const center = textGeo.boundingBox.getCenter(new THREE.Vector3())
    textMesh.updateMatrixWorld();
    center.applyMatrix4(textMesh.matrixWorld);
    textMesh.geometry.translate(x-(2*center.x),y-center.y,z-center.z)
}

function centerText(textGeo, textMesh, x,y,z){
    textGeo.computeBoundingBox();
    const center = textGeo.boundingBox.getCenter(new THREE.Vector3())
    textMesh.updateMatrixWorld();
    center.applyMatrix4(textMesh.matrixWorld);
    textMesh.geometry.translate(x-center.x,y-center.y,z-center.z,)
}

function onWindowResize(){
    CAMERA.aspect = window.innerWidth / window.innerHeight;
    CAMERA.updateProjectionMatrix();
    UI_CAMERA.aspect = window.innerWidth / window.innerHeight;
    UI_CAMERA.updateProjectionMatrix();
    RENDERER.setSize(window.innerWidth, window.innerHeight);
    UI_RENDERER.setSize(window.innerWidth, window.innerHeight);
}
    return (
        <>
            <div id="progress">
                <div id="progress-bar">
                </div>
            </div>
            <div id="ui-holder"></div>
            <div id="canvas-holder"></div>
        </>
    )
}

export default Inventory