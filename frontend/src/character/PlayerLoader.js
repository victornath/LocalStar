import * as THREE from '../three.js/build/three.module.js'
import ItemDetails from './ItemDetails.js'
import FaceDetails from './FaceDetails.js'
import PLAYER_OBJ from '../furniture/player.js';

const TEXTURE_LOADER = new THREE.TextureLoader()
class PlayerLoader{
    constructor(){
    }

    Load(PlayerID, controllable = false){
        this.CONTROLLABLE = controllable
        this.PLAYER = new PLAYER_OBJ().group
        this.appearance = [];
        this.pivot = 0;

        return this.PLAYER
    }

    // LoadBrow(page = 1){
    //     let array = []
    //     let faceDetailTemp = new FaceDetails()
    //     let count = faceDetailTemp.getBrowCount()
    //     let i;
    //     if ( page > (count/30)+1 || page < 1){
    //         return new Promise(resolve => {
    //             resolve(null)
    //         })
    //     } else {
    //         i = ((page-1)*30)
    //     }
    //     console.log("Loading Item Start From : "+i)

    //     return new Promise(resolve => {
    //         let interval = setInterval(function(){
    //                     array.push(faceDetailTemp.LoadBrowMaterial(i+1))
    //                     i++;
    //                     if(i == count || i == page*30){
    //                         clearInterval(interval)
    //                         resolve(array)
    //                     }
    //                 },5)
    //     })
    // }
    // LoadEyes(page = 1){
    //     let array = []
    //     let faceDetailTemp = new FaceDetails()
    //     let count = faceDetailTemp.getEyeCount()
    //     let i;
    //     if ( page > (count/30)+1 || page < 1){
    //         return new Promise(resolve => {
    //             resolve(null)
    //         })
    //     } else {
    //         i = ((page-1)*30)
    //     }
    //     console.log("Loading Item Start From : "+i)

    //     return new Promise(resolve => {
    //         let interval = setInterval(function(){
    //                     array.push(faceDetailTemp.LoadEyeMaterial(i+1))
    //                     i++;
    //                     if(i == count || i == page*30){
    //                         clearInterval(interval)
    //                         resolve(array)
    //                     }
    //                 },5)
    //     })
    // }
    // LoadNose(page = 1){
    //     let array = []
    //     let faceDetailTemp = new FaceDetails()
    //     let count = faceDetailTemp.getNoseCount()
    //     let i;
    //     if ( page > (count/30)+1 || page < 1){
    //         return new Promise(resolve => {
    //             resolve(null)
    //         })
    //     } else {
    //         i = ((page-1)*30)
    //     }
    //     console.log("Loading Item Start From : "+i)

    //     return new Promise(resolve => {
    //         let interval = setInterval(function(){
    //                     array.push(faceDetailTemp.LoadNoseMaterial(i+1))
    //                     i++;
    //                     if(i == count || i == page*30){
    //                         clearInterval(interval)
    //                         resolve(array)
    //                     }
    //                 },5)
    //     })
    // }

    // LoadMouth(page = 1){
    //     let array = []
    //     let faceDetailTemp = new FaceDetails()
    //     let count = faceDetailTemp.getMouthCount()
    //     let i;
    //     if ( page > (count/30)+1 || page < 1){
    //         return new Promise(resolve => {
    //             resolve(null)
    //         })
    //     } else {
    //         i = ((page-1)*30)
    //     }
    //     console.log("Loading Item Start From : "+i)

    //     return new Promise(resolve => {
    //         let interval = setInterval(function(){
    //                     array.push(faceDetailTemp.LoadMouthMaterial(i+1))
    //                     i++;
    //                     if(i == count || i == page*30){
    //                         clearInterval(interval)
    //                         resolve(array)
    //                     }
    //                 },5)
    //     })
    // }

