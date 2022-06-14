
const playrooms = [];

let tableCount = 0;
for (let index = 1; index <= 20; index++) {
    let minigame
    if (index >= 1 && index <= 5) {
        minigame = "Congklak"
    } else if (index >= 6 && index <= 10) {
        minigame = "Gobak Sodor"
    } else if (index >= 11 && index <= 15) {
        minigame = "Tarik Tambang"
    } else {
        minigame = "Balap Karung"
    }
    let tempArray = [];
    for (let j = 1; j <= 4; j++) {
        tempArray.push(++tableCount)
    }
    let temp = {
        playroom_id: index,
        game_name: minigame,
        table_ids: tempArray,
    }
    playrooms.push(temp)

}

export default playrooms;