
const playrooms = [];

for (let index = 1; index <= 5; index++) {
    let temp = {
        playroom_id: index,
        x: 10,
        y: 10,
        room_name: "Test Congklak Room",
        floor: "ground_test",
        wall: "wall_test",
        spawn: {
            spawn_x: 137.5,
            spawn_y: 25,
            spawn_z: 12.5,
        },
        objects: [
            {
                mesh: "desk",
                URL: "",
                position_x: 4,
                position_y: 0,
                position_z: 4,
                size_x: 2,
                size_z: 2
            },
            {
                mesh: "desk",
                URL: "",
                position_x: 8,
                position_y: 0,
                position_z: 4,
                size_x: 2,
                size_z: 2
            },
            {
                mesh: "desk",
                URL: "",
                position_x: 4,
                position_y: 0,
                position_z: 8,
                size_x: 2,
                size_z: 2
            },
            {
                mesh: "desk",
                URL: "",
                position_x: 8,
                position_y: 0,
                position_z: 8,
                size_x: 2,
                size_z: 2
            },
            {
                mesh: "congklak",
                URL: "./pages/games/congklak_games.html",
                position_x: 8,
                position_y: 25,
                position_z: 8,
                size_x: 1,
                size_z: 1
            },
            {
                mesh: "congklak",
                URL: "./pages/games/congklak_games.html",
                position_x: 4,
                position_y: 25,
                position_z: 4,
                size_x: 1,
                size_z: 1
            },
            {
                mesh: "congklak",
                URL: "./pages/games/congklak_games.html",
                position_x: 8,
                position_y: 25,
                position_z: 4,
                size_x: 1,
                size_z: 1
            },
            {
                mesh: "congklak",
                URL: "./pages/games/congklak_games.html",
                position_x: 4,
                position_y: 25,
                position_z: 8,
                size_x: 1,
                size_z: 1
            }
        ],
    }
    playrooms.push(temp)

}

export default playrooms;