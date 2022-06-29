
const playrooms = [];

let temp_counter = 1
for (let index = 1; index <= 5; index++) {
    let temp = {
        x: 10, y: 10, floor: "ground_sand", wall: "wall_sky", spawn: {
            spawn_x: 137.5,
            spawn_y: 25,
            spawn_z: 12.5,
        },
        objects: []
    }
    temp.playroom_id = 10 + index
    temp.room_name = "room_tambang_" + index
    for (let i = 1; i <= 2; i++) {
        for (let j = 1; j <= 2; j++) {
            temp.objects.push({
                mesh: "game_tambang",
                URL: "./tambang?game_room=table_tambang_" + temp_counter,
                position_x: (i * 4),
                position_y: 0,
                position_z: (j * 4),
                size_x: 1,
                size_z: 1
            })
            temp_counter++;
        }
    }
    playrooms.push(temp)
}

export default playrooms;