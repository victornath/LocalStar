import * as THREE from 'three'

/*

    Gunakan file ini sebagai TEMPLATE PEMBUATAN OBJECT.

    1. Sebelum membuat object, ganti nama Class (Line 27) dan export (Line 122)
       sesuai dengan nama object yang akan dibuat

    2. Basic test material hanya digunakan untuk testing.
    3. Disarankan untuk menambahkan comment nama Sub Object.
    4. Untuk membuat object:
        1. Pembuatan object terdiri dari:
            - Properties
            - Geometry
            - Mesh
            - Positioning
            - Rotating (optional)
        2. Setelah object terbuat, lakukan Group Adding
    5. Untuk melakukan testing, buka object_test.js.
    6. Ikuti petunjuk yang sudah di sediakan di object_test.js
    7. Lakuan Go Live Server pada object_test.HTML
    
*/


class Player {
    constructor() {
        const TEXTURE_LOADER = new THREE.TextureLoader()
        let LOADED_MATERIAL = []
        LOADED_MATERIAL["rope"] = new THREE.MeshStandardMaterial()
        let obj_1 = new THREE.Mesh(new THREE.TorusKnotGeometry(7.5, 2, 150, 50, 8, 6), LOADED_MATERIAL["rope"])
        TEXTURE_LOADER.load('./images/texture/item/rope/rope_._diffuse.png', function (texture) {
            TEXTURE_LOADER.load('./images/texture/item/rope/rope_._normal.png', function (normal) {
                TEXTURE_LOADER.load('./images/texture/item/rope/rope_._displacement.png', function (displace) {
                    texture.wrapS = THREE.RepeatWrapping
                    texture.wrapT = THREE.RepeatWrapping
                    texture.repeat.set(2, 10)
                    normal.wrapS = THREE.RepeatWrapping
                    normal.wrapT = THREE.RepeatWrapping
                    normal.repeat.set(2, 10)
                    displace.wrapS = THREE.RepeatWrapping
                    displace.wrapT = THREE.RepeatWrapping
                    displace.repeat.set(2, 10)
                    LOADED_MATERIAL["rope"] = new THREE.MeshStandardMaterial({
                        map: texture,
                        normalMap: normal,
                        displacementMap: displace
                    })
                    obj_1.material.map = texture
                    obj_1.material.normalMap = normal
                    obj_1.material.displacementMap = displace
                    obj_1.material.needsUpdate = true
                })
            })
        })
        // Stack Height (y)
        let height = 0
        let obj = []

        // Object 1 : Leg
        obj_1.position.set(0, height + (7.5 / 2), 0)
        obj_1.rotation.x = Math.PI / 2
        obj.push(obj_1)

        height += 7.5

        // Group Adding
        this.group = new THREE.Group()
        obj.forEach(e => {
            this.group.add(e)
        })
    }
}
export default Player;