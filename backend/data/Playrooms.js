
const playrooms = [];

for (let game = 1; game <= 4; game++) {
    let temp_counter = 1
    let game_name
    switch (game) {
        case 1:
            game_name = "congklak"
            break;
        case 2:
            game_name = "gobaksodor"
            break;
        case 3:
            game_name = "tambang"
            break;
        case 4:
            game_name = "karung"
            break;
    }
    for (let index = 1; index <= 5; index++) {
        let temp = {
            playroom_id: ((game - 1) * 5) + index,
            x: 10,
            y: 10,
            room_name: "room_" + game_name + "_" + index,
            floor: "ground_test",
            wall: "wall_test",
            spawn: {
                spawn_x: 137.5,
                spawn_y: 25,
                spawn_z: 12.5,
            },
            objects: [],
        }
        for (let i = 1; i <= 2; i++) {
            for (let j = 1; j <= 2; j++) {
                temp.objects.push({
                    mesh: "congklak_board",
                    URL: "./" + game_name + "?game_room=table_" + game_name + "_" + temp_counter,
                    position_x: (i * 4),
                    position_y: 25,
                    position_z: (j * 4),
                    size_x: 1,
                    size_z: 1
                }, {
                    mesh: "desk",
                    URL: "",
                    position_x: (i * 4),
                    position_y: 0,
                    position_z: (j * 4),
                    size_x: 2,
                    size_z: 2
                })
                temp_counter++;
            }
        }
        playrooms.push(temp)
    }
}

export default playrooms;