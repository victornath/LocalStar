import * as THREE from 'three';

class top_sweater {
    constructor(material, material2) {
        let shirt = []
        let plane_shirt = new THREE.PlaneGeometry(15.1, 16.5)
        shirt[0] = new THREE.Mesh(plane_shirt, material)
        shirt[0].position.set(0, 2, 5.1)
        shirt[1] = new THREE.Mesh(plane_shirt, material2)
        shirt[1].position.set(0, 2, -5.1)

        plane_shirt = new THREE.PlaneGeometry(10.1, 16.5)
        shirt[2] = new THREE.Mesh(plane_shirt, material2)
        shirt[2].rotation.y = -Math.PI / 2
        shirt[2].position.set(-7.55, 2, 0)
        shirt[3] = new THREE.Mesh(plane_shirt, material2)
        shirt[3].rotation.y = -Math.PI / 2
        shirt[3].position.set(7.55, 2, 0)

        plane_shirt = new THREE.PlaneGeometry(5.15, 11.5)
        shirt[4] = new THREE.Mesh(plane_shirt, material2)
        shirt[4].rotation.y = -Math.PI / 2
        shirt[4].position.set(-2.55, 0.8, 0)
        shirt[5] = new THREE.Mesh(plane_shirt, material2)
        shirt[5].rotation.y = -Math.PI / 2
        shirt[5].position.set(2.55, 0.8, 0)

        shirt[6] = new THREE.Mesh(plane_shirt, material2)
        shirt[6].position.set(0, 0.8, 2.6)

        shirt[7] = new THREE.Mesh(plane_shirt, material2)
        shirt[7].position.set(0, 0.8, 2.6)

        shirt[8] = new THREE.Mesh(plane_shirt, material2)
        shirt[8].position.set(0, 0.8, -2.6)

        shirt[9] = new THREE.Mesh(plane_shirt, material2)
        shirt[9].position.set(0, 0.8, -2.6)

        plane_shirt = new THREE.PlaneGeometry(5.1, 5.1)
        shirt[10] = new THREE.Mesh(plane_shirt, material2)
        shirt[10].position.set(0, 6.55, 0)
        shirt[10].rotation.x = -Math.PI / 2
        shirt[11] = new THREE.Mesh(plane_shirt, material2)
        shirt[11].position.set(0, 6.55, 0)
        shirt[11].rotation.x = -Math.PI / 2

        plane_shirt = new THREE.PlaneGeometry(5.1, 10)
        shirt[12] = new THREE.Mesh(plane_shirt, material)
        shirt[12].position.set(5, 2 + 8.35, 0)
        shirt[12].rotation.x = -Math.PI / 2
        shirt[13] = new THREE.Mesh(plane_shirt, material)
        shirt[13].position.set(-5, 2 + 8.35, 0)
        shirt[13].rotation.x = -Math.PI / 2

        plane_shirt = new THREE.PlaneGeometry(3, 16.5)
        shirt[14] = new THREE.Mesh(plane_shirt, material2)
        shirt[14].position.set(-6, 2, 5.15)
        shirt[15] = new THREE.Mesh(plane_shirt, material2)
        shirt[15].position.set(6, 2, 5.15)

        plane_shirt = new THREE.PlaneGeometry(2, 10)
        shirt[16] = new THREE.Mesh(plane_shirt, material2)
        shirt[16].rotation.z = Math.PI / 4
        shirt[16].position.set(-2.5, 8, 5.15)
        shirt[17] = new THREE.Mesh(plane_shirt, material2)
        shirt[17].rotation.z = -Math.PI / 4
        shirt[17].position.set(2.5, 8, 5.15)

        plane_shirt = new THREE.PlaneGeometry(5, 3.5)
        shirt[18] = new THREE.Mesh(plane_shirt, material2)
        shirt[18].rotation.z = -Math.PI / 4
        shirt[18].position.set(-3, 7.5, 5.15)
        shirt[19] = new THREE.Mesh(plane_shirt, material2)
        shirt[19].position.set(3, 7.5, 5.15)
        shirt[19].rotation.z = Math.PI / 4

        plane_shirt = new THREE.PlaneGeometry(9, 13)
        shirt[20] = new THREE.Mesh(plane_shirt, material2)
        shirt[20].position.set(0, 0.25, 5.15)

        this.object = [[], [], [], [], [], []]
        // Head
        this.object[0].push()

        // Tangan Kanan
        this.object[1].push(shirt[4], shirt[6], shirt[8], shirt[10])

        // Tangan Kiri
        this.object[2].push(shirt[5], shirt[7], shirt[9], shirt[11])

        // Body
        this.object[3].push(shirt[0], shirt[1], shirt[2], shirt[3], shirt[12], shirt[13], shirt[14], shirt[15], shirt[16], shirt[17], shirt[18], shirt[19], shirt[20])

        // Kaki Kanan
        this.object[4].push()

        // Kaki Kiri
        this.object[5].push()


        // Group Adding
        this.group = new THREE.Group()
        shirt.forEach(e => {
            this.group.add(e)
        });
    }
}
export default top_sweater;