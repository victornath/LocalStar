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


class Finish_line {
    constructor(texture) {
        // basic test color material
        const TEXTURE_LOADER = new THREE.TextureLoader();
        let ground_texture = texture
        ground_texture.wrapS = THREE.RepeatWrapping
        ground_texture.repeat.set(10, 1)
        let black = new THREE.MeshLambertMaterial({
            map: ground_texture,
            side: THREE.DoubleSide
        })
        let white = new THREE.MeshLambertMaterial({
            color: 0xAAAAAA,
        })
        let flag_texture = texture
        flag_texture.wrapS = THREE.RepeatWrapping
        flag_texture.wrapT = THREE.RepeatWrapping
        flag_texture.repeat.set(10, 2)
        let flag_mat = new THREE.MeshLambertMaterial({
            map: flag_texture,
            side: THREE.DoubleSide
        })

        // Object 1 : Ground_Line
        let finish_line = new THREE.PlaneGeometry(275, 25)
        const line = new THREE.Mesh(finish_line, black)
        line.position.set(0, 0.1, 0)
        line.rotation.x = -Math.PI / 2

        let finish_flag = new THREE.PlaneGeometry(275, 50)
        const flag = new THREE.Mesh(finish_flag, flag_mat)
        flag.position.set(0, 115, 0)

        // Object 2 : Pole
        let geo_pole = new THREE.CylinderGeometry(3, 3, 140)
        const pole = new THREE.Mesh(geo_pole, white)
        const pole2 = new THREE.Mesh(geo_pole, white)
        pole.position.set(135, 70, 0)
        pole2.position.set(-135, 70, 0)

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(line)
        this.group.add(pole)
        this.group.add(pole2)
        this.group.add(flag)
    }
}
export default Finish_line;