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
    const FONT_SIZE = 16;

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
    let GAME_NAME = []
    let BOTTOM_MENU = []
    let TOP_MENU = []
    let EDIT_POPUP = []

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

        //     const geometry = new TextGeometry( 'Available Games:', {
        //         font: LOADED_FONT,
        //         size: FONT_SIZE,
        //         height: 0,
        //         bevelEnabled: false,
        //     } );
        //     let mesh = new THREE.Mesh(geometry,gray_material)
        //     mesh.position.set(65,150,65)
        //     UI.add(mesh)

        // let gameName = ["Congklak", "Gobak Sodor", ""]
        // for (let i = 1; i <= 3; i++) {
        //     const material = new THREE.MeshBasicMaterial({
        //         map: LOADED_TEXTURE["game_"+i],
        //         side: THREE.DoubleSide,
        //         transparent: true
        //     })
        //     const shadow = new THREE.MeshBasicMaterial({
        //         color: 0x151515,
        //         opacity: 0.30,
        //         transparent: true
        //     })
        //     let player_background = new THREE.Mesh(new THREE.PlaneGeometry(100,160), material)
        //     player_background.position.set(-25+(77.5*i),46.5,-25+(77.5*i))
        //     player_background.name = "game_menu_0"+i
        //     player_background.userData = { URL: "../../index.html" }
        //     GAME_MENU.push(player_background)
        //     UI.add(player_background)

        //     player_background = new THREE.Mesh(new THREE.PlaneGeometry(100,160), shadow)
        //     player_background.position.set(-20+(77.5*i),48,-25+(77.5*i))
        //     GAME_MENU.push(player_background)
        //     UI.add(player_background)

        //     if(i != 3){
        //         const material = new THREE.MeshBasicMaterial({
        //             map: LOADED_TEXTURE["help"],
        //             side: THREE.DoubleSide,
        //             transparent: true
        //         })
        //         let player_background = new THREE.Mesh(new THREE.CircleGeometry(10,32), material)
        //         player_background.position.set(-10+(77.5*i),120,10+(77.5*i))
        //         player_background.name = "help_menu_0"+i
        //         UI.add(player_background)
        //     }

        //         const geometry = new TextGeometry( gameName[i-1], {
        //             font: LOADED_FONT,
        //             size: 10,
        //             height: 0,
        //             bevelEnabled: false,
        //         } );
        //         let mesh = new THREE.Mesh(geometry,other_material)
        //         mesh.position.set(-75+(77.5*i),-6,-40+(77.5*i))
        //         GAME_NAME.push(mesh)
        //         UI.add(mesh)
        // }    

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

        const name_geometry = new TextGeometry(userInfo.name, {
            font: LOADED_FONT,
            size: 12,
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
        player_background.name = "top_menu_04"
        TOP_MENU.push(player_background)
        UI.add(player_background)

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
                    if (obj_name.startsWith("help_")) {
                        switch (choice) {
                            case 1:
                                break;
                            case 2:
                                break;
                            case 3:
                                break;
                        }
                        items.splice(0, 2)
                    } else if (obj_name.startsWith("top_")) {
                        switch (choice) {
                            case 1:
                                break;
                            case 2:
                                break;
                            case 3:
                                break;
                            case 4:
                                break;
                            case 5:
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
                            case 3:
                                break;
                        }
                    } else if (obj_name.startsWith("choice_")) {
                        switch (choice) {
                            case 1:
                                window.open(i.object.userData.URL, "_self");
                                break;
                            case 2:
                                window.open(i.object.userData.URL, "_self");
                                break;
                        }
                        items.splice(0, 3)
                    } else if (obj_name.startsWith("game_")) {
                        switch (choice) {
                            case 1:
                                window.open(i.object.userData.URL, "_self");
                                break;
                            case 2:
                                window.open(i.object.userData.URL, "_self");
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

    function editAvatarChoice() {
        if (EDIT_POPUP.length > 0) {
            EDIT_POPUP.forEach(e => {
                UI.remove(e)
            });
            EDIT_POPUP = []
        } else {
            const material = new THREE.MeshBasicMaterial({
                map: LOADED_TEXTURE["edit_avatar_click"],
                side: THREE.DoubleSide,
                transparent: true
            })
            let plane = new THREE.PlaneGeometry(105, 100)
            let mesh = new THREE.Mesh(plane, material)
            mesh.position.set(10, 35, 80)
            EDIT_POPUP.push(mesh)
            UI.add(mesh)

            let button = ["appearance", "closet"]
            for (let i = 0; i < 2; i++) {
                const material = new THREE.MeshBasicMaterial({
                    map: LOADED_TEXTURE[button[i]],
                    side: THREE.DoubleSide,
                    transparent: true
                })
                plane = new THREE.PlaneGeometry(40, 45)
                let choice1 = new THREE.Mesh(plane, material)
                choice1.position.set(-10 + (35 * i), 45, 65 + (35 * i))
                choice1.scale.set(1, 1.075, 1)
                choice1.name = "choice_0" + (i + 1)
                choice1.userData = {
                    URL: "../../pages/player/change" + button[i] + ".html"
                }
                EDIT_POPUP.push(choice1)
                UI.add(choice1)
            }
        }
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

export default Lobby