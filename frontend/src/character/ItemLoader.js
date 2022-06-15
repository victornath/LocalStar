import * as THREE from 'three';

const TEXTURE_LOADER = new THREE.TextureLoader()
class ItemLoader
{
    constructor(){
    }
    async load(itemId){
        let item = await import('../character/item/'+itemId+'.js');
        let temp = TEXTURE_LOADER.load('./images/texture/item/preview/'+itemId+'.png')
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
