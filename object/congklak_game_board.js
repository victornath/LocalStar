import * as THREE from '../three.js/build/three.module.js'

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
        
        // Object 3 : Big Circles
        let b_circle_properties = {
            radius: 12,
            segment: 12
        }
        let geo_b_circle = new THREE.CircleGeometry(
            b_circle_properties.radius,
            b_circle_properties.segment
        )
        const b_circle_l = new THREE.Mesh(geo_b_circle, wood_dark)
        b_circle_l.position.set(5,height+0.1,12.5)
        b_circle_l.rotation.x = -Math.PI/2
        const b_circle_r = new THREE.Mesh(geo_b_circle, wood_dark)
        b_circle_r.position.set(105,height+0.1,12.5)
        b_circle_r.rotation.x = -Math.PI/2

        // Object 4: Small Circles
        let circle_properties = {
            radius: 5,
            segment: 9
        }
        let geo_circle = new THREE.CircleGeometry(
            circle_properties.radius,
            circle_properties.segment
        )
        const circle_01 = new THREE.Mesh(geo_circle, wood_dark)
        circle_01.position.set(22,height+0.1,5)
        circle_01.rotation.x = -Math.PI/2
        
        const circle_02 = new THREE.Mesh(geo_circle, wood_dark)
        circle_02.position.set(22,height+0.1,20)
        circle_02.rotation.x = -Math.PI/2
        
        const circle_03 = new THREE.Mesh(geo_circle, wood_dark)
        circle_03.position.set(33,height+0.1,5)
        circle_03.rotation.x = -Math.PI/2

        const circle_04 = new THREE.Mesh(geo_circle, wood_dark)
        circle_04.position.set(33,height+0.1,20)
        circle_04.rotation.x = -Math.PI/2
        
        const circle_05 = new THREE.Mesh(geo_circle, wood_dark)
        circle_05.position.set(44,height+0.1,5)
        circle_05.rotation.x = -Math.PI/2

        const circle_06 = new THREE.Mesh(geo_circle, wood_dark)
        circle_06.position.set(44,height+0.1,20)
        circle_06.rotation.x = -Math.PI/2

        const circle_07 = new THREE.Mesh(geo_circle, wood_dark)
        circle_07.position.set(55,height+0.1,5)
        circle_07.rotation.x = -Math.PI/2

        const circle_08 = new THREE.Mesh(geo_circle, wood_dark)
        circle_08.position.set(55,height+0.1,20)
        circle_08.rotation.x = -Math.PI/2

        const circle_09 = new THREE.Mesh(geo_circle, wood_dark)
        circle_09.position.set(66,height+0.1,5)
        circle_09.rotation.x = -Math.PI/2

        const circle_10 = new THREE.Mesh(geo_circle, wood_dark)
        circle_10.position.set(66,height+0.1,20)
        circle_10.rotation.x = -Math.PI/2

        const circle_11 = new THREE.Mesh(geo_circle, wood_dark)
        circle_11.position.set(77,height+0.1,5)
        circle_11.rotation.x = -Math.PI/2

        const circle_12 = new THREE.Mesh(geo_circle, wood_dark)
        circle_12.position.set(77,height+0.1,20)
        circle_12.rotation.x = -Math.PI/2

        const circle_13 = new THREE.Mesh(geo_circle, wood_dark)
        circle_13.position.set(88,height+0.1,5)
        circle_13.rotation.x = -Math.PI/2

        const circle_14 = new THREE.Mesh(geo_circle, wood_dark)
        circle_14.position.set(88,height+0.1,20)
        circle_14.rotation.x = -Math.PI/2

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(board)
        this.group.add(corner_l)
        this.group.add(corner_r)
        /*
        this.group.add(b_circle_l)
        this.group.add(b_circle_r)
        this.group.add(circle_01)
        this.group.add(circle_02)
        this.group.add(circle_03)
        this.group.add(circle_04)
        this.group.add(circle_05)
        this.group.add(circle_06)
        this.group.add(circle_07)
        this.group.add(circle_08)
        this.group.add(circle_09)
        this.group.add(circle_10)
        this.group.add(circle_11)
        this.group.add(circle_12)
        this.group.add(circle_13)
        this.group.add(circle_14)
        */
    }
}
export default Congklak_big;