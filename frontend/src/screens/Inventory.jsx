import React from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import WebGL from '../WebGL.js';


const Inventory = () => {

    // Variables
    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)
    const FONT_SIZE = 16;

    let CONTAINER
    let UI_CONTAINER

    const SCENE = new THREE.Scene();
    const UI = new THREE.Scene();
    const CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth / window.innerHeight)), (135 * (window.innerWidth / window.innerHeight)), 135, -135, -1000, 1000)
    const UI_CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth / window.innerHeight)), (135 * (window.innerWidth / window.innerHeight)), 135, -135, -1000, 1000)
    const RENDERER = new THREE.WebGLRenderer({
        antialias: false,
    });
    const UI_RENDERER = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true
    });

    let LOADED_FONT = []
    let LOADED_TEXTURE = []
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

    var time, delta, moveTimer = 0;
    var useDeltaTiming = true, weirdTiming = 0;
    var prevTime = performance.now();


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
        initUI()
        initScene()
        initGame()
        window.addEventListener('resize', onWindowResize, false);
    }

    function initManager() {
        MANAGER.onStart = function (managerUrl, itemsLoaded, itemsTotal) {
            console.log('Started loading: ' + managerUrl + '\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };

        MANAGER.onProgress = function (managerUrl, itemsLoaded, itemsTotal) {
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

    function load() {
        initManager()
        FONT_LOADER.load('./Bahnschrift_Regular.json', function (font) {
            LOADED_FONT = font
        });
    }


    function loadPlayerInventory(){
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
    
        if(ACTIVE_PAGE < 0){
            ACTIVE_PAGE = 0
        }
    
        let itemArray = ["Item1","Item2","Item3","Item4","Item5","Item6","Item7","Item","Item","Item","Item","Item","Item", "Item","Item","Item","Item","Item","Item"]
        let base_material = new THREE.MeshBasicMaterial({
            color: 0xcec3c1
        })
        let other_material = new THREE.MeshBasicMaterial({
            color: 0x240115
        })
        let material = new THREE.MeshBasicMaterial({
            color:0xA5908D
        })
        let material2 = new THREE.MeshBasicMaterial({
            color:0x2F131E
        })
        let activeMaterial = new THREE.MeshBasicMaterial({
            color:0x652941
        })
    
        for (let i = 0; i < 6; i++) {
            let category_bg = new THREE.Mesh(new THREE.PlaneGeometry(30,30),material2)
            if(ACTIVE_CATEGORY == i){
                category_bg.material = activeMaterial
            }
            category_bg.position.set(221,192.5-(i*31),-2)
            category_bg.name = "category_0"+i
            CATEGORY.push(category_bg)
            UI.add(category_bg)
        }
    
        if(itemArray.length > 15){
            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 5; i++) {                
                    let item = new THREE.Mesh(new THREE.PlaneGeometry(45,45), material2)
                    item.position.set(-25+(50*i),180-(j*51.5),2)
                    item.name = "item_0"+((j*5)+i)
                    UI.add(item)
                    let item_thumbnail = new THREE.Mesh(new THREE.PlaneGeometry(38,38), material)
                    item_thumbnail.position.set(-25+(50*i),180-(j*51.5),3)
                    ITEM_LIST.push(item)
                    ITEM_LIST.push(item_thumbnail)
                    UI.add(item_thumbnail)
                }
            }
            let item_page = new THREE.Mesh(new THREE.PlaneGeometry(25,25),material2)
            item_page.position.set(25,35,2)
            item_page.name = "button_prev"
            ITEM_LIST.push(item_page)
            UI.add(item_page)
            item_page = new THREE.Mesh(new THREE.PlaneGeometry(25,25),material2)
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
            let page_number = new THREE.Mesh(page_text,material2)
            centerText(page_text, page_number, 75,35,2)
            ITEM_LIST.push(page_number)
            UI.add(page_number)
    
            // item loader (e)
    
        } else {
            let i = 0
            let j = 0
            itemArray.forEach(e => {
                let item = new THREE.Mesh(new THREE.PlaneGeometry(45,45), material2)
                item.position.set(-25+(50*i),175-(j*57.5),2)
                ITEM_LIST.push(item)
                UI.add(item)
    
                let item_thumbnail = new THREE.Mesh(new THREE.PlaneGeometry(38,38), material)
                item_thumbnail.position.set(-25+(50*i),175-(j*57.5),3)
                ITEM_LIST.push(item_thumbnail)
                UI.add(item_thumbnail)
    
                // item loader (e)
                i++
                if(i == 5){
                    j++;
                    i = 0;
                }
            });
        }
    }
    function initRenderer() {
        RENDERER.setSize(window.innerWidth, window.innerHeight)
        RENDERER.setClearColor(0xcec3c1)
    
        UI_RENDERER.setSize(window.innerWidth, window.innerHeight)
        UI_RENDERER.setClearColor(0xcec3c1, 0)
    }

    function initCamera() {
        CAMERA.position.set(0, 0, 0)
        CAMERA.zoom = 2.5
        CAMERA.updateProjectionMatrix();
        CAMERA.rotation.order = 'YXZ';
        CAMERA.rotation.y = - Math.PI / 4;
        CAMERA.rotation.x = Math.atan(- 1 / Math.sqrt(2));

        UI_CAMERA.position.set(20, 140, 150)
        UI_CAMERA.updateProjectionMatrix();
        // UI_CAMERA.rotation.order = 'YXZ';
        // UI_CAMERA.rotation.y = - Math.PI / 4;
        // UI_CAMERA.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
    }

    function initScene() {
        CONTAINER.appendChild(RENDERER.domElement)
        UI_CONTAINER.appendChild(UI_RENDERER.domElement)
    }

    function initUI() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        UI.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        UI.add(dirLight);

        let base_material = new THREE.MeshLambertMaterial({
            color: 0xcec3c1
        })
        let other_material = new THREE.MeshBasicMaterial({
            color: 0x240115
        })
        let material = new THREE.MeshBasicMaterial({
            color: 0xA5908D
        })
        let material2 = new THREE.MeshBasicMaterial({
            color: 0x2F131E
        })    
        let activeMaterial = new THREE.MeshBasicMaterial({
            color:0x652941
        })
    
        let page_text = new TextGeometry("Inventory", {
            font: LOADED_FONT,
            size: 14,
            height: 0,
            bevelEnabled: false,
        });
        let page_mesh = new THREE.Mesh(page_text, other_material)
        centerText(page_text, page_mesh, -122.5, 242, 0)
        TOP_MENU.push(page_mesh)
        UI.add(page_mesh)

        let back_button = new THREE.Mesh(new THREE.PlaneGeometry(38, 38), material2)
        back_button.position.set(-190, 242, -1)
        back_button.name = "button_back"
        TOP_MENU.push(back_button)
        UI.add(back_button)

        let currency_plane = new THREE.PlaneGeometry(109, 31)
        let currency_shadow_plane = new THREE.PlaneGeometry(114, 36)
        let player_background = new THREE.Mesh(currency_plane, material)
        player_background.position.set(-2.75, 242, 0)
        player_background.name = "top_menu_02"
        TOP_MENU.push(player_background)
        UI.add(player_background)
        player_background = new THREE.Mesh(currency_shadow_plane, material2)
        player_background.position.set(-2.75, 242, -1)
        player_background.name = "top_menu_02"
        TOP_MENU.push(player_background)
        UI.add(player_background)

        let point_geometry = new TextGeometry("Player Point", {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        let mesh = new THREE.Mesh(point_geometry, other_material)
        centerText(point_geometry, mesh, -2.75, 242, 1)
        GAME_NAME.push(mesh)
        UI.add(mesh)

        player_background = new THREE.Mesh(currency_plane, material)
        player_background.position.set(126.25, 242, 0)
        player_background.name = "top_menu_03"
        TOP_MENU.push(player_background)
        UI.add(player_background)
        player_background = new THREE.Mesh(currency_shadow_plane, material2)
        player_background.position.set(126.25, 242, -1)
        player_background.name = "top_menu_03"
        TOP_MENU.push(player_background)
        UI.add(player_background)


        point_geometry = new TextGeometry("Player Gold", {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        mesh = new THREE.Mesh(point_geometry, other_material)
        centerText(point_geometry, mesh, 126.25, 242, 1)
        GAME_NAME.push(mesh)
        UI.add(mesh)

        player_background = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), material)
        player_background.position.set(214.75, 243.5, 0)
        player_background.name = "top_menu_04"
        TOP_MENU.push(player_background)
        UI.add(player_background)
        player_background = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), material2)
        player_background.position.set(219.75, 238.5, -1)
        player_background.name = "top_menu_04"
        TOP_MENU.push(player_background)
        UI.add(player_background)

        let save_button = new THREE.Mesh(new THREE.PlaneGeometry(100,30),material2)
        save_button.position.set(-142.5,45,3)
        save_button.name = "button_save"
        UI.add(save_button)
        let save_text = new TextGeometry("Save", {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false
        })
        let save_mesh = new THREE.Mesh(save_text, base_material)
        centerText(save_text,save_mesh, -142.5, 45, 4)
        save_mesh.name = "button_save"
        UI.add(save_mesh)

        // Main UI
        let inventory_bg = new THREE.Mesh(new THREE.PlaneGeometry(270, 200), material2)
        inventory_bg.position.set(75, 115, 0)
        MAIN_UI.push(inventory_bg)
        UI.add(inventory_bg)
        inventory_bg = new THREE.Mesh(new THREE.PlaneGeometry(262, 192), material)
        inventory_bg.position.set(75, 115, 1)
        MAIN_UI.push(inventory_bg)
        UI.add(inventory_bg)

        loadPlayerInventory()

        document.addEventListener("click", function (event) {
            /* which = 1 itu click kiri */
            /* which = 2 itu scroll click */
            /* which = 3 itu click kanan */
            if (event.which == 1) {
                let mouse = {}
                let w = window.innerWidth
                let h = window.innerHeight
                mouse.x = event.clientX / w * 2 - 1
                mouse.y = event.clientY / h * (-2) + 1

                RAYCAST.setFromCamera(mouse, UI_CAMERA)
                let items = RAYCAST.intersectObjects(UI.children, false)
                console.log(items)
                items.forEach(i => {
                    console.log(i.object.name)
                    let obj_name = i.object.name
                    let choice = parseInt(obj_name.charAt(obj_name.length - 1))
                    if (obj_name.startsWith("item_")) {
                        switch (choice) {
                            case 1:
                                break;
                            case 2:
                                break;
                            case 3:
                                break;
                        }
                        items.splice(1,3)
                    } else if(obj_name.startsWith("category_")){
                        switch(choice){
                            case 0:
                                ACTIVE_CATEGORY= 0
                                break;
                            case 1:
                                ACTIVE_CATEGORY= 1
                                break;
                            case 2:
                                ACTIVE_CATEGORY= 2
                                break;
                            case 3:
                                ACTIVE_CATEGORY= 3
                                break;
                            case 4:
                                ACTIVE_CATEGORY= 4
                                break;
                            case 5:
                                ACTIVE_CATEGORY= 5
                                break;
                        }
                        loadPlayerInventory()
                    } else {
                        switch (obj_name) {
                            case "button_back":
                                window.open("../lobby", "_self")
                                break;
                            case "button_save":
                                // Save avatar
                                break;
                            case "button_next":
                                ACTIVE_PAGE++;
                                loadPlayerInventory()
                                break;
                            case "button_prev":
                                ACTIVE_PAGE--;
                                console.log(ACTIVE_PAGE)
                                loadPlayerInventory()
                                break;    
                        }
                    }
                })
            }
        })

    }

    function initGame() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        SCENE.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        SCENE.add(dirLight);

        let material = new THREE.MeshBasicMaterial({
            color: 0xA5908D
        })
        let material2 = new THREE.MeshBasicMaterial({
            color: 0x2F131E
        })
        let player_background = new THREE.Mesh(new THREE.PlaneGeometry(52, 95.5), material)
        player_background.rotation.y = -Math.PI / 4
        player_background.position.set(-16.25, -41.5, -76.25)
        SCENE.add(player_background)

        player_background = new THREE.Mesh(new THREE.PlaneGeometry(51, 95.5), material2)
        player_background.rotation.y = -Math.PI / 4
        player_background.position.set(-0.5, -57.5, -88.25)

        SCENE.add(player_background)
        // SCENE.add(PLAYER_PREVIEW)
    }

function gameLoop() {
        requestAnimationFrame(gameLoop);


        RENDERER.render(SCENE, CAMERA);
        UI_RENDERER.render(UI, UI_CAMERA);
    }

    function centerText(textGeo, textMesh, x, y, z) {
        textGeo.computeBoundingBox();
        const center = textGeo.boundingBox.getCenter(new THREE.Vector3())
        textMesh.updateMatrixWorld();
        center.applyMatrix4(textMesh.matrixWorld);
        textMesh.geometry.translate(x - center.x, y - center.y, z - center.z,)
    }

    function onWindowResize() {
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