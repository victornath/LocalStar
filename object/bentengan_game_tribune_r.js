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


class Tribune_mid
{
    constructor(){
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
            width: 42.5,
            height: 25,
            length: 85
        }
        const base = new THREE.Mesh(new THREE.BoxGeometry(
            base_properties.width,
            base_properties.height,
            base_properties.length
        ), white)
        base.position.set(8.75,height+(base_properties.height/2),12.5)
        
        height += base_properties.height

        // Object 2 : Stair Base1
        let stair_properties = {
            width: 42.5,
            height: 15,
            length: 60
        }
        const stair = new THREE.Mesh(new THREE.BoxGeometry(
            stair_properties.width,
            stair_properties.height,
            stair_properties.length
        ), green)
        stair.position.set(8.75,height+(stair_properties.height/2),0)
        height += stair_properties.height

        const stair2 = new THREE.Mesh(new THREE.BoxGeometry(
            stair_properties.width,
            stair_properties.height,
            stair_properties.length-25
        ), green)
        stair2.position.set(8.75,height+(stair_properties.height/2),-12.5)
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
        border_f.position.set(12.5,border_f_properties.height/2,58.75)

        const border_b = new THREE.Mesh(new THREE.BoxGeometry(
            border_f_properties.width,
            border_f_properties.height+30,
            border_f_properties.length
        ), blue)
        border_b.position.set(12.5,15+border_f_properties.height/2,-33.75)

        let border_sr_properties = {
            width: 7.5,
            height: 20,
            length: 98
        }
        let geo_border_sr = new THREE.BoxGeometry(
            border_sr_properties.width,
            border_sr_properties.height,
            border_sr_properties.length
        )
        const border_sr = new THREE.Mesh(geo_border_sr, blue)
        border_sr.position.set(33.75,33.5+border_sr_properties.height/2,12.5)
        border_sr.rotation.x = Math.PI/18 * 1.9
        height += border_sr_properties.height

        let border_s1_properties = {
            width: 7.5,
            height: 37.5,
            length: 85
        }
        let geo_border_s1 = new THREE.BoxGeometry(
            border_s1_properties.width,
            border_s1_properties.height,
            border_s1_properties.length
        )
        const border_s1 = new THREE.Mesh(geo_border_s1, blue)
        border_s1.position.set(33.75,border_s1_properties.height/2,12.5)
        height += border_s1_properties.height

        let border_s2_properties = {
            width: 7.5,
            height: 15,
            length: 35
        }
        const border_s2 = new THREE.Mesh(new THREE.BoxGeometry(
            border_s2_properties.width,
            border_s2_properties.height,
            border_s2_properties.length
        ), blue)
        border_s2.position.set(33.75,37.5+border_s2_properties.height/2,-18.5)
        height += border_s2_properties.height

        let border_s3_properties = {
            width: 8,
            height: 57.5,
            length: 12.5
        }
        const border_s3 = new THREE.Mesh(new THREE.BoxGeometry(
            border_s3_properties.width,
            border_s3_properties.height,
            border_s3_properties.length
        ), blue)
        border_s3.position.set(-16.5,37.5+border_s3_properties.height/2,-38.5)
        height += border_s3_properties.height
        
        // Group Adding
        this.group = new THREE.Group()
        this.group.add(base)
        this.group.add(stair)
        this.group.add(stair2)
        this.group.add(border_f)
        this.group.add(border_b)
        this.group.add(border_sr)
        this.group.add(border_s1)
        this.group.add(border_s2)
        // this.group.add(border_s3)
        // this.group.add(body)
        // this.group.add(head)
        // this.group.add(hand_l)
        // this.group.add(hand_r)
    }
}
export default Tribune_mid;