import React from 'react'
import * as THREE from 'three'
import RoomLoader from '../character/RoomLoader.js';
import PlayerLoader from '../character/PlayerLoader.js';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import WebGL from '../WebGL.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import * as PF from 'pathfinding';
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");


const Playroom = () => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const currURL = window.location.href.substring(window.location.href.indexOf('?') + 1, window.location.href.length)

    // Variables
    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader();

    let CONTAINER
    let UI_CONTAINER
    let CSS2DCONTAINER


    const SCENE = new THREE.Scene();
    const UI = new THREE.Scene();
    const ROOM_LOADER = new RoomLoader(SCENE)
    let PLAYER_LOADER = new PlayerLoader(userInfo._id)
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
    const CSS2DRENDERER = new CSS2DRenderer();
    let CAMERA_CONTROL
    let LOADED_FONT
    const RAYCAST = new THREE.Raycaster()
    let ROOM_GRID
    let WALK_FINDER
    let PLAYER_MOVE = [], OTHER_MOVE = []
    let PLAYER, OTHER_PLAYER = []
    let UI_Object = []
    let walking = []
    let passed_parameters = []
    var inputManager
    let MESSAGE_TIMER = []
    let time = performance.now()
    // Also make sure webgl is enabled on the current machine
    if (currURL) {
        (currURL.split(";")).forEach(e => {
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
    }

    function load() {
        initManager()
        FONT_LOADER.load('./Bahnschrift_Regular.json', function (font) {
            LOADED_FONT = font
        });
    }

    function init() {
        // Initiate the Room
        initRenderer()
        initScene()
        initCamera()
        loadData("/api/users/getData")
        initSocket()
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
            CSS2DCONTAINER = document.getElementById('css-holder');
            init()
            console.log('Loading complete!');
            document.getElementById('progress').hidden = true;
        };
    }

    function initRenderer() {
        RENDERER.setSize(window.innerWidth, window.innerHeight)
        RENDERER.setClearColor(0x303030)
        RENDERER.shadowMap.enabled = true

        UI_RENDERER.setSize(window.innerWidth, window.innerHeight)
        UI_RENDERER.setClearColor(0xFFFFFF, 0)
        UI_RENDERER.shadowMap.enabled = true

        CSS2DRENDERER.setSize(window.innerWidth, window.innerHeight);
    }

    function initCamera() {
        CAMERA.position.set(150, 150, 150)
        CAMERA.rotation.order = 'YXZ';
        CAMERA.rotation.y = - Math.PI / 4;
        CAMERA.rotation.x = Math.atan(- 1 / Math.sqrt(2));
        CAMERA.updateProjectionMatrix();

        UI_CAMERA.position.set(0, 0, 0)
        CAMERA_CONTROL.enableDamping = false;
        CAMERA_CONTROL.update()
    }

    function initUI() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        UI.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        UI.add(dirLight);
        let geometry = new TextGeometry(ROOM_LOADER.getRoomName(), {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }))
        mesh.position.set(-225, 110, 0)
        UI_Object.push(mesh)
        UI.add(mesh)

        geometry = new TextGeometry("Back to Lobby", {
            font: LOADED_FONT,
            size: 7,
            height: 0,
            bevelEnabled: false,
        });
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }))
        mesh.position.set(-225, -120, 1)
        mesh.userData = { URL: "./lobby" }
        mesh.name = "ui_back_btn"
        UI.add(mesh)

        inputManager = document.createElement('input')
        inputManager.addEventListener("keydown", function (e) {
            if (e.code === "Enter") {
                sendChat(inputManager.value)
                inputManager.value = ""
            }
        })
        const obj = new CSS2DObject(inputManager);
        obj.position.set(125, -120, 0)
        UI.add(obj)


        geometry = new THREE.PlaneGeometry(85, 40)
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true }))
        mesh.position.set(-200, -120, 0)
        mesh.userData = { URL: "./lobby" }
        mesh.name = "ui_back_btn"
        UI.add(mesh)
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
                items.forEach(i => {
                    if (i.object.name == "ui_back_btn") {
                        window.open(i.object.userData.URL, "_self")
                    }
                })
            }
        })
    }

    function initScene() {
        CONTAINER.appendChild(RENDERER.domElement)
        UI_CONTAINER.appendChild(UI_RENDERER.domElement)
        CSS2DCONTAINER.appendChild(CSS2DRENDERER.domElement)
        CAMERA_CONTROL = new MapControls(CAMERA, UI_CONTAINER)
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
            initRoom(passed_parameters["room_id"], data)
        }
    }

    async function initRoom(roomId, data) {
        ROOM_LOADER.Load(roomId).then(result => {
            WALK_FINDER = new PF.AStarFinder({
                allowDiagonal: true
            });
            ROOM_GRID = ROOM_LOADER.getGrid()
            initUI()
            initPlayer(data)
        })
    }

    function initPlayer(data) {
        console.log("Initting player")
        PLAYER = PLAYER_LOADER.PLAYER.player

        PLAYER.speedMultiplier = 1

        let PlayerName_geo = new TextGeometry(data.name, {
            font: LOADED_FONT,
            size: 6,
            height: 0,
            bevelEnabled: false
        })
        let PlayerName = new THREE.Mesh(PlayerName_geo, new THREE.MeshBasicMaterial({ color: 0xFFFFFF }))
        PlayerName.rotation.y = Math.PI / 4
        centerText(PlayerName_geo, PlayerName, -2.5, 37.5, -2.5)
        PLAYER.add(PlayerName)

        PLAYER.position.copy(ROOM_LOADER.spawn)
        SCENE.add(PLAYER);

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
                let items = RAYCAST.intersectObjects(SCENE.children, true)
                console.log(items)
                items.forEach(i => {
                    if (i.object.parent.name == "clickable") {
                        console.log(i.object.parent.name)
                        window.open(i.object.parent.userData.URL + "&src=" + passed_parameters["room_id"])
                        items.pop()
                    } else {
                        PLAYER_MOVE.forEach(e => {
                            if (e._id === "self") {
                                PLAYER_MOVE.splice(PLAYER_MOVE.indexOf(e), 1)
                            }
                        })
                        let newPoint = {}
                        newPoint.x = Math.round(i.point.x / 25)
                        newPoint.z = Math.round(i.point.z / 25)

                        if (newPoint.x < 0) newPoint.x = 0
                        if (newPoint.z < 0) newPoint.z = 0

                        if (newPoint.x > ROOM_LOADER.x - 1) newPoint.x = ROOM_LOADER.x - 1
                        if (newPoint.z > ROOM_LOADER.y - 1) newPoint.z = ROOM_LOADER.y - 1

                        let startPos = {
                            x: Math.floor((PLAYER.position.x - 12.5) / 25),
                            z: Math.floor((PLAYER.position.z - 12.5) / 25)
                        }
                        var gridClone = ROOM_GRID.clone()
                        var path = WALK_FINDER.findPath(startPos.x, startPos.z, newPoint.x, newPoint.z, gridClone)
                        let walk_path = {
                            _id: userInfo._id,
                            path: path,
                            distance: null
                        }
                        socket.emit("playroom_walk", walk_path)
                        walk_path._id = "self"
                        PLAYER_MOVE.push(walk_path)
                    }

                })
            }
        })
    }

    function initSocket() {
        window.addEventListener('beforeunload', function (e) {
            socket.disconnect()
        });
        window.addEventListener('unload', function (e) {
            socket.disconnect()
        })
        socket.emit("playroom_enter", {
            _id: userInfo._id,
            name: userInfo.name,
            roomId: passed_parameters["room_id"]
        }, (response) => {
            response.userList.forEach(e => {
                socket.emit("ask_id", e)
            })
        })

        socket.on("playroom_already_in", param => {
            PLAYER_LOADER.Load(param._id)
            OTHER_PLAYER[param._id] = PLAYER_LOADER.OTHER_PLAYER[param._id]
            let PlayerName_geo = new TextGeometry(param.name, {
                font: LOADED_FONT,
                size: 6,
                height: 0,
                bevelEnabled: false
            })
            let PlayerName = new THREE.Mesh(PlayerName_geo, new THREE.MeshBasicMaterial({ color: 0xFFFFFF }))
            PlayerName.rotation.y = Math.PI / 4
            centerText(PlayerName_geo, PlayerName, -2.5, 37.5, -2.5)
            OTHER_PLAYER[param._id].player.add(PlayerName)
            OTHER_PLAYER[param._id].player.position.x = param.position.x
            OTHER_PLAYER[param._id].player.position.y = param.position.y
            OTHER_PLAYER[param._id].player.position.z = param.position.z
            SCENE.add(OTHER_PLAYER[param._id].player)
        })

        socket.on("ask_id", e => {
            socket.emit("give_id", {
                to: e,
                _id: userInfo._id,
                name: userInfo.name,
                roomType: "playroom",
                position: {
                    x: PLAYER.position.x,
                    y: PLAYER.position.y,
                    z: PLAYER.position.z
                }
            })
        })

        socket.on("playroom_addplayer", param => {
            if (param._id != userInfo._id) {
                PLAYER_LOADER.Load(param._id)
                OTHER_PLAYER[param._id] = PLAYER_LOADER.OTHER_PLAYER[param._id]
                let PlayerName_geo = new TextGeometry(param.name, {
                    font: LOADED_FONT,
                    size: 6,
                    height: 0,
                    bevelEnabled: false
                })
                let PlayerName = new THREE.Mesh(PlayerName_geo, new THREE.MeshBasicMaterial({ color: 0xFFFFFF }))
                PlayerName.rotation.y = Math.PI / 4
                centerText(PlayerName_geo, PlayerName, -2.5, 37.5, -2.5)
                OTHER_PLAYER[param._id].player.add(PlayerName)
                OTHER_PLAYER[param._id].player.position.copy(ROOM_LOADER.spawn)
                SCENE.add(OTHER_PLAYER[param._id].player)
            }
        })

        socket.on("room_leave", param => {
            if (passed_parameters["room_id"] === param.room) {
                if (OTHER_PLAYER[param._id]) {
                    SCENE.remove(OTHER_PLAYER[param._id].player)
                    PLAYER_LOADER.OTHER_PLAYER[param._id] = null
                    OTHER_PLAYER[param._id] = null
                    walking[param._id] = null
                    PLAYER_MOVE.forEach(e => {
                        if (e.param._id === param._id) {
                            PLAYER_MOVE.splice(PLAYER_MOVE.indexOf(e), 1)
                        }
                    })
                }
            }
        })

        socket.on("playroom_walk", param => {
            const walk_path = {
                _id: param._id,
                path: param.path,
                distance: null
            }
            PLAYER_MOVE.forEach(e => {
                if (e._id === param._id) {
                    PLAYER_MOVE.splice(PLAYER_MOVE.indexOf(e), 1)
                }
            })
            PLAYER_MOVE.push(walk_path)
        })

        socket.on("playroom_chat", param => {
            let PlayerText_geo = new TextGeometry(param.message, {
                font: LOADED_FONT,
                size: 6,
                height: 0,
                bevelEnabled: false
            })
            let PlayerText = new THREE.Mesh(PlayerText_geo, new THREE.MeshBasicMaterial({ color: 0x000000 }))
            PlayerText_geo.computeBoundingBox();
            const size = PlayerText_geo.boundingBox.getSize(new THREE.Vector3())
            const center = PlayerText_geo.boundingBox.getCenter(new THREE.Vector3())
            let PlayerText_bg = new THREE.Mesh(new THREE.PlaneGeometry((size.x + 5), (size.y + 2)), new THREE.MeshBasicMaterial({ color: 0xffffff }))
            PlayerText_bg.position.set(-2.5, 45.5, -2.5)
            centerText(PlayerText_geo, PlayerText, -3.5, 45.5, 6.5)
            PlayerText_bg.add(PlayerText)
            let MessageGroup = new THREE.Group()
            MessageGroup.add(PlayerText, PlayerText_bg)
            MESSAGE_TIMER.push({
                _id: param._id,
                message: MessageGroup,
                time: performance.now()
            })
            if (OTHER_PLAYER[param._id]) {
                if (OTHER_PLAYER[param._id].player.rotation.y === Math.PI / 2) {
                    MessageGroup.rotation.y = -Math.PI / 2 + Math.PI / 4
                } else if (OTHER_PLAYER[param._id].player.rotation.y === -Math.PI / 2) {
                    MessageGroup.rotation.y = Math.PI / 2 + Math.PI / 4
                } else if (OTHER_PLAYER[param._id].player.rotation.y === Math.PI) {
                    MessageGroup.rotation.y = -Math.PI + Math.PI / 4
                } else {
                    MessageGroup.rotation.y = Math.PI / 4
                }
                if (OTHER_PLAYER[param._id].player.children.length > 8) {
                    OTHER_PLAYER[param._id].player.remove(OTHER_PLAYER[param._id].children[8])
                }
                OTHER_PLAYER[param._id].player.add(MessageGroup)
            } else if (param._id === userInfo._id) {
                if (PLAYER.rotation.y === Math.PI / 2) {
                    MessageGroup.rotation.y = -Math.PI / 2 + Math.PI / 4
                } else if (PLAYER.rotation.y === -Math.PI / 2) {
                    MessageGroup.rotation.y = Math.PI / 2 + Math.PI / 4
                } else if (PLAYER.rotation.y === Math.PI) {
                    MessageGroup.rotation.y = -Math.PI + Math.PI / 4
                } else {
                    MessageGroup.rotation.y = Math.PI / 4
                }
                if (PLAYER.children.length > 8) {
                    PLAYER.remove(PLAYER.children[8])
                }
                PLAYER.add(MessageGroup)
            }
        })
    }

    function sendChat(e) {
        let object = {
            _id: userInfo._id,
            message: e
        }
        socket.emit("playroom_chat", object)
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);
        time = performance.now()

        // Process player input
        if (PLAYER_MOVE.length > 0) {
            for (let i = 0; i < PLAYER_MOVE.length; i++) {
                if (PLAYER_MOVE[i].path.length > 1) {
                    if (PLAYER_MOVE[i].distance === null) {
                        let from = PLAYER_MOVE[i].path[0]
                        let destination = PLAYER_MOVE[i].path[1]

                        let vector_start = new THREE.Vector3((from[0] * 25) + 12.5, 0, (from[1] * 25) + 12.5)
                        let vector_end = new THREE.Vector3((destination[0] * 25) + 12.5, 0, (destination[1] * 25) + 12.5)

                        PLAYER_MOVE[i].distance = vector_start.distanceTo(vector_end)
                    } else {
                        let temp = PLAYER_MOVE[i]
                        let character

                        if (temp._id === "self") {
                            character = PLAYER_LOADER.PLAYER
                        } else {
                            character = PLAYER_LOADER.OTHER_PLAYER[temp._id]
                        }

                        if (temp.distance > 0) {
                            character.walk()
                            if ((temp.path[1][0] * 25) + 12.5 > character.player.position.x) {
                                character.player.position.x += 1
                                character.player.rotation.y = Math.PI / 2
                                character.player.children[7].rotation.y = -Math.PI / 2 + Math.PI / 4
                                if (character.player.children.length > 8) {
                                    character.player.children[8].rotation.y = -Math.PI / 2 + Math.PI / 4
                                }
                            }
                            if ((temp.path[1][0] * 25) + 12.5 < character.player.position.x) {
                                character.player.position.x -= 1
                                character.player.rotation.y = -Math.PI / 2
                                character.player.children[7].rotation.y = Math.PI / 2 + Math.PI / 4
                                if (character.player.children.length > 8) {
                                    character.player.children[8].rotation.y = Math.PI / 2 + Math.PI / 4
                                }
                            }
                            if ((temp.path[1][1] * 25) + 12.5 > character.player.position.z) {
                                character.player.position.z += 1
                                character.player.rotation.y = 0
                                character.player.children[7].rotation.y = Math.PI / 4
                                if (character.player.children.length > 8) {
                                    character.player.children[8].rotation.y = Math.PI / 4
                                }
                            }
                            if ((temp.path[1][1] * 25) + 12.5 < character.player.position.z) {
                                character.player.position.z -= 1
                                character.player.rotation.y = Math.PI
                                character.player.children[7].rotation.y = -Math.PI + Math.PI / 4
                                if (character.player.children.length > 8) {
                                    character.player.children[8].rotation.y = -Math.PI + Math.PI / 4
                                }
                            }


                            let destination = PLAYER_MOVE[i].path[1]
                            let vector_end = new THREE.Vector3((destination[0] * 25) + 12.5, character.player.position.y, (destination[1] * 25) + 12.5)
                            temp.distance = character.player.position.distanceTo(vector_end)
                            PLAYER_MOVE[i] = temp
                        } else {
                            PLAYER_MOVE[i].path.shift()
                            if (PLAYER_MOVE[i].path.length <= 1) {
                                character.stop()
                            }
                            PLAYER_MOVE[i].distance = null
                        }
                    }
                } else {
                    PLAYER_MOVE.splice(i, 1)
                }
            }
        }

        if (MESSAGE_TIMER.length > 0) {
            MESSAGE_TIMER.forEach(e => {
                let delta = (time - e.time) / 1000
                if (delta > 6) {
                    if (e._id === userInfo._id) {
                        PLAYER.remove(e.message)
                    } else {
                        OTHER_PLAYER[e._id].player.remove(e.message)
                    }
                    MESSAGE_TIMER.splice(MESSAGE_TIMER.indexOf(e), 1)
                }
            })
        }

        RENDERER.render(SCENE, CAMERA);
        UI_RENDERER.render(UI, UI_CAMERA);
        CSS2DRENDERER.render(UI, UI_CAMERA)
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
                <div id="css-holder"></div>
                <div id="ui-holder"></div>
                <div id="canvas-holder"></div>
            </>
        </div>
    )
}

export default Playroom