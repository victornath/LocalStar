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
import { io } from "socket.io-client";


const socket = io("http://localhost:5000");


const Playroom = () => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const currURL = window.location.href.substring(window.location.href.indexOf('?')+1,window.location.href.length)

    // Variables
    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader();

    let CONTAINER
    let UI_CONTAINER


    const SCENE = new THREE.Scene();
    const UI = new THREE.Scene();
    const ROOM_LOADER = new RoomLoader(SCENE, MANAGER)
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

    // Also make sure webgl is enabled on the current machine
    if(currURL){
        (currURL.split(";")).forEach(e=>{
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
                        PLAYER_MOVE.forEach(e => {
                            if(e._id === "self"){
                                PLAYER_MOVE.splice(PLAYER_MOVE.indexOf(e),1)
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

    function initSocket(){
        socket.emit("playroom_enter", {
            _id: userInfo._id,
            roomId: passed_parameters["room_id"]
        })

        socket.on("playroom_already_in", param => {
            PLAYER_LOADER.Load(param._id)
            OTHER_PLAYER[param._id] = PLAYER_LOADER.OTHER_PLAYER[param._id]
            OTHER_PLAYER[param._id].player.position.x = param.position.x
            OTHER_PLAYER[param._id].player.position.y = param.position.y
            OTHER_PLAYER[param._id].player.position.z = param.position.z
            SCENE.add(OTHER_PLAYER[param._id].player)
        })

        socket.on("playroom_playerList", param => {
            param.forEach(e => {
                socket.emit("ask_id", e)
            })
        })

        socket.on("ask_id", e => {
            socket.emit("give_id", {
                to: e,
                _id: userInfo._id,
                position: {
                    x: PLAYER.position.x,
                    y: PLAYER.position.y,
                    z: PLAYER.position.z
                }
            })
        })

        socket.on("playroom_addplayer", param => {
            if(param._id != userInfo._id){
                PLAYER_LOADER.Load(param._id)
                OTHER_PLAYER[param._id] = PLAYER_LOADER.OTHER_PLAYER[param._id]
                OTHER_PLAYER[param._id].player.position.copy(ROOM_LOADER.spawn)
                SCENE.add(OTHER_PLAYER[param._id].player)
            }
        })

        socket.on("user-disconnected", _id => {
            if(OTHER_PLAYER[_id]){
                SCENE.remove(OTHER_PLAYER[_id].player)
                PLAYER_LOADER.OTHER_PLAYER[_id] = null
                OTHER_PLAYER[_id] = null
                walking[_id] = null
                PLAYER_MOVE.forEach(e =>{
                    if(e._id === _id){
                        PLAYER_MOVE.splice(PLAYER_MOVE.indexOf(e),1)
                    }
                })
            }
        })

        socket.on("playroom_walk", param =>{
            const walk_path = {
                _id: param._id,
                path: param.path,
                distance: null
            }
            PLAYER_MOVE.forEach(e => {
                if(e._id === param._id){
                    PLAYER_MOVE.splice(PLAYER_MOVE.indexOf(e),1)
                }
            })
            PLAYER_MOVE.push(walk_path)
})
    }
    function gameLoop() {
        requestAnimationFrame(gameLoop);

        // Process player input
        if (PLAYER_MOVE.length > 0) {
            for (let i = 0; i < PLAYER_MOVE.length; i++) {
                if(PLAYER_MOVE[i].path.length > 1){
                    if(PLAYER_MOVE[i].distance === null){
                        let from = PLAYER_MOVE[i].path[0]
                        let destination = PLAYER_MOVE[i].path[1]
                        
                        let vector_start = new THREE.Vector3((from[0]*25)+12.5,0,(from[1]*25)+12.5)
                        let vector_end = new THREE.Vector3((destination[0]*25)+12.5,0,(destination[1]*25)+12.5)
                        
                        PLAYER_MOVE[i].distance = vector_start.distanceTo(vector_end)
                    } else {
                        let temp = PLAYER_MOVE[i]
                        let character
                        
                        if(temp._id === "self"){
                            character = PLAYER_LOADER.PLAYER
                        } else {
                            character= PLAYER_LOADER.OTHER_PLAYER[temp._id]
                        }
                        
                        if(temp.distance > 0){
                            character.walk()
                            if((temp.path[1][0]*25) + 12.5 > character.player.position.x) {character.player.position.x += 1; character.player.rotation.y = Math.PI/2;}
                            if((temp.path[1][0]*25) + 12.5 < character.player.position.x) {character.player.position.x -= 1; character.player.rotation.y = -Math.PI/2;}

                            if((temp.path[1][1]*25) + 12.5 > character.player.position.z) {character.player.position.z += 1; character.player.rotation.y = 0;}
                            if((temp.path[1][1]*25) + 12.5 < character.player.position.z) {character.player.position.z -= 1; character.player.rotation.y = Math.PI;}

    
                            let destination = PLAYER_MOVE[i].path[1]
                            let vector_end = new THREE.Vector3((destination[0]*25)+12.5,character.player.position.y,(destination[1]*25)+12.5)
                            temp.distance = character.player.position.distanceTo(vector_end)
                            PLAYER_MOVE[i] = temp
                        } else {
                            PLAYER_MOVE[i].path.shift()
                            if(PLAYER_MOVE[i].path.length <= 1){
                                character.stop()
                            }
                            PLAYER_MOVE[i].distance = null
                        }
                    }
                } else {
                    PLAYER_MOVE.splice(i,1)
                }
            }
        }
        
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