import * as THREE from 'three';
import * as PF from 'pathfinding';

class RoomLoader {
    constructor(SCENE) {
        this.TEXTURE_LOADER = new THREE.TextureLoader()
        this.Scene = SCENE

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.Scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(0, 20, 10); // x, y, z
        this.Scene.add(dirLight);

    }

    async loadObjects(itemId) {
        let item = await import('../3DObject/' + itemId + '.js');
        return new Promise(resolve => {
            resolve({
                object: new item.default()
            })
        })
    }

    async getPlayroom(roomId) {
        const response = await fetch('/api/playrooms/getPlayroom?room_name=' + roomId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response) {
            return new Promise(resolve => {
                resolve(response.json())
            })

        }
    }

    async Load(roomId) {
        return new Promise(resolve => {
            this.getPlayroom(roomId).then(result => {
                let RoomDetail = result[0]
                this.x = RoomDetail.x
                this.y = RoomDetail.y
                this.spawn = new THREE.Vector3(RoomDetail.spawn.spawn_x, RoomDetail.spawn.spawn_y, RoomDetail.spawn.spawn_z)
                this.room_name = RoomDetail.room_name
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
                this.Scene.add(wall_l_mesh)

                //objects
                RoomDetail.objects.forEach(element => {
                    this.loadObjects(element.mesh).then(result => {
                        result.object.group.position.set((element.position_x) * 25, element.position_y, (element.position_z) * 25)
                        if (element.URL != null) {
                            result.object.group.name = "clickable"
                            result.object.group.userData = { URL: element.URL }
                        }
                        this.Scene.add(result.object.group)
                        for (let index = 0; index < element.size_x; index++) {
                            for (let index2 = 0; index2 < element.size_z; index2++) {
                                this.ROOM_GRID.setWalkableAt(element.position_x + index - 1, element.position_z + index2 - 1, false)
                                console.log("Position: (" + (element.position_x + index) + "," + (element.position_z + index2) + ") is blocked")
                            }
                        }
                    })
                });
                resolve("Success")
            })
        })
    }

    getGrid() {
        return this.ROOM_GRID
    }

    blockGrid(x, z) {
        this.ROOM_GRID.setWalkableAt(x, z, false)
    }
    openGrid(x, z) {
        this.ROOM_GRID.setWalkableAt(x, z, true)
    }

    getRoomName() {
        return this.room_name
    }
}
export default RoomLoader