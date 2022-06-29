import * as THREE from '../three.js/build/three.module.js'
import ShopDetails from './ShopDetails.js'

const TEXTURE_LOADER = new THREE.TextureLoader()
class PlayerLoader{
    constructor(){
    }

    LoadItemList(category, page = 1,PlayerID){
        let array = []
        let itemDetailTemp = new ShopDetails()
        let count = itemDetailTemp.getCount(category)
        let i;
        if ( page > (count/20)+1 || page < 1){
            return new Promise(resolve => {
                resolve(null)
            })
        } else {
            i = ((page-1)*20)
        }

        return new Promise(resolve => {
            let interval = setInterval(function(){
                        let res = itemDetailTemp.LoadPreview(category,i)
                        array.push(res)
                        i++;
                        if(i == count || i == page*20){
                            clearInterval(interval)
                            resolve(array)
                        }
                    },5)
        })
    }

    LoadPreview(category,i){
        let itemDetailTemp = new ShopDetails()

        return new Promise(resolve => {
            let res = itemDetailTemp.LoadBigPreview(category,i)
            resolve(res)
        })
    }
}
export default PlayerLoader