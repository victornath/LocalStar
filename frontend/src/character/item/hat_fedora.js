import * as THREE from 'three';

class hat_fedora
{
    constructor(material){
        // Stack Height (y)
        let height = 11.5

        // Object 5 : Vedora Hat
        let hat_properties = {
            radius_top: 7.5,
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
        const vedora_hat = new THREE.Mesh(geo_hat,material)
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
        const vedora_ring = new THREE.Mesh(geo_ring,material)
        vedora_ring.rotation.x = -Math.PI/2
        vedora_ring.position.set(0,height,0)

        this.object = [[],[],[],[],[],[]]
        // Head
        this.object[0].push(vedora_hat,vedora_ring)

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
        this.group.add(vedora_hat)
        this.group.add(vedora_ring)
    }
}
export default hat_fedora;