import * as THREE from 'three';
import Desk from "../Desk.js";
import Congklak from "../congklak_board.js";

class RoomDetails {
    constructor() {
        this.RoomDetails = []
        this.RoomDetails.push({
            x: 10,
            y: 10,
            roomName: "Test Congklak Room",
            floor: "ground_test",
            wall: "wall_test",
            spawn: new THREE.Vector3(137.5, 25, 12.5),
            objects: [
                {
                    mesh: new Desk().group,
                    position_x: 4,
                    position_y: 0,
                    position_z: 4,
                    size_x: 2,
                    size_z: 2
                },
                {
                    mesh: new Desk().group,
                    position_x: 8,
                    position_y: 0,
                    position_z: 4,
                    size_x: 2,
                    size_z: 2
                },
                {
                    mesh: new Desk().group,
                    position_x: 4,
                    position_y: 0,
                    position_z: 8,
                    size_x: 2,
                    size_z: 2
                },
                {
                    mesh: new Desk().group,
                    position_x: 8,
                    position_y: 0,
                    position_z: 8,
                    size_x: 2,
                    size_z: 2
                },
                {
                    mesh: new Congklak().group,
                    URL: "./congklak?game_room=table_congklak_1",
                    position_x: 8,
                    position_y: 25,
                    position_z: 8,
                    size_x: 1,
                    size_z: 1
                },
                {
                    mesh: new Congklak().group,
                    URL: "./congklak?game_room=table_congklak_2",
                    position_x: 4,
                    position_y: 25,
                    position_z: 4,
                    size_x: 1,
                    size_z: 1
                },
                {
                    mesh: new Congklak().group,
                    URL: "./congklak?game_room=table_congklak_3",
                    position_x: 8,
                    position_y: 25,
                    position_z: 4,
                    size_x: 1,
                    size_z: 1
                },
                {
                    mesh: new Congklak().group,
                    URL: "./congklak?game_room=table_congklak_4",
                    position_x: 4,
                    position_y: 25,
                    position_z: 8,
                    size_x: 1,
                    size_z: 1
                }
            ]
        })
        this.RoomDetails.push({
            x: 8,
            y: 8,
            roomName: "Test Room Red",
            floor: "ground_test",
            wall: "wall_red",
            spawn: new THREE.Vector3(137.5, 25, 12.5),
            objects: []
        })
    }

    getDetails(RoomID) {
        return this.RoomDetails[RoomID]
    }
}
export default RoomDetails;
