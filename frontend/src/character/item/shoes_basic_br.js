import * as THREE from 'three';
import Object from './base/shoes_basic.js'

class shoes_basic_br {
    constructor() {
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0x5C4033,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default shoes_basic_br;