import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import PlayerLoader from '../character/PlayerLoader.js';
import WebGL from '../WebGL.js';

const TarikTambang = () => {
    /*
    Local Star

    Coding Guide:
        Imports: Line 12
        Constants: Line 18
        Support Check: Line 44
        Code init: Line 61
*/

    // Library Imports

    // Variables
    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);

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
    const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)

    let LOADED_FONT;
    let LOADED_MATERIAL = []
    let POWER = 0
    let TRIANGLE, button_action
    let PIVOT = 0
    let SHAKE_CAMERA = []

    var time, delta, moveTimer = 0;
    var useDeltaTiming = true, weirdTiming = 0;
    var prevTime
    const PRESS_DELAY = 3
    var pressOnDelay = false


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

        TEXTURE_LOADER.load('../../texture/item/rope/rope_._diffuse.png', function (texture) {
            TEXTURE_LOADER.load('../../texture/item/rope/rope_._normal.png', function (normal) {
                TEXTURE_LOADER.load('../../texture/item/rope/rope_._displacement.png', function (displace) {
                    texture.wrapS = THREE.RepeatWrapping
                    texture.wrapT = THREE.RepeatWrapping
                    texture.repeat.set(1, 20)
                    normal.wrapS = THREE.RepeatWrapping
                    normal.wrapT = THREE.RepeatWrapping
                    normal.repeat.set(1, 20)
                    displace.wrapS = THREE.RepeatWrapping
                    displace.wrapT = THREE.RepeatWrapping
                    displace.repeat.set(1, 20)
                    LOADED_MATERIAL["rope"] = new THREE.MeshStandardMaterial({
                        map: texture,
                        normalMap: normal,
                        displacementMap: displace,
                        displacementScale: 2.5
                    })
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
        document.getElementById("end-screen").style.display = "none"

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        SCENE.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        SCENE.add(dirLight);

        let Player1 = PLAYER_LOADER.PLAYER.player.clone()
        Player1.position.set(175, 0, 25)
        Player1.children[2].position.set(-10, 8.5, 10)
        Player1.children[2].rotation.x = -Math.PI / 3
        Player1.children[2].rotation.z = Math.PI / 9
        Player1.children[3].position.set(10, -2, 4)
        Player1.children[3].rotation.x = -Math.PI / 3
        Player1.children[3].rotation.z = Math.PI / 9
        animateChara(0, 1, Player1)
        SCENE.add(Player1)
        let Player2 = PLAYER_LOADER.OTHER_PLAYER[0].player.clone()
        Player2.position.set(285, 0, 135)
        Player2.rotation.y = -Math.PI / 2
        Player2.children[3].position.set(10, 8.5, 10)
        Player2.children[3].rotation.x = -Math.PI / 3
        Player2.children[3].rotation.z = -Math.PI / 9
        Player2.children[2].position.set(-10, -2, 4)
        Player2.children[2].rotation.x = -Math.PI / 3
        Player2.children[2].rotation.z = -Math.PI / 9
        SCENE.add(Player2)

        let sky = new THREE.Mesh(new THREE.PlaneGeometry(450, 175), new THREE.MeshBasicMaterial({ color: 0x87CEEB }))
        sky.position.set(325, 15, 0)
        sky.rotation.y = -Math.PI / 4
        SCENE.add(sky)

        let meter = new THREE.Mesh(new THREE.PlaneGeometry(225, 10), new THREE.ShaderMaterial({
            uniforms: {
                color1: {
                    value: new THREE.Color("#7dfd46")
                },
                color2: {
                    value: new THREE.Color("red")
                }
            },
            vertexShader: `
          varying vec2 vUv;
      
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
            fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
        
          varying vec2 vUv;
          
          void main() {
            
            gl_FragColor = vec4(mix(color1, color2, vUv.x), 1.0);
          }
        `
        }))
        meter.position.set(105, 35, 205)
        meter.rotation.y = -Math.PI / 4
        SCENE.add(meter)

        TRIANGLE = new THREE.Mesh(new THREE.CircleGeometry(5, 3), new THREE.MeshBasicMaterial({ color: 0xFF0000 }))
        TRIANGLE.position.set(26, 45, 126)
        TRIANGLE.rotation.y = - Math.PI / 4
        TRIANGLE.rotation.z = -Math.PI / 2
        SCENE.add(TRIANGLE)

        button_action = new THREE.Mesh(new THREE.PlaneGeometry(225, 50), new THREE.MeshBasicMaterial({ color: 0x87CEEB }))
        button_action.position.set(105, 0, 205)
        button_action.rotation.y = -Math.PI / 4
        button_action.name = "button_action"
        SCENE.add(button_action)

        let rope = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 500, 512, 512), LOADED_MATERIAL["rope"])
        rope.position.set(220, 2, 90)
        rope.rotation.x = -Math.PI / 2
        rope.rotation.z = Math.PI / 4
        SCENE.add(rope)

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
                        console.log("Power: " + POWER)
                        shakeCamera()
                        animateChara(PIVOT, 1, Player1)
                        button_action.material = new THREE.MeshBasicMaterial({ color: 0xAAAAAA })
                    }
                })
            }
        })
    }

    function shakeCamera() {
        SHAKE_CAMERA = [[4, -4, 2, -2, 2, -2, 3, -3, -1, 1], [4, -4, 2, -2, 2, -2, 3, -3, -1, 1]]
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);

        time = performance.now();
        if (pressOnDelay) {
            delta = (time - prevTime) / 1000;
            if (delta > PRESS_DELAY) {
                console.log("Ready")
                pressOnDelay = false
                button_action.material = new THREE.MeshBasicMaterial({ color: 0x87CEEB })
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

        if (PIVOT == 0) {
            POWER += 2;
            TRIANGLE.position.x += 2
            TRIANGLE.position.z += 2
            if (POWER == 158) {
                PIVOT = 1
            }
        } else {
            POWER -= 2;
            TRIANGLE.position.x -= 2
            TRIANGLE.position.z -= 2
            if (POWER == 0) {
                PIVOT = 0
            }
        }

        RENDERER.render(SCENE, CAMERA);
        UI_RENDERER.render(UI, UI_CAMERA);
    }

    function animateChara(pose, player, character) {
        if (pose === 1 && player == 1) {
            character.children[0].position.set(-5, -12, -1)
            character.children[0].rotation.x = Math.PI / 9
            character.children[1].position.set(10, -19, 0)
            character.children[1].rotation.x = -Math.PI / 4
        } else if (pose === 0 && player == 1) {
            character.children[0].position.set(-5, -12, -1)
            character.children[0].rotation.x = -Math.PI / 9
            character.children[1].position.set(10, -19, 0)
            character.children[1].rotation.x = -Math.PI / 3.5
        }
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

export default TarikTambang