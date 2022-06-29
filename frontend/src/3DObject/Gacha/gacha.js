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


class Finish_line
{
    constructor(machine_color){
        // basic test color material
        let blue_glass_tp = new THREE.MeshBasicMaterial({
            color: 0xC7E3E1,
            opacity: 0.5,
            transparent: true
        })
        let blue_glass = new THREE.MeshBasicMaterial({
            color: 0xC7E3E1,
        })
        let color = new THREE.MeshBasicMaterial({
            color: new THREE.Color(machine_color),
        })
        let color_red = new THREE.MeshBasicMaterial({
            color: 0xE3242B,
        })
        let color_2 = new THREE.MeshBasicMaterial({
            color: 0x4169E1,
        })
        let color_3 = new THREE.MeshBasicMaterial({
            color: 0x7DC734,
        })
        let white = new THREE.MeshBasicMaterial({
            color: 0xAAAAAA,
        })
        let black = new THREE.MeshBasicMaterial({
            color: 0x242424,
        })

        // Object 1 : Body
        let geo_pole = new THREE.PlaneGeometry(40,60)
        const pole2 = new THREE.Mesh(geo_pole,color)
        pole2.position.set(21,0,0)

        let bowl = new THREE.CircleGeometry(30,30)
        const bowl_mesh = new THREE.Mesh(bowl,blue_glass)
        bowl_mesh.position.set(21,50,1)
        const bowl_mesh_2 = new THREE.Mesh(bowl,blue_glass_tp)
        bowl_mesh_2.position.set(21,50,4)

        let head = new THREE.PlaneGeometry(35,10)
        const head_mesh = new THREE.Mesh(head,color)
        head_mesh.position.set(21,80,5)

        let line = new THREE.PlaneGeometry(20,25)
        let line_mesh = new THREE.Mesh(line,white)
        line_mesh.position.set(21,0,2)
        let inside = new THREE.PlaneGeometry(17.5,22.5)
        let inside_mesh = new THREE.Mesh(inside,color)
        inside_mesh.position.set(21,0,3)

        let hole = new THREE.PlaneGeometry(10,10)
        let hole_mesh = new THREE.Mesh(hole,black)
        hole_mesh.position.set(21,-2.5,4)

        let ball = []
        let temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), black)
        temp.position.set(0,48,2)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), black)
        temp.position.set(4,46,2)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), black)
        temp.position.set(11,50,2)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), black)
        temp.position.set(17,44,2)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), black)
        temp.position.set(24,49,2)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), black)
        temp.position.set(30,46,2)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), black)
        temp.position.set(37,50,2)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), black)
        temp.position.set(43,46,2)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(25,10,Math.PI,Math.PI), black)
        temp.position.set(21,46,2)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_red)
        temp.position.set(21,27,3)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_red)
        temp.position.set(6,37,3)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_red)
        temp.position.set(26,37,3)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_red)
        temp.position.set(16,42,3)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_red)
        temp.position.set(36,42,3)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_2)
        temp.position.set(22,44,3)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_2)
        temp.position.set(14,34,3)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_2)
        temp.position.set(28,30,3)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_3)
        temp.position.set(23,36,3)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_3)
        temp.position.set(8,43,3)
        ball.push(temp)
        temp = new THREE.Mesh(new THREE.CircleGeometry(5,10), color_3)
        temp.position.set(33,40,3)
        ball.push(temp)

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(pole2)
        this.group.add(bowl_mesh)
        this.group.add(bowl_mesh_2)
        this.group.add(head_mesh)
        this.group.add(line_mesh)
        this.group.add(inside_mesh)
        this.group.add(hole_mesh)
        ball.forEach(e => {
            this.group.add(e)
        })
    }

    spinAnimation(){
        // put animation here
    }
}
export default Finish_line;