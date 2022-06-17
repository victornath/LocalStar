import * as THREE from 'three';
import Object from './hair_short.js'

class hair_short_gr
{
    constructor(){
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0x747474,
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default hair_short_gr;