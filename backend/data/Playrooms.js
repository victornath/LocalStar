
const playrooms = [];

for (let index = 1; index <= 80; index++) {
    let minigame
    if (index >= 1 && index <= 20) {
        minigame = "Congklak"
    } else if (index >= 21 && index <= 40) {
        minigame = "Gobak Sodor"
    } else if (index >= 41 && index <= 60) {
        minigame = "Tarik Tambang"
    } else {
        minigame = "Balap Karung"
    }
    let temp = {
        table_id: index,
        game_name: minigame,
        playroom_id: Math.floor(((index - 1) / 4)) + 1,
    }
    playrooms.push(temp)

}

export default playrooms;