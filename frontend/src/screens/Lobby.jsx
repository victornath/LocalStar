import React from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
//import PlayerLoader from '../character/PlayerLoader.js';
import WebGL from '../WebGL.js';
import { useSelector } from "react-redux";



const Lobby = () => {

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)
    // const PLAYER_LOADER = new PlayerLoader();
    let FONT_SIZE = 16;

    let CONTAINER
    let UI_CONTAINER

    const SCENE = new THREE.Scene();
    const UI = new THREE.Scene();
    const CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth / window.innerHeight)), (135 * (window.innerWidth / window.innerHeight)), 135, -135, -1000, 1000)
    const UI_CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth / window.innerHeight)), (135 * (window.innerWidth / window.innerHeight)), 135, -135, -1000, 1000)
    const RENDERER = new THREE.WebGLRenderer({
        antialias: false,
        localClippingEnabled: true
    });
    const UI_RENDERER = new THREE.WebGLRenderer({
        antialias: false,
        localClippingEnabled: true,
        alpha: true
    });

    let LOADED_FONT = []
    let LOADED_TEXTURE = []
    // const CAMERA_CONTROL = new MapControls(CAMERA, RENDERER.domElement)
    const RAYCAST = new THREE.Raycaster()
    RAYCAST.layers.set = 1
    let PLAYER_PREVIEW
    let GAME_MENU = []
    let ACTIVE_GAME = 0
    let GAME_NAME = []
    let BOTTOM_MENU = []
    let TOP_MENU = []
    
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
            // Only allow control once content is fully loaded
            // CANVAS_HOLDER.addEventListener('click', function () {
            //     CONTROLS.lock();
            // }, false);

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

    function initRenderer() {
        RENDERER.setSize(window.innerWidth, window.innerHeight)
        RENDERER.setClearColor(0xcec3c1)
        RENDERER.shadowMap.enabled = true

        UI_RENDERER.setSize(window.innerWidth, window.innerHeight)
        UI_RENDERER.setClearColor(0xcec3c1, 0)
        UI_RENDERER.shadowMap.enabled = true

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

        let base_material = new THREE.MeshBasicMaterial({
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

        let bottom_menu = ["Shop", "Inventory", "Friends"]
        for (let i = 0; i < 3; i++) {
            let player_background = new THREE.Mesh(new THREE.PlaneGeometry(87, 36), material)
            player_background.position.set(-16.25 + (102 * i), 37.5, 0)
            player_background.name = "bottom_menu_0" + i
            BOTTOM_MENU.push(player_background)
            UI.add(player_background)

            player_background = new THREE.Mesh(new THREE.PlaneGeometry(87, 36), material2)
            player_background.position.set(-11.25 + (102 * i), 32.5, -1)
            player_background.name = "bottom_menu_0" + i
            BOTTOM_MENU.push(player_background)
            UI.add(player_background)

            const name_geometry = new TextGeometry(bottom_menu[i], {
                font: LOADED_FONT,
                size: 10,
                height: 0,
                bevelEnabled: false,
            });
            let name_mesh = new THREE.Mesh(name_geometry, other_material)
            centerText(name_geometry, name_mesh, -16.25 + (102 * i), 37.5, 1)
            GAME_NAME.push(name_mesh)
            UI.add(name_mesh)

        }

        let player_background = new THREE.Mesh(new THREE.PlaneGeometry(130.5, 60), material)
        player_background.position.set(-140, 230, 0)
        player_background.name = "top_menu_01"
        TOP_MENU.push(player_background)
        UI.add(player_background)

        let player_name_shadow = new THREE.Mesh(new THREE.PlaneGeometry(130.5, 60), material2)
        player_name_shadow.position.set(-135, 225, -1)
        player_name_shadow.name = "top_menu_01"
        TOP_MENU.push(player_name_shadow)
        UI.add(player_name_shadow)

        let PLAYER_NAME = userInfo.name
        if(PLAYER_NAME.length > 8){
            FONT_SIZE = 8.5
        } else {
            FONT_SIZE = 12
        }    

        const name_geometry = new TextGeometry(PLAYER_NAME, {
            font: LOADED_FONT,
            size: FONT_SIZE,
            height: 0,
            bevelEnabled: false,
        });
        let name_mesh = new THREE.Mesh(name_geometry, other_material)
        centerText(name_geometry, name_mesh, -140, 230, 1)
        GAME_NAME.push(name_mesh)
        UI.add(name_mesh)

        let player_experience = new THREE.Mesh(new THREE.PlaneGeometry(110.5, 5), material2)
        player_experience.position.set(-140, 32.5, 1)
        GAME_NAME.push(player_experience)
        UI.add(player_experience)
        let current_experience = new THREE.Mesh(new THREE.PlaneGeometry(107.5*(354/588),2), material)
        let excess = (107.5 - (107.5*(354/588)))/2
        current_experience.position.set(-140-excess,32.5,2)
        GAME_NAME.push(current_experience)
        UI.add(current_experience)
    
        // PLAYER LEVEL DISINI
        let level_text = new TextGeometry("3",{
            font: LOADED_FONT,
            size: 8,
            height: 0,
            bevelEnabled: false
        })
        let level_number = new THREE.Mesh(level_text, material2)
        centerText(level_text,level_number, -180,55,4)
        UI.add(level_number)
     
        let experience_text = new TextGeometry("354/588",{
            font: LOADED_FONT,
            size: 7,
            height: 0,
            bevelEnabled: false
        })
        let experience_number = new THREE.Mesh(experience_text, material2)
        alignText(experience_text,experience_number, -85,42.5,3)
        UI.add(experience_number)
        
        let player_level = new THREE.Mesh(new THREE.CircleGeometry(12.5, 6), base_material)
        player_level.position.set(-180, 55, 2)
        player_level.rotation.z = Math.PI / 2
        GAME_NAME.push(player_level)
        UI.add(player_level)
        player_level = new THREE.Mesh(new THREE.CircleGeometry(15, 6), material2)
        player_level.position.set(-180, 55, 1)
        player_level.rotation.z = Math.PI / 2
        GAME_NAME.push(player_level)
        UI.add(player_level)

        let currency_plane = new THREE.PlaneGeometry(109, 31)
        let currency_shadow_plane = new THREE.PlaneGeometry(114, 36)
        player_background = new THREE.Mesh(currency_plane, material)
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
        TOP_MENU.push(player_background)
        UI.add(player_background)

        let game_image_material = [base_material,other_material,material,material2]
    
        let game_image = new THREE.Mesh(new THREE.PlaneGeometry(180,120), game_image_material[ACTIVE_GAME])
        game_image.position.set(90,155,2)
        GAME_MENU.push(game_image)
        UI.add(game_image)
    
        let game_help = new THREE.Mesh(new THREE.PlaneGeometry(15,15), material)
        game_help.position.set(170,205,3)
        game_help.name = "help_button"
        UI.add(game_help)
    
        let game_button = new THREE.Mesh(new THREE.PlaneGeometry(115,45), material)
        game_button.position.set(87.5,92.5,4)
        game_button.name = "play_0"+ACTIVE_GAME
        GAME_MENU.push(game_button)
        UI.add(game_button)
        game_button = new THREE.Mesh(new THREE.PlaneGeometry(115,45), material2)
        game_button.position.set(92.5,87.5,3)
        GAME_MENU.push(game_button)
        UI.add(game_button)
    
        let game_name = ["Congklak","Gobak Sodor","Tarik Tambang","Balap Karung"]
        let game_text = new TextGeometry("Play\n"+game_name[ACTIVE_GAME], {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false
        })
        let game_text_mesh = new THREE.Mesh(game_text, other_material)
        centerText(game_text,game_text_mesh,87.5,92.5,5)
        GAME_MENU.push(game_text_mesh)
        UI.add(game_text_mesh)
    
        let game_next = new THREE.Mesh(new THREE.PlaneGeometry(30,35), material)
        game_next.position.set(170,97.5,3)
        game_next.name = "button_next"
        UI.add(game_next)
    
        let game_prev = new THREE.Mesh(new THREE.PlaneGeometry(30,35), material)
        game_prev.position.set(10,97.5,3)
        game_prev.name = "button_prev"
        UI.add(game_prev)

        document.addEventListener("click", function (event) {
            /* which = 1 itu click kiri */
            /* which = 2 itu scroll click */
            /* which = 3 itu click kanan */
            if (event.which == 1) {
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
                    let choice = parseInt(obj_name.charAt(obj_name.length-1))
                    if(obj_name.startsWith("help_")){
                        switch(obj_name){
                            case "help_button":
                                break;
                        }
                    } else if (obj_name.startsWith("top_")){
                        switch(choice){
                            case 1:
                                // Link to Edit Profile
                                break;
                            case 2:
                                break;
                            case 3:
                                break;
                            case 4:
                                // Mute / Unmute Sound
                                break;
                        }
                    } else if (obj_name.startsWith("bottom_")) {
                        switch (choice) {
                            case 0:
                                window.open("../shop", "_self")
                                break;
                            case 1:
                                window.open("../inventory", "_self")
                                break;
                            case 2:
                                window.open("../pages/friends.html", "_self")
                                break;
                        }
                    } else if(obj_name.startsWith("button_")){
                            switch(obj_name){
                                case "button_next":
                                    ACTIVE_GAME++;
                                    if(ACTIVE_GAME > 3){
                                        ACTIVE_GAME = 0;
                                    }
                                    changeGameMode()
                                    break;
                                case "button_prev":
                                    ACTIVE_GAME--;
                                    if(ACTIVE_GAME < 0){
                                        ACTIVE_GAME = 3
                                    }
                                    changeGameMode()
                                    break;
                                }
                        } else if (obj_name.startsWith("play_")){
                            switch(choice){
                                case 0:
                                    break;
                                case 1:
                                    break;
                                case 2:
                                    break;
                                case 3:
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

        // PLAYER_PREVIEW = PLAYER_LOADER.Load()
        // PLAYER_PREVIEW.scale.set(0.75,0.75,0.75)
        // PLAYER_PREVIEW.position.set(-55,-4,-35)

        let material = new THREE.MeshBasicMaterial({
            color: 0xA5908D
        })
        let material2 = new THREE.MeshBasicMaterial({
            color: 0x2F131E
        })
        let player_background = new THREE.Mesh(new THREE.PlaneGeometry(52, 83.5), material)
        player_background.rotation.y = -Math.PI / 4
        player_background.position.set(-15.25, -47.5, -75.25)
        SCENE.add(player_background)

        player_background = new THREE.Mesh(new THREE.PlaneGeometry(51, 83.5), material2)
        player_background.rotation.y = -Math.PI / 4
        player_background.position.set(0.5, -63.5, -87.25)

        SCENE.add(player_background)
        SCENE.add(PLAYER_PREVIEW)
    }

    function changeGameMode(){
        if(GAME_MENU.length > 0){
            GAME_MENU.forEach(e => {
                UI.remove(e)
            });
        }

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

        let game_image_material = [base_material,other_material,material,material2]
        
        let game_image = new THREE.Mesh(new THREE.PlaneGeometry(180,120), game_image_material[ACTIVE_GAME])
        game_image.position.set(90,155,2)
        GAME_MENU.push(game_image)
        UI.add(game_image)
        
        let game_name = ["Congklak","Gobak Sodor","Tarik Tambang","Balap Karung"]
        let game_text = new TextGeometry("Play\n"+game_name[ACTIVE_GAME], {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false
        })
        let game_text_mesh = new THREE.Mesh(game_text, other_material)
        centerText(game_text,game_text_mesh,87.5,92.5,5)
        GAME_MENU.push(game_text_mesh)
        UI.add(game_text_mesh)
        
        let game_button = new THREE.Mesh(new THREE.PlaneGeometry(115,45), material)
        game_button.position.set(87.5,92.5,4)
        game_button.name = "play_0"+ACTIVE_GAME
        GAME_MENU.push(game_button)
        UI.add(game_button)
        game_button = new THREE.Mesh(new THREE.PlaneGeometry(115,45), material2)
        game_button.position.set(92.5,87.5,3)
        GAME_MENU.push(game_button)
        UI.add(game_button)
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

export default Lobby