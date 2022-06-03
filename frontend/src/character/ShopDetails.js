import * as THREE from '../three.js/build/three.module.js'

import VedoraHat from '../../item/item/hat_vedora.js'
import SimpleCap from "../../item/item/hat_cap_simple.js"
import ShortHair from "../../item/item/hair_short.js"
import LongHair from "../../item/item/hair_long.js"
import ShirtRed from "../../item/item/shirt_red.js"
import ShirtBlue from "../../item/item/shirt_blue.js"
import ShirtPink from "../../item/item/shirt_pink.js"

const TEXTURE_LOADER = new THREE.TextureLoader()
class ItemDetails
{

    LoadBigPreview(category,id){
        if(!this.ItemDetails[category]){
            return null
        }
        let price = this.ItemDetails[category][id].price
        return new Promise(resolve => {
            TEXTURE_LOADER.load(this.ItemDetails[category][id].preview, function(texture){
                let material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    alphaTest: 0.05
                })
                resolve({
                    material: material,
                    price: price
                })
            })
        })

    }


    LoadPreview(category,id){
        if(!this.ItemDetails[category]){
            return null
        }
        let texture = TEXTURE_LOADER.load(this.ItemDetails[category][id].preview)
        let material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            alphaTest: 0.05
        })
        return {
            material: material,
            price: this.ItemDetails[category][id].price
        }

    }

    /*
        Item Type Guide:
         0: Hat
         1: Hair
         2: Top
         3: Bottom
         4: Shoes
         */
    getCount(itemType){
        switch(itemType){
            case 0:
                return this.HatCount
            case 1:
                return this.HairCount
            case 2:
                return this.TopCount
            case 3:
                return this.BottomCount
            case 4:
                return this.ShoesCount
        }
    }
    constructor()
    {
        this.HatCount = 2
        this.HairCount = 2
        this.TopCount = 3
        this.BottomCount = 0
        this.ShoesCount = 0

        this.ItemDetails = []
        this.ItemDetails.push([{
            id: 0,
            name: "Vedora Hat",
            type: 0,
            mesh: new VedoraHat().group,
            preview: "../../texture/item/hat_vedora.png",
            price: 100
        },{
            id: 1,
            name: "Simple Cap",
            type: 0,
            mesh: new SimpleCap().group,
            preview: "../../texture/item/hat_cap.png",
            price: 100
        }],[{
            id: 2,
            name: "Short Hair",
            type: 1,
            mesh: new ShortHair().group,
            preview: "../../texture/item/hair_short.png",
            price: 100
        },{
            id: 3,
            name: "Long Hair",
            type: 1,
            mesh: new LongHair().group,
            preview: "../../texture/item/hair_long.png",
            price: 100
        }],[{
            id: 4,
            name: "Shirt Red",
            type: 2,
            mesh: new ShirtRed().group,
            preview: "../../texture/item/shirt_red.png",
            price: 100
        },{
            id: 5,
            name: "Shirt Blue",
            type: 2,
            mesh: new ShirtBlue().group,
            preview: "../../texture/item/shirt_blue.png",
            price: 100
        },{
            id: 6,
            name: "Shirt Pink",
            type: 2,
            mesh: new ShirtPink().group,
            preview: "../../texture/item/shirt_pink.png",
            price: 100
        }])
    }
    getDetails(category, itemID){
        return this.ItemDetails[category][itemID]
    }

}
export default ItemDetails;
