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
            color: 0x5C4033,
            side: THREE.DoubleSide
        })

        // Object 3 : Shirt
        let shoes = []
        let geo_shoes = new THREE.BoxGeometry(5.2,3,8)
        shoes[1] = new THREE.Mesh(geo_shoes,red)
        shoes[1].position.set(-5,-23.6,1.4)
        shoes[2] = new THREE.Mesh(geo_shoes,red)
        shoes[2].position.set(5,-23.6,1.4)
        // Group Adding
        this.group = new THREE.Group()
        shoes.forEach(e => {
            this.group.add(e)
        });
    }
}
export default Player;