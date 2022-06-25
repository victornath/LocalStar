import * as THREE from 'three';

class shoes_boots {
    constructor(material) {
        let shoes = []
        let geo_shoes = new THREE.BoxGeometry(6, 3, 8)
        shoes[1] = new THREE.Mesh(geo_shoes, material)
        shoes[1].position.set(0, -6.1, 1.4)
        shoes[2] = new THREE.Mesh(geo_shoes, material)
        shoes[2].position.set(0, -6.1, 1.4)
        geo_shoes = new THREE.BoxGeometry(6, 6, 6)
        shoes[3] = new THREE.Mesh(geo_shoes, material)
        shoes[3].position.set(0, -4.6, 0)
        shoes[4] = new THREE.Mesh(geo_shoes, material)
        shoes[4].position.set(0, -4.6, 0)

        this.object = [[], [], [], [], [], []]
        // Head
        this.object[0].push()

        // Tangan Kanan
        this.object[1].push()

        // Tangan Kiri
        this.object[2].push()

        // Body
        this.object[3].push()

        // Kaki Kanan
        this.object[4].push(shoes[1], shoes[3])

        // Kaki Kiri
        this.object[5].push(shoes[2], shoes[4])

        // Group Adding
        this.group = new THREE.Group()
        shoes.forEach(e => {
            this.group.add(e)
        });
    }
}
export default shoes_boots;