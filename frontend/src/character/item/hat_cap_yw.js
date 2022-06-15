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
        let color = new THREE.MeshLambertMaterial({
            color: 0xF6BB00,
        })

        // Stack Height (y)
        let height = 27.5

        // Object 5 : Cap
        let hat_properties = {
            radius: 10,
            segment: 10,
            phi_start: 0,
            phi_length: 3,
        }
        let geo_hat = new THREE.SphereGeometry(
            hat_properties.radius,
            hat_properties.segment,
            hat_properties.segment,
            hat_properties.phi_start,
            hat_properties.phi_length
        )
        const cap = new THREE.Mesh(geo_hat, color)
        cap.position.set(0,height,0)
        cap.rotation.x = -Math.PI/2

        // Object 5 : Vedora Ring
        let circle_properties = {
            radius: 9,
            segment: 10
        }
        let geo_circle = new THREE.CircleGeometry(
            circle_properties.radius,
            circle_properties.segment
        )
        const cap_snap = new THREE.Mesh(geo_circle, color)
        cap_snap.rotation.x = -Math.PI/2
        cap_snap.position.set(0,height+0.1,6)

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(cap)
        this.group.add(cap_snap)
    }
}
export default Player;