    LoadEquipList(category, page = 1,PlayerID){
        let array = []
        let itemDetailTemp = new ItemDetails()
        let count = itemDetailTemp.getCount(category)
        let i;
        if ( page > (count/30)+1 || page < 1){
            return new Promise(resolve => {
                resolve(null)
            })
        } else {
            i = ((page-1)*30)
        }

        return new Promise(resolve => {
            let interval = setInterval(function(){
                        array.push(itemDetailTemp.LoadPreview(category,i))
                        i++;
                        if(i == count || i == page*30){
                            clearInterval(interval)
                            resolve(array)
                        }
                    },5)
        })
    }

    LoadAppearanceList(part, page = 1){
        let array = []
        let faceDetailTemp = new FaceDetails()
        let count = faceDetailTemp.getCount(part)
        let i;
        if ( page > (count/30)+1 || page < 1){
            return new Promise(resolve => {
                resolve(null)
            })
        } else {
            i = ((page-1)*30)
        }

        return new Promise(resolve => {
            let interval = setInterval(function(){
                        array.push(faceDetailTemp.LoadMaterialPart(part,(i+1)))
                        i++;
                        if(i == count || i == page*30){
                            clearInterval(interval)
                            resolve(array)
                        }
                    },5)
        })
    }


    EquipItem(id,part){
        let itemDetailTemp = new ItemDetails()
        let itemDetails = itemDetailTemp.getDetails(part, id)

        this.PLAYER.add(itemDetails.mesh)

        let equippedObject = {
            PLAYER: this.PLAYER,
            equippedItem: itemDetails.mesh
        }

        return equippedObject
    }

    UneqItem(mesh){
        this.PLAYER.remove(mesh)

        return this.PLAYER
    }
    EquipAppearance(mat,part){
        let plane = new THREE.PlaneGeometry(15,15)
        if(this.appearance[part] != null){
            this.PLAYER.remove(this.appearance[part])
        }
        this.appearance[part] = new THREE.Mesh(plane,mat)
        this.appearance[part].position.set(0,20-(part*2.5),7.6+(part*0.01))
        this.PLAYER.add(this.appearance[part])

        return this.PLAYER
    }


    PlayerWalk(){
        let player_leg_l = this.PLAYER.children[0]
        let player_leg_r = this.PLAYER.children[1]
        let player_hand_l = this.PLAYER.children[2]
        let player_hand_r = this.PLAYER.children[3]

        if(this.pivot == 0){
            player_leg_l.rotation.x += -Math.PI/40
            player_leg_l.position.z += 1

            player_leg_r.rotation.x += Math.PI/40
            player_leg_r.position.z -= 1

            player_hand_l.rotation.x += Math.PI/40
            player_hand_l.position.z -= 0.5

            player_hand_r.rotation.x += -Math.PI/40
            player_hand_r.position.z += 0.5

            if(player_leg_l.rotation.x <= -Math.PI/4){
                this.pivot = 1
            }
        } else {
            player_leg_l.rotation.x += Math.PI/40
            player_leg_l.position.z -= 1

            player_leg_r.rotation.x += -Math.PI/40
            player_leg_r.position.z += 1

            player_hand_r.rotation.x += Math.PI/40
            player_hand_r.position.z -= 0.5

            player_hand_l.rotation.x += -Math.PI/40
            player_hand_l.position.z += 0.5

            if(player_leg_l.rotation.x >= Math.PI/4){
                this.pivot = 0
            }
        }

    }

    
    PlayerStop(){
        let player_leg_l = this.PLAYER.children[0]
        let player_leg_r = this.PLAYER.children[1]
        let player_hand_l = this.PLAYER.children[2]
        let player_hand_r = this.PLAYER.children[3]

        player_leg_l.position.z = 0
        player_leg_l.rotation.x = 0

        player_leg_r.position.z = 0
        player_leg_r.rotation.x = 0

        player_hand_l.position.z = 0
        player_hand_l.rotation.x = 0

        player_hand_r.position.z = 0
        player_hand_r.rotation.x = 0
    }
}
export default PlayerLoader