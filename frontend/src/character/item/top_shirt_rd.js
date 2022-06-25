import * as THREE from 'three';
import Object from './base/top_shirt.js'

class top_shirt_rd {
    constructor() {
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0xD0312D,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default top_shirt_rd;