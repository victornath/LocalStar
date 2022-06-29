import * as THREE from '../three.js/build/three.module.js'
const TEXTURE_LOADER = new THREE.TextureLoader()
class FaceDetails{
    constructor(){
        this.EyeCount = 86
        this.BrowCount = 42
        this.MouthCount = 51
        this.NoseCount = 45
    }

    getCount(part){
        switch(part){
            case 0:
                return this.BrowCount
            case 1:
                return this.EyeCount
            case 2:
                return this.NoseCount
            case 3:
                return this.MouthCount
        }

    }

    LoadMaterialPart(part, id){
        let texture
        switch(part){
            case 0:
                texture = TEXTURE_LOADER.load('../../texture/face/eyebrow/pigg_eyebrow_'+id+'.png')
            break;
            case 1:
                texture = TEXTURE_LOADER.load('../../texture/face/eyes/pigg_eyes_'+id+'.png')
            break;
            case 2:
                texture = TEXTURE_LOADER.load('../../texture/face/nose/nose_'+id+'.png')
            break;
            case 3:
                texture = TEXTURE_LOADER.load('../../texture/face/mouth/pigg_mouth_'+id+'.png')
            break;
        }
        let material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.05
        })
        
        return material

    }

    LoadEyeMaterial(eyeId){
        let eyeTexture = TEXTURE_LOADER.load('../../texture/face/eyes/pigg_eyes_'+eyeId+'.png')
        let eyeMaterial = new THREE.MeshBasicMaterial({
            map: eyeTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        })
        
        return eyeMaterial
    }

    LoadBrowMaterial(browId){
        let browTexture = TEXTURE_LOADER.load('../../texture/face/eyebrow/pigg_eyebrow_'+browId+'.png')
        let browMaterial = new THREE.MeshBasicMaterial({
            map: browTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        })
        
        return browMaterial
    }

    LoadMouthMaterial(mouthId){
        let mouthTexture = TEXTURE_LOADER.load('../../texture/face/mouth/pigg_mouth_'+mouthId+'.png')
        let mouthMaterial = new THREE.MeshBasicMaterial({
            map: mouthTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        })
        
        return mouthMaterial
    }

    LoadNoseMaterial(noseId){
        let noseTexture = TEXTURE_LOADER.load('../../texture/face/nose/nose_'+noseId+'.png')
        let noseMaterial = new THREE.MeshBasicMaterial({
            map: noseTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        })
        
        return noseMaterial
    }

}
export default FaceDetails