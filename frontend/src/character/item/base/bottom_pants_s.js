import * as THREE from 'three';

class bottom_pants_s
{
    constructor( material ){
        // Object 3 : Shirt
        let pants = []
        let plane_shirt = new THREE.PlaneGeometry( 15.1 , 4)
        pants[0] = new THREE.Mesh(plane_shirt, material)
        pants[0].position.set(0,-8.25,5.1)
        pants[1] = new THREE.Mesh(plane_shirt, material)
        pants[1].position.set(0,-8.25,-5.1)

        plane_shirt = new THREE.PlaneGeometry( 10.1 , 4)
        pants[2] = new THREE.Mesh(plane_shirt, material)
        pants[2].rotation.y = -Math.PI/2
        pants[2].position.set(-7.6,-8.25,0)
        pants[3] = new THREE.Mesh(plane_shirt, material)
        pants[3].rotation.y = -Math.PI/2
        pants[3].position.set(7.6,-8.25,0)
 
        plane_shirt = new THREE.PlaneGeometry( 5.1 , 7.5)
        pants[4] = new THREE.Mesh(plane_shirt, material)
        pants[4].rotation.y = -Math.PI/2
        pants[4].position.set(-2.55,4,0)
        pants[5] = new THREE.Mesh(plane_shirt, material)
        pants[5].rotation.y = -Math.PI/2
        pants[5].position.set(2.55,4,0)

        pants[6] = new THREE.Mesh(plane_shirt, material)
        pants[6].rotation.y = -Math.PI/2
        pants[6].position.set(2.55,4,0)
        pants[7] = new THREE.Mesh(plane_shirt, material)
        pants[7].rotation.y = -Math.PI/2
        pants[7].position.set(-2.55,4,0)

        pants[8] = new THREE.Mesh(plane_shirt, material)
        pants[8].position.set(0,4,2.55)

        pants[9] = new THREE.Mesh(plane_shirt, material)
        pants[9].position.set(0,4,2.55)

        pants[10] = new THREE.Mesh(plane_shirt, material)
        pants[10].position.set(0,4,-2.55)

        pants[11] = new THREE.Mesh(plane_shirt, material)
        pants[11].position.set(0,4,-2.55)


        plane_shirt = new THREE.PlaneGeometry( 15.1 , 10)
        pants[12] = new THREE.Mesh(plane_shirt, material)
        pants[12].position.set(0,-10.1,0)
        pants[12].rotation.x = -Math.PI/2
        
        plane_shirt = new THREE.PlaneGeometry( 5.1 , 5.1)
        pants[13] = new THREE.Mesh(plane_shirt, material)
        pants[13].position.set(0,7.75,0)
        pants[13].rotation.x = -Math.PI/2
        pants[14] = new THREE.Mesh(plane_shirt, material)
        pants[14].position.set(0,7.75,0)
        pants[14].rotation.x = -Math.PI/2

        this.object = [[],[],[],[],[],[]]
        // Head
        this.object[0].push()

        // Tangan Kanan
        this.object[1].push()

        // Tangan Kiri
        this.object[2].push()

        // Body
        this.object[3].push(pants[0],pants[1],pants[2],pants[3],pants[12])

        // Kaki Kanan
        this.object[4].push(pants[4],pants[6],pants[8],pants[10],pants[13])

        // Kaki Kiri
        this.object[5].push(pants[5],pants[7],pants[9],pants[11],pants[14])

        // Group Adding
        this.group = new THREE.Group()
        pants.forEach(e => {
            this.group.add(e)
        });
    }
}
export default bottom_pants_s;