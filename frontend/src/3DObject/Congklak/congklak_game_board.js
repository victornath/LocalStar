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


class Congklak_big
{
    constructor(){
        // basic test color material
        let wood_dark = new THREE.MeshBasicMaterial({
            color: 0x36594E,
        })
        let wood = new THREE.MeshLambertMaterial({
            color: 0x4E7E6F,
        })
        
        // Stack Height (y)
        let height = 0
        // Object 1 : Board
        let board_properties = {
            width: 100,
            height: 10,
            length: 30
        }
        let geo_board = new THREE.BoxGeometry(
            board_properties.width,
            board_properties.height,
            board_properties.length
        )
        const board = new THREE.Mesh(geo_board, wood)
        board.position.set(55,height+(board_properties.height/2),12.5)
        
        //Object 2 : Cylinder corner
        let corner_properties = {
            radius: 15,
            height: 10,
            rad_segment: 10,
            height_segment: 1,
            theta_start: 0,
            theta_end: Math.PI
        }
        let geo_corner_l = new THREE.CylinderGeometry(
            corner_properties.radius,
            corner_properties.radius,
            corner_properties.height,
            corner_properties.rad_segment,
            corner_properties.height_segment,
            false,
            corner_properties.theta_start,
            corner_properties.theta_end
        )
        let geo_corner_r = new THREE.CylinderGeometry(
            corner_properties.radius,
            corner_properties.radius,
            corner_properties.height,
            corner_properties.rad_segment,
            corner_properties.height_segment,
            false,
            corner_properties.theta_end,
            corner_properties.theta_end
        )
        const corner_l = new THREE.Mesh(geo_corner_l, wood)
        corner_l.position.set(105,height+(board_properties.height/2),12.5)
        const corner_r = new THREE.Mesh(geo_corner_r, wood)
        corner_r.position.set(5,height+(board_properties.height/2),12.5)
        height += corner_properties.height

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(board)
        this.group.add(corner_l)
        this.group.add(corner_r)
    }
}
export default Congklak_big;