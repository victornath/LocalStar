import PLAYER_OBJ from '../3DObject/Player/Player.js';
import ItemLoader from './ItemLoader.js';

class PlayerLoader {

    constructor(data) {
        this.ITEM_LOADER = new ItemLoader()
        this.OTHER_PLAYER = []
        this.getData(data)
    }

    async loadItem(itemId){
        return await this.ITEM_LOADER.load(itemId)
    }
    
    async getData(data){
        const response = await fetch("/api/users/?id="+data,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        });
        var data = await response.json()
        if(response){
            this.LoadPlayer(data)
        }

    }
    async getOtherData(data){
        const response = await fetch("/api/users/?id="+data,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        });
        return await response.json()
    }

    LoadPlayer(data){
        let player = new PLAYER_OBJ().group
        let equip = [data.equipped_items.hat,data.equipped_items.hair,data.equipped_items.top,data.equipped_items.bottom,data.equipped_items.shoes]
        let equip_object = []
        for (let i = 0; i < equip.length; i++) {
            if(equip[i].length > 0){
                this.loadItem(equip[i]).then(result => {
                    equip_object[i] = result.object.group
                    player.add(result.object.group)
                })
            }
        }
        this.PLAYER = {
            player: player,
            head: player.children[5],
            equip: equip,
            equip_obj: equip_object
        }
    }

    Load(PlayerID) {
        this.getOtherData(PlayerID).then(data => {
            let player = new PLAYER_OBJ().group
            let equip = [data.equipped_items.hat,data.equipped_items.hair,data.equipped_items.top,data.equipped_items.bottom,data.equipped_items.shoes]
            let equip_object = []
            for (let i = 0; i < equip.length; i++) {
                if(equip[i].length > 0){
                    this.loadItem(equip[i]).then(result => {
                        equip_object[i] = result.object.group
                        player.add(result.object.group)
                    })
                }
            }
            this.OTHER_PLAYER[PlayerID] = {
                player: player,
                head: player.children[5],
                equip: equip,
                equip_obj: equip_object
            }    
        })
    }

    PlayerWalk() {
        let player_leg_l = this.PLAYER.player.children[0]
        let player_leg_r = this.PLAYER.player.children[1]
        let player_hand_l = this.PLAYER.player.children[2]
        let player_hand_r = this.PLAYER.player.children[3]

        if (this.pivot == 0) {
            player_leg_l.rotation.x += -Math.PI / 40
            player_leg_l.position.z += 1

            player_leg_r.rotation.x += Math.PI / 40
            player_leg_r.position.z -= 1

            player_hand_l.rotation.x += Math.PI / 40
            player_hand_l.position.z -= 0.5

            player_hand_r.rotation.x += -Math.PI / 40
            player_hand_r.position.z += 0.5

            if (player_leg_l.rotation.x <= -Math.PI / 4) {
                this.pivot = 1
            }
        } else {
            player_leg_l.rotation.x += Math.PI / 40
            player_leg_l.position.z -= 1

            player_leg_r.rotation.x += -Math.PI / 40
            player_leg_r.position.z += 1

            player_hand_r.rotation.x += Math.PI / 40
            player_hand_r.position.z -= 0.5

            player_hand_l.rotation.x += -Math.PI / 40
            player_hand_l.position.z += 0.5

            if (player_leg_l.rotation.x >= Math.PI / 4) {
                this.pivot = 0
            }
        }

    }

    PlayerStop() {
        let player_leg_l = this.PLAYER.player.children[0]
        let player_leg_r = this.PLAYER.player.children[1]
        let player_hand_l = this.PLAYER.player.children[2]
        let player_hand_r = this.PLAYER.player.children[3]

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