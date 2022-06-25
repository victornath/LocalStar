import * as THREE from 'three';

class top_shirt
{
    constructor( material ){
        let shirt = []
        let plane_shirt = new THREE.PlaneGeometry( 15.1 , 16.5)
        shirt[0] = new THREE.Mesh(plane_shirt, material)
        shirt[0].position.set(0,2,5.1)
        shirt[1] = new THREE.Mesh(plane_shirt, material)
        shirt[1].position.set(0,2,-5.1)

        plane_shirt = new THREE.PlaneGeometry( 10.1 , 16.5)
        shirt[2] = new THREE.Mesh(plane_shirt, material)
        shirt[2].rotation.y = -Math.PI/2
        shirt[2].position.set(-7.55,2,0)
        shirt[3] = new THREE.Mesh(plane_shirt, material)
        shirt[3].rotation.y = -Math.PI/2
        shirt[3].position.set(7.55,2,0)
 
        plane_shirt = new THREE.PlaneGeometry( 5.15 , 7.5)
        shirt[4] = new THREE.Mesh(plane_shirt, material)
        shirt[4].rotation.y = -Math.PI/2
        shirt[4].position.set(-2.55,2.8,0)
        shirt[5] = new THREE.Mesh(plane_shirt, material)
        shirt[5].rotation.y = -Math.PI/2
        shirt[5].position.set(2.55,2.8,0)

        shirt[6] = new THREE.Mesh(plane_shirt, material)
        shirt[6].position.set(0,2.8,2.6)

        shirt[7] = new THREE.Mesh(plane_shirt, material)
        shirt[7].position.set(0,2.8,2.6)

        shirt[8] = new THREE.Mesh(plane_shirt, material)
        shirt[8].position.set(0,2.8,-2.6)

        shirt[9] = new THREE.Mesh(plane_shirt, material)
        shirt[9].position.set(0,2.8,-2.6)

        plane_shirt = new THREE.PlaneGeometry( 5.1 , 5.1)
        shirt[10] = new THREE.Mesh(plane_shirt, material)
        shirt[10].position.set(0,6.55,0)
        shirt[10].rotation.x = -Math.PI/2
        shirt[11] = new THREE.Mesh(plane_shirt, material)
        shirt[11].position.set(0,6.55,0)
        shirt[11].rotation.x = -Math.PI/2

        plane_shirt = new THREE.PlaneGeometry( 5.1 , 10)
        shirt[12] = new THREE.Mesh(plane_shirt, material)
        shirt[12].position.set(5,2+8.35,0)
        shirt[12].rotation.x = -Math.PI/2
        shirt[13] = new THREE.Mesh(plane_shirt, material)
        shirt[13].position.set(-5,2+8.35,0)
        shirt[13].rotation.x = -Math.PI/2

        this.object = [[],[],[],[],[],[]]
        // Head
        this.object[0].push()

        // Tangan Kanan
        this.object[1].push(shirt[4],shirt[6],shirt[8],shirt[10])

        // Tangan Kiri
        this.object[2].push(shirt[5],shirt[7],shirt[9],shirt[11])

        // Body
        this.object[3].push(shirt[0],shirt[1],shirt[2],shirt[3],shirt[12],shirt[13])

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
export default top_shirt;