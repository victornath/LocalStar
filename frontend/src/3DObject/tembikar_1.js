import * as THREE from 'three'

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


class Player {
    constructor() {
        // basic test color material
        let black = new THREE.MeshLambertMaterial({
            color: 0x000000,
            side: THREE.DoubleSide
        })
        let white = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide
        })
        let green = new THREE.MeshLambertMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide
        })
        let blue = new THREE.MeshLambertMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide
        })
        let red = new THREE.MeshLambertMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide
        })

        // Stack Height (y)
        let height = 0
        let obj = []

        // Object 1 : Leg
        let obj_1 = new THREE.Mesh(new THREE.CylinderGeometry(10, 5, 15, 50), red)
        obj_1.position.set(5, height + (15 / 2), 0)
        obj.push(obj_1)

        height += 15

        obj_1 = new THREE.Mesh(new THREE.CylinderGeometry(3, 10, 10, 50, 1, true), red)
        obj_1.position.set(5, height + (10 / 2), 0)
        obj.push(obj_1)

        height += 10

        obj_1 = new THREE.Mesh(new THREE.CylinderGeometry(6, 3, 5, 50, 1, true), red)
        obj_1.position.set(5, height + (5 / 2), 0)
        obj.push(obj_1)

        height += 15

        // Object 2 : Body
        // Group Adding
        this.group = new THREE.Group()
        obj.forEach(e => {
            this.group.add(e)
        })
    }
}
export default Player;