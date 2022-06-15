import * as THREE from '../../three.js/build/three.module.js'

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


class Player
{
    constructor(){
        // basic test color material
        let red = new THREE.MeshLambertMaterial({
            color: 0x313131,
            side: THREE.DoubleSide
        })

        // Object 3 : Shirt
        let shirt = []
        let plane_shirt = new THREE.PlaneGeometry( 15.1 , 16.5)
        shirt[0] = new THREE.Mesh(plane_shirt, red)
        shirt[0].position.set(0,2+0,5.1)
        shirt[1] = new THREE.Mesh(plane_shirt, red)
        shirt[1].position.set(0,2+0,-5.1)

        plane_shirt = new THREE.PlaneGeometry( 10.1 , 16.5)
        shirt[2] = new THREE.Mesh(plane_shirt, red)
        shirt[2].rotation.y = -Math.PI/2
        shirt[2].position.set(-7.6,2+0,0)
        shirt[3] = new THREE.Mesh(plane_shirt, red)
        shirt[3].rotation.y = -Math.PI/2
        shirt[3].position.set(7.6,2+0,0)
 
        plane_shirt = new THREE.PlaneGeometry( 5.1 , 7.5)
        shirt[4] = new THREE.Mesh(plane_shirt, red)
        shirt[4].rotation.y = -Math.PI/2
        shirt[4].position.set(-12.6,2+4.75,0)
        shirt[5] = new THREE.Mesh(plane_shirt, red)
        shirt[5].rotation.y = -Math.PI/2
        shirt[5].position.set(12.6,2+4.75,0)

        shirt[6] = new THREE.Mesh(plane_shirt, red)
        shirt[6].position.set(-10,2+4.75,2.6)

        shirt[7] = new THREE.Mesh(plane_shirt, red)
        shirt[7].position.set(10,2+4.75,2.6)

        shirt[8] = new THREE.Mesh(plane_shirt, red)
        shirt[8].position.set(-10,2+4.75,-2.6)

        shirt[9] = new THREE.Mesh(plane_shirt, red)
        shirt[9].position.set(10,2+4.75,-2.6)

        plane_shirt = new THREE.PlaneGeometry( 5.1 , 5.1)
        shirt[10] = new THREE.Mesh(plane_shirt, red)
        shirt[10].position.set(10,2+8.35,0)
        shirt[10].rotation.x = -Math.PI/2
        shirt[11] = new THREE.Mesh(plane_shirt, red)
        shirt[11].position.set(-10,2+8.35,0)
        shirt[11].rotation.x = -Math.PI/2

        plane_shirt = new THREE.PlaneGeometry( 5.1 , 10)
        shirt[12] = new THREE.Mesh(plane_shirt, red)
        shirt[12].position.set(5,2+8.35,0)
        shirt[12].rotation.x = -Math.PI/2
        shirt[13] = new THREE.Mesh(plane_shirt, red)
        shirt[13].position.set(-5,2+8.35,0)
        shirt[13].rotation.x = -Math.PI/2

        // Group Adding
        this.group = new THREE.Group()
        shirt.forEach(e => {
            this.group.add(e)
        });
    }
}
export default Player;