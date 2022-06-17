import * as THREE from 'three';
import Object from './bottom_pants_l.js'

class bottom_pants_l_bk
{
    constructor(){
        // basic test color material
        let color = new THREE.MeshLambertMaterial({
            color: 0x191C27,
            side: THREE.DoubleSide
        })

        let base_object = new Object(color)
        this.object = base_object.object
        this.group = base_object.group
    }
}
export default bottom_pants_l_bk;