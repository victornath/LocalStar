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
        let color = new THREE.MeshLambertMaterial({
            color: 0xE3CC88,
        })

        // Stack Height (y)
        let height = 21.5


        // Object 5 : Hair
        let hair_properties = {
            width: 17.5,
            height: 3.5,
            length: 17.5
        }
        let geo_hair = new THREE.BoxGeometry(
            hair_properties.width,
            hair_properties.height,
            hair_properties.length
        )
        const short_hair = new THREE.Mesh(geo_hair, color)
        short_hair.position.set(0,height+2,0)

        let hair_1_properties = {
            width: 17.5,
            height: 27.5,
            length: 10
        }
        let geo_hair_1 = new THREE.BoxGeometry(
            hair_1_properties.width,
            hair_1_properties.height,
            hair_1_properties.length
        )
        const short_hair_1 = new THREE.Mesh(geo_hair_1, color)
        short_hair_1.position.set(0,height-8.5,-5)

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(short_hair)
        this.group.add(short_hair_1)
    }
}
export default Player;