import * as THREE from 'three';

class hat_sunglass {
    constructor() {
        let material = new THREE.MeshLambertMaterial({
            color: 0x1A1A1A,
            side: THREE.DoubleSide
        })
        let height = 7.5

        // Object 5 : Hair
        let geo_hair = new THREE.BoxGeometry(16, 1.5, 15)
        const short_hair = []
        short_hair[1] = new THREE.Mesh(geo_hair, material)
        short_hair[1].position.set(0, height - 6, 0.75)

        geo_hair = new THREE.BoxGeometry(5, 4, 15)
        short_hair[2] = new THREE.Mesh(geo_hair, material)
        short_hair[2].position.set(-4, height - 8, 0.75)
        short_hair[3] = new THREE.Mesh(geo_hair, material)
        short_hair[3].position.set(4, height - 8, 0.75)


        this.object = [[], [], [], [], [], []]
        // Head
        short_hair.forEach(e => {
            this.object[0].push(e)
        })

        // Tangan Kanan
        this.object[1].push()

        // Tangan Kiri
        this.object[2].push()

        // Body
        this.object[3].push()

        // Kaki Kanan
        this.object[4].push()

        // Kaki Kiri
        this.object[5].push()

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(short_hair)

    }
}
export default hat_sunglass;