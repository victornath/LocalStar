import * as THREE from 'three';
import Object from './base/hat_beanie.js'

class top_hoodie_gn {
    constructor() {
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0x747474,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default top_hoodie_gn;