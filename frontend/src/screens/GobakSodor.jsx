import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import Tribune_l from "../3DObject/bentengan_game_tribune_l.js"
import Tribune_r from "../3DObject/bentengan_game_tribune_r.js"
import Tribune_mid from "../3DObject/bentengan_game_tribune_mid.js"
import finish_line from "../3DObject/game_finish_line.js"
import PlayerLoader from '../character/PlayerLoader.js';
import WebGL from '../WebGL.js';
import { useSelector } from "react-redux";
import { io } from "socket.io-client";


const socket = io("http://localhost:5000");

const GobakSodor = () => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const currURL = window.location.href.substring(window.location.href.indexOf('?') + 1, window.location.href.length)

    // Variables
    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader();

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
        localClippingEnabled: true,
        alpha: true
    });
    const RAYCAST = new THREE.Raycaster()

    let passed_parameters = []
    var end_game = { status: false };
    let PLAYER_LOADER = new PlayerLoader(userInfo._id)
    var PLAYER_CHOOSE = [];
    var PLAYER_POINT = [0, 0];
    var ONGOING_TURN = false;
    var PLAYER_SPECIAL = [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1]
    let PLAYER_DATA
    let GAME_UI = []
    let ready_button


    let ui_pink_btn = new THREE.MeshBasicMaterial({
        color: 0xFF3366,
    })
    let PENDING_MOVE = []
    let OTHER_PLAYER = []
    let OTHER_PLAYER_ID
    let P1_UI = []
    let ROW_RING = []
    let P2_UI = []
    let P2_POINT
    let P1_POINT
    let LOADED_FONT, LOADED_TEXTURE = []
    let END_SCREEN = []
    let ui_btn_p1 = []
    let ui_btn_p2 = []
    let GAME_ROUND = 0;
    let ROW = 0;
    let PLAYER_POSITION
    let CHARACTER_POSITION = [82.5, -67.5, -217.5, -367.5, -517.5, -667.5, - 817.5]
    let CATCHER_POSITION = [7.5, -142.5, -292.5, -442.5, -592.5, -742.5]
    let CAMERA_POSITION = [100, -50, -200, -350, -500, -650, -800]
    let OTHER_PLAYER_MESH = []
    let PLAYER_MESH_POSITION = []
    let PLAYER_READY
    let READY_UI = []
    let GAME_START
    let PLAYER_PLAY


    let Catcher = [];
    let Player2;

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
        loadData("/api/users/getData")
        initScene()
        initRaycast()
        window.addEventListener('resize', onWindowResize, false);
    }

    function initManager() {
        MANAGER.onStart = function (managerUrl, itemsLoaded, itemsTotal) {
            console.log('Started loading: ' + managerUrl + '\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        };

        MANAGER.onProgress = function (managerUrl, itemsLoaded, itemsTotal) {
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
        TEXTURE_LOADER.load('./images/texture/ui/game/gobak_sodor/arrow_l.png', function (texture) {
            LOADED_TEXTURE["arrow_l"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                alphaTest: 0.5
            })
        })
        TEXTURE_LOADER.load('./images/texture/ui/game/gobak_sodor/arrow_r.png', function (texture) {
            LOADED_TEXTURE["arrow_r"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                alphaTest: 0.5
            })
        })
        TEXTURE_LOADER.load('./images/texture/ui/game/gobak_sodor/arrow_l_special.png', function (texture) {
            LOADED_TEXTURE["arrow_l_special"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                alphaTest: 0.5
            })
        })
        TEXTURE_LOADER.load('./images/texture/ui/game/gobak_sodor/arrow_r_special.png', function (texture) {
            LOADED_TEXTURE["arrow_r_special"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                alphaTest: 0.5
            })
        })
        TEXTURE_LOADER.load('./images/texture/ui/game/gobak_sodor/arrow_l_disabled.png', function (texture) {
            LOADED_TEXTURE["arrow_l_disabled"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                alphaTest: 0.5
            })
        })
        TEXTURE_LOADER.load('./images/texture/ui/game/gobak_sodor/arrow_r_disabled.png', function (texture) {
            LOADED_TEXTURE["arrow_r_disabled"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                alphaTest: 0.5
            })
        })
        TEXTURE_LOADER.load('./images/texture/ui/game/gobak_sodor/finish_line.png', function (texture) {
            LOADED_TEXTURE["finish_line"] = texture
        })
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
        CAMERA.position.set(150, 110, 100)
        CAMERA.zoom = 1.1
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
        let ui_blue = new THREE.MeshBasicMaterial({
            color: 0xBCE5FB,
        })
        let ui_blue_light = new THREE.MeshBasicMaterial({
            color: 0xEBF8FF,
        })
        let ui_p1 = new THREE.Mesh(ui_background, ui_pink_light);
        let ui_p1_padding = new THREE.Mesh(ui_padding, ui_pink);
        let ui_p1_status = new THREE.Mesh(ui_status, ui_pink_light);
        let ui_p2 = new THREE.Mesh(ui_background, ui_blue_light);
        let ui_p2_padding = new THREE.Mesh(ui_padding, ui_blue);
        let ui_p2_status = new THREE.Mesh(ui_status, ui_blue_light);
        let ui_btn = new THREE.Mesh(ui_btn_background, ui_pink_btn);

        if (PLAYER_POSITION !== 0) {
            let player_y = [0, 145, 15]
            let name_y = [0, 110, -20]
            let Player1 = PLAYER_LOADER.PLAYER.player
            Player1.position.set(65, player_y[PLAYER_POSITION], 25)
            Player1.scale.set(1.25, 1.25, 1.25)
            PLAYER_MESH_POSITION.push(Player1)
            UI.add(Player1)

            let geometry = new TextGeometry(userInfo.name, {
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
        }

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
        UI.add(ui_btn)

        UI.add(ui_p1)
        UI.add(ui_p2)
        UI.add(ui_p1_padding)
        UI.add(ui_p2_padding)
        UI.add(ui_p1_status)
        UI.add(ui_p2_status)
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

        socket.on("disconnect", () => {
            end_game = {
                status: true,
                win: (PLAYER_POSITION === 1) ? 2 : 1,
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
            GAME_START = true
            prevTime = performance.now()
            initGame()
        })

        socket.on("gameroom_move", param => {
            if (ONGOING_TURN) {
                PENDING_MOVE.push(param)
            } else {
                PLAYER_CHOOSE[(param.position - 1)] = param.choose
            }
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

                        let geometry = new TextGeometry(userInfo.name, {
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
                            reason: 0
                        }
                        if (PLAYER_PLAY.p1 === param.socket_id) {
                            temp.winner = 2
                        } else if (PLAYER_PLAY.p2 === param.socket_id) {
                            temp.winner = 1
                        }
                        end_game = temp
                    }
                    PLAYER_LOADER.OTHER_PLAYER[param._id] = null
                    OTHER_PLAYER[param._id] = null
                }
            }
        })
    }


    function initGame() {
        READY_UI.forEach(e => {
            SCENE.remove(e)
        })

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        GAME_UI.push(ambientLight);
        SCENE.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        GAME_UI.push(dirLight);
        SCENE.add(dirLight);

        let white = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
        })

        const ui_btn_background = new THREE.PlaneGeometry(40, 40);

        for (let i = 0; i < 6; i++) {
            let material
            let material_special
            if (i < 3) {
                material = LOADED_TEXTURE["arrow_l"]
                material_special = LOADED_TEXTURE["arrow_l_special"]
            } else {
                material = LOADED_TEXTURE["arrow_r"]
                material_special = LOADED_TEXTURE["arrow_r_special"]
            }
            if (PLAYER_SPECIAL[1] - 1 == i) {
                ui_btn_p2[i] = new THREE.Mesh(ui_btn_background, material_special);
            } else {
                ui_btn_p2[i] = new THREE.Mesh(ui_btn_background, material);
            }
            ui_btn_p2[i].rotation.y = -Math.PI / 4
            ui_btn_p2[i].scale.set(1, 1.25, 1)
            ui_btn_p2[i].name = "player2_" + (6 - i)
            if (i < 3) {
                ui_btn_p2[i].position.set(165, 0 + (i * 60), 85)
            } else {
                ui_btn_p2[i].position.set(300, 0 + ((i - 3) * 60), 210)
            }
        }

        ui_btn_p2.forEach(o => {
            GAME_UI.push(o);
            SCENE.add(o)
        });

        if (PLAYER_POSITION === 1) {
            for (let i = 0; i < 6; i++) {
                Catcher[i] = OTHER_PLAYER[OTHER_PLAYER_ID].player.clone()
                Catcher[i].position.set(320, 50, CATCHER_POSITION[i])
            }
            Player2 = PLAYER_LOADER.PLAYER.player.clone()
            Player2.position.set(295, 50, 82.5)
            Player2.rotation.y = -Math.PI
        } else {
            Player2 = OTHER_PLAYER[OTHER_PLAYER_ID].player.clone()
            Player2.position.set(295, 50, 82.5)
            Player2.rotation.y = -Math.PI
            for (let i = 0; i < 6; i++) {
                Catcher[i] = PLAYER_LOADER.PLAYER.player.clone()
                Catcher[i].position.set(320, 50, CATCHER_POSITION[i])
            }
        }

        let Tribune_right = []
        Tribune_right[0] = new Tribune_l().group
        Tribune_right[0].position.set(512.5, 30, -725)
        Tribune_right[0].rotation.y = -Math.PI / 2
        for (let i = 0; i < 16; i++) {
            Tribune_right[i + 1] = new Tribune_mid().group
            Tribune_right[i + 1].position.set(512.5, 30, -725 + (i * 50))
            Tribune_right[i + 1].rotation.y = -Math.PI / 2
        }
        Tribune_right[17] = new Tribune_r().group
        Tribune_right[17].position.set(512.5, 30, 75)
        Tribune_right[17].rotation.y = -Math.PI / 2


        Catcher.forEach(e => {
            GAME_UI.push(e);
            SCENE.add(e)
        });
        GAME_UI.push(Player2);
        SCENE.add(Player2)
        Tribune_right.forEach(e => {
            GAME_UI.push(e);
            SCENE.add(e)
        })

        let white_strip_long = new THREE.PlaneGeometry(25, 750)
        let white_strip_short = new THREE.PlaneGeometry(275, 25)
        let finish = new finish_line(LOADED_TEXTURE["finish_line"]).group
        finish.position.set(325, 0, -817.5)

        let strip_side = [];

        for (let i = 0; i < 6; i++) {
            strip_side[i] = new THREE.Mesh(white_strip_short, white)
            strip_side[i].position.set(325, 0, 25 - (i * 150))
            strip_side[i].rotation.x = -Math.PI / 2
        }

        let strip_long_l = new THREE.Mesh(white_strip_long, white)
        strip_long_l.position.set(200, 0, -337.5)
        strip_long_l.rotation.x = -Math.PI / 2

        let strip_long_r = new THREE.Mesh(white_strip_long, white)
        strip_long_r.position.set(450, 0, -337.5)
        strip_long_r.rotation.x = -Math.PI / 2

        strip_side.forEach(e => {
            GAME_UI.push(e);
            SCENE.add(e)
        });

        GAME_UI.push(strip_long_l);
        GAME_UI.push(finish);
        GAME_UI.push(strip_long_r);
        SCENE.add(strip_long_l)
        SCENE.add(finish)
        SCENE.add(strip_long_r)

        if (PLAYER_POSITION === 2) {
            let indicator_ring = new THREE.RingGeometry(11, 15, 25, 25)
            let turn_ring = new THREE.Mesh(indicator_ring, new THREE.MeshBasicMaterial({ color: 0xFF3366 }))
            turn_ring.rotation.x = -Math.PI / 2
            turn_ring.position.set(320, 5.4, CATCHER_POSITION[ROW])
            ROW_RING.push(turn_ring)

            GAME_UI.push(turn_ring);
            SCENE.add(turn_ring)
        }
    }
    function showReadyUI() {
        let ready_bg = new THREE.Mesh(new THREE.PlaneGeometry(160, 150), new THREE.MeshBasicMaterial({ color: 0xffffff }))
        ready_bg.position.set(315, 15, 65)
        ready_bg.rotation.y = -Math.PI / 4
        READY_UI.push(ready_bg)
        SCENE.add(ready_bg)
        ready_button = new THREE.Mesh(new THREE.PlaneGeometry(120, 33), ui_pink_btn)
        ready_button.position.set(305, -12.5, 75)
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
        centerText(ready_button_text_geometry, ready_button_text, 270, 172.5, 100)
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
        centerText(ready_text_geometry, ready_text, 270, 225, 100)
        ready_text.rotation.y = -Math.PI / 4
        READY_UI.push(ready_text)
        SCENE.add(ready_text)
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
                    console.log(i.object.name)
                    if (i.object.name == "button_ready") {
                        ready_button.material = new THREE.MeshBasicMaterial({ color: 0x747474 })
                        // if (PLAYER_POSITION === 1) {
                        //     // updateStatus("Siap", "")
                        // } else {
                        //     // updateStatus("", "Siap")
                        // }
                        socket.emit("gameroom_playerReady", PLAYER_PLAY);
                        PLAYER_READY = true
                        items.splice(0, items.length)
                    } else {
                        if (!i.object.name.endsWith("_disabled") && !ONGOING_TURN) {
                            if (PLAYER_CHOOSE[(PLAYER_POSITION - 1)] == null) {
                                let param = PLAYER_PLAY
                                PLAYER_CHOOSE[(PLAYER_POSITION - 1)] = parseInt(i.object.name.charAt(8))
                                if (PLAYER_CHOOSE[(PLAYER_POSITION - 1)] < 4) {
                                    ui_btn_p2[6 - PLAYER_CHOOSE[(PLAYER_POSITION - 1)]].material = LOADED_TEXTURE["arrow_r_disabled"]
                                } else {
                                    ui_btn_p2[6 - PLAYER_CHOOSE[(PLAYER_POSITION - 1)]].material = LOADED_TEXTURE["arrow_l_disabled"]
                                }
                                ui_btn_p2[6 - PLAYER_CHOOSE[(PLAYER_POSITION - 1)]].name += "_disabled"
                                param.choose = PLAYER_CHOOSE[(PLAYER_POSITION - 1)]
                                param.position = PLAYER_POSITION
                                console.log("Player1 choosed: " + PLAYER_CHOOSE[(PLAYER_POSITION - 1)])
                                socket.emit("gameroom_move", param)
                            }
                        }
                    }
                })
            }
        })
    }


    function loadOtherPlayer(_id, position, name) {
        OTHER_PLAYER_ID = _id
        PLAYER_LOADER.Load(_id)
        OTHER_PLAYER_MESH[_id] = []
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
        OTHER_PLAYER_MESH[_id].push(name_mesh)
        OTHER_PLAYER_MESH[_id].push(OTHER_PLAYER[_id].player)
        OTHER_PLAYER_MESH[_id].forEach(e => {
            UI.add(e)
        })
    }



    var moveChara = (obj_loader, obj_chara, loc) => new Promise(resolve => {
        let pos = obj_chara.position
        let dx
        let dz
        if (loc.x - pos.x > 0) {
            dx = 1
        } else dx = -1
        if (loc.z - pos.z > 0) {
            dz = 1
        } else dz = -1

        let interval = setInterval(function () {
            if ((loc.z - pos.z != 0) || (loc.x - pos.x != 0)) {
                if (loc.z - pos.z != 0) {
                    obj_chara.position.z += dz
                    pos = obj_chara.position
                }
                if (loc.x - pos.x != 0) {
                    obj_chara.position.x += dx
                    pos = obj_chara.position
                }
            } else {
                clearInterval(interval)
                resolve()
            }
        }, 25)
    })

    var distributeChara = (player_direction) => new Promise(resolve => {
        let obj = [];
        let loader = [];
        let location = [];
        if (player_direction[0] == -1) {
            obj[0] = Catcher[ROW]
            // loader[0] = CATCHER_LOADER[ROW]
            location[0] = {
                x: 320 + (player_direction[0] * 75),
                y: 30,
                z: CATCHER_POSITION[ROW]
            }
        } else {
            obj[0] = Catcher[ROW]
            // loader[0] = CATCHER_LOADER[ROW]
            location[0] = {
                x: 320 + (player_direction[0] * 50),
                y: 30,
                z: CATCHER_POSITION[ROW]
            }
        }
        if (player_direction[1] == -1) {
            obj[1] = Player2
            loader[1] = PLAYER_LOADER
            location[1] = {
                x: 295 + (player_direction[1] * 50),
                y: 30,
                z: CHARACTER_POSITION[ROW] - 50
            }
        } else {
            obj[1] = Player2
            loader[1] = PLAYER_LOADER
            location[1] = {
                x: 295 + (player_direction[1] * 75),
                y: 30,
                z: CHARACTER_POSITION[ROW] - 50
            }
        }
        Promise.all([moveChara(loader[0], obj[0], location[0]), moveChara(loader[1], obj[1], location[1])]).then(result => {
            resolve(null)
        })
    })


    function bentenganGame(player_input) {
        if (!ONGOING_TURN) {
            SCENE.remove(ROW_RING[0])
            ROW_RING.pop()
            ONGOING_TURN = true
            let player_direction = [0, 0];
            for (let i = 0; i < 2; i++) {
                switch (player_input[i]) {
                    case 1: case 2: case 3:
                        player_direction[i] = -1
                        break;
                    case 4: case 5: case 6:
                        player_direction[i] = 1
                        break;
                }
            }
            let promiseArray = []

            distributeChara(player_direction).then(result => {
                if (player_direction[0] == player_direction[1]) {
                    if (7 - player_input[0] == PLAYER_SPECIAL[0]) {
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
                            z: CHARACTER_POSITION[ROW]
                        }),
                        moveChara(null, Catcher[ROW], {
                            x: 320,
                            y: 30,
                            z: CATCHER_POSITION[ROW]
                        })
                    )
                } else {
                    if (7 - player_input[1] == PLAYER_SPECIAL[1]) {
                        console.log("Player 2 passed Player 1 (SP)")
                        PLAYER_POINT[1] += 3;
                    } else {
                        console.log("Player 2 passed Player 1")
                        PLAYER_POINT[1]++;
                    }
                    ROW++;
                    promiseArray.push(
                        moveChara(PLAYER_LOADER, Player2, {
                            x: 295,
                            y: 30,
                            z: CHARACTER_POSITION[ROW]
                        }),
                        moveChara(null, CAMERA, {
                            x: 150,
                            y: 110,
                            z: CAMERA_POSITION[ROW]
                        })
                    )
                    for (let i = 0; i < 6; i++) {
                        if (i < 3) {
                            promiseArray.push(moveChara(null, ui_btn_p2[i], {
                                x: 165,
                                y: 0 + (i * 60),
                                z: CAMERA_POSITION[ROW] - 15
                            }))
                        } else {
                            promiseArray.push(moveChara(null, ui_btn_p2[i], {
                                x: 300,
                                y: 0 + ((i - 3) * 60),
                                z: CAMERA_POSITION[ROW] + 110
                            }))
                        }
                    }
                }
                Promise.all(promiseArray).then(result => {
                    let geometry = new TextGeometry(PLAYER_POINT[0].toString(), {
                        font: LOADED_FONT,
                        size: 20,
                        height: 0,
                        bevelEnabled: false,
                    });
                    let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
                    mesh.rotation.y = -Math.PI / 4
                    mesh.position.set(-152.5, 85, 49)
                    UI.remove(P1_POINT)
                    P1_POINT = mesh
                    UI.add(P1_POINT)

                    geometry = new TextGeometry(PLAYER_POINT[1].toString(), {
                        font: LOADED_FONT,
                        size: 20,
                        height: 0,
                        bevelEnabled: false,
                    });
                    mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
                    mesh.rotation.y = -Math.PI / 4
                    mesh.position.set(45, 85, 246)
                    UI.remove(P2_POINT)
                    P2_POINT = mesh
                    UI.add(P2_POINT)

                    if (PLAYER_POSITION === 2) {
                        let indicator_ring = new THREE.RingGeometry(11, 15, 25, 25)
                        let turn_ring = new THREE.Mesh(indicator_ring, new THREE.MeshBasicMaterial({ color: 0xFF3366 }))
                        turn_ring.rotation.x = -Math.PI / 2
                        turn_ring.position.set(320, 5.4, CATCHER_POSITION[ROW])
                        ROW_RING.push(turn_ring)

                        GAME_UI.push(turn_ring)
                        SCENE.add(turn_ring)
                    }

                    PLAYER_CHOOSE = [null, null];
                    prevTime = performance.now()
                    GAME_ROUND++;
                    ONGOING_TURN = false;
                    if (GAME_ROUND == 6) {
                        let temp = {
                            status: true,
                            reason: 1
                        }
                        if (PLAYER_POINT[0] > PLAYER_POINT[1]) {
                            temp.winner = 1
                            // Catcher Win
                        } else if (PLAYER_POINT[0] < PLAYER_POINT[1]) {
                            temp.winner = 2
                            // Player win
                        } else {
                            temp.winner = 0
                            temp.reason = 2
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

        if (PENDING_MOVE.length > 0) {
            let param = PENDING_MOVE[0]
            PLAYER_CHOOSE[(param.position - 1)] = param.choose
            PENDING_MOVE.shift()
        }

        if (GAME_START) {
            if (PLAYER_POSITION !== 0 && PLAYER_CHOOSE[(PLAYER_POSITION - 1)] === null) {
                delta = (time - prevTime) / 1000;
                if (delta > 30) {
                    console.log("Turn Timeout")
                    socket.disconnect()
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
        }

        if (PLAYER_CHOOSE[0] != null && PLAYER_CHOOSE[1] != null) {
            bentenganGame(PLAYER_CHOOSE)
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
                "game_name": "Gobak Sodor",
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
        ready_bg.position.set(66.5, 10.3, 140)
        ready_bg.rotation.x = -Math.PI / 2
        SCENE.add(ready_bg)
        ready_button = new THREE.Mesh(new THREE.PlaneGeometry(60, 12.5), ui_pink_btn)
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
        let ready_button_text = new THREE.Mesh(ready_button_text_geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }))
        centerText(ready_button_text_geometry, ready_button_text, 66.5, -100, 155)
        ready_button_text.rotation.x = -Math.PI / 3
        SCENE.add(ready_button_text)
        let ready_text_geometry = new TextGeometry(string, {
            font: LOADED_FONT,
            size: 5,
            height: 0,
            bevelEnabled: false
        })
        let ready_text = new THREE.Mesh(ready_text_geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
        centerText(ready_text_geometry, ready_text, 66.5, -75, 155)
        ready_text.rotation.x = -Math.PI / 3
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
        UI_CAMERA.aspect = window.innerWidth / window.innerHeight;
        UI_CAMERA.updateProjectionMatrix();
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

export default GobakSodor