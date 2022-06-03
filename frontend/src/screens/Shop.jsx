import React from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import WebGL from '../WebGL.js';

const Shop = () => {
    // Library Imports


    // Variables
    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)

    let CONTAINER
    let UI_CONTAINER

    const UI = new THREE.Scene();
    const UI_CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth / window.innerHeight)), (135 * (window.innerWidth / window.innerHeight)), 135, -135, -1000, 1000)
    const UI_RENDERER = new THREE.WebGLRenderer({
        antialias: false,
        localClippingEnabled: true,
        alpha: true
    });
    // const CAMERA_CONTROL = new MapControls(CAMERA, RENDERER.domElement)
    const RAYCAST = new THREE.Raycaster()
    let LOADED_FONT
    let PLAYER_PREVIEW
    let ui_item_list = [];
    let TOP_MENU = [];
    let GACHA_UI = [];
    let USED_FONT;
    let ui_preview = [];

    let ActiveCategory = 0;
    // 0 = Brow, 1 = Eye, 2 = Nose, 3 = Mouth

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
        CONTAINER.remove();
        throw 'WebGL disabled or not supported';
    }

    function init() {
        // Initiate Loading

        // Initiate the Game
        initRenderer()
        initCamera()
        initUI()
        initScene()
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
            console.log('Loading complete!');

        };
    }

    function load() {
        initManager()
        FONT_LOADER.load('./Bahnschrift_Regular.json', function (font) {
            LOADED_FONT = font
        });

    }

    function initRenderer() {
        UI_RENDERER.setSize(window.innerWidth, window.innerHeight)
        UI_RENDERER.setClearColor(0xcec3c1)
        UI_RENDERER.shadowMap.enabled = true

    }

    function initCamera() {
        UI_CAMERA.position.set(20, 140, 150)
        UI_CAMERA.updateProjectionMatrix();
    }

    function initScene() {
        UI_CONTAINER.appendChild(UI_RENDERER.domElement)
    }

    function initUI() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        UI.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        UI.add(dirLight);

        let base_material = new THREE.MeshLambertMaterial({
            color: 0xcec3c1
        })
        let other_material = new THREE.MeshBasicMaterial({
            color: 0x240115
        })
        let material = new THREE.MeshBasicMaterial({
            color: 0xA5908D
        })
        let material2 = new THREE.MeshBasicMaterial({
            color: 0x2F131E
        })


        let page_text = new TextGeometry("Shop", {
            font: LOADED_FONT,
            size: 14,
            height: 0,
            bevelEnabled: false,
        });
        let page_mesh = new THREE.Mesh(page_text, other_material)
        centerText(page_text, page_mesh, -145, 242, 0)
        TOP_MENU.push(page_mesh)
        UI.add(page_mesh)

        let back_button = new THREE.Mesh(new THREE.PlaneGeometry(38, 38), material2)
        back_button.position.set(-190, 242, -1)
        back_button.name = "button_back"
        TOP_MENU.push(back_button)
        UI.add(back_button)

        let currency_plane = new THREE.PlaneGeometry(109, 31)
        let currency_shadow_plane = new THREE.PlaneGeometry(114, 36)
        let player_background = new THREE.Mesh(currency_plane, material)
        player_background.position.set(-2.75, 242, 0)
        player_background.name = "top_menu_02"
        TOP_MENU.push(player_background)
        UI.add(player_background)
        player_background = new THREE.Mesh(currency_shadow_plane, material2)
        player_background.position.set(-2.75, 242, -1)
        player_background.name = "top_menu_02"
        TOP_MENU.push(player_background)
        UI.add(player_background)


        let point_geometry = new TextGeometry("Player Point", {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        let mesh = new THREE.Mesh(point_geometry, other_material)
        centerText(point_geometry, mesh, -2.75, 242, 1)
        TOP_MENU.push(mesh)
        UI.add(mesh)

        player_background = new THREE.Mesh(currency_plane, material)
        player_background.position.set(126.25, 242, 0)
        player_background.name = "top_menu_03"
        TOP_MENU.push(player_background)
        UI.add(player_background)
        player_background = new THREE.Mesh(currency_shadow_plane, material2)
        player_background.position.set(126.25, 242, -1)
        player_background.name = "top_menu_03"
        TOP_MENU.push(player_background)
        UI.add(player_background)


        point_geometry = new TextGeometry("Player Gold", {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        mesh = new THREE.Mesh(point_geometry, other_material)
        centerText(point_geometry, mesh, 126.25, 242, 1)
        TOP_MENU.push(mesh)
        UI.add(mesh)

        player_background = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), material)
        player_background.position.set(214.75, 243.5, 0)
        player_background.name = "top_menu_04"
        TOP_MENU.push(player_background)
        UI.add(player_background)
        player_background = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), material2)
        player_background.position.set(219.75, 238.5, -1)
        player_background.name = "top_menu_04"
        TOP_MENU.push(player_background)
        UI.add(player_background)

        for (let i = 0; i < 3; i++) {
            let gacha_bg = new THREE.Mesh(new THREE.PlaneGeometry(140, 190), material)
            gacha_bg.position.set(-140 + (150.55 * i), 117.5, 0)
            gacha_bg.name = "top_menu_04"
            GACHA_UI.push(gacha_bg)
            UI.add(gacha_bg)
            gacha_bg = new THREE.Mesh(new THREE.PlaneGeometry(140, 190), material2)
            gacha_bg.position.set(-135 + (150.55 * i), 112.5, -1)
            gacha_bg.name = "top_menu_04"
            GACHA_UI.push(gacha_bg)
            UI.add(gacha_bg)
        }


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
                console.log(items)
                items.forEach(i => {
                    console.log(i.object.name)
                    let obj_name = i.object.name
                    if (obj_name.startsWith("button_")) {
                        switch (obj_name) {
                            case "button_next":
                                break;
                            case "button_prev":
                                break;
                            case "button_back":
                                window.open("../lobby", "_self")
                                break;
                            case "button_save": break;
                        }
                    }
                })
            }
        })

    }
    function gameLoop() {
        requestAnimationFrame(gameLoop);

        UI_RENDERER.render(UI, UI_CAMERA);
    }

    function centerText(textGeo, textMesh, x, y, z) {
        textGeo.computeBoundingBox();
        const center = textGeo.boundingBox.getCenter(new THREE.Vector3())
        textMesh.updateMatrixWorld();
        center.applyMatrix4(textMesh.matrixWorld);
        textMesh.geometry.translate(x - center.x, y - center.y, z - center.z,)
    }

    function onWindowResize() {
        UI_CAMERA.aspect = window.innerWidth / window.innerHeight;
        UI_CAMERA.updateProjectionMatrix();
        UI_RENDERER.setSize(window.innerWidth, window.innerHeight);
    }
    return (
        <>
            <div id="progress">
                <div id="progress-bar">
                </div>
            </div>
            <div id="ui-holder"></div>
            <div id="canvas-holder"></div>
        </>
    )
}

export default Shop