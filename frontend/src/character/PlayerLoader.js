import PLAYER_OBJ from '../3DObject/Player/Player.js';
class PlayerLoader {

    constructor(data) {
        this.OTHER_PLAYER = []
        this.getData()
    }

    async getData(){
        const response = await fetch("/api/users/",{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
        });
        var data = await response.json()
        if(response){
            this.LoadData(data)
        }

    }

    LoadPlayer(data){
        let player = new PLAYER_OBJ().group
        let appearance = [data.equipped_items.hat,data.equipped_items.hair,data.equipped_items.top,data.equipped_items.bottom,data.equipped_items.shoes]
        this.PLAYER = {
            player: player,
            head: player.children[5],
            equip: appearance
        }
    }

    Load(PlayerID) {
        let player = new PLAYER_OBJ().group
        let appearance = []
        this.OTHER_PLAYER[PlayerID] = {
            player: player,
            head: player.children[5],
            equip: appearance
        }

        return this.OTHER_PLAYER.length
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