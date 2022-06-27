import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import Congklak_big from "../3DObject/congklak_game_board.js";
import Desk from "../3DObject/desk.js";
import PlayerLoader from '../character/PlayerLoader.js';
import WebGL from '../WebGL.js';
import { useSelector } from "react-redux";
import { io } from "socket.io-client";


const socket = io("http://localhost:5000");

const Congklak = () => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const currURL = window.location.href.substring(window.location.href.indexOf('?') + 1, window.location.href.length)

    // Variables
    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);

    let CONTAINER
    let UI_CONTAINER
    let PLAYER_POSITION
    let PLAYER_MESH_POSITION = []
    let OTHER_PLAYER = []
    let OTHER_PLAYER_MESH = []
    let OTHER_PLAYER_ID
    let PLAYER_DATA
    let PLAYER_PLAY
    let PLAYER_READY = false, GAME_START = false, TIMEOUT_COUNTER = 0
    let READY_UI = []
    let GAME_UI = []

    const SCENE = new THREE.Scene();
    const UI = new THREE.Scene();
    const CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth / window.innerHeight)), (135 * (window.innerWidth / window.innerHeight)), 135, -135, 1, 1000)
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
    const BOARD = new Congklak_big().group
    const DESK = new Desk().group
    let ready_button
    let PLAYER_LOADER = new PlayerLoader(userInfo._id)

    var curr_turn = 1;
    var end_game = { status: false }
    var ONGOING_TURN = false;
    var PLAYER_CHOOSE = null;
    let PENDING_CHOOSE = []
    let LOADED_FONT;
    let LOADED_MATERIAL = []

    let ui_p1, ui_p2;
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
    let s_circle_p1 = [7, 7, 7, 7, 7, 7, 7];
    let b_circle = [0, 0];
    let s_circle_p2 = [7, 7, 7, 7, 7, 7, 7];
    let p1_loc = [32, 43, 54, 65, 76, 87, 98]
    let p2_loc = [98, 87, 76, 65, 54, 43, 32]
    let p1_big = 115
    let p2_big = 15
    let passed_parameters = []

    const hand = new THREE.Mesh(new THREE.BoxGeometry(5, 13, 5), new THREE.MeshLambertMaterial({ color: 0xffdbac }))

    var time, delta, moveTimer = 0;
    var useDeltaTiming = true, weirdTiming = 0;
    var prevTime = performance.now();


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
        initSocket()
        initRaycast()
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
        })

        //Materials
        LOADED_MATERIAL.push(
            new THREE.MeshBasicMaterial({ color: 0xFFCECE }),         // 0. Player 1 Base
            new THREE.MeshBasicMaterial({ color: 0xFFF2F2 }),         // 1. Player 1 Light
            new THREE.MeshBasicMaterial({ color: 0xFF5D79 }),         // 2. Player 1 Dark
            new THREE.MeshBasicMaterial({ color: 0xBCE5FB }),         // 3. Player 2 base
            new THREE.MeshBasicMaterial({ color: 0xEBF8FF }),         // 4. Player 2 Light
            new THREE.MeshBasicMaterial({ color: 0x0B97F4 }),         // 5. Player 2 Dark
            new THREE.MeshBasicMaterial({ color: 0xFF3366 }),         // 6. Button
            new THREE.MeshBasicMaterial({ color: 0x000000 }),         // 7. Text Color
            new THREE.MeshLambertMaterial({ color: 0xFFFFFF }),       // 8. Biji Congklak
            new THREE.MeshBasicMaterial({ color: 0x36594E }),         // 9. Lubang Papan Congklak
            new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),         //10. Text Color 2
            new THREE.MeshBasicMaterial({ color: 0x747474 }),         //11. Button Disabled
        )
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

    function initRenderer() {
        RENDERER.setSize(window.innerWidth, window.innerHeight)
        RENDERER.setClearColor(0x90B94F)
        RENDERER.shadowMap.enabled = true

        UI_RENDERER.setSize(window.innerWidth * 0.4, window.innerHeight)
        UI_RENDERER.setClearColor(0xFFFFFF)
        UI_RENDERER.shadowMap.enabled = true

    }

    function initCamera() {
        CAMERA.position.set(20, 140, 150)
        CAMERA.zoom = 2.2;
        CAMERA.updateProjectionMatrix();
        CAMERA.rotation.order = 'YXZ';
        CAMERA.rotation.y = 0;
        CAMERA.rotation.x = -1.5;

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

    function initUI(playerData) {
        PLAYER_DATA = playerData
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        UI.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        UI.add(dirLight);

        const ui_background = new THREE.PlaneGeometry(180, 120);
        const ui_padding = new THREE.PlaneGeometry(170, 105);
        const ui_status = new THREE.PlaneGeometry(100, 50);
        const ui_btn_background = new THREE.PlaneGeometry(180, 40);
        ui_p1 = new THREE.Mesh(ui_background, LOADED_MATERIAL[2]);
        let ui_p1_padding = new THREE.Mesh(ui_padding, LOADED_MATERIAL[0]);
        let ui_p1_status = new THREE.Mesh(ui_status, LOADED_MATERIAL[1]);

        ui_p2 = new THREE.Mesh(ui_background, LOADED_MATERIAL[5]);
        let ui_p2_padding = new THREE.Mesh(ui_padding, LOADED_MATERIAL[3]);
        let ui_p2_status = new THREE.Mesh(ui_status, LOADED_MATERIAL[4]);
        let ui_btn = new THREE.Mesh(ui_btn_background, LOADED_MATERIAL[6]);

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

        if (PLAYER_POSITION !== 0) {
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
            let mesh = new THREE.Mesh(geometry, LOADED_MATERIAL[7])
            mesh.rotation.y = -Math.PI / 4
            mesh.position.set(100, name_y[PLAYER_POSITION], 50)
            PLAYER_MESH_POSITION.push(mesh)
            UI.add(mesh)
        }

        SCENE.add(ambientLight.clone());
        SCENE.add(dirLight.clone());

        DESK.position.set(65, -90, 145)
        DESK.scale.set(3, 3, 3)
        hand.position.set(0, 0, 0)
        hand.rotation.x = - Math.PI / 2
        hand.scale.set(1.7, 1.7, 1.7)

        // UI.add(Player2)
        UI.add(ui_p1)
        UI.add(ui_p2)
        UI.add(ui_p1_padding)
        UI.add(ui_p2_padding)
        UI.add(ui_p1_status)
        UI.add(ui_p2_status)
        UI.add(ui_btn)
        // UI.add(mesh)
        SCENE.add(hand)
        SCENE.add(DESK)
    }

    function updateStatus(status1, status2) {
        if (ui_status.length > 0) {
            ui_status.forEach(e => {
                UI.remove(e)
            });
            ui_status = []
        }
        let statusText = [status1, status2]
        for (let i = 0; i < 2; i++) {
            let geometry = new TextGeometry(statusText[i], {
                font: LOADED_FONT,
                size: 10,
                height: 0,
                bevelEnabled: false,
            });
            let mesh = new THREE.Mesh(geometry, LOADED_MATERIAL[7])
            mesh.rotation.y = -Math.PI / 4
            mesh.position.set(100, 155 - (i * 130), 50)
            ui_status.push(mesh)
            UI.add(mesh)
        }
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
            if (PLAYER_CHOOSE !== null) {
                PLAYER_CHOOSE = param.choose
            } else {
                PENDING_CHOOSE.push(param.choose)
            }
        })

        socket.on("gameroom_timeout", param => {
            prevTime = performance.now()
            if (curr_turn === 1) { curr_turn = 2 } else { curr_turn = 1 }
            distributeSeed(s_circle_p1, b_circle[0], s_circle_p2, b_circle[1]);
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
            if (PLAYER_POSITION === 1) {
                if (PLAYER_READY) {
                    updateStatus("Siap", "Siap")
                } else {
                    updateStatus("", "Siap")
                }
            } else {
                if (PLAYER_READY) {
                    updateStatus("Siap", "Siap")
                } else {
                    updateStatus("Siap", "")
                }
            }
            socket.emit("gameroom_ready_check", param)
        })

        socket.on("gameroom_start", param => {
            prevTime = performance.now()
            initGame()
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
                        let mesh = new THREE.Mesh(geometry, LOADED_MATERIAL[7])
                        mesh.rotation.y = -Math.PI / 4
                        mesh.position.set(100, name_y[PLAYER_POSITION], 50)
                        PLAYER_MESH_POSITION.push(mesh)
                        UI.add(mesh)
                        READY_UI.forEach(e => {
                            UI.remove(e)
                        })
                        READY_UI = []
                    } else if (OTHER_PLAYER_MESH[param._id].length > 0) {
                        OTHER_PLAYER_MESH[param._id].forEach(e => {
                            UI.remove(e)
                        })
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
        let ready_bg = new THREE.Mesh(new THREE.PlaneGeometry(80, 50), LOADED_MATERIAL[10])
        ready_bg.position.set(66.5, 10.3, 140)
        ready_bg.rotation.x = -Math.PI / 2
        READY_UI.push(ready_bg)
        SCENE.add(ready_bg)
        ready_button = new THREE.Mesh(new THREE.PlaneGeometry(60, 12.5), LOADED_MATERIAL[6])
        ready_button.position.set(66.5, 15, 155)
        ready_button.rotation.x = -Math.PI / 2
        ready_button.name = "button_ready"
        READY_UI.push(ready_button)
        SCENE.add(ready_button)
        let ready_button_text_geometry = new TextGeometry("Siap!", {
            font: LOADED_FONT,
            size: 5,
            height: 0,
            bevelEnabled: false
        })
        let ready_button_text = new THREE.Mesh(ready_button_text_geometry, LOADED_MATERIAL[10])
        centerText(ready_button_text_geometry, ready_button_text, 66.5, -100, 155)
        ready_button_text.rotation.x = -Math.PI / 3
        READY_UI.push(ready_button_text)
        SCENE.add(ready_button_text)
        let ready_text_geometry = new TextGeometry("Apakah kamu siap?", {
            font: LOADED_FONT,
            size: 5,
            height: 0,
            bevelEnabled: false
        })
        let ready_text = new THREE.Mesh(ready_text_geometry, LOADED_MATERIAL[7])
        centerText(ready_text_geometry, ready_text, 66.5, -75, 155)
        ready_text.rotation.x = -Math.PI / 3
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
        let name_mesh = new THREE.Mesh(geometry, LOADED_MATERIAL[7])
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
        GAME_START = true
        if (READY_UI.length > 0) {
            READY_UI.forEach(e => {
                SCENE.remove(e)
            })
            READY_UI = []
        }

        BOARD.position.set(10, 0, 130)
        GAME_UI.push(BOARD)
        SCENE.add(BOARD)

        for (let i = 0; i < 8; i++) {
            const box_geometry = RoundedRectangle(-5, 20, 15, 15)
            let mesh = new THREE.Mesh(box_geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
            mesh.scale.set(0.25, 0.25, 0.25)
            mesh.rotation.x = -Math.PI / 2
            if (i == 0) {
                mesh.position.set(p2_big, 10.2, 162)
            } else {
                if (i % 2 == 1) {
                    mesh.position.set(p1_loc[i - 1], 10.2, 162)
                } else {
                    mesh.position.set(p1_loc[i - 1], 10.2, 172)
                }
            }
            GAME_UI.push(mesh)
            SCENE.add(mesh)
            mesh = new THREE.Mesh(box_geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
            mesh.scale.set(0.25, 0.25, 0.25)
            mesh.rotation.x = -Math.PI / 2
            if (i == 0) {
                mesh.position.set(p1_big, 10.2, 123)
            } else {
                if (i % 2 == 1) {
                    mesh.position.set(p1_loc[i - 1], 10.2, 123)
                } else {
                    mesh.position.set(p1_loc[i - 1], 10.2, 113)
                }
            }
            GAME_UI.push(mesh)
            SCENE.add(mesh)
        }

        distributeSeed(s_circle_p1, b_circle[0], s_circle_p2, b_circle[1]);
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
                let items = RAYCAST.intersectObjects(SCENE.children, false)
                items.forEach(i => {
                    if (i.object.name == "button_ready") {
                        ready_button.material = LOADED_MATERIAL[11]
                        if (PLAYER_POSITION === 1) {
                            updateStatus("Siap", "")
                        } else {
                            updateStatus("", "Siap")
                        }
                        socket.emit("gameroom_playerReady", PLAYER_PLAY);
                        PLAYER_READY = true
                    } else {
                        if (PLAYER_CHOOSE == null && curr_turn === PLAYER_POSITION) {
                            if (PLAYER_POSITION === 1) {
                                if (i.object.name.startsWith("player1") && s_circle_p1[parseInt(i.object.name.charAt(12))] > 0) {
                                    let param = PLAYER_PLAY
                                    param.choose = i.object.name
                                    PLAYER_CHOOSE = i.object.name
                                    socket.emit("gameroom_move", param)
                                }
                            } else if (PLAYER_POSITION === 2) {
                                if (i.object.name.startsWith("player2") && s_circle_p2[parseInt(i.object.name.charAt(12))] > 0) {
                                    let param = PLAYER_PLAY
                                    param.choose = i.object.name
                                    PLAYER_CHOOSE = i.object.name
                                    socket.emit("gameroom_move", param)
                                }
                            }
                        } else {
                            console.log("PLAYER_CHOOSE is not empty")
                        }
                    }
                })
            }
        })
    }

    function distributeSeed(a1, a2, b1, b2) {
        console.log(s_circle_p1, b_circle[0], s_circle_p2, b_circle[1])
        if (curr_turn == 1) {
            updateStatus("Giliranmu", "Menunggu")
            ui_p1.material.color = new THREE.Color(0xFF5D79);
            ui_p1.material.needsUpdate = true
            ui_p2.material.color = new THREE.Color(0xBCE5FB);
            ui_p2.material.needsUpdate = true
        } else {
            updateStatus("Menunggu", "Giliranmu")
            ui_p1.material.color = new THREE.Color(0xFFCECE);
            ui_p1.material.needsUpdate = true
            ui_p2.material.color = new THREE.Color(0x0B97F4);
            ui_p2.material.needsUpdate = true
        }


        if (counter_p1.length > 0) {
            counter_p1.forEach(e => {
                SCENE.remove(e)
            })
            counter_p1 = []
        }
        for (let i = 0; i < a1.length; i++) {
            const geometry = new TextGeometry(a1[i].toString(), {
                font: LOADED_FONT,
                size: 5,
                height: 0,
                bevelEnabled: false,
            });
            let mesh = new THREE.Mesh(geometry, LOADED_MATERIAL[10])
            mesh.rotation.x = -Math.PI / 2
            if (i % 2 == 0) {
                mesh.position.set(p1_loc[i] - 5, 10.3, 125)
            } else {
                mesh.position.set(p1_loc[i] - 5, 10.3, 115)
            }
            counter_p1.push(mesh)
            GAME_UI.push(mesh)
            SCENE.add(mesh)
        }
        if (counter_p2.length > 0) {
            counter_p2.forEach(e => {
                SCENE.remove(e)
            })
            counter_p2 = []
        }
        for (let i = 0; i < b1.length; i++) {
            const geometry = new TextGeometry(b1[i].toString(), {
                font: LOADED_FONT,
                size: 5,
                height: 0,
                bevelEnabled: false,
            });
            let mesh = new THREE.Mesh(geometry, LOADED_MATERIAL[10])
            mesh.rotation.x = -Math.PI / 2
            if (i % 2 == 0) {
                mesh.position.set(p2_loc[i] - 5, 10.3, 165)
            } else {
                mesh.position.set(p2_loc[i] - 5, 10.3, 175)
            }
            counter_p2.push(mesh)
            GAME_UI.push(mesh)
            SCENE.add(mesh)
        }

        if (counter_big.length > 0) {
            counter_big.forEach(e => {
                SCENE.remove(e)
            })
            counter_big = []
        }
        let text = [a2, b2]
        for (let i = 0; i < 2; i++) {
            const geometry = new TextGeometry(text[i].toString(), {
                font: LOADED_FONT,
                size: 5,
                height: 0,
                bevelEnabled: false,
            });
            let mesh = new THREE.Mesh(geometry, LOADED_MATERIAL[10])
            mesh.rotation.x = -Math.PI / 2
            if (i == 0) {
                mesh.position.set(p1_big - 5, 10.3, 125)
            } else {
                mesh.position.set(p2_big - 5, 10.3, 165)
            }
            counter_big.push(mesh)
            GAME_UI.push(mesh)
            SCENE.add(mesh)
        }

        const congklak_seed_geo = new THREE.SphereGeometry(1, 6, 6);
        if (big_circle.length == 0) {
            let geo_b_circle = new THREE.CircleGeometry(12, 12);

            const b_circle_1 = new THREE.Mesh(geo_b_circle, LOADED_MATERIAL[9])
            b_circle_1.position.set(p1_big, 10.1, 142)
            b_circle_1.rotation.x = -Math.PI / 2
            big_circle.push(b_circle_1)
            GAME_UI.push(b_circle_1)
            SCENE.add(b_circle_1)

            const b_circle_2 = new THREE.Mesh(geo_b_circle, LOADED_MATERIAL[9])
            b_circle_2.position.set(p2_big, 10.1, 142)
            b_circle_2.rotation.x = -Math.PI / 2
            big_circle.push(b_circle_2)
            GAME_UI.push(b_circle_2)
            SCENE.add(b_circle_2)
        }

        if (congklak_p1.length != a2) {
            congklak_p1.forEach(e => {
                SCENE.remove(e)
            });
            congklak_p1 = [];
            for (let i = 0; i < a2; i++) {
                let congklak = new THREE.Mesh(congklak_seed_geo, LOADED_MATERIAL[8])
                congklak.position.set((Math.random() * 10) + p1_big - 5, 10 + i / 10, (Math.random() * 15) + 135)
                congklak_p1.push(congklak)
                GAME_UI.push(congklak)
                SCENE.add(congklak)
            }
        }
        if (congklak_p2.length != b2) {
            congklak_p2.forEach(e => {
                SCENE.remove(e)
            })
            for (let i = 0; i < b2; i++) {
                congklak_p2[i] = new THREE.Mesh(congklak_seed_geo, LOADED_MATERIAL[8])
                congklak_p2[i].position.set((Math.random() * 10) + p2_big - 5, 10 + i / 10, (Math.random() * 15) + 135)
                GAME_UI.push(congklak_p2[i])
                SCENE.add(congklak_p2[i])
            }
        }

        if (circle_row1.length == 0) {
            let geo_circle = new THREE.CircleGeometry(5, 9);
            for (let i = 0; i < 7; i++) {
                let circle = new THREE.Mesh(geo_circle, LOADED_MATERIAL[9])
                circle.position.set(p1_loc[i], 10.1, 135)
                circle.rotation.x = -Math.PI / 2
                circle.name = "player1_row_" + i
                circle_row1.push(circle)
                GAME_UI.push(circle)
                SCENE.add(circle)
                let arrayTemp = []
                for (let j = 0; j < 7; j++) {
                    let congklak = new THREE.Mesh(congklak_seed_geo, LOADED_MATERIAL[8])
                    congklak.position.set((Math.random() * 6) + p1_loc[i] - 3, 10.2 + (j / 10), (Math.random() * 5) + 133)
                    GAME_UI.push(congklak)
                    SCENE.add(congklak)
                    arrayTemp.push(congklak)
                }
                congklak_row1.push(arrayTemp)
            }
        }

        for (let i = 0; i < 7; i++) {
            if (congklak_row1[i].length != a1[i]) {
                let arrayTemp = []
                congklak_row1[i].forEach(e => {
                    SCENE.remove(e)
                })
                congklak_row1[i] = []
                for (let j = 0; j < a1[i]; j++) {
                    let congklak = new THREE.Mesh(congklak_seed_geo, LOADED_MATERIAL[8])
                    congklak.position.set((Math.random() * 6) + p1_loc[i] - 3, 10.2 + (j / 10), (Math.random() * 5) + 133)
                    GAME_UI.push(congklak)
                    SCENE.add(congklak)
                    arrayTemp.push(congklak)
                }
                congklak_row1[i] = arrayTemp
            }
        }


        if (circle_row2.length == 0) {
            let geo_circle = new THREE.CircleGeometry(5, 9);
            for (let i = 0; i < 7; i++) {
                let circle = new THREE.Mesh(geo_circle, LOADED_MATERIAL[9])
                circle.position.set(p2_loc[i], 10.1, 150)
                circle.rotation.x = -Math.PI / 2
                circle.name = "player2_row_" + i
                circle_row2.push(circle)
                GAME_UI.push(circle)
                SCENE.add(circle)
                let arrayTemp = []
                for (let j = 0; j < 7; j++) {
                    let congklak = new THREE.Mesh(congklak_seed_geo, LOADED_MATERIAL[8])
                    congklak.position.set((Math.random() * 6) + p2_loc[i] - 3, 10.2 + j / 10, (Math.random() * 5) + 148)
                    GAME_UI.push(congklak)
                    SCENE.add(congklak)
                    arrayTemp.push(congklak)
                }
                congklak_row2.push(arrayTemp)
            }
        }

        for (let i = 0; i < 7; i++) {
            if (congklak_row2[i].length != b1[i]) {
                let arrayTemp = []
                congklak_row2[i].forEach(e => {
                    SCENE.remove(e)
                })
                congklak_row2[i] = []
                for (let j = 0; j < b1[i]; j++) {
                    let congklak = new THREE.Mesh(congklak_seed_geo, LOADED_MATERIAL[8])
                    congklak.position.set((Math.random() * 6) + p2_loc[i] - 3, 10.2 + j / 10, (Math.random() * 5) + 148)
                    GAME_UI.push(congklak)
                    SCENE.add(congklak)
                    arrayTemp.push(congklak)
                }
                congklak_row2[i] = arrayTemp
            }
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
        let interval = setInterval(function () {
            // while (i > 0){
            if (i == 0) {
                hand.position.set(0, 0, 0)
                console.log("Done distribute")
                clearInterval(interval);
                resolve(j);
                return;
            }
            if ((player_input + j) % 15 < 7) {
                array[(player_input + j) % 15]++;
                hand.position.set(loc[(player_input + j) % 15], 50, hand_z)
                distributeSeed(s_circle_p1, b_circle[0], s_circle_p2, b_circle[1]);
                i--
                j++;
            } else if (((player_input + j) % 15) == 7) {
                big[player - 1]++;
                hand.position.set(loc_big, 50, hand_z_big)
                distributeSeed(s_circle_p1, b_circle[0], s_circle_p2, b_circle[1]);
                i--
                j++;
            } else {
                enemy_array[(((player_input + j) % 15) % 8)]++;
                hand.position.set(enemy_loc[(((player_input + j) % 15) % 8)], 50, hand_enemy_z)
                distributeSeed(s_circle_p1, b_circle[0], s_circle_p2, b_circle[1]);
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
        if ((player_input + j - 1) % 15 == 7) {
            console.log("// Turn changed to P1 (Ended in P1's House)");
            ONGOING_TURN = false
            PLAYER_CHOOSE = null;
            prevTime = performance.now()
        } else if ((player_input + j - 1) % 15 < 7) {
            let input_temp = (player_input + j - 1) % 15;
            if (array[input_temp] > 1) {
                player_input = input_temp + 1;
                congklak_temp = array[input_temp];
                array[input_temp] = 0;
                j = 0;
            } else if (enemy_array[6 - (input_temp % 8)] > 0) {
                let temp_add = array[input_temp] + enemy_array[6 - input_temp];
                array[input_temp] = 0;
                enemy_array[6 - input_temp] = 0;
                big[player - 1] += temp_add;
                console.log("// Turn Changed to P2 (P1 Stole P2's)\n");
                curr_turn = enemy_turn;
                ONGOING_TURN = false
                PLAYER_CHOOSE = null
                prevTime = performance.now()
            } else {
                curr_turn = enemy_turn;
                console.log("// Turn Changed to P2 (P1 ended in empty P1's hole.)\n");
                ONGOING_TURN = false
                PLAYER_CHOOSE = null
                prevTime = performance.now()
            }
        } else {
            let input_temp = (player_input + j - 1) % 15;
            if (enemy_array[input_temp % 8] > 1) {
                player_input = input_temp + 1;
                congklak_temp = enemy_array[input_temp % 8];
                enemy_array[input_temp % 8] = 0;
                j = 0
            } else {
                curr_turn = enemy_turn;
                console.log("// Turn Changed to P2 (P1 ended in empty P2's hole.)\n");
                ONGOING_TURN = false
                PLAYER_CHOOSE = null
                prevTime = performance.now()
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
        if (curr_turn == 2 && p2_row_sum == 0) {
            curr_turn = 1
            console.log("// Turn Changed to P1 (P2 Row is empty)")
            ONGOING_TURN = false
            PLAYER_CHOOSE = null
            prevTime = performance.now()
        }
        if (curr_turn == 1 && p1_row_sum == 0) {
            curr_turn = 2
            console.log("// Turn Changed to P2 (P1 Row is empty)")
            ONGOING_TURN = false
            PLAYER_CHOOSE = null
            prevTime = performance.now()
        }
        distributeSeed(s_circle_p1, b_circle[0], s_circle_p2, b_circle[1]);
        resolve([PLAYER_CHOOSE, player_input, curr_turn, congklak_temp]);
        return;
    })

    var repeatTurnUntilFinish = (player_input, curr_turn, congklak_temp) => new Promise(resolve => {
        (function loop(res, input, turn, c_temp) {
            if (res == null) {
                return;
            }
            distribute(input, turn, c_temp).then(result => {
                checkTurn(input, turn, c_temp, result).then(res => {
                    console.log(res)
                    if ((b_circle[0] + b_circle[1]) == 98) {
                        let temp = {
                            status: true,
                            reason: 1
                        }
                        if (PLAYER_POSITION === 1) {
                            if (b_circle[0] > b_circle[1]) {
                                temp.win = true
                            } else if (b_circle[0] < b_circle[1]) {
                                temp.win = false
                            } else {
                                temp.win = true
                                temp.reason = 2
                            }
                        } else if (PLAYER_POSITION === 2) {
                            if (b_circle[0] > b_circle[1]) {
                                temp.win = false
                            } else if (b_circle[0] < b_circle[1]) {
                                temp.win = true
                            } else {
                                temp.win = false
                                temp.reason = 2
                            }
                        }
                        end_game = temp
                    }
                    loop(res[0], res[1], res[2], res[3]);
                })
            })
        })(PLAYER_CHOOSE, player_input, curr_turn, congklak_temp);
    })

    function congklakGame(player_input_raw) {
        if (!ONGOING_TURN) {
            ONGOING_TURN = true
            let player_input = parseInt(player_input_raw.charAt(12)) + 1
            let congklak_temp
            switch (curr_turn) {
                case 1:
                    hand.position.set(p1_loc[player_input - 1], 50, 131)
                    congklak_temp = s_circle_p1[player_input - 1]
                    s_circle_p1[player_input - 1] = 0
                    break;
                case 2:
                    hand.position.set(p2_loc[player_input - 1], 50, 160)
                    congklak_temp = s_circle_p2[player_input - 1]
                    s_circle_p2[player_input - 1] = 0
                    break;
                default:
                    break;
            }
            repeatTurnUntilFinish(player_input, curr_turn, congklak_temp).then(result => {
                console.log(s_circle_p1, b_circle[0], s_circle_p2, b_circle[1])
            })
        }
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);

        time = performance.now();
        if (GAME_START) {
            if (curr_turn === PLAYER_POSITION && PLAYER_CHOOSE === null) {
                delta = (time - prevTime) / 1000;
                if (delta > 30) {
                    console.log("Turn Timeout")
                    socket.emit("gameroom_timeout", PLAYER_PLAY)
                    if (curr_turn === 1) { curr_turn = 2 } else { curr_turn = 1 }
                    distributeSeed(s_circle_p1, b_circle[0], s_circle_p2, b_circle[1]);
                    TIMEOUT_COUNTER += 1
                    if (TIMEOUT_COUNTER === 2) {
                        socket.disconnect()
                    }
                }
            }
            if (end_game.status) {
                GAME_UI.forEach(e => {
                    SCENE.remove(e)
                })
                GAME_UI = []
                showEndScreen(end_game)
                if (end_game.win) {
                    sendGameResult("/api/users/game-result", end_game)
                }
                GAME_START = false
            }
            if (PENDING_CHOOSE.length > 0 && PLAYER_CHOOSE === null) {
                PLAYER_CHOOSE = PENDING_CHOOSE[0]
                PENDING_CHOOSE.shift()
            }
        }

        if (PLAYER_CHOOSE != null) {
            congklakGame(PLAYER_CHOOSE)
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
                "game_name": "Congklak",
                "win_player_id": userInfo._id,
                "lose_player_id": OTHER_PLAYER_ID,
                "reason": end_game.reason
            })
        });
        var data = await response.json()
    }

    function showEndScreen(end_game) {
        let ready_bg = new THREE.Mesh(new THREE.PlaneGeometry(80, 50), LOADED_MATERIAL[10])
        ready_bg.position.set(66.5, 10.3, 140)
        ready_bg.rotation.x = -Math.PI / 2
        SCENE.add(ready_bg)
        ready_button = new THREE.Mesh(new THREE.PlaneGeometry(60, 12.5), LOADED_MATERIAL[6])
        ready_button.position.set(66.5, 15, 155)
        ready_button.rotation.x = -Math.PI / 2
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
            size: 5,
            height: 0,
            bevelEnabled: false
        })
        let ready_button_text = new THREE.Mesh(ready_button_text_geometry, LOADED_MATERIAL[10])
        centerText(ready_button_text_geometry, ready_button_text, 66.5, -100, 155)
        ready_button_text.rotation.x = -Math.PI / 3
        SCENE.add(ready_button_text)
        let ready_text_geometry = new TextGeometry(string, {
            font: LOADED_FONT,
            size: 5,
            height: 0,
            bevelEnabled: false
        })
        let ready_text = new THREE.Mesh(ready_text_geometry, LOADED_MATERIAL[7])
        centerText(ready_text_geometry, ready_text, 66.5, -75, 155)
        ready_text.rotation.x = -Math.PI / 3
        SCENE.add(ready_text)
    }

    function RoundedRectangle(w, h, r, s) { // width, height, radius corner, smoothness

        // helper const's
        const wi = w / 2 - r;		// inner width
        const hi = h / 2 - r;		// inner height
        const w2 = w / 2;			// half width
        const h2 = h / 2;			// half height
        const ul = r / w;			// u left
        const ur = (w - r) / w;	// u right
        const vl = r / h;			// v low
        const vh = (h - r) / h;	// v high	

        let positions = [

            wi, hi, 0, -wi, hi, 0, -wi, -hi, 0, wi, -hi, 0

        ];

        let uvs = [

            ur, vh, ul, vh, ul, vl, ur, vl

        ];

        let n = [

            3 * (s + 1) + 3, 3 * (s + 1) + 4, s + 4, s + 5,
            2 * (s + 1) + 4, 2, 1, 2 * (s + 1) + 3,
            3, 4 * (s + 1) + 3, 4, 0

        ];

        let indices = [

            n[0], n[1], n[2], n[0], n[2], n[3],
            n[4], n[5], n[6], n[4], n[6], n[7],
            n[8], n[9], n[10], n[8], n[10], n[11]

        ];

        let phi, cos, sin, xc, yc, uc, vc, idx;

        for (let i = 0; i < 4; i++) {

            xc = i < 1 || i > 2 ? -wi : wi;
            yc = i < 2 ? -hi : hi;

            uc = i < 1 || i > 2 ? ur : ul;
            vc = i < 2 ? vh : vl;

            for (let j = 0; j <= s; j++) {

                phi = Math.PI / 2 * (i + j / s);
                cos = Math.cos(phi);
                sin = Math.sin(phi);

                positions.push(xc + r * cos, yc + r * sin, 0);

                uvs.push(uc + ul * cos, vc + vl * sin);

                if (j < s) {

                    idx = (s + 1) * i + j + 4;
                    indices.push(i, idx, idx + 1);

                }

            }

        }

        const geometry = new THREE.BufferGeometry();
        geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

        return geometry;

    }

    function centerText(textGeo, textMesh, x, y, z) {
        textGeo.computeBoundingBox();
        const center = textGeo.boundingBox.getCenter(new THREE.Vector3())
        textMesh.updateMatrixWorld();
        center.applyMatrix4(textMesh.matrixWorld);
        textMesh.geometry.translate(x - center.x, y + center.y, z - center.z,)
    }

    function onWindowResize() {
        CAMERA.aspect = window.innerWidth / window.innerHeight;
        CAMERA.updateProjectionMatrix();
        RENDERER.setSize(window.innerWidth, window.innerHeight);
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

export default Congklak