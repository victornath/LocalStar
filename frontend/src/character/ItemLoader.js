import * as THREE from '../three.js/build/three.module.js'

const TEXTURE_LOADER = new THREE.TextureLoader()
class ItemLoader
{
    constructor(){
    }
    async load(itemId){
        let item = await import('../item/item/'+itemId+'.js');
        let temp = TEXTURE_LOADER.load('../texture/item/preview/'+itemId+'.png')
        return new Promise(resolve => {
            resolve({
                texture: new THREE.MeshBasicMaterial({
                    map: temp,
                    side: THREE.DoubleSide,
                    alphaTest: 0.6
                }),
                object: new item.default()
            })
        })
    }

}
export default ItemLoader;
