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


class Tribune_mid {
    constructor() {
        // basic test color material
        let black = new THREE.MeshLambertMaterial({
            color: 0x000000,
        })
        let white = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
        })
        let green = new THREE.MeshLambertMaterial({
            color: 0x00ff00,
        })
        let blue = new THREE.MeshLambertMaterial({
            color: 0x0000ff,
        })
        let red = new THREE.MeshLambertMaterial({
            color: 0xff0000,
        })

        // Stack Height (y)
        let height = 0

        // Object 1 : Lower Base
        let base_properties = {
            width: 50,
            height: 25,
            length: 85
        }
        const base = new THREE.Mesh(new THREE.BoxGeometry(
            base_properties.width,
            base_properties.height,
            base_properties.length
        ), white)
        base.position.set(12.5, height + (base_properties.height / 2), 12.5)

        height += base_properties.height

        // Object 2 : Stair Base1
        let stair_properties = {
            width: 50,
            height: 15,
            length: 60
        }
        const stair = new THREE.Mesh(new THREE.BoxGeometry(
            stair_properties.width,
            stair_properties.height,
            stair_properties.length
        ), green)
        stair.position.set(12.5, height + (stair_properties.height / 2), 0)
        height += stair_properties.height

        const stair2 = new THREE.Mesh(new THREE.BoxGeometry(
            stair_properties.width,
            stair_properties.height,
            stair_properties.length - 25
        ), green)
        stair2.position.set(12.5, height + (stair_properties.height / 2), -12.5)
        height += stair_properties.height

        // Object 3 : Borders
        let border_f_properties = {
            width: 50,
            height: 39,
            length: 7.5
        }
        const border_f = new THREE.Mesh(new THREE.BoxGeometry(
            border_f_properties.width,
            border_f_properties.height,
            border_f_properties.length
        ), blue)
        border_f.position.set(12.5, border_f_properties.height / 2, 58.75)

        const border_b = new THREE.Mesh(new THREE.BoxGeometry(
            border_f_properties.width,
            border_f_properties.height + 30,
            border_f_properties.length
        ), blue)
        border_b.position.set(12.5, 15 + border_f_properties.height / 2, -33.75)

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(base)
        this.group.add(stair)
        this.group.add(stair2)
        this.group.add(border_f)
        this.group.add(border_b)
    }
}
export default Tribune_mid;