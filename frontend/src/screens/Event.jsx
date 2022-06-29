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
        showEvent(1)
    }

    function initRenderer() {
        UI_RENDERER.setSize(window.innerWidth * 0.4, window.innerHeight)
        UI_RENDERER.setClearColor(0xA5908D)
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
                    let choice = parseInt(i.object.name.substring(i.object.name.length - 1, i.object.name.length))
                    if (i.object.name === "button_back") {
                        window.open("./lobby", "_self")
                    } else if (i.object.name.startsWith("event_")) {
                        switch (choice) {
                            case 1:
                                showEvent(1)
                                break;
                            case 2:
                                showEvent(2)
                                break;
                            case 3:
                                showEvent(3)
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

    function showEvent(eventId) {
        let event = []
        event.push('                    <img src="./images/event/event_openning.png"></img>\n        <h1 class="section-heading">Pembukaan Legends Arcadia</h1>\n        <p>Selamat datang di Legends Arcadia!</p>\n        <p>Legends Arcadia adalah sebuah permainan berbasis web yang mengangkat permainan-permainan tradisional Indonesia ke dalam bentuk virtual.</p>\n        <p>Pemilihan basis web ini diperuntukkan agar dapat memudahkan para pemainnya untuk mengakses permainan Legends Arcadia dari berbagia platform, baik Desktop, Android, maupun iOS</p>\n        <p>Pada Legends Arcadia, kalian dapat bertemu dengan para pemain lain, dan memainkan permainan-permainan tradisional Indonesia.</p>')
        event.push('                    <img src="./images/event/event_level10.png" />\n        <h1 class="section-header">Raih Level 10 dan Dapatkan Saldo E-Wallet!</h1>\n        <p>Periode: 29 Juni 2022 - 10 Juli 2022</p>\n        <p>Pada event ini, para pemain ditantang untuk mencapai level 10 dalam periode waktu yang telah ditentukan. Bisakah kamu menjadi salah satu yang berhasil mencapainya?</p>\n        <p>Setelah mencapai level 10, pemain dimohon untuk melengkapi data pada formulir google berikut, agar tim Legends Arcadia dapat menghubungi kalian</p>\n        <p><a href="http://bit.ly/LegendsArcadiaLevel10">http://bit.ly/LegendsArcadiaLevel10</a></p>\n        <p>Terima kasih</p>\n        <p class="disclaimer">Tim Legends Arcadia berhak untuk membatalkan dan mendiskualifikasi pemain yang terbukti melakukan kecurangan dalam bentuk apapun.</p>\n')
        event.push('                    <img src="./images/event/event_kuesioner.png" />\n        <h1 class="section-header">Isi Kuesioner dan Dapatkan Saldo E-Wallet!</h1>\n        <p>Periode: 29 Juni 2022 - 6 Juli 2022</p>\n        <p>Pada event ini, pemain bisa mendapatkan saldo E-Wallet sebesar Rp. ##????#?#?#?# hanya dengan mengisi kuesioner.</p>\n        <p>Adapun syarat yang harus dipenuhi oleh pemain adalah:</p>\n        <ul>\n            <li>Pemain minimal Level 2.</li>\n            <li>Pemain pernah memainkan 4 jenis permainan yang ada di Legends Arcadia.</li>\n            <li>Pemenang dipilih secara acak pada akhir periode.</li>\n        </ul>\n        <p>Kuesioner dapat diisi pada link berikut: <a href="http://bit.ly/LegendsArcadiaKuesioner">http://bit.ly/LegendsArcadiaKuesioner</a></p>\n        <p class="disclaimer">Tim Legends Arcadia berhak untuk membatalkan dan mendiskualifikasi pemain yang terbukti melakukan kecurangan dalam bentuk apapun.</p>\n')
        document.getElementById("column-2").innerHTML = event[(eventId - 1)]
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
            <div class="row">
                <div class="col-sm-5" id="column-1"></div>
                <div class="col-sm-6 overflow-auto event-content" id="column-2">
                </div>
            </div>
        </>
    )
}

export default Event