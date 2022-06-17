import * as THREE from 'three';
import Object from './hat_cap.js'

class hat_cap_gn
{
    constructor(){
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0x228C22,
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default hat_cap_gn;