import * as THREE from 'three';

class hat_cap
{
    constructor(material){
        // Stack Height (y)
        let height = 11.5

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
        const cap = new THREE.Mesh(geo_hat, material)
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
        const cap_snap = new THREE.Mesh(geo_circle, material)
        cap_snap.rotation.x = -Math.PI/2
        cap_snap.position.set(0,height+0.1,6)

        this.object = [[],[],[],[],[],[]]
        // Head
        this.object[0].push(cap,cap_snap)

        // Tangan Kanan
        this.object[1].push()

        // Tangan Kiri
        this.object[2].push()

        // Body
        this.object[3].push()

        // Kaki Kanan
        this.object[4].push()

        // Kaki Kiri
        this.object[5].push()


        // Group Adding
        this.group = new THREE.Group()
        this.group.add(cap)
        this.group.add(cap_snap)
    }
}
export default hat_cap;