import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import PlayerLoader from '../character/PlayerLoader.js';
import WebGL from '../WebGL.js';
import { useSelector } from "react-redux";
import { io } from "socket.io-client";


const socket = io("http://localhost:5000");

const BalapKarung = () => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const currURL = window.location.href.substring(window.location.href.indexOf('?') + 1, window.location.href.length)

    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER);

    let CONTAINER
    let UI_CONTAINER

    const SCENE = new THREE.Scene();
    const UI = new THREE.Scene();
    const CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth / window.innerHeight)), (135 * (window.innerWidth / window.innerHeight)), 135, -135, -1000, 1000)
    const UI_CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth * 0.4 / window.innerHeight)), (135 * (window.innerWidth * 0.4 / window.innerHeight)), 135, -135, 1, 1000)
    const RENDERER = new THREE.WebGLRenderer({
        antialias: true,
        localClippingEnabled: true
    });
    const UI_RENDERER = new THREE.WebGLRenderer({
        antialias: true,
        localClippingEnabled: true
    });
    const RAYCAST = new THREE.Raycaster()
    const PLAYER_LOADER = new PlayerLoader(userInfo._id)

    let LOADED_FONT, LOADED_MATERIAL = []
    let SHAKE_CAMERA = []
    let POWER = 0, PIVOT = 0, JUMP_PIVOT = [0, 0]
    let TRIANGLE, button_action, text_Mesh
    let JUMP_POINT = [0, 0], CHARA_JUMP = []

    let passed_parameters = []
    let PLAYER_POSITION
    let PLAYER_DATA
    let PLAYER_PLAY
    let PLAYER_READY = false
    let PLAYER_MESH_POSITION = []
    let OTHER_PLAYER = []
    let OTHER_PLAYER_ID
    let OTHER_PLAYER_MESH = []
    let GAME_START
    let READY_UI = []
    let GAME_UI = []
    let end_game = { status: false }
    let ready_button
    let GAME_CHARACTER_1
    let GAME_CHARACTER_2

    var time, delta
    var useDeltaTiming = true, weirdTiming = 0;
    var prevTime = performance.now();
    let pressOnDelay = false
    const PRESS_DELAY = 2


    // Support check
    if (!('getContext' in document.createElement('canvas'))) {
        alert('Sorry, it looks like your browser does not support canvas!');
    }
    if (window.location.href.indexOf('?') > 0) {
        (currURL.split("&")).forEach(e => {
            let temp = e.split("=")
            passed_parameters[temp[0]] = temp[1]
        })
        console.log(passed_parameters)
        if (WebGL.isWebGLAvailable()) {
            // If everything is possible, start the app, otherwise show an error
            load();
            gameLoop();
        } else {
            let warning = WebGL.getWebGLErrorMessage();
            document.body.appendChild(warning);
            throw 'WebGL disabled or not supported';
        }
    } else {
        let warning = WebGL.getWebGLErrorMessage();
        document.body.appendChild(warning);
    }

    function init() {
        // Initiate the Game
        initRenderer()
        initCamera()
        initScene()
        initSocket()
        loadData("/api/users/getData")
        initRaycast()
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
            gameLoop();
            document.getElementById('progress').hidden = true;
            console.log('Loading complete!');
        };
    }

    function load() {
        initManager()
        FONT_LOADER.load('./Bahnschrift_Regular.json', function (font) {
            LOADED_FONT = font
        })
        TEXTURE_LOADER.load('./images/texture/item/sack/bag_big.jpg', function (texture) {
            TEXTURE_LOADER.load('./images/texture/item/sack/bag_big_displaace.png', function (displace) {
                texture.wrapS = THREE.RepeatWrapping
                texture.wrapT = THREE.RepeatWrapping
                texture.repeat.set(1, 1)
                displace.wrapS = THREE.RepeatWrapping
                displace.wrapT = THREE.RepeatWrapping
                displace.repeat.set(1, 1)
                LOADED_MATERIAL["sack"] = new THREE.MeshStandardMaterial({
                    map: texture,
                    displacementMap: displace,
                    displacementScale: 1.5,
                    side: THREE.DoubleSide
                })
            })
        })

    }

    function initRenderer() {
        RENDERER.setSize(window.innerWidth, window.innerHeight)
        RENDERER.setClearColor(0x90B94F)
        RENDERER.shadowMap.enabled = true

        UI_RENDERER.setSize(window.innerWidth * 0.4, window.innerHeight)
        UI_RENDERER.setClearColor(0xFFFFFF)
        UI_RENDERER.shadowMap.enabled = true
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
        if (response) {
            initUI(data)
        }
    }

    function initCamera() {
        CAMERA.position.set(20, 140, 150)
        CAMERA.updateProjectionMatrix();
        CAMERA.rotation.order = 'YXZ';
        CAMERA.rotation.y = - Math.PI / 4;
        CAMERA.rotation.x = Math.atan(- 1 / Math.sqrt(2));

        UI_CAMERA.position.set(20, 140, 150)
        UI_CAMERA.updateProjectionMatrix();
        UI_CAMERA.rotation.order = 'YXZ';
        UI_CAMERA.rotation.y = - Math.PI / 4;
        UI_CAMERA.rotation.x = Math.atan(- 1 / Math.sqrt(2));
    }

    function initScene() {
        CONTAINER.appendChild(RENDERER.domElement)
        UI_CONTAINER.appendChild(UI_RENDERER.domElement)
    }

    function initUI(data) {
        PLAYER_DATA = data
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        UI.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        UI.add(dirLight);

        if (PLAYER_POSITION !== 0) {
            let player_y = [0, 145, 15]
            let name_y = [0, 110, -20]
            let geometry = new TextGeometry(PLAYER_DATA.name, {
                font: LOADED_FONT,
                size: 10,
                height: 0,
                bevelEnabled: false,
            });
            let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
            mesh.rotation.y = -Math.PI / 4
            mesh.position.set(100, name_y[PLAYER_POSITION], 50)
            PLAYER_MESH_POSITION.push(mesh)
            UI.add(mesh)

            let Player1 = PLAYER_LOADER.PLAYER.player
            Player1.position.set(65, player_y[PLAYER_POSITION], 25)
            Player1.scale.set(1.25, 1.25, 1.25)
            PLAYER_MESH_POSITION.push(Player1)
            UI.add(Player1)
        }

        const ui_background = new THREE.PlaneGeometry(180, 120);
        const ui_padding = new THREE.PlaneGeometry(170, 105);
        const ui_status = new THREE.PlaneGeometry(100, 50);
        const ui_btn_background = new THREE.PlaneGeometry(180, 40);
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
        let ui_p1 = new THREE.Mesh(ui_background, ui_pink_dark);
        let ui_p1_padding = new THREE.Mesh(ui_padding, ui_pink);
        let ui_p1_status = new THREE.Mesh(ui_status, ui_pink_light);

        let ui_p2 = new THREE.Mesh(ui_background, ui_blue_dark);
        let ui_p2_padding = new THREE.Mesh(ui_padding, ui_blue);
        let ui_p2_status = new THREE.Mesh(ui_status, ui_blue_light);
        let ui_btn = new THREE.Mesh(ui_btn_background, ui_pink_btn);

        ui_p1.position.set(170, 85, 0)
        ui_p1.rotation.y = -Math.PI / 4
        ui_p2.position.set(170, -45, 0)
        ui_p2.rotation.y = -Math.PI / 4
        ui_p1_padding.position.set(145, 110, 25)
        ui_p1_padding.rotation.y = -Math.PI / 4
        ui_p2_padding.position.set(145, -20, 25)
        ui_p2_padding.rotation.y = -Math.PI / 4
        ui_p1_status.position.set(163, 130, 50)
        ui_p1_status.rotation.y = -Math.PI / 4
        ui_p2_status.position.set(163, 0, 50)
        ui_p2_status.rotation.y = -Math.PI / 4

        ui_btn.rotation.y = -Math.PI / 4
        ui_btn.name = "opt_button"
        ui_btn.position.set(170, -140, 0)

        UI.add(ui_p1)
        UI.add(ui_p2)
        UI.add(ui_p1_padding)
        UI.add(ui_p2_padding)
        UI.add(ui_p1_status)
        UI.add(ui_p2_status)
        UI.add(ui_btn)
    }
    function initSocket() {
        socket.emit("gameroom_enter", {
            _id: userInfo._id,
            roomId: passed_parameters["game_room"]
        }, (response) => {
            response.userList.forEach(e => {
                socket.emit("ask_id", e)
            })
            switch (response.userList.length) {
                case 1:
                    PLAYER_POSITION = 1
                    break;
                case 2:
                    PLAYER_POSITION = 2
                    break;
                default:
                    PLAYER_POSITION = 0
                    break;
            }
            console.log(PLAYER_POSITION)
            socket.emit("gameroom_playerLoaded", {
                _id: userInfo._id,
                name: userInfo.name,
                position: PLAYER_POSITION
            })
        })
        socket.on("gameroom_already_in", param => {
            if (param._id !== userInfo._id) {
                if (param.position !== 0) {
                    loadOtherPlayer(param._id, param.position, param.name)
                }
            }
        })

        socket.on("gameroom_move", param => {
            if (param.power >= 108) {
                if (PLAYER_POSITION === 1) {
                    JUMP_POINT[1] += 1;
                    CHARA_JUMP.push(GAME_CHARACTER_2)
                } else {
                    JUMP_POINT[0] += 1;
                    CHARA_JUMP.push(GAME_CHARACTER_1)
                }
            }
        })

        socket.on("gameroom_timeout", param => {
            prevTime = performance.now()
        })

        socket.on("disconnect", () => {
            end_game = {
                status: true,
                win: false,
                reason: 0
            }

        })

        socket.on("ask_id", e => {
            socket.emit("give_id", {
                to: e,
                _id: userInfo._id,
                name: userInfo.name,
                roomType: "gameroom",
                position: PLAYER_POSITION
            })
        })

        socket.on("gameroom_newPlayer", param => {
            if (param._id !== userInfo._id) {
                if (param.position !== 0) {
                    loadOtherPlayer(param._id, param.position, param.name)
                    if (param.position === 2) {
                        socket.emit("gameroom_playerFilled", {
                            p2: param.socket_id,
                        })
                    }
                }
            }
        })

        socket.on("gameroom_ready_ask", param => {
            showReadyUI()
            PLAYER_PLAY = param
        })

        socket.on("gameroom_ready_check", param => {
            param.ready = PLAYER_READY
            param.timed = true
            // if (PLAYER_POSITION === 1) {
            //     if (PLAYER_READY) {
            //         updateStatus("Siap", "Siap")
            //     } else {
            //         updateStatus("", "Siap")
            //     }
            // } else {
            //     if (PLAYER_READY) {
            //         updateStatus("Siap", "Siap")
            //     } else {
            //         updateStatus("Siap", "")
            //     }
            // }
            socket.emit("gameroom_ready_check", param)
        })

        socket.on("gameroom_start", param => {
            prevTime = performance.now()
            initGame()
            GAME_START = true
        })

        socket.on("room_leave", param => {
            if (passed_parameters["game_room"] === param.room) {
                if (OTHER_PLAYER[param._id]) {
                    if (OTHER_PLAYER_MESH[param._id].length > 0 && PLAYER_POSITION === 2) {
                        PLAYER_POSITION = 1
                        PLAYER_MESH_POSITION.forEach(e => {
                            UI.remove(e)
                        })
                        OTHER_PLAYER_MESH[param._id].forEach(e => {
                            UI.remove(e)
                        })
                        PLAYER_MESH_POSITION = []
                        OTHER_PLAYER_MESH[param._id] = []
                        let player_y = [0, 145, 15]
                        let name_y = [0, 110, -20]
                        let Player1 = PLAYER_LOADER.PLAYER.player
                        Player1.position.set(65, player_y[PLAYER_POSITION], 25)
                        Player1.scale.set(1.25, 1.25, 1.25)
                        PLAYER_MESH_POSITION.push(Player1)
                        UI.add(Player1)

                        let geometry = new TextGeometry(PLAYER_DATA.name, {
                            font: LOADED_FONT,
                            size: 10,
                            height: 0,
                            bevelEnabled: false,
                        });
                        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
                        mesh.rotation.y = -Math.PI / 4
                        mesh.position.set(100, name_y[PLAYER_POSITION], 50)
                        PLAYER_MESH_POSITION.push(mesh)
                        UI.add(mesh)
                        READY_UI.forEach(e => {
                            SCENE.remove(e)
                        })
                        READY_UI = []
                    } else if (OTHER_PLAYER_MESH[param._id].length > 0) {
                        OTHER_PLAYER_MESH[param._id].forEach(e => {
                            UI.remove(e)
                        })
                        READY_UI.forEach(e => {
                            SCENE.remove(e)
                        })
                        READY_UI = []
                    }
                    if (GAME_START) {
                        let temp = {
                            status: true,
                            win: true,
                            reason: 0
                        }
                        end_game = temp
                    }
                    PLAYER_LOADER.OTHER_PLAYER[param._id] = null
                    OTHER_PLAYER[param._id] = null
                }
            }
        })
    }

    function showReadyUI() {
        let ready_bg = new THREE.Mesh(new THREE.PlaneGeometry(160, 150), new THREE.MeshBasicMaterial({ color: 0xffffff }))
        ready_bg.position.set(280, -45, 30)
        ready_bg.rotation.y = -Math.PI / 4
        READY_UI.push(ready_bg)
        SCENE.add(ready_bg)
        let ui_pink_btn = new THREE.MeshBasicMaterial({
            color: 0xFF3366,
        })
        ready_button = new THREE.Mesh(new THREE.PlaneGeometry(120, 33), ui_pink_btn)
        ready_button.position.set(270, -72.5, 40)
        ready_button.rotation.y = -Math.PI / 4
        ready_button.name = "button_ready"
        READY_UI.push(ready_button)
        SCENE.add(ready_button)
        let ready_button_text_geometry = new TextGeometry("Siap!", {
            font: LOADED_FONT,
            size: 12,
            height: 0,
            bevelEnabled: false
        })
        let ready_button_text = new THREE.Mesh(ready_button_text_geometry, new THREE.MeshBasicMaterial({ color: 0xFFFFFF }))
        centerText(ready_button_text_geometry, ready_button_text, 220, 112.5, 100)
        ready_button_text.rotation.y = -Math.PI / 4
        READY_UI.push(ready_button_text)
        SCENE.add(ready_button_text)
        let ready_text_geometry = new TextGeometry("Apakah kamu siap?", {
            font: LOADED_FONT,
            size: 12,
            height: 0,
            bevelEnabled: false
        })
        let ready_text = new THREE.Mesh(ready_text_geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
        centerText(ready_text_geometry, ready_text, 220, 165, 100)
        ready_text.rotation.y = -Math.PI / 4
        READY_UI.push(ready_text)
        SCENE.add(ready_text)
    }

    function loadOtherPlayer(_id, position, name) {
        OTHER_PLAYER_ID = _id
        PLAYER_LOADER.Load(_id)
        OTHER_PLAYER[_id] = PLAYER_LOADER.OTHER_PLAYER[_id]

        let player_y = [0, 145, 15]
        let name_y = [0, 110, -20]
        OTHER_PLAYER[_id].player.position.x = 65
        OTHER_PLAYER[_id].player.position.y = player_y[position]
        OTHER_PLAYER[_id].player.position.z = 25
        OTHER_PLAYER[_id].player.scale.set(1.25, 1.25, 1.25)
        let geometry = new TextGeometry(name, {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        let name_mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
        name_mesh.rotation.y = -Math.PI / 4
        name_mesh.position.set(100, name_y[position], 50)
        OTHER_PLAYER_MESH[_id] = []
        OTHER_PLAYER_MESH[_id].push(name_mesh)
        OTHER_PLAYER_MESH[_id].push(OTHER_PLAYER[_id].player)
        OTHER_PLAYER_MESH[_id].forEach(e => {
            UI.add(e)
        })
    }

    function initGame() {
        READY_UI.forEach(e => {
            SCENE.remove(e)
        })
        READY_UI = []

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        GAME_UI.push(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        GAME_UI.push(dirLight);

        if (PLAYER_POSITION !== 0) {
            switch (PLAYER_POSITION) {
                case 1:
                    GAME_CHARACTER_1 = PLAYER_LOADER.PLAYER.player.clone()
                    GAME_CHARACTER_2 = PLAYER_LOADER.OTHER_PLAYER[OTHER_PLAYER_ID].player.clone()
                    break;
                case 2:
                    GAME_CHARACTER_1 = PLAYER_LOADER.OTHER_PLAYER[OTHER_PLAYER_ID].player.clone()
                    GAME_CHARACTER_2 = PLAYER_LOADER.PLAYER.player.clone()
            }
        }

        GAME_CHARACTER_1.position.set(225, 0, -25)
        GAME_CHARACTER_1.children[1].rotation.x = -Math.PI / 3
        GAME_CHARACTER_1.children[1].position.z += 3.5
        GAME_CHARACTER_1.children[1].position.x += 0.5
        GAME_CHARACTER_1.children[1].position.y += 1.5
        GAME_CHARACTER_1.children[2].rotation.x = -Math.PI / 3
        GAME_CHARACTER_1.children[2].position.z += 3.5
        GAME_CHARACTER_1.children[2].position.x -= 0.5
        GAME_CHARACTER_1.children[2].position.y += 1.5
        GAME_UI.push(GAME_CHARACTER_1)
        GAME_CHARACTER_2.position.set(125, 0, 50)
        GAME_CHARACTER_2.children[1].rotation.x = -Math.PI / 3
        GAME_CHARACTER_2.children[1].position.z += 3.5
        GAME_CHARACTER_2.children[1].position.x += 0.5
        GAME_CHARACTER_2.children[1].position.y += 1.5
        GAME_CHARACTER_2.children[2].rotation.x = -Math.PI / 3
        GAME_CHARACTER_2.children[2].position.z += 3.5
        GAME_CHARACTER_2.children[2].position.x -= 0.5
        GAME_CHARACTER_2.children[2].position.y += 1.5
        GAME_UI.push(GAME_CHARACTER_2)

        let sack = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 25, 10, 512, true), LOADED_MATERIAL["sack"])
        sack.position.set(0, -10, 0)
        GAME_CHARACTER_1.add(sack)
        GAME_CHARACTER_2.add(sack.clone())

        let sky = new THREE.Mesh(new THREE.PlaneGeometry(750, 175), new THREE.MeshBasicMaterial({ color: 0x87CEEB }))
        sky.position.set(450, 0, -50)
        sky.rotation.y = -Math.PI / 4
        GAME_UI.push(sky)

        TRIANGLE = new THREE.Mesh(new THREE.RingGeometry(50, 52, 100, 100), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }))
        TRIANGLE.position.set(175, 0, 285)
        TRIANGLE.rotation.y = - Math.PI / 4
        TRIANGLE.rotation.x = -Math.PI / 4
        TRIANGLE.scale.set(2.2, 2.2, 2.2)
        GAME_UI.push(TRIANGLE)

        let text_Geometry = new TextGeometry("Jump!", {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        text_Mesh = new THREE.Mesh(text_Geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
        text_Mesh.rotation.y = -Math.PI / 4
        text_Mesh.position.set(120, 40, 310)
        GAME_UI.push(text_Mesh)

        button_action = new THREE.Mesh(new THREE.CircleGeometry(50, 100), new THREE.MeshBasicMaterial({ color: 0x87CEEB }))
        button_action.position.set(175, 0, 285)
        button_action.rotation.y = -Math.PI / 4
        button_action.rotation.x = -Math.PI / 4
        button_action.name = "button_action"
        GAME_UI.push(button_action)
        GAME_UI.forEach(e => {
            SCENE.add(e)
        })
    }

    function initRaycast() {
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

                RAYCAST.setFromCamera(mouse, CAMERA)
                // console.log(CAMERA.zoom)
                let items = RAYCAST.intersectObjects(SCENE.children, false)
                items.forEach(i => {
                    if (i.object.name == "button_action" && !pressOnDelay) {
                        let param = PLAYER_PLAY
                        param.power = POWER
                        if (param.power >= 108) {
                            console.log("JUMP!")
                            if (PLAYER_POSITION === 1) {
                                JUMP_POINT[0] += 1;
                                CHARA_JUMP.push(GAME_CHARACTER_1)
                            } else {
                                JUMP_POINT[1] += 1;
                                CHARA_JUMP.push(GAME_CHARACTER_2)
                            }
                            socket.emit("gameroom_move", param)
                        } else {
                            shakeCamera()
                        }
                        prevTime = time
                        pressOnDelay = true
                    } else if (i.object.name === "button_ready") {
                        ready_button.material = new THREE.MeshBasicMaterial({ color: 0x747474 })
                        // if (PLAYER_POSITION === 1) {
                        //     // updateStatus("Siap", "")
                        // } else {
                        //     // updateStatus("", "Siap")
                        // }
                        socket.emit("gameroom_playerReady", PLAYER_PLAY);
                        PLAYER_READY = true
                        items.splice(0, items.length)
                    }
                })
            }
        })
    }

    function shakeCamera() {
        SHAKE_CAMERA.push([4, -4, 2, -2, 2, -2, 3, -3, -1, 1], [4, -4, 2, -2, 2, -2, 3, -3, -1, 1])
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);

        time = performance.now();
        if (GAME_START) {
            if (pressOnDelay) {
                TRIANGLE.visible = false
                button_action.material = new THREE.MeshBasicMaterial({ color: 0xAAAAAA })
                delta = (time - prevTime) / 1000;
                if (delta > PRESS_DELAY) {
                    button_action.material = new THREE.MeshBasicMaterial({ color: 0x87CEEB })
                    PIVOT = 0
                    POWER = 0
                    TRIANGLE.scale.set(2.2, 2.2, 2.2)
                    TRIANGLE.visible = true
                    pressOnDelay = false
                }
            } else {
                if (PIVOT == 0) {
                    POWER += 1;
                    TRIANGLE.scale.x -= 0.01
                    TRIANGLE.scale.y -= 0.01
                    TRIANGLE.scale.z -= 0.01
                    if (POWER == 120) {
                        PIVOT = 1
                        TRIANGLE.visible = false
                    }
                } else {
                    POWER -= 3;
                    if (POWER == 0) {
                        PIVOT = 0
                        TRIANGLE.scale.set(2.2, 2.2, 2.2)
                        TRIANGLE.visible = true
                    }
                }
            }
            if (end_game.status) {
                GAME_UI.forEach(e => {
                    SCENE.remove(e)
                })
                GAME_UI = []
                if (end_game.win) {
                    sendGameResult("/api/users/game-result", end_game)
                }
                GAME_START = false
            }
            if (JUMP_POINT[0] === 10) {
                if (PLAYER_POSITION === 1) {
                    end_game = {
                        status: true,
                        win: true,
                        reason: 1
                    }
                } else {
                    end_game = {
                        status: true,
                        win: false,
                        reason: 1
                    }
                }
            } else if (JUMP_POINT[1] === 10) {
                if (PLAYER_POSITION === 1) {
                    end_game = {
                        status: true,
                        win: false,
                        reason: 1
                    }
                } else {
                    end_game = {
                        status: true,
                        win: true,
                        reason: 1
                    }
                }

            }
        }

        if (SHAKE_CAMERA.length > 0) {
            let x = Math.floor(Math.random() * SHAKE_CAMERA[0].length)
            let z = Math.floor(Math.random() * SHAKE_CAMERA[1].length)
            CAMERA.position.x += SHAKE_CAMERA[0][x];
            SHAKE_CAMERA[0].splice(x, 1)
            CAMERA.position.z += SHAKE_CAMERA[1][z];
            SHAKE_CAMERA[1].splice(z, 1)

            if (SHAKE_CAMERA[0].length === 0) {
                SHAKE_CAMERA.pop()
                SHAKE_CAMERA.pop()
                prevTime = time
                pressOnDelay = true
            }
        }
        if (CHARA_JUMP.length > 0) {
            JUMP_PIVOT[0]++;
            CHARA_JUMP[0].position.x += 1
            CHARA_JUMP[0].position.z += 1
            if (JUMP_PIVOT[1] === 0) {
                CHARA_JUMP[0].position.y += 1
                if (JUMP_PIVOT[0] === 10) {
                    JUMP_PIVOT[1] = 1
                }
            } else if (JUMP_PIVOT[1] === 1) {
                CHARA_JUMP[0].position.y -= 1
                if (JUMP_PIVOT[0] === 20) {
                    JUMP_PIVOT[0] = 0
                    JUMP_PIVOT[1] = 0
                    CHARA_JUMP.shift()
                }
            }
            if (JUMP_POINT[0] > 3) {
                CAMERA.position.x += 1
                CAMERA.position.z += 1
                TRIANGLE.position.x += 1
                TRIANGLE.position.z += 1
                button_action.position.x += 1
                button_action.position.z += 1
                text_Mesh.position.x += 1
                text_Mesh.position.z += 1
            }
        }


        RENDERER.render(SCENE, CAMERA);
        UI_RENDERER.render(UI, UI_CAMERA);
    }

    async function sendGameResult(url, end_game) {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userInfo.token,
            },
            body: JSON.stringify({
                "game_name": "Balap Karung",
                "win_player_id": userInfo._id,
                "lose_player_id": OTHER_PLAYER_ID,
                "reason": end_game.reason
            })
        });
        var data = await response.json()
        if (response) {
            showEndScreen(end_game)
        }
    }

    function showEndScreen(end_game) {
        let ready_bg = new THREE.Mesh(new THREE.PlaneGeometry(80, 50), new THREE.MeshBasicMaterial({ color: 0xffffff }))
        ready_bg.position.set(280, -45, 30)
        ready_bg.rotation.y = -Math.PI / 4
        SCENE.add(ready_bg)
        let ui_pink_btn = new THREE.MeshBasicMaterial({
            color: 0xFF3366,
        })
        ready_button = new THREE.Mesh(new THREE.PlaneGeometry(60, 12.5), ui_pink_btn)
        ready_button.position.set(270, -72.5, 40)
        ready_button.rotation.y = -Math.PI / 4
        ready_button.name = "button_back"
        SCENE.add(ready_button)
        let string
        if (end_game.reason === 2) {
            string = "Hasil seri!"
        } else if (end_game.win) {
            string = "Kamu menang"
        } else {
            string = "Kamu kalah"
        }
        let ready_button_text_geometry = new TextGeometry("Kembali", {
            font: LOADED_FONT,
            size: 12,
            height: 0,
            bevelEnabled: false
        })
        let ready_button_text = new THREE.Mesh(ready_button_text_geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }))
        centerText(ready_button_text_geometry, ready_button_text, 220, 112.5, 100)
        ready_button_text.rotation.y = -Math.PI / 4
        SCENE.add(ready_button_text)
        let ready_text_geometry = new TextGeometry(string, {
            font: LOADED_FONT,
            size: 12,
            height: 0,
            bevelEnabled: false
        })
        let ready_text = new THREE.Mesh(ready_text_geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
        centerText(ready_text_geometry, ready_text, 220, 165, 100)
        ready_text.rotation.y = -Math.PI / 4
        SCENE.add(ready_text)
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
        RENDERER.setSize(window.innerWidth, window.innerHeight);
        UI_CAMERA.aspect = window.innerWidth / window.innerHeight;
        UI_CAMERA.updateProjectionMatrix();
        UI_RENDERER.setSize(window.innerWidth * 0.4, window.innerHeight);
    }
    return (
        <div>
            <>
                <div id="progress">
                    <div id="progress-bar">
                    </div>
                </div>
                <div id="ui-holder"></div>
                <div id="canvas-holder"></div>
            </>
        </div>
    )
}

export default BalapKarung