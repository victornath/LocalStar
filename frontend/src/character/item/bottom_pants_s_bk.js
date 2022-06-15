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
            color: 0x191C27,
            side: THREE.DoubleSide
        })

        // Object 3 : Shirt
        let pants = []
        let plane_shirt = new THREE.PlaneGeometry( 15.1 , 4)
        pants[0] = new THREE.Mesh(plane_shirt, red)
        pants[0].position.set(0,-8.25,5.1)
        pants[1] = new THREE.Mesh(plane_shirt, red)
        pants[1].position.set(0,-8.25,-5.1)

        plane_shirt = new THREE.PlaneGeometry( 10.1 , 4)
        pants[2] = new THREE.Mesh(plane_shirt, red)
        pants[2].rotation.y = -Math.PI/2
        pants[2].position.set(-7.6,-8.25,0)
        pants[3] = new THREE.Mesh(plane_shirt, red)
        pants[3].rotation.y = -Math.PI/2
        pants[3].position.set(7.6,-8.25,0)
 
        plane_shirt = new THREE.PlaneGeometry( 5.1 , 7.5)
        pants[4] = new THREE.Mesh(plane_shirt, red)
        pants[4].rotation.y = -Math.PI/2
        pants[4].position.set(-7.6,-13.9,0)
        pants[5] = new THREE.Mesh(plane_shirt, red)
        pants[5].rotation.y = -Math.PI/2
        pants[5].position.set(7.6,-13.9,0)

        pants[6] = new THREE.Mesh(plane_shirt, red)
        pants[6].rotation.y = -Math.PI/2
        pants[6].position.set(-2.45,-13.9,0)
        pants[7] = new THREE.Mesh(plane_shirt, red)
        pants[7].rotation.y = -Math.PI/2
        pants[7].position.set(2.45,-13.9,0)

        pants[8] = new THREE.Mesh(plane_shirt, red)
        pants[8].position.set(-5,-13.9,2.6)

        pants[9] = new THREE.Mesh(plane_shirt, red)
        pants[9].position.set(5,-13.9,2.6)

        pants[10] = new THREE.Mesh(plane_shirt, red)
        pants[10].position.set(-5,-13.9,-2.6)

        pants[11] = new THREE.Mesh(plane_shirt, red)
        pants[11].position.set(5,-13.9,-2.6)


        plane_shirt = new THREE.PlaneGeometry( 15.1 , 10)
        pants[12] = new THREE.Mesh(plane_shirt, red)
        pants[12].position.set(0,-10.1,0)
        pants[12].rotation.x = -Math.PI/2

        // Group Adding
        this.group = new THREE.Group()
        pants.forEach(e => {
            this.group.add(e)
        });
    }
}
export default Player;