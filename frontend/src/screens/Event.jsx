import React from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import WebGL from '../WebGL.js';

const Event = () => {
    // THREE
    const MANAGER = new THREE.LoadingManager();
    const RAYCAST = new THREE.Raycaster()

    // Scene attributes
    const UI = new THREE.Scene();
    let UI_CONTAINER
    const UI_CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth * 0.4 / window.innerHeight)), (135 * (window.innerWidth * 0.4 / window.innerHeight)), 135, -135, 1, 1000)
    const UI_RENDERER = new THREE.WebGLRenderer({
        antialias: true,
        localClippingEnabled: true
    });

    // Loaders
    const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)
    const FONT_LOADER = new FontLoader(MANAGER);


    let LOADED_FONT = []
    let LOADED_TEXTURE = []

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
        FONT_LOADER.load('./Bahnschrift_Regular.json', function (font) {
            LOADED_FONT = font
        })
        TEXTURE_LOADER.load('./images/texture/ui/arrow/arrow_l_back.png', function (texture) {
            LOADED_TEXTURE["back"] = new THREE.MeshBasicMaterial({
                map: texture,
                alphaTest: 0.9
            })
        })
        TEXTURE_LOADER.load('./images/event/blank_event.png', function (texture) {
            LOADED_TEXTURE["blank_event"] = new THREE.MeshBasicMaterial({
                map: texture
            })
        })
        TEXTURE_LOADER.load('./images/event/event_level10.png', function (texture) {
            LOADED_TEXTURE["event_level10"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            })
        })
        TEXTURE_LOADER.load('./images/event/event_kuesioner.png', function (texture) {
            LOADED_TEXTURE["event_kuesioner"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            })
        })
        TEXTURE_LOADER.load('./images/event/event_openning.png', function (texture) {
            LOADED_TEXTURE["event_openning"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            })
        })
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
            UI_CONTAINER = document.getElementById('column-1');
            init()
            document.getElementById('progress').hidden = true;
            console.log('Loading complete!');
        };
    }

    function init() {
        // Initiate the Game
        initRenderer()
        initCamera()
        initUI()
        initRaycast()
        initScene()
        window.addEventListener('resize', onWindowResize, false);
    }

    function initRenderer() {
        UI_RENDERER.setSize(window.innerWidth * 0.4, window.innerHeight)
        UI_RENDERER.setClearColor(0xCEC3C1)
        UI_RENDERER.shadowMap.enabled = true
    }

    function initCamera() {
        UI_CAMERA.position.set(0, 0, 150)
        UI_CAMERA.updateProjectionMatrix();
    }

    function initRaycast() {
        document.addEventListener("click", function (event) {
            /* which = 1 itu click kiri */
            /* which = 2 itu scroll click */
            /* which = 3 itu click kanan */
            if (event.which == 1) {
                let mouse = {}
                let w = window.innerWidth * 0.4
                let h = window.innerHeight
                mouse.x = event.clientX / w * 2 - 1
                mouse.y = event.clientY / h * (-2) + 1

                RAYCAST.setFromCamera(mouse, UI_CAMERA)
                // console.log(CAMERA.zoom)
                let items = RAYCAST.intersectObjects(UI.children, false)
                items.forEach(i => {
                    let choice = i.object.name.substring(i.object.name.length - 1, i.object.name.length)
                    console.log(choice)
                    if (i.object.name === "button_back") {
                        window.open("./lobby", "_self")
                    } else if (i.object.name.startsWith("event_")) {
                        switch (choice) {
                            case 1:
                                break;
                            case 2:
                                break;
                            case 3:
                                break;
                            default:
                                break;
                        }
                    }
                    console.log(i.object.name)
                })
            }
        })
    }

    function initUI() {
        const event_geo = new THREE.PlaneGeometry(160, 60)
        let events = [LOADED_TEXTURE["event_openning"], LOADED_TEXTURE["event_level10"], LOADED_TEXTURE["event_kuesioner"]]
        for (let i = 0; i < events.length; i++) {
            let event_mesh = new THREE.Mesh(event_geo, events[i])
            event_mesh.position.set(0, 55 - (i * 70), 0)
            event_mesh.name = "event_" + (i + 1)
            let event_mesh_bg1 = new THREE.Mesh(new THREE.PlaneGeometry(165, 65), new THREE.MeshBasicMaterial({ color: 0x2f131e }))
            event_mesh_bg1.position.set(0, 55 - (i * 70), -1)
            UI.add(event_mesh_bg1)
            UI.add(event_mesh)
        }

        let back_geo = new THREE.PlaneGeometry(15, 15)
        let back_mesh = new THREE.Mesh(back_geo, LOADED_TEXTURE["back"])
        back_mesh.position.set(-70, 110, 0)
        UI.add(back_mesh)
        back_geo = new THREE.PlaneGeometry(20, 20)
        let back_mesh_bg = new THREE.Mesh(back_geo, new THREE.MeshBasicMaterial({ color: 0x2F131E }))
        back_mesh_bg.name = "button_back"
        back_mesh_bg.position.set(-70, 110, -1)
        UI.add(back_mesh_bg)

        let page_title_text = new TextGeometry("Event", {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false
        })
        let page_title = new THREE.Mesh(page_title_text, new THREE.MeshBasicMaterial({ color: 0x3F131E }))
        page_title.position.set(-50, 105, 0)
        UI.add(page_title)
    }

    function initScene() {
        UI_CONTAINER.appendChild(UI_RENDERER.domElement)
    }

    function onWindowResize() {
        UI_CAMERA.aspect = (window.innerWidth * 0.4) / window.innerHeight;
        UI_CAMERA.updateProjectionMatrix();
        UI_RENDERER.setSize(window.innerWidth * 0.4, window.innerHeight);
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);
        UI_RENDERER.render(UI, UI_CAMERA);
    }

    return (
        <>
            <div id="progress">
                <div id="progress-bar">
                </div>
            </div>
            <div id="row">
                <div id="column-1"></div>
                <div id="column-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis nihil aspernatur ullam nulla esse. Voluptates reprehenderit dignissimos inventore repellendus! Mollitia nemo officia adipisci! Dolore amet explicabo, exercitationem ab non aliquam?</div>
            </div>
        </>
    )
}

export default Event