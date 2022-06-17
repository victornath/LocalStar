import * as THREE from 'three';
import Object from './shoes_basic.js'

class shoes_basic_rd
{
    constructor(){
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0xB90E0A,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default shoes_basic_rd;