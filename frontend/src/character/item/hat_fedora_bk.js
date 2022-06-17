import * as THREE from 'three';
import Object from './hat_fedora.js'

class hat_fedora_bk
{
    constructor(){
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0x504F54,
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default hat_fedora_bk;