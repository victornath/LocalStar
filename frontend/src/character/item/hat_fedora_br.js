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
            color: 0xA67B46,
        })

        // Stack Height (y)
        let height = 27.5

        // Object 5 : Vedora Hat
        let hat_properties = {
            radius_top: 6,
            radius_bottom: 10,
            height: 7,
            segment: 10
        }
        let geo_hat = new THREE.CylinderGeometry(
            hat_properties.radius_top,
            hat_properties.radius_bottom,
            hat_properties.height,
            hat_properties.segment,
            hat_properties.segment
        )
        const vedora_hat = new THREE.Mesh(geo_hat,color)
        vedora_hat.position.set(0,height+(hat_properties.height/2),0)

        // Object 5 : Vedora Ring
        let ring_properties = {
            radius_in: 9,
            radius_out: 15,
            segment: 15
        }
        let geo_ring = new THREE.RingGeometry(
            ring_properties.radius_in,
            ring_properties.radius_out,
            ring_properties.segment
        )
        const vedora_ring = new THREE.Mesh(geo_ring,color)
        vedora_ring.rotation.x = -Math.PI/2
        vedora_ring.position.set(0,height,0)

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(vedora_hat)
        this.group.add(vedora_ring)
    }
}
export default Player;