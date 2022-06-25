import * as THREE from 'three';
import Object from './base/top_sweater.js'

class top_hoodie_gn {
    constructor() {
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide
        })
        let color1 = new THREE.MeshLambertMaterial({
            color: 0x1A1A1A,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color, color1)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default top_hoodie_gn;