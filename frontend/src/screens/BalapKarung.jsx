import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import PlayerLoader from '../character/PlayerLoader.js';
import WebGL from '../WebGL.js';

const BalapKarung = () => {
    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER);

    const CONTAINER = document.getElementById('canvas-holder');
    const UI_CONTAINER = document.getElementById('ui-holder');

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
    const PLAYER_LOADER = new PlayerLoader()

    let LOADED_FONT, LOADED_MATERIAL = []
    let SHAKE_CAMERA = []
    let POWER = 0, PIVOT = 0, JUMP_PIVOT = [0, 0]
    let TRIANGLE, button_action, text_Mesh
    let JUMP_POINT = [0, 0], CHARA_JUMP = []


    var time, delta
    var useDeltaTiming = true, weirdTiming = 0;
    var prevTime = performance.now();
    let pressOnDelay = false
    const PRESS_DELAY = 2


    // Support check
    if (!('getContext' in document.createElement('canvas'))) {
        alert('Sorry, it looks like your browser does not support canvas!');
    }

    // Also make sure webgl is enabled on the current machine
    if (WebGL.isWebGLAvailable()) {
        // If everything is possible, start the app, otherwise show an error
        load();
    } else {
        let warning = WebGL.getWebGLErrorMessage();
        document.body.appendChild(warning);
        CONTAINER.remove();
        throw 'WebGL disabled or not supported';
    }

    function init() {
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
            init()
            gameLoop();
            document.getElementById('progress').hidden = true;
            console.log('Loading complete!');
        };
    }

    function load() {
        initManager()
        FONT_LOADER.load('../../texture/fonts/Bahnschrift_Regular.json', function (font) {
            LOADED_FONT = font
        })
        TEXTURE_LOADER.load('../../texture/item/sack/bag_big.jpg', function (texture) {
            TEXTURE_LOADER.load('../../texture/item/sack/bag_big_displaace.png', function (displace) {
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

    function initUI() {

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        UI.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        UI.add(dirLight);

        console.log(PLAYER_LOADER.Load(0))


        for (let i = 0; i < 2; i++) {
            let geometry = new TextGeometry("Player Name", {
                font: LOADED_FONT,
                size: 10,
                height: 0,
                bevelEnabled: false,
            });
            let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
            mesh.rotation.y = -Math.PI / 4
            mesh.position.set(100, 110 - (i * 130), 50)
            UI.add(mesh)
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

        let Player1 = PLAYER_LOADER.PLAYER.player
        Player1.position.set(65, 145, 25)
        Player1.scale.set(1.5, 1.5, 1.5)
        let Player2 = PLAYER_LOADER.OTHER_PLAYER[0].player
        Player2.position.set(65, 15, 25)
        Player2.scale.set(1.5, 1.5, 1.5)


        UI.add(Player1)
        UI.add(Player2)
        UI.add(ui_p1)
        UI.add(ui_p2)
        UI.add(ui_p1_padding)
        UI.add(ui_p2_padding)
        UI.add(ui_p1_status)
        UI.add(ui_p2_status)
        UI.add(ui_btn)
        // UI.add(mesh)
    }

    function initGame() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        SCENE.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        SCENE.add(dirLight);

        let Player1 = PLAYER_LOADER.PLAYER.player.clone()
        Player1.position.set(225, 0, -25)
        Player1.children[2].rotation.x = -Math.PI / 3
        Player1.children[2].position.z += 3.5
        Player1.children[2].position.x += 0.5
        Player1.children[2].position.y += 1.5
        Player1.children[3].rotation.x = -Math.PI / 3
        Player1.children[3].position.z += 3.5
        Player1.children[3].position.x -= 0.5
        Player1.children[3].position.y += 1.5
        SCENE.add(Player1)
        let Player2 = PLAYER_LOADER.OTHER_PLAYER[0].player.clone()
        Player2.position.set(125, 0, 50)
        Player2.children[2].rotation.x = -Math.PI / 3
        Player2.children[2].position.z += 3.5
        Player2.children[2].position.x += 0.5
        Player2.children[2].position.y += 1.5
        Player2.children[3].rotation.x = -Math.PI / 3
        Player2.children[3].position.z += 3.5
        Player2.children[3].position.x -= 0.5
        Player2.children[3].position.y += 1.5
        SCENE.add(Player2)

        let sack = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 25, 10, 512, true), LOADED_MATERIAL["sack"])
        sack.position.set(0, -10, 0)
        Player1.add(sack)
        Player2.add(sack.clone())

        let sky = new THREE.Mesh(new THREE.PlaneGeometry(750, 175), new THREE.MeshBasicMaterial({ color: 0x87CEEB }))
        sky.position.set(450, 0, -50)
        sky.rotation.y = -Math.PI / 4
        SCENE.add(sky)

        TRIANGLE = new THREE.Mesh(new THREE.RingGeometry(50, 52, 100, 100), new THREE.MeshBasicMaterial({ color: 0xFFFFFF }))
        TRIANGLE.position.set(175, 0, 285)
        TRIANGLE.rotation.y = - Math.PI / 4
        TRIANGLE.rotation.x = -Math.PI / 4
        TRIANGLE.scale.set(2.2, 2.2, 2.2)
        SCENE.add(TRIANGLE)

        let text_Geometry = new TextGeometry("Jump!", {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        text_Mesh = new THREE.Mesh(text_Geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
        text_Mesh.rotation.y = -Math.PI / 4
        text_Mesh.position.set(120, 40, 310)
        SCENE.add(text_Mesh)

        button_action = new THREE.Mesh(new THREE.CircleGeometry(50, 100), new THREE.MeshBasicMaterial({ color: 0x87CEEB }))
        button_action.position.set(175, 0, 285)
        button_action.rotation.y = -Math.PI / 4
        button_action.rotation.x = -Math.PI / 4
        button_action.name = "button_action"
        SCENE.add(button_action)

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
                        let powerNow = POWER
                        if (powerNow >= 108) {
                            console.log("JUMP!")
                            JUMP_POINT[0] += 1;
                            CHARA_JUMP.push(Player1)
                        } else {
                            shakeCamera()
                        }
                        prevTime = time
                        pressOnDelay = true
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