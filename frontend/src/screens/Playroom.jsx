import React from 'react'
import * as THREE from 'three'
import RoomLoader from '../character/RoomLoader.js';
import PlayerLoader from '../character/PlayerLoader.js';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import WebGL from '../WebGL.js';
import * as PF from 'pathfinding';
import { useSelector } from "react-redux";



const Playroom = () => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    // Variables
    const MANAGER = new THREE.LoadingManager();
    const GLTF_LOADER = new GLTFLoader(MANAGER);
    const CUBE_TEXTURE_LOADER = new THREE.CubeTextureLoader();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader();
    const FONT_SIZE = 0.08;

    let CONTAINER
    let UI_CONTAINER


    const SCENE = new THREE.Scene();
    const UI = new THREE.Scene();
    const ROOM_LOADER = new RoomLoader(SCENE, MANAGER)
    let PLAYER_LOADER = new PlayerLoader(userInfo._id)
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
    let CAMERA_CONTROL
    let LOADED_FONT
    const RAYCAST = new THREE.Raycaster()
    let ROOM_GRID
    let WALK_FINDER
    let PLAYER_MOVE = []
    let PLAYER
    let PIVOTx = 0
    let PIVOTz = 0
    let UI_Object = []

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
        throw 'WebGL disabled or not supported';
    }

    function load() {
        initManager()
        initRoom()
        FONT_LOADER.load('./Bahnschrift_Regular.json', function (font) {
            LOADED_FONT = font
        });
    }

    function init() {
        // Initiate the Room
        initRenderer()
        initScene()
        initCamera()
        initPlayer()
        initUI()
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
    }

    function initCamera() {
        CAMERA.position.set(150, 150, 150)
        CAMERA.rotation.order = 'YXZ';
        CAMERA.rotation.y = - Math.PI / 4;
        CAMERA.rotation.x = Math.atan(- 1 / Math.sqrt(2));

        UI_CAMERA.position.set(20, 140, 150)
        UI_CAMERA.updateProjectionMatrix();
        UI_CAMERA.rotation.order = 'YXZ';
        UI_CAMERA.rotation.y = - Math.PI / 4;
        UI_CAMERA.rotation.x = Math.atan(- 1 / Math.sqrt(2));
        CAMERA_CONTROL.enableDamping = false;
    }

    function initUI() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        UI.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        UI.add(dirLight);
        console.log(ROOM_LOADER.getRoomName())
        let geometry = new TextGeometry(ROOM_LOADER.getRoomName(), {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }))
        mesh.rotation.y = -Math.PI / 4
        mesh.position.set(-5, 140, -150)
        UI_Object.push(mesh)
        UI.add(mesh)

        geometry = new TextGeometry("Back to Lobby", {
            font: LOADED_FONT,
            size: 7,
            height: 0,
            bevelEnabled: false,
        });
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffffff }))
        mesh.rotation.y = -Math.PI / 4
        mesh.position.set(-5, -150, -150)
        mesh.userData = { URL: "./lobby" }
        mesh.name = "ui_back_btn"
        UI.add(mesh)

        geometry = new THREE.PlaneGeometry(70, 40)
        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.2, transparent: true }))
        mesh.rotation.y = -Math.PI / 4
        mesh.position.set(17.5, -150, -127.5)
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
        CAMERA_CONTROL = new MapControls(CAMERA, UI_CONTAINER)
    }

    function initRoom() {
        ROOM_LOADER.Load(0)
        WALK_FINDER = new PF.AStarFinder({
            allowDiagonal: true
        });
        ROOM_GRID = ROOM_LOADER.getGrid()
    }

    function initPlayer() {
        PLAYER = PLAYER_LOADER.PLAYER.player

        PLAYER.position.copy(ROOM_LOADER.spawn)
        PLAYER.speedMultiplier = 1
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
                        window.open(i.object.parent.userData.URL)
                        items.pop()
                    } else {
                        let newPoint = {}
                        newPoint.x = Math.round(i.point.x / 25)
                        newPoint.z = Math.round(i.point.z / 25)

                        if (newPoint.x < 0) {
                            newPoint.x = 0
                        }
                        if (newPoint.z < 0) {
                            newPoint.z = 0
                        }

                        if (newPoint.x > ROOM_LOADER.x - 1) {
                            newPoint.x = ROOM_LOADER.x - 1
                        }
                        if (newPoint.z > ROOM_LOADER.y - 1) {
                            newPoint.z = ROOM_LOADER.y - 1
                        }


                        let startPos = {
                            x: Math.floor((PLAYER.position.x + 12.5) / 25) - 1,
                            z: Math.floor((PLAYER.position.z + 12.5) / 25) - 1
                        }
                        PLAYER_MOVE.pop()
                        var gridClone = ROOM_GRID.clone()
                        var path = WALK_FINDER.findPath(startPos.x, startPos.z, newPoint.x, newPoint.z, gridClone)
                        // PLAYER_MOVE.push([newPoint.x,newPoint.z,startPos.x,startPos.z])
                        PLAYER_MOVE.push(path)
                    }

                })
            }
        })
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);

        // Process player input
        if (PLAYER_MOVE.length > 0) {
            if (PLAYER_MOVE[0].length > 1) {
                PLAYER_LOADER.PlayerWalk()
                let start_position = {
                    x: PLAYER_MOVE[0][0][0],
                    z: PLAYER_MOVE[0][0][1]
                }
                let end_position = {
                    x: PLAYER_MOVE[0][1][0],
                    z: PLAYER_MOVE[0][1][1]
                }
                let xMove = 0;
                let zMove = 0;
                if (end_position.x - start_position.x > 0) {
                    xMove = 1;
                } else xMove = -1

                if (end_position.z - start_position.z > 0) {
                    zMove = 1;
                } else zMove = -1

                if (PLAYER.position.x !== (end_position.x * 25) + 12.5) {
                    PLAYER.position.x += xMove * PLAYER.speedMultiplier
                } else {
                    PIVOTx++
                }
                if (PLAYER.position.z !== (end_position.z * 25) + 12.5) {
                    PLAYER.position.z += zMove * PLAYER.speedMultiplier
                } else {
                    PIVOTz++
                }
                if (xMove == -1 && zMove == -1) {
                    if (PIVOTx > 0 && PIVOTz == 0) {
                        PLAYER.rotation.y = Math.PI
                    } else if (PIVOTz > 0 && PIVOTx == 0) {
                        PLAYER.rotation.y = -Math.PI / 2
                    }
                } else if (xMove == -1 && zMove == 1) {
                    PLAYER.rotation.y = 0
                } else if (xMove == 1 && zMove == -1) {
                    PLAYER.rotation.y = Math.PI / 2
                }

                if (PIVOTx !== 0 && PIVOTz !== 0) {
                    PLAYER_MOVE[0].shift()
                    PIVOTx = 0
                    PIVOTz = 0
                    if (PLAYER_MOVE[0].length === 1) {
                        PLAYER_MOVE.shift()
                        PLAYER_LOADER.PlayerStop()
                    }
                }
            }

        }

        // Broadcast movement to other players n times per second
        // moveTimer += delta;
        // if (moveTimer >= 1/TICKRATE) {
        //     moveTimer = 0;
        //     emitMove();
        // }

        // Move other players (interpolate movement)
        // for (let userid in USERS) {
        //     if (USERS[userid] !== undefined) {
        //         let oldPos = USERS[userid].oldPos;
        //         let pos = USERS[userid].pos;
        //         let rot = USERS[userid].rot;
        //         let a = USERS[userid].alpha;

        //         if (USERS[userid].mesh !== undefined) {
        //             USERS[userid].mesh.position.lerpVectors(oldPos, pos, a);
        //             USERS[userid].mesh.quaternion.rotateTowards(rot, USERS[userid].mesh.quaternion.angleTo(rot) * (TICKRATE * delta));
        //             if (USERS[userid].text !== undefined) {
        //                 USERS[userid].text.position.copy(USERS[userid].mesh.position);
        //                 USERS[userid].text.rotation.copy(USERS[userid].mesh.rotation);
        //             }
        //         }

        //         USERS[userid].alpha = Math.min(a + delta*(TICKRATE-1), 2);
        //     }
        // }

        prevTime = time;
        RENDERER.render(SCENE, CAMERA);
        UI_RENDERER.render(UI, UI_CAMERA);
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

export default Playroom