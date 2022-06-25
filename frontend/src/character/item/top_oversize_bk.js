import * as THREE from 'three';
import Object from './base/top_oversize.js'

class top_oversize_wh {
    constructor() {
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0x1A1A1A,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default top_oversize_wh;