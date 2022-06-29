import * as THREE from 'three';

class hair_long
{
    constructor(material){
        // Stack Height (y)
        let height = 4.5


        // Object 5 : Hair
        let hair_properties = {
            width: 17.5,
            height: 3.5,
            length: 17.5
        }
        let geo_hair = new THREE.BoxGeometry(
            hair_properties.width,
            hair_properties.height,
            hair_properties.length
        )
        const short_hair = new THREE.Mesh(geo_hair, material)
        short_hair.position.set(0,height+2,0)

        let hair_1_properties = {
            width: 17.5,
            height: 27.5,
            length: 10
        }
        let geo_hair_1 = new THREE.BoxGeometry(
            hair_1_properties.width,
            hair_1_properties.height,
            hair_1_properties.length
        )
        const short_hair_1 = new THREE.Mesh(geo_hair_1, material)
        short_hair_1.position.set(0,height-8.5,-5)

        this.object = [[],[],[],[],[],[]]
        // Head
        this.object[0].push(short_hair,short_hair_1)

        // Tangan Kanan
        this.object[1].push()

        // Tangan Kiri
        this.object[2].push()

        // Body
        this.object[3].push()

        // Kaki Kanan
        this.object[4].push()

        // Kaki Kiri
        this.object[5].push()

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(short_hair)
        this.group.add(short_hair_1)
    }
}
export default hair_long;