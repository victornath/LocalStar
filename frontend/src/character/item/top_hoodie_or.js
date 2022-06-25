import * as THREE from 'three';
import Object from './base/top_hoodie.js'

class top_hoodie_bk {
    constructor() {
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0xEA632A,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default top_hoodie_bk;