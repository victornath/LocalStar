import React from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import Gacha from '../3DObject/Gacha/gacha.js'
import ItemLoader from '../character/ItemLoader.js';
import WebGL from '../WebGL.js';
import { useSelector } from "react-redux";

const Shop = () => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    let audioBGM = new Audio("./audio/bgm_gacha.mp3")
    let audioClick = new Audio("./audio/button_click.mp3")

    audioBGM.loop = true

    // Variables
    const MANAGER = new THREE.LoadingManager();
    const FONT_LOADER = new FontLoader(MANAGER);
    const TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)
    const ITEM_LOADER = new ItemLoader();
    const FONT_SIZE = 0.08;

    let CONTAINER
    let UI_CONTAINER

    const UI = new THREE.Scene();
    const UI_CAMERA = new THREE.OrthographicCamera((-135 * (window.innerWidth / window.innerHeight)), (135 * (window.innerWidth / window.innerHeight)), 135, -135, -1000, 1000)
    const UI_RENDERER = new THREE.WebGLRenderer({
        antialias: true,
        localClippingEnabled: true,
        alpha: true
    });
    // const CAMERA_CONTROL = new MapControls(CAMERA, RENDERER.domElement)
    const RAYCAST = new THREE.Raycaster()
    let LOADED_FONT
    let LOADED_MATERIAL = []
    let LOADED_TEXTURE = []
    let TOP_MENU = [];
    let GACHA_UI = [];
    let RESULT_UI = []
    let GACHA = []
    let PLAYER_DATA
    let sound_icon
    let SOUND_PLAY

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
        loadData("/api/users/getData")
        initRaycast()
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
        TEXTURE_LOADER.load('./images/texture/ui/currency/points.png', function (texture) {
            LOADED_TEXTURE["point"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                alphaTest: 0.3
            })
        })
        TEXTURE_LOADER.load('./images/texture/ui/currency/gold.png', function (texture) {
            LOADED_TEXTURE["gold"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                alphaTest: 0.3
            })
        })
        TEXTURE_LOADER.load('./images/texture/ui/sound/sound_on.png', function (texture) {
            LOADED_TEXTURE["sound_on"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                alphaTest: 0.6
            })
        })
        TEXTURE_LOADER.load('./images/texture/ui/sound/sound_off.png', function (texture) {
            LOADED_TEXTURE["sound_off"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                alphaTest: 0.6
            })
        })
        TEXTURE_LOADER.load('./images/texture/ui/arrow/arrow_l_back.png', function (texture) {
            LOADED_TEXTURE["arrow_back"] = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                alphaTest: 0.5,
                alphaToCoverage: true
            })
        })

        // Material
        LOADED_MATERIAL.push(
            new THREE.MeshBasicMaterial({ color: 0xcec3c1 }),
            new THREE.MeshBasicMaterial({ color: 0x240115 }),
            new THREE.MeshBasicMaterial({ color: 0xA5908D }),
            new THREE.MeshBasicMaterial({ color: 0x2F131E }),
            new THREE.MeshBasicMaterial({ color: 0x87F5FB })
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
        initUI(data)
    }

    async function getItemName(id) {
        const response = await fetch('api/items?id=' + id, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });
        return await response.json()
    }


    async function loadItem(itemId) {
        return await ITEM_LOADER.load(itemId)
    }

    async function spinGacha(url, id) {
        const gacha_names = ["Basic Gacha", "Simple Gacha", "Premium Gacha"]
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userInfo.token,
            },
            body: JSON.stringify({
                "gacha_name": gacha_names[id]
            })
        });
        var data = await response.json()
        if (data) {
            console.log(data)
            showResult(data)
        }
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

    function initUI(loadedData) {
        if (RESULT_UI.length > 0) {
            RESULT_UI.forEach(e => {
                UI.remove(e)
            })
            RESULT_UI = []
        }
        if (TOP_MENU.length > 0) {
            TOP_MENU.forEach(e => {
                UI.remove(e)
            })
            TOP_MENU = []
        }
        PLAYER_DATA = loadedData
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        GACHA_UI.push(ambientLight)
        UI.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        GACHA_UI.push(dirLight)
        UI.add(dirLight);


        let page_text = new TextGeometry("Toko", {
            font: LOADED_FONT,
            size: 14,
            height: 0,
            bevelEnabled: false,
        });
        let page_mesh = new THREE.Mesh(page_text, LOADED_MATERIAL[1])
        centerText(page_text, page_mesh, -145, 242, 0)
        TOP_MENU.push(page_mesh)
        UI.add(page_mesh)

        let back_button = new THREE.Mesh(new THREE.PlaneGeometry(38, 38), LOADED_MATERIAL[3])
        back_button.position.set(-190, 242, -1)
        back_button.name = "button_back"
        TOP_MENU.push(back_button)
        UI.add(back_button)
        let back = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), LOADED_TEXTURE["arrow_back"])
        back.position.set(-190, 242, 1)
        UI.add(back)

        loadUI_currency()

        const gacha_names = ["Basic Gacha", "Simple Gacha", "Premium Gacha"]
        const gacha_color = ["#EB1B0C", "#167D3D", "#364EB9"]
        const gacha_prices = ["150 Points", "150 Points", "50 Gold"]
        for (let i = 0; i < 3; i++) {
            GACHA.push(new Gacha(gacha_color[i]))
            let gacha_machine = GACHA[i].group
            gacha_machine.scale.set(0.75, 0.75, 0.75)
            gacha_machine.position.set(-160 + (150.55 * i), 137.5, 1)
            GACHA_UI.push(gacha_machine)
            UI.add(gacha_machine)
            let gacha_bg = new THREE.Mesh(new THREE.PlaneGeometry(140, 190), LOADED_MATERIAL[2])
            gacha_bg.position.set(-140 + (150.55 * i), 117.5, 0)
            GACHA_UI.push(gacha_bg)
            UI.add(gacha_bg)
            gacha_bg = new THREE.Mesh(new THREE.PlaneGeometry(140, 190), LOADED_MATERIAL[3])
            gacha_bg.position.set(-135 + (150.55 * i), 112.5, -1)
            GACHA_UI.push(gacha_bg)
            UI.add(gacha_bg)

            let spin_button = new THREE.Mesh(new THREE.PlaneGeometry(100, 30), LOADED_MATERIAL[3])
            spin_button.position.set(-142.5 + (150.55 * i), 45, 2)
            spin_button.name = "button_spin_" + i
            GACHA_UI.push(spin_button)
            UI.add(spin_button)
            let spin_text = new TextGeometry("Spin", {
                font: LOADED_FONT,
                size: 10,
                height: 0,
                bevelEnabled: false
            })
            let spin_mesh = new THREE.Mesh(spin_text, LOADED_MATERIAL[0])
            centerText(spin_text, spin_mesh, -142.5 + (150.55 * i), 45, 4)
            spin_mesh.name = "button_spin_" + i
            GACHA_UI.push(spin_mesh)
            UI.add(spin_mesh)

            let price_text = new TextGeometry(gacha_prices[i], {
                font: LOADED_FONT,
                size: 8,
                height: 0,
                bevelEnabled: false
            })
            let price_mesh = new THREE.Mesh(price_text, LOADED_MATERIAL[1])
            centerText(price_text, price_mesh, -142.5 + (150.55 * i), 85, 4)
            GACHA_UI.push(price_mesh)
            UI.add(price_mesh)

            let name_text = new TextGeometry(gacha_names[i], {
                font: LOADED_FONT,
                size: 10,
                height: 0,
                bevelEnabled: false
            })
            let name_mesh = new THREE.Mesh(name_text, LOADED_MATERIAL[1])
            centerText(name_text, name_mesh, -142.5 + (150.55 * i), 100, 4)
            GACHA_UI.push(name_mesh)
            UI.add(name_mesh)
        }
    }

    function initRaycast() {
        document.addEventListener("click", function (event) {
            if (SOUND_PLAY === undefined) {
                audioBGM.play()
                SOUND_PLAY = true
            }
            audioClick.play()
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
                    let choice = parseInt(obj_name.substring(obj_name.length - 1, obj_name.length))
                    if (obj_name.startsWith("button_spin_")) {
                        spinGacha("/api/users/shop", choice)
                        items.splice(1, 9999)
                    } else {
                        switch (obj_name) {
                            case "button_next":
                                break;
                            case "button_prev":
                                break;
                            case "button_back":
                                window.open("./lobby", "_self")
                                break;
                            case "button_close_result":
                                loadData("/api/users/getData")
                                break;
                            case "top_menu_04":
                                if (SOUND_PLAY) {
                                    audioBGM.pause()
                                    sound_icon.material = LOADED_TEXTURE["sound_off"]
                                    SOUND_PLAY = false
                                } else {
                                    audioBGM.play()
                                    sound_icon.material = LOADED_TEXTURE["sound_on"]
                                    SOUND_PLAY = true
                                }
                                break;
                        }
                    }
                })
            }
        })
    }


    function loadUI_currency() {
        let currency_plane = new THREE.PlaneGeometry(115, 31)
        let currency_shadow_plane = new THREE.PlaneGeometry(120, 36)
        let player_background = new THREE.Mesh(currency_plane, LOADED_MATERIAL[2])
        player_background.position.set(0.25, 242, 0)
        player_background.name = "top_menu_02"
        TOP_MENU.push(player_background)
        UI.add(player_background)
        player_background = new THREE.Mesh(currency_shadow_plane, LOADED_MATERIAL[3])
        player_background.position.set(0.25, 242, -1)
        player_background.name = "top_menu_02"
        TOP_MENU.push(player_background)
        UI.add(player_background)

        let point_geometry = new TextGeometry(PLAYER_DATA.point.toString(), {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        let mesh = new THREE.Mesh(point_geometry, LOADED_MATERIAL[1])
        alignText(point_geometry, mesh, 27.5, 242, 1)
        TOP_MENU.push(mesh)
        UI.add(mesh)

        let currency_logo = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), LOADED_TEXTURE["point"])
        currency_logo.position.set(42.5, 242, 2)
        UI.add(currency_logo)
        currency_logo = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), LOADED_TEXTURE["gold"])
        currency_logo.position.set(172.5, 242, 2)
        UI.add(currency_logo)

        player_background = new THREE.Mesh(currency_plane, LOADED_MATERIAL[2])
        player_background.position.set(129.25, 242, 0)
        player_background.name = "top_menu_03"
        TOP_MENU.push(player_background)
        UI.add(player_background)
        player_background = new THREE.Mesh(currency_shadow_plane, LOADED_MATERIAL[3])
        player_background.position.set(129.25, 242, -1)
        player_background.name = "top_menu_03"
        TOP_MENU.push(player_background)
        UI.add(player_background)


        point_geometry = new TextGeometry(PLAYER_DATA.gold.toString(), {
            font: LOADED_FONT,
            size: 10,
            height: 0,
            bevelEnabled: false,
        });
        mesh = new THREE.Mesh(point_geometry, LOADED_MATERIAL[1])
        alignText(point_geometry, mesh, 157.5, 242, 1)
        TOP_MENU.push(mesh)
        UI.add(mesh)

        if (SOUND_PLAY) {
            sound_icon = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), LOADED_TEXTURE["sound_on"])
        } else {
            sound_icon = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), LOADED_TEXTURE["sound_off"])
        }
        sound_icon.position.set(214.75, 243.5, 1)
        TOP_MENU.push(sound_icon)
        UI.add(sound_icon)

        player_background = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), LOADED_MATERIAL[2])
        player_background.position.set(214.75, 243.5, 0)
        player_background.name = "top_menu_04"
        TOP_MENU.push(player_background)
        UI.add(player_background)
        player_background = new THREE.Mesh(new THREE.PlaneGeometry(33, 33), LOADED_MATERIAL[3])
        player_background.position.set(219.75, 238.5, -1)
        TOP_MENU.push(player_background)
        UI.add(player_background)
    }

    function gameLoop() {
        requestAnimationFrame(gameLoop);

        // if(PLAYER_CHOOSE[0] != null && PLAYER_CHOOSE[1] != null){
        //     bentenganGame(PLAYER_CHOOSE)
        // }

        UI_RENDERER.render(UI, UI_CAMERA);
    }

    function showResult(data) {
        loadItem(data.result).then(result => {
            if (GACHA_UI.length > 0) {
                GACHA_UI.forEach(e => {
                    UI.remove(e)
                })
                GACHA_UI = []
            }

            let name_text = new TextGeometry("You got:", {
                font: LOADED_FONT,
                size: 10,
                height: 0,
                bevelEnabled: false
            })
            let name_mesh = new THREE.Mesh(name_text, LOADED_MATERIAL[1])
            centerText(name_text, name_mesh, 0, 175, 2)
            RESULT_UI.push(name_mesh)
            UI.add(name_mesh)

            let back_arrow = new THREE.Mesh(new THREE.PlaneGeometry(25, 25), LOADED_MATERIAL[1])
            back_arrow.position.set(-192.5, 195, 1)
            back_arrow.name = "button_close_result"
            RESULT_UI.push(back_arrow)
            UI.add(back_arrow)

            getItemName(data.result).then(itemName => {
                name_text = new TextGeometry(itemName, {
                    font: LOADED_FONT,
                    size: 11,
                    height: 0,
                    bevelEnabled: false
                })
                name_mesh = new THREE.Mesh(name_text, LOADED_MATERIAL[1])
                centerText(name_text, name_mesh, 0, 55, 2)
                RESULT_UI.push(name_mesh)
                UI.add(name_mesh)
            })

            name_text = new TextGeometry(data.message, {
                font: LOADED_FONT,
                size: 8,
                height: 0,
                bevelEnabled: false
            })
            name_mesh = new THREE.Mesh(name_text, LOADED_MATERIAL[1])
            centerText(name_text, name_mesh, 0, 37.5, 2)
            RESULT_UI.push(name_mesh)
            UI.add(name_mesh)

            let item = new THREE.Mesh(new THREE.PlaneGeometry(75, 75), result.texture)
            item.position.set(0, 115, 2)
            RESULT_UI.push(item)
            UI.add(item)

            let circle = new THREE.Mesh(new THREE.CircleGeometry(50, 50), LOADED_MATERIAL[4])
            circle.position.set(0, 115, 1)
            RESULT_UI.push(circle)
            UI.add(circle)

            let gacha_bg = new THREE.Mesh(new THREE.PlaneGeometry(440, 190), LOADED_MATERIAL[2])
            gacha_bg.position.set(10, 117.5, 0)
            RESULT_UI.push(gacha_bg)
            UI.add(gacha_bg)
            gacha_bg = new THREE.Mesh(new THREE.PlaneGeometry(440, 190), LOADED_MATERIAL[3])
            gacha_bg.position.set(15, 112.5, -1)
            RESULT_UI.push(gacha_bg)
            UI.add(gacha_bg)
        })
    }

    function alignText(textGeo, textMesh, x, y, z) {
        textGeo.computeBoundingBox();
        const center = textGeo.boundingBox.getCenter(new THREE.Vector3())
        textMesh.updateMatrixWorld();
        center.applyMatrix4(textMesh.matrixWorld);
        textMesh.geometry.translate(x - (2 * center.x), y - center.y, z - center.z)
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