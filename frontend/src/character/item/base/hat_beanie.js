import * as THREE from 'three';

class hat_beanie {
    constructor(material) {
        let height = 11.5
        let cap = []
        let geo_hat = new THREE.BoxGeometry(17.5, 5, 17.5)
        cap[1] = new THREE.Mesh(geo_hat, material)
        cap[1].position.set(0, height, 0)
        geo_hat = new THREE.BoxGeometry(12.5, 5, 12.5)
        cap[2] = new THREE.Mesh(geo_hat, material)
        cap[2].position.set(0, height + 2.5, -1)
        geo_hat = new THREE.BoxGeometry(7.5, 5, 7.5)
        cap[3] = new THREE.Mesh(geo_hat, material)
        cap[3].position.set(0, height + 5, -2)

        let cat_ear = new THREE.Group()
        cap.forEach(e => {
            cat_ear.add(e)
        })

        let cat_ear2 = cat_ear.clone()
        // cat_ear.position.set(-5, 0, 5)
        // cat_ear2.position.set(7, 0, 5)

        // Object 5 : Vedora Ring
        this.object = [[], [], [], [], [], []]
        // Head
        this.object[0].push(cat_ear)

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
        // this.group.add(cat_ear2)

    }
}
export default hat_beanie;