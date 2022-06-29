import * as THREE from 'three';
import Object from './base/top_vest.js'

class hat_cap_rd {
    constructor() {
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0x1A1A1A,
            side: THREE.DoubleSide
        })
        let color1 = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color1, color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default hat_cap_rd;