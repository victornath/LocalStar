import * as THREE from 'three'

class Player {
    constructor() {
        const TEXTURE_LOADER = new THREE.TextureLoader()
        let LOADED_TEXTURE = []
        LOADED_TEXTURE["sack"] = new THREE.MeshStandardMaterial()
        const obj_1 = new THREE.Mesh(new THREE.CylinderGeometry(12.5, 12.5, 25, 50, 50, true), LOADED_TEXTURE["sack"])
        TEXTURE_LOADER.load('./images/texture/item/sack/bag_big.jpg', function (texture) {
            TEXTURE_LOADER.load('./images/texture/item/sack/bag_big_displaace.png', function (displace) {
                texture.wrapS = THREE.RepeatWrapping
                texture.wrapT = THREE.RepeatWrapping
                texture.repeat.set(1, 1)
                displace.wrapS = THREE.RepeatWrapping
                displace.wrapT = THREE.RepeatWrapping
                displace.repeat.set(1, 1)
                LOADED_TEXTURE["sack"] = new THREE.MeshStandardMaterial({
                    map: texture,
                    displacementMap: displace,
                    displacementScale: 1.5,
                    side: THREE.DoubleSide
                })
                obj_1.material.map = texture
                obj_1.material.displacementMap = displace
                obj_1.material.displacementScale = 1.5
                obj_1.material.side = THREE.DoubleSide
                obj_1.material.needsUpdate = true
            })
        })

        // Stack Height (y)
        let height = 0
        let obj = []

        // Object 1 : Leg
        obj_1.position.set(0, 4, 0)
        obj_1.scale.set(1, 1, 0.3)
        // obj_1.rotation.z = Math.PI / 2
        obj_1.rotation.x = Math.PI / 2
        obj.push(obj_1)

        // Group Adding
        this.group = new THREE.Group()
        obj.forEach(e => {
            this.group.add(e)
        })
    }
}
export default Player;