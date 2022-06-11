import * as THREE from 'three'

class Player {
    constructor() {
        // basic test color material
        let black = new THREE.MeshBasicMaterial({
            color: 0x000000,
        })
        let green = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
        })
        let blue = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
        })
        let red = new THREE.MeshBasicMaterial({
            color: 0xff0000,
        })
        let skin = new THREE.MeshLambertMaterial({
            color: 0xffdbac
        })

        // Stack Height (y)
        let height = -25

        // Object 1 : Leg
        let leg_properties = {
            width: 5,
            height: 15,
            length: 5
        }
        let geo_leg = new THREE.BoxGeometry(
            leg_properties.width,
            leg_properties.height,
            leg_properties.length
        )
        const leg_r = new THREE.Mesh(geo_leg, skin)
        leg_r.position.set(5, height + (leg_properties.height / 2), 0)

        const leg_l = new THREE.Mesh(geo_leg, skin)
        leg_l.position.set(-5, height + (leg_properties.height / 2), 0)
        height += leg_properties.height

        // Object 2 : Body
        let body_properties = {
            width: 15,
            height: 20,
            length: 10
        }
        let geo_body = new THREE.BoxGeometry(
            body_properties.width,
            body_properties.height,
            body_properties.length
        )
        const body = new THREE.Mesh(geo_body, skin)
        body.position.set(0, height + (body_properties.height / 2), 0)
        height += body_properties.height

        // Object 3 : Head
        let head_properties = {
            width: 15,
            height: 15,
            length: 15
        }
        let geo_head = new THREE.BoxGeometry(
            head_properties.width,
            head_properties.height,
            head_properties.length
        )
        const head = new THREE.Mesh(geo_head, skin)
        head.position.set(0, height + (head_properties.height / 2), 0)
        height += head_properties.height

        // Object 4 : Hand
        let hand_properties = {
            width: 5,
            height: 13,
            length: 5
        }
        let geo_hand = new THREE.BoxGeometry(
            hand_properties.width,
            hand_properties.height,
            hand_properties.length
        )
        const hand_l = new THREE.Mesh(geo_hand, skin)
        hand_l.position.set(-10, 3.5, 0)

        const hand_r = new THREE.Mesh(geo_hand, skin)
        hand_r.position.set(10, 3.5, 0)

        // Object 5 : Shadow
        let shadow_properties = {
            radius: 12.5,
            segments: 25,
        }
        let geo_shadow = new THREE.CircleGeometry(
            shadow_properties.radius,
            shadow_properties.segments
        )
        const shadow = new THREE.Mesh(geo_shadow, new THREE.MeshBasicMaterial({
            color: 0x151515,
            opacity: 0.35,
            transparent: true
        }))

        shadow.rotation.x = -Math.PI / 2
        shadow.position.set(0, -24.8, 0)

        // Group Adding
        this.group = new THREE.Group()
        this.group.add(leg_l)
        this.group.add(leg_r)
        this.group.add(hand_l)
        this.group.add(hand_r)
        this.group.add(body)
        this.group.add(head)
        this.group.add(shadow)
    }
}
export default Player;