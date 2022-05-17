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


class Congklak
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
            width: 34,
            height: 2,
            length: 14
        }
        let geo_board = new THREE.BoxGeometry(
            board_properties.width,
            board_properties.height,
            board_properties.length
        )
        const board = new THREE.Mesh(geo_board, wood)
        board.position.set(1,height+(board_properties.height/2),0)
        
        //Object 2 : Cylinder corner
        let corner_properties = {
            radius: 7,
            height: 2,
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
        corner_l.position.set(18,height+(board_properties.height/2),0)
        const corner_r = new THREE.Mesh(geo_corner_r, wood)
        corner_r.position.set(-16,height+(board_properties.height/2),0)
        height += corner_properties.height
        
        // Object 3 : Big Circles
        let b_circle_properties = {
            radius: 4,
            segment: 9
        }
        let geo_b_circle = new THREE.CircleGeometry(
            b_circle_properties.radius,
            b_circle_properties.segment
        )
        const b_circle_l = new THREE.Mesh(geo_b_circle, wood_dark)
        b_circle_l.position.set(-17,height+0.1,0)
        b_circle_l.rotation.x = -Math.PI/2
        const b_circle_r = new THREE.Mesh(geo_b_circle, wood_dark)
        b_circle_r.position.set(19,height+0.1,0)
        b_circle_r.rotation.x = -Math.PI/2

        // Object 4: Small Circles
        let circle_properties = {
            radius: 1.5,
            segment: 9
        }
        let geo_circle = new THREE.CircleGeometry(
            circle_properties.radius,
            circle_properties.segment
        )
        const circle_1 = new THREE.Mesh(geo_circle, wood_dark)
        circle_1.position.set(-11,height+0.1,-2.5)
        circle_1.rotation.x = -Math.PI/2
        
        const circle_2 = new THREE.Mesh(geo_circle, wood_dark)
        circle_2.position.set(-11,height+0.1,2.5)
        circle_2.rotation.x = -Math.PI/2
        
        const circle_3 = new THREE.Mesh(geo_circle, wood_dark)
        circle_3.position.set(-7,height+0.1,-2.5)
        circle_3.rotation.x = -Math.PI/2

        const circle_4 = new THREE.Mesh(geo_circle, wood_dark)
        circle_4.position.set(-7,height+0.1,2.5)
        circle_4.rotation.x = -Math.PI/2
        
        const circle_5 = new THREE.Mesh(geo_circle, wood_dark)
        circle_5.position.set(-3,height+0.1,-2.5)
        circle_5.rotation.x = -Math.PI/2

        const circle_6 = new THREE.Mesh(geo_circle, wood_dark)
        circle_6.position.set(-3,height+0.1,2.5)
        circle_6.rotation.x = -Math.PI/2

        const circle_7 = new THREE.Mesh(geo_circle, wood_dark)
        circle_7.position.set(1,height+0.1,-2.5)
        circle_7.rotation.x = -Math.PI/2

        const circle_8 = new THREE.Mesh(geo_circle, wood_dark)
        circle_8.position.set(1,height+0.1,2.5)
        circle_8.rotation.x = -Math.PI/2

        const circle_9 = new THREE.Mesh(geo_circle, wood_dark)
        circle_9.position.set(5,height+0.1,-2.5)
        circle_9.rotation.x = -Math.PI/2

        const circle_10 = new THREE.Mesh(geo_circle, wood_dark)
        circle_10.position.set(5,height+0.1,2.5)
        circle_10.rotation.x = -Math.PI/2

        const circle_11 = new THREE.Mesh(geo_circle, wood_dark)
        circle_11.position.set(9,height+0.1,-2.5)
        circle_11.rotation.x = -Math.PI/2

        const circle_12 = new THREE.Mesh(geo_circle, wood_dark)
        circle_12.position.set(9,height+0.1,2.5)
        circle_12.rotation.x = -Math.PI/2

        const circle_13 = new THREE.Mesh(geo_circle, wood_dark)
        circle_13.position.set(13,height+0.1,-2.5)
        circle_13.rotation.x = -Math.PI/2

        const circle_14 = new THREE.Mesh(geo_circle, wood_dark)
        circle_14.position.set(13,height+0.1,2.5)
        circle_14.rotation.x = -Math.PI/2

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(board)
        this.group.add(corner_l)
        this.group.add(corner_r)
        this.group.add(b_circle_l)
        this.group.add(b_circle_r)
        this.group.add(circle_1)
        this.group.add(circle_2)
        this.group.add(circle_3)
        this.group.add(circle_4)
        this.group.add(circle_5)
        this.group.add(circle_6)
        this.group.add(circle_7)
        this.group.add(circle_8)
        this.group.add(circle_9)
        this.group.add(circle_10)
        this.group.add(circle_11)
        this.group.add(circle_12)
        this.group.add(circle_13)
        this.group.add(circle_14)
        this.group.children.forEach(e =>{
            e.name = "clickable"
        })
    }
}
export default Congklak;