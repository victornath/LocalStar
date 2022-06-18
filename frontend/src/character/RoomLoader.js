import * as THREE from 'three';
import RoomDetails from '../3DObject/Room/Rooms.js';
import * as PF from 'pathfinding';

class RoomLoader {
    constructor(SCENE, MANAGER) {
        this.TEXTURE_LOADER = new THREE.TextureLoader(MANAGER)
        this.Room = []
        this.RoomDetails = new RoomDetails()
        this.Scene = SCENE

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.Scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        this.Scene.add(dirLight);

    }

    Load(RoomID, showGrid = false) {
        if (this.Room.length > 0) {
            this.Room.forEach(e => {
                this.Scene.remove(e)
            })
            this.Room = []
        }
        let RoomDetail = this.RoomDetails.getDetails(RoomID)
        this.x = RoomDetail.x
        this.y = RoomDetail.y
        this.spawn = RoomDetail.spawn
        this.room_name = RoomDetail.roomName
        this.ROOM_GRID = new PF.Grid(RoomDetail.x, RoomDetail.y)

        let ground = new THREE.PlaneGeometry((RoomDetail.x * 25), (RoomDetail.y * 25))
        let ground_texture = this.TEXTURE_LOADER.load('./images/texture/ground/' + RoomDetail.floor + '.png')
        ground_texture.wrapS = THREE.RepeatWrapping
        ground_texture.wrapT = THREE.RepeatWrapping
        ground_texture.repeat.set(RoomDetail.x, RoomDetail.y)
        let ground_material = new THREE.MeshLambertMaterial({
            map: ground_texture,
            side: THREE.DoubleSide
        })
        const ground_mesh = new THREE.Mesh(ground, ground_material)
        ground_mesh.position.set((RoomDetail.x * 25) / 2, 0, (RoomDetail.y * 25) / 2)
        ground_mesh.rotation.x = -Math.PI / 2
        // ground_mesh.layers.set(1)

        this.Room.push(ground_mesh)
        this.Scene.add(ground_mesh)

        /* Wall
            R = kanan
            L = kiri
        */
        let wall_r = new THREE.PlaneGeometry(RoomDetail.x * 25, 100)
        let wall_r_texture = this.TEXTURE_LOADER.load('./images/texture/wall/' + RoomDetail.wall + '.png')
        wall_r_texture.wrapS = THREE.RepeatWrapping
        wall_r_texture.wrapT = THREE.RepeatWrapping
        wall_r_texture.repeat.set(RoomDetail.x, 1)
        let wall_r_material = new THREE.MeshLambertMaterial({
            map: wall_r_texture,
            side: THREE.DoubleSide
        })
        const wall_r_mesh = new THREE.Mesh(wall_r, wall_r_material)
        wall_r_mesh.position.set((RoomDetail.x * 25) / 2, 50, 0)
        this.Room.push(wall_r_mesh)
        this.Scene.add(wall_r_mesh)

        let wall_l = new THREE.PlaneGeometry(RoomDetail.y * 25, 100)
        let wall_l_texture = this.TEXTURE_LOADER.load('./images/texture/wall/' + RoomDetail.wall + '.png')
        wall_l_texture.wrapS = THREE.RepeatWrapping
        wall_l_texture.wrapT = THREE.RepeatWrapping
        wall_l_texture.repeat.set(RoomDetail.y, 1)
        let wall_l_material = new THREE.MeshLambertMaterial({
            map: wall_l_texture,
            side: THREE.DoubleSide
        })
        const wall_l_mesh = new THREE.Mesh(wall_l, wall_l_material)
        wall_l_mesh.position.set(0, 50, (RoomDetail.y * 25) / 2)
        wall_l_mesh.rotation.y = -Math.PI / 2
        this.Room.push(wall_l_mesh)
        this.Scene.add(wall_l_mesh)

        // grid helper
        if (showGrid == true) {
            let gridHelper = new THREE.GridHelper((RoomDetail.x * 25), RoomDetail.x);
            gridHelper.position.set((RoomDetail.x * 25) / 2, 0, (RoomDetail.y * 25) / 2);
            this.Room.push(gridHelper)
            this.Scene.add(gridHelper)
        }

        //objects
        RoomDetail.objects.forEach(element => {
            element.mesh.position.set((element.position_x) * 25, element.position_y, (element.position_z) * 25)
            if (element.URL != null) {
                element.mesh.name = "clickable"
                element.mesh.userData = { URL: element.URL }
            }
            this.Room.push(element.mesh)
            this.Scene.add(element.mesh)
            for (let index = 0; index < element.size_x; index++) {
                for (let index2 = 0; index2 < element.size_z; index2++) {
                    this.ROOM_GRID.setWalkableAt(element.position_x + index - 1, element.position_z + index2 - 1, false)
                    console.log("Position: (" + (element.position_x + index) + "," + (element.position_z + index2) + ") is blocked")
                }
            }
        });

    }

    getGrid() {
        return this.ROOM_GRID
    }

    blockGrid(x,z){
        this.ROOM_GRID.setWalkableAt(x,z,false)
    }
    openGrid(x,z){
        this.ROOM_GRID.setWalkableAt(x,z,true)
    }

    getRoomName() {
        return this.room_name
    }
}
export default RoomLoader