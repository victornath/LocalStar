import * as THREE from 'three';
import Object from './base/hair_long.js'

class hair_long_bk {
    constructor() {
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0x242424,
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default hair_long_bk;