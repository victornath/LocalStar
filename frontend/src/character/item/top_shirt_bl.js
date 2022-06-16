import * as THREE from 'three';
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
        let blue = new THREE.MeshLambertMaterial({
            color: 0x1974D2,
            side: THREE.DoubleSide
        })

        // Stack Height (y)
        let height = 0
        
        // Object 3 : Shirt
        let shirt = []
        let plane_shirt = new THREE.PlaneGeometry( 15.1 , 16.5)
        shirt[0] = new THREE.Mesh(plane_shirt, blue)
        shirt[0].position.set(0,2,5.1)
        shirt[1] = new THREE.Mesh(plane_shirt, blue)
        shirt[1].position.set(0,2,-5.1)

        plane_shirt = new THREE.PlaneGeometry( 10.1 , 16.5)
        shirt[2] = new THREE.Mesh(plane_shirt, blue)
        shirt[2].rotation.y = -Math.PI/2
        shirt[2].position.set(-7.6,2,0)
        shirt[3] = new THREE.Mesh(plane_shirt, blue)
        shirt[3].rotation.y = -Math.PI/2
        shirt[3].position.set(7.6,2,0)
 
        plane_shirt = new THREE.PlaneGeometry( 5.1 , 7.5)
        shirt[4] = new THREE.Mesh(plane_shirt, blue)
        shirt[4].rotation.y = -Math.PI/2
        shirt[4].position.set(-12.6,6.75,0)
        shirt[5] = new THREE.Mesh(plane_shirt, blue)
        shirt[5].rotation.y = -Math.PI/2
        shirt[5].position.set(12.6,6.75,0)

        shirt[6] = new THREE.Mesh(plane_shirt, blue)
        shirt[6].position.set(-10,6.75,2.6)

        shirt[7] = new THREE.Mesh(plane_shirt, blue)
        shirt[7].position.set(10,6.75,2.6)

        shirt[8] = new THREE.Mesh(plane_shirt, blue)
        shirt[8].position.set(-10,6.75,-2.6)

        shirt[9] = new THREE.Mesh(plane_shirt, blue)
        shirt[9].position.set(10,6.75,-2.6)

        plane_shirt = new THREE.PlaneGeometry( 5.1 , 5.1)
        shirt[10] = new THREE.Mesh(plane_shirt, blue)
        shirt[10].position.set(10,10.35,0)
        shirt[10].rotation.x = -Math.PI/2
        shirt[11] = new THREE.Mesh(plane_shirt, blue)
        shirt[11].position.set(-10,10.35,0)
        shirt[11].rotation.x = -Math.PI/2


        // Group Adding
        this.group = new THREE.Group()
        // this.group.add(leg_l)
        // this.group.add(leg_r)
        // this.group.add(body)
        // this.group.add(head)
        // this.group.add(hand_l)
        // this.group.add(hand_r)
        shirt.forEach(e => {
            this.group.add(e)
        });
    }
}
export default Player;