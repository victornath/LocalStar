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
        TEXTURE_LOADER.load('./images/event/blank_event.png', function (texture) {
            LOADED_TEXTURE["blank_event"] = new THREE.MeshBasicMaterial({
                map: texture
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
            UI_CONTAINER = document.getElementById('ui-holder');
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
                let w = window.innerWidth
                let h = window.innerHeight
                mouse.x = event.clientX / w * 2 - 1
                mouse.y = event.clientY / h * (-2) + 1

                RAYCAST.setFromCamera(mouse, UI_CAMERA)
                // console.log(CAMERA.zoom)
                let items = RAYCAST.intersectObjects(UI.children, false)
                items.forEach(i => {
                    console.log(i.object.name)
                })
            }
        })
    }

    function initUI() {
        const event_geo = new THREE.PlaneGeometry(160, 60)
        const back_geo = new THREE.PlaneGeometry(20, 20)

        let back_mesh = new THREE.Mesh(back_geo, LOADED_TEXTURE["blank_event"])
        let event_mesh = new THREE.Mesh(event_geo, LOADED_TEXTURE["blank_event"])
        event_mesh.position.set(0, 55, 0)
        UI.add(event_mesh)
        let temp = event_mesh.clone()
        temp.position.set(0, -15, 0)
        UI.add(temp)
        temp = event_mesh.clone()
        temp.position.set(0, -85, 0)
        UI.add(temp)
        back_mesh.position.set(-70, 110, 0)
        UI.add(back_mesh)
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
            <div id="ui-holder"></div>
            <div id="canvas-holder">
            </div>
        </>
    )
}

export default Event