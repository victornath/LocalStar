import * as THREE from 'three';
import Object from './shoes_basic.js'

class shoes_basic_wh
{
    constructor(){
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0xF8FDFF,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default shoes_basic_wh;