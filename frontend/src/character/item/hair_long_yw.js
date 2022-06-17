import * as THREE from 'three';
import Object from './hair_long.js'

class hair_long_yw
{
    constructor(){
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0xE3CC88,
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default hair_long_yw;