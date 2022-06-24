
const playrooms = [];

let temp_counter = 1
for (let index = 1; index <= 5; index++) {
    let temp = {
        x: 15, y: 10, floor: "ground_grass", wall: "none", spawn: {
            spawn_x: 137.5,
            spawn_y: 25,
            spawn_z: 12.5,
        },
        objects: [{
            mesh: "bentengan_game_tribune_l",
            URL: "",
            position_x: 0.5,
            position_y: 0,
            position_z: -2.5,
            size_x: 1,
            size_z: 2
        }, {
            mesh: "bentengan_game_tribune_mid",
            URL: "",
            position_x: 2,
            position_y: 0,
            position_z: -2.5,
            size_x: 1,
            size_z: 2
        }, {
            mesh: "bentengan_game_tribune_mid",
            URL: "",
            position_x: 4,
            position_y: 0,
            position_z: -2.5,
            size_x: 1,
            size_z: 2
        }, {
            mesh: "bentengan_game_tribune_mid",
            URL: "",
            position_x: 6,
            position_y: 0,
            position_z: -2.5,
            size_x: 1,
            size_z: 2
        }, {
            mesh: "bentengan_game_tribune_mid",
            URL: "",
            position_x: 8,
            position_y: 0,
            position_z: -2.5,
            size_x: 1,
            size_z: 2
        }, {
            mesh: "bentengan_game_tribune_mid",
            URL: "",
            position_x: 10,
            position_y: 0,
            position_z: -2.5,
            size_x: 1,
            size_z: 2
        }, {
            mesh: "bentengan_game_tribune_mid",
            URL: "",
            position_x: 12,
            position_y: 0,
            position_z: -2.5,
            size_x: 1,
            size_z: 2
        }, {
            mesh: "bentengan_game_tribune_r",
            URL: "",
            position_x: 13.5,
            position_y: 0,
            position_z: -2.5,
            size_x: 1,
            size_z: 2
        }, {
            mesh: "bentengan_game_tribune_r",
            URL: "",
            position_x: -2.5,
            position_y: 0,
            position_z: 1.5,
            size_x: 2,
            size_z: 1,
            rotation: 1
        }, {
            mesh: "bentengan_game_tribune_mid",
            URL: "",
            position_x: -2.5,
            position_y: 0,
            position_z: 3,
            size_x: 2,
            size_z: 1,
            rotation: 1
        }, {
            mesh: "bentengan_game_tribune_mid",
            URL: "",
            position_x: -2.5,
            position_y: 0,
            position_z: 5,
            size_x: 2,
            size_z: 1,
            rotation: 1
        }, {
            mesh: "bentengan_game_tribune_mid",
            URL: "",
            position_x: -2.5,
            position_y: 0,
            position_z: 7,
            size_x: 2,
            size_z: 1,
            rotation: 1
        }, {
            mesh: "bentengan_game_tribune_mid",
            URL: "",
            position_x: -2.5,
            position_y: 0,
            position_z: 9,
            size_x: 2,
            size_z: 1,
            rotation: 1
        }, {
            mesh: "bentengan_game_tribune_l",
            URL: "",
            position_x: -2.5,
            position_y: 0,
            position_z: 9.5,
            size_x: 2,
            size_z: 1,
            rotation: 1
        }]
    }
    temp.playroom_id = 5 + index
    temp.room_name = "room_gobaksodor_" + index
    for (let i = 1; i <= 2; i++) {
        for (let j = 1; j <= 2; j++) {
            temp.objects.push({
                mesh: "game_gobaksodor",
                URL: "./gobaksodor?game_room=table_gobaksodor_" + temp_counter,
                position_x: -3 + (i * 7),
                position_y: 0,
                position_z: -1 + (j * 4),
                size_x: 1,
                size_z: 1
            })
            temp_counter++;
        }
    }
    playrooms.push(temp)
}

export default playrooms;