import React from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import PlayerLoader from '../../src/character/PlayerLoader.js'
import WebGL from '../WebGL.js';
import { useSelector } from "react-redux";



const Lobby = () => {

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)
    const PLAYER_LOADER = new PlayerLoader(userInfo._id);
    let FONT_SIZE = 16;

    let CONTAINER
    let UI_CONTAINER

    const SCENE = new THREE.Scene();
    const UI = new THREE.Scene();
    const CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth / window.innerHeight)), (135 * (window.innerWidth / window.innerHeight)), 135, -135, -1000, 1000)
    const UI_CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth / window.innerHeight)), (135 * (window.innerWidth / window.innerHeight)), 135, -135, -1000, 1000)
    const RENDERER = new THREE.WebGLRenderer({
        antialias: true,
        localClippingEnabled: true
    });
    const UI_RENDERER = new THREE.WebGLRenderer({
        antialias: true,
        localClippingEnabled: true,
        alpha: true
    });

    let LOADED_FONT = []
    let LOADED_TEXTURE = []
    let LOADED_MATERIAL = []
    // const CAMERA_CONTROL = new MapControls(CAMERA, RENDERER.domElement)
    const RAYCAST = new THREE.Raycaster()
    RAYCAST.layers.set = 1
    let PLAYER_PREVIEW
    let GAME_MENU = []
    let ACTIVE_GAME = 0
    let GAME_NAME = []
    let TOP_MENU = []
    let MAIN_UI = []
    let ROOM_UI = []
    let PLAYER_DATA


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
        loadData("/api/users/getData")
        initScene()
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

    async function loadData(url) {
        const response = await fetch(url, {
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

    function load() {
        initManager()
        FONT_LOADER.load('./Bahnschrift_Regular.json', function (font) {
            LOADED_FONT = font
        });

        // Materials
        LOADED_MATERIAL.push(
            new THREE.MeshBasicMaterial({ color: 0xcec3c1 }),
            new THREE.MeshBasicMaterial({ color: 0x240115 }),
            new THREE.MeshBasicMaterial({ color: 0xA5908D }),
            new THREE.MeshBasicMaterial({ color: 0x2F131E })
        )
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
    }

    function initScene() {
        CONTAINER.appendChild(RENDERER.domElement)
        UI_CONTAINER.appendChild(UI_RENDERER.domElement)
    }

    function initUI(loadedData) {
        PLAYER_DATA = loadedData
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        UI.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10);
        UI.add(dirLight);

        loadUI_main()

        let player_background = new THREE.Mesh(new THREE.PlaneGeometry(130.5, 60), LOADED_MATERIAL[2])
        player_background.position.set(-140, 230, 0)
        player_background.name = "top_menu_01"
        TOP_MENU.push(player_background)
        UI.add(player_background)

        let player_name_shadow = new THREE.Mesh(new THREE.PlaneGeometry(130.5, 60), LOADED_MATERIAL[3])
        player_name_shadow.position.set(-135, 225, -1)
        TOP_MENU.push(player_name_shadow)
        UI.add(player_name_shadow)


        let PLAYER_NAME = PLAYER_DATA.name
        if (PLAYER_NAME.length > 8) {
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
        let name_mesh = new THREE.Mesh(name_geometry, LOADED_MATERIAL[1])
        centerText(name_geometry, name_mesh, -140, 230, 1)
        GAME_NAME.push(name_mesh)
        UI.add(name_mesh)

        let player_experience = new THREE.Mesh(new THREE.PlaneGeometry(110.5, 5), LOADED_MATERIAL[3])
        player_experience.position.set(-140, 32.5, 1)
        GAME_NAME.push(player_experience)
        UI.add(player_experience)

        let current_experience = new THREE.Mesh(new THREE.PlaneGeometry(107.5 * (PLAYER_DATA.experience / 588), 2), LOADED_MATERIAL[2])
        let excess = (107.5 - (107.5 * (PLAYER_DATA.experience / 588))) / 2
        current_experience.position.set(-140 - excess, 32.5, 2)
        GAME_NAME.push(current_experience)
        UI.add(current_experience)

        // PLAYER LEVEL DISINI
        let level_text = new TextGeometry(PLAYER_DATA.level.toString(), {
            font: LOADED_FONT,
            size: 8,
            height: 0,
            bevelEnabled: false
        })
        let level_number = new THREE.Mesh(level_text, LOADED_MATERIAL[3])
        centerText(level_text, level_number, -180, 55, 4)
        UI.add(level_number)

        let PLAYER_EXP = PLAYER_DATA.experience
        let experience_text = new TextGeometry(PLAYER_EXP.toString() + "/588", {
            font: LOADED_FONT,
            size: 7,
            height: 0,
            bevelEnabled: false
        })
        let experience_number = new THREE.Mesh(experience_text, LOADED_MATERIAL[3])
        alignText(experience_text, experience_number, -85, 42.5, 3)
        UI.add(experience_number)

        let player_level = new THREE.Mesh(new THREE.CircleGeometry(12.5, 6), LOADED_MATERIAL[0])
        player_level.position.set(-180, 55, 2)
        player_level.rotation.z = Math.PI / 2
        GAME_NAME.push(player_level)
        UI.add(player_level)
        player_level = new THREE.Mesh(new THREE.CircleGeometry(15, 6), LOADED_MATERIAL[3])
        player_level.position.set(-180, 55, 1)
        player_level.rotation.z = Math.PI / 2
        GAME_NAME.push(player_level)
        UI.add(player_level)

        loadUI_currency()
        document.addEventListener("click", function (event) {
            /* which = 1 itu click kiri */
            /* which = 2 itu scroll click */
            /* which = 3 itu click kanan */
            if (event.which === 1) {
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
                        switch (obj_name) {
                            case "help_button":
                                break;
                        }
                    } else if (obj_name.startsWith("top_")) {
                        switch (choice) {
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
                                window.open("../chat", "_self")
                                break;
                        }
                    } else if (obj_name.startsWith("button_")) {
                        switch (obj_name) {
                            case "button_next":
                                ACTIVE_GAME++;
                                if (ACTIVE_GAME > 3) {
                                    ACTIVE_GAME = 0;
                                }
                                changeGameMode()
                                break;
                            case "button_prev":
                                ACTIVE_GAME--;
                                if (ACTIVE_GAME < 0) {
                                    ACTIVE_GAME = 3
                                }
                                changeGameMode()
                                break;
                            case "button_close_choice":
                                loadUI_main()
                                break;
                        }
                    } else if (obj_name.startsWith("play_")) {
                        getPlayrooms(choice, "/api/playrooms/lobby")
                    } else if (obj_name.startsWith("room_")) {
                        window.open("/playroom", "_self")
                    }
                })
            }
        })
    }

    async function getPlayrooms(gameId, url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userInfo.token,
            }
        });
        var data = await response.json()
        if (response) {
            showRoom(gameId, data)
        }
    }

    function showRoom(gameId, data) {
        MAIN_UI.forEach(e => {
            UI.remove(e)
        });
        MAIN_UI = []
        GAME_MENU.forEach(e => {
            UI.remove(e)
        })
        GAME_MENU = []

        let back_arrow = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), LOADED_MATERIAL[0])
        back_arrow.position.set(-45, 200, 100)
        back_arrow.name = "button_close_choice"
        ROOM_UI.push(back_arrow)
        UI.add(back_arrow)

        let room_choice = new THREE.Mesh(new THREE.PlaneGeometry(296, 200), LOADED_MATERIAL[2])
        room_choice.position.set(88, 115, 99)
        ROOM_UI.push(room_choice)
        UI.add(room_choice)
        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < 3; i++) {
                if (i === 2 && j === 1) break;
                let room = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), LOADED_MATERIAL[0])
                room.position.set(20 + (i * 70), 150 - (j * 85), 100)
                room.name = "room_" + gameId + "_" + (i + (j * 3) + 1)
                ROOM_UI.push(room)
                UI.add(room)

                let userCount = data[((gameId - 1) * 5) + (i + (j * 3) + 1)].user_ids.length.toString()
                console.log(userCount)
                let point_geometry = new TextGeometry(userCount + "/10", {
                    font: LOADED_FONT,
                    size: 8,
                    height: 0,
                    bevelEnabled: false,
                });
                let mesh = new THREE.Mesh(point_geometry, LOADED_MATERIAL[1])
                centerText(point_geometry, mesh, 20 + (i * 70), 112.5 - (j * 85), 100)
                ROOM_UI.push(mesh)
                UI.add(mesh)
            }
        }


    }

    function loadUI_main() {

        if (ROOM_UI.length > 0) {
            ROOM_UI.forEach(e => {
                UI.remove(e)
            })
            ROOM_UI = []
        }
        let bottom_menu = ["Shop", "Inventory", "Chat"]
        for (let i = 0; i < bottom_menu.length; i++) {
            let player_background = new THREE.Mesh(new THREE.PlaneGeometry(87, 36), LOADED_MATERIAL[2])
            player_background.position.set(-16.25 + (102 * i), 37.5, 0)
            player_background.name = "bottom_menu_0" + i
            MAIN_UI.push(player_background)
            UI.add(player_background)

            player_background = new THREE.Mesh(new THREE.PlaneGeometry(87, 36), LOADED_MATERIAL[3])
            player_background.position.set(-11.25 + (102 * i), 32.5, -1)
            player_background.name = "bottom_menu_0" + i
            MAIN_UI.push(player_background)
            UI.add(player_background)

            const name_geometry = new TextGeometry(bottom_menu[i], {
                font: LOADED_FONT,
                size: 10,
                height: 0,
                bevelEnabled: false,
            });
            let name_mesh = new THREE.Mesh(name_geometry, LOADED_MATERIAL[1])
            centerText(name_geometry, name_mesh, -16.25 + (102 * i), 37.5, 1)
            MAIN_UI.push(name_mesh)
            UI.add(name_mesh)
        }

        let game_image_material = [LOADED_MATERIAL[0], LOADED_MATERIAL[1], LOADED_MATERIAL[2], LOADED_MATERIAL[3]]

        let game_image = new THREE.Mesh(new THREE.PlaneGeometry(180, 120), game_image_material[ACTIVE_GAME])
        game_image.position.set(90, 155, 2)
        GAME_MENU.push(game_image)
        UI.add(game_image)

        let game_help = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), LOADED_MATERIAL[0])
        game_help.position.set(170, 205, 3)
        game_help.name = "help_button"
        GAME_MENU.push(game_help)
        UI.add(game_help)

        let game_button = new THREE.Mesh(new THREE.PlaneGeometry(115, 45), LOADED_MATERIAL[2])
        game_button.position.set(87.5, 92.5, 4)
        game_button.name = "play_0" + (ACTIVE_GAME + 1)
        GAME_MENU.push(game_button)
        UI.add(game_button)
        game_button = new THREE.Mesh(new THREE.PlaneGeometry(115, 45), LOADED_MATERIAL[3])
        game_button.position.set(92.5, 87.5, 3)
        GAME_MENU.push(game_button)
        UI.add(game_button)

        let game_name = ["Congklak", "Gobak Sodor", "Tarik Tambang", "Balap Karung"]
        let game_text = new TextGeometry("Play\n" + game_name[ACTIVE_GAME], {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false
        })
        let game_text_mesh = new THREE.Mesh(game_text, LOADED_MATERIAL[1])
        centerText(game_text, game_text_mesh, 87.5, 92.5, 5)
        GAME_MENU.push(game_text_mesh)
        UI.add(game_text_mesh)

        let game_next_arrow = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), LOADED_MATERIAL[2])
        game_next_arrow.position.set(170, 97.5, 4)
        GAME_MENU.push(game_next_arrow)
        UI.add(game_next_arrow)
        let game_next = new THREE.Mesh(new THREE.PlaneGeometry(30, 35), LOADED_MATERIAL[2])
        game_next.position.set(170, 97.5, 3)
        game_next.name = "button_next"
        GAME_MENU.push(game_next)
        UI.add(game_next)

        let game_prev_arrow = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), LOADED_MATERIAL[2])
        game_prev_arrow.position.set(10, 97.5, 4)
        GAME_MENU.push(game_prev_arrow)
        UI.add(game_prev_arrow)
        let game_prev = new THREE.Mesh(new THREE.PlaneGeometry(30, 35), LOADED_MATERIAL[2])
        game_prev.position.set(10, 97.5, 3)
        game_prev.name = "button_prev"
        GAME_MENU.push(game_prev)
        UI.add(game_prev)
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
        alignText(point_geometry, mesh, 28.5, 242, 1)
        GAME_NAME.push(mesh)
        UI.add(mesh)

        let currency_logo = new THREE.Mesh(new THREE.PlaneGeometry(22.5, 25), LOADED_MATERIAL[0])
        currency_logo.position.set(45, 242, 2)
        UI.add(currency_logo)
        currency_logo = new THREE.Mesh(new THREE.PlaneGeometry(37.5, 25), LOADED_MATERIAL[0])
        currency_logo.position.set(165, 242, 2)
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
        alignText(point_geometry, mesh, 145, 242, 1)
        GAME_NAME.push(mesh)
        UI.add(mesh)

        let sound_icon = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), LOADED_MATERIAL[0])
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

    function changeGameMode() {
        if (GAME_MENU.length > 0) {
            GAME_MENU.forEach(e => {
                UI.remove(e)
            });
            GAME_MENU = []
        }

        let game_image_material = [LOADED_MATERIAL[0], LOADED_MATERIAL[1], LOADED_MATERIAL[2], LOADED_MATERIAL[3]]

        let game_image = new THREE.Mesh(new THREE.PlaneGeometry(180, 120), game_image_material[ACTIVE_GAME])
        game_image.position.set(90, 155, 2)
        GAME_MENU.push(game_image)
        UI.add(game_image)

        let game_name = ["Congklak", "Gobak Sodor", "Tarik Tambang", "Balap Karung"]
        let game_text = new TextGeometry("Play\n" + game_name[ACTIVE_GAME], {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false
        })
        let game_text_mesh = new THREE.Mesh(game_text, LOADED_MATERIAL[1])
        centerText(game_text, game_text_mesh, 87.5, 92.5, 5)
        GAME_MENU.push(game_text_mesh)
        UI.add(game_text_mesh)

        let game_help = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), LOADED_MATERIAL[0])
        game_help.position.set(170, 205, 3)
        game_help.name = "help_button"
        GAME_MENU.push(game_help)
        UI.add(game_help)

        let game_button = new THREE.Mesh(new THREE.PlaneGeometry(115, 45), LOADED_MATERIAL[2])
        game_button.position.set(87.5, 92.5, 4)
        game_button.name = "play_0" + (ACTIVE_GAME + 1)
        GAME_MENU.push(game_button)
        UI.add(game_button)
        game_button = new THREE.Mesh(new THREE.PlaneGeometry(115, 45), LOADED_MATERIAL[3])
        game_button.position.set(92.5, 87.5, 3)
        GAME_MENU.push(game_button)
        UI.add(game_button)


        let game_next_arrow = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), LOADED_MATERIAL[0])
        game_next_arrow.position.set(170, 97.5, 4)
        GAME_MENU.push(game_next_arrow)
        UI.add(game_next_arrow)
        let game_next = new THREE.Mesh(new THREE.PlaneGeometry(30, 35), LOADED_MATERIAL[2])
        game_next.position.set(170, 97.5, 3)
        game_next.name = "button_next"
        GAME_MENU.push(game_next)
        UI.add(game_next)

        let game_prev_arrow = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), LOADED_MATERIAL[0])
        game_prev_arrow.position.set(10, 97.5, 4)
        GAME_MENU.push(game_prev_arrow)
        UI.add(game_prev_arrow)
        let game_prev = new THREE.Mesh(new THREE.PlaneGeometry(30, 35), LOADED_MATERIAL[2])
        game_prev.position.set(10, 97.5, 3)
        game_prev.name = "button_prev"
        GAME_MENU.push(game_prev)
        UI.add(game_prev)
    }

    function initGame() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        SCENE.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10);
        SCENE.add(dirLight);

        PLAYER_PREVIEW = PLAYER_LOADER.PLAYER.player
        PLAYER_PREVIEW.scale.set(0.85, 0.85, 0.85)
        PLAYER_PREVIEW.position.set(-55, -2.5, -35)

        let player_background = new THREE.Mesh(new THREE.PlaneGeometry(52, 83.5), LOADED_MATERIAL[2])
        player_background.rotation.y = -Math.PI / 4
        player_background.position.set(-15.25, -47.5, -75.25)
        SCENE.add(player_background)

        player_background = new THREE.Mesh(new THREE.PlaneGeometry(51, 83.5), LOADED_MATERIAL[3])
        player_background.rotation.y = -Math.PI / 4
        player_background.position.set(0.5, -63.5, -87.25)

        SCENE.add(player_background)
        SCENE.add(PLAYER_PREVIEW)
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);

        RENDERER.render(SCENE, CAMERA);
        UI_RENDERER.render(UI, UI_CAMERA);
    }

    function alignText(textGeo, textMesh, x, y, z) {
        textGeo.computeBoundingBox();
        const center = textGeo.boundingBox.getCenter(new THREE.Vector3())
        textMesh.updateMatrixWorld();
        center.applyMatrix4(textMesh.matrixWorld);
        textMesh.geometry.translate(x - (2 * center.x), y - center.y, z - center.z)
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