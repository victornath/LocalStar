import * as THREE from 'three';

class hat_cat_ear {
    constructor(material, material2) {
        let height = 11.5
        let cap = []
        let geo_hat = new THREE.BoxBufferGeometry(2.5, 5, 5)
        cap[1] = new THREE.Mesh(geo_hat, [material2, material, material, material, material, material])
        cap[1].position.set(-4.25, height, -1.5)
        cap[1].rotation.x = -Math.PI / 2
        geo_hat = new THREE.BoxBufferGeometry(5, 2.5, 5)
        cap[2] = new THREE.Mesh(geo_hat, [material, material, material, material2, material, material])
        cap[2].position.set(-3, height, -3)
        cap[2].rotation.x = -Math.PI / 2

        geo_hat = new THREE.BoxBufferGeometry(2, 3, 1.5)
        cap[3] = new THREE.Mesh(geo_hat, [material2, material, material, material, material, material])
        cap[3].position.set(-3.25, height + 3, -0.5)
        cap[3].rotation.x = -Math.PI / 2
        geo_hat = new THREE.BoxBufferGeometry(3, 2, 1.5)
        cap[4] = new THREE.Mesh(geo_hat, [material, material, material, material2, material, material])
        cap[4].position.set(-2, height + 3, -2)
        cap[4].rotation.x = -Math.PI / 2

        geo_hat = new THREE.BoxBufferGeometry(2, 2, 1.5)
        cap[5] = new THREE.Mesh(geo_hat, [material, material, material, material, material, material])
        cap[5].position.set(-1.5, height + 4.5, 0)
        cap[5].rotation.x = -Math.PI / 2

        let cat_ear = new THREE.Group()
        cap.forEach(e => {
            cat_ear.add(e)
        })

        let cat_ear2 = cat_ear.clone()
        cat_ear.rotation.y = -Math.PI / 4.5
        cat_ear2.rotation.y = -Math.PI / 4.5
        cat_ear.position.set(-5, 0, 5)
        cat_ear2.position.set(7, 0, 5)

        // Object 5 : Vedora Ring
        this.object = [[], [], [], [], [], []]
        // Head
        this.object[0].push(cat_ear, cat_ear2)

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
        this.group.add(cat_ear)
        this.group.add(cat_ear2)

    }
}
export default hat_cat_ear;