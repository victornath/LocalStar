import * as THREE from 'three';
import Object from './hat_fedora.js'

class hat_fedora_br
{
    constructor(){
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0xA67B46,
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default hat_fedora_br;