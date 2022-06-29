import * as THREE from 'three';
import Object from './base/hat_cat_ear.js'

class top_hoodie_gn {
    constructor() {
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0x1A1A1A,
            side: THREE.DoubleSide
        })
        let color1 = new THREE.MeshLambertMaterial({
            color: 0xF8C5D8,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color, color1)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default top_hoodie_gn;