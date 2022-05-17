import * as THREE from '../three.js/build/three.module.js'
import PlayerLoader from '../../item/PlayerLoader.js';
import {FontLoader} from '../../three.js/examples/jsm/loaders/FontLoader.js' 
import { TextGeometry } from '../../three.js/examples/jsm/geometries/TextGeometry.js'

/*

    Gunakan file ini sebagai TEMPLATE PEMBUATAN OBJECT.

    1. Sebelum membuat object, ganti nama Class (Line 27) dan export (Line 122)
       sesuai dengan nama object yang akan dibuat

    2. Basic test material hanya digunakan untuk testing.
    3. Disarankan untuk menambahkan comment nama Sub Object.
    4. Untuk membuat object:
        1. Pembuatan object terdiri dari:
            - Properties
            - Geometry
            - Mesh
            - Positioning
            - Rotating (optional)
        2. Setelah object terbuat, lakukan Group Adding
    5. Untuk melakukan testing, buka object_test.js.
    6. Ikuti petunjuk yang sudah di sediakan di object_test.js
    7. Lakuan Go Live Server pada object_test.HTML
    
*/


class Friend_UI
{
    RoundedRectangle( w, h, r, s ) { // width, height, radius corner, smoothness
		
        // helper const's
        const wi = w / 2 - r;		// inner width
        const hi = h / 2 - r;		// inner height
        const w2 = w / 2;			// half width
        const h2 = h / 2;			// half height
        const ul = r / w;			// u left
        const ur = ( w - r ) / w;	// u right
        const vl = r / h;			// v low
        const vh = ( h - r ) / h;	// v high	
        
        let positions = [
        
             wi, hi, 0, -wi, hi, 0, -wi, -hi, 0, wi, -hi, 0
             
        ];
        
        let uvs = [
            
            ur, vh, ul, vh, ul, vl, ur, vl
            
        ];
        
        let n = [
            
            3 * ( s + 1 ) + 3,  3 * ( s + 1 ) + 4,  s + 4,  s + 5,
            2 * ( s + 1 ) + 4,  2,  1,  2 * ( s + 1 ) + 3,
            3,  4 * ( s + 1 ) + 3,  4, 0
            
        ];
        
        let indices = [
            
            n[0], n[1], n[2],  n[0], n[2],  n[3],
            n[4], n[5], n[6],  n[4], n[6],  n[7],
            n[8], n[9], n[10], n[8], n[10], n[11]
            
        ];
        
        let phi, cos, sin, xc, yc, uc, vc, idx;
        
        for ( let i = 0; i < 4; i ++ ) {
        
            xc = i < 1 || i > 2 ? -wi : wi;
            yc = i < 2 ? -hi : hi;
            
            uc = i < 1 || i > 2 ? ur : ul;
            vc = i < 2 ? vh : vl;
                
            for ( let j = 0; j <= s; j ++ ) {
            
                phi = Math.PI / 2  *  ( i + j / s );
                cos = Math.cos( phi );
                sin = Math.sin( phi );
    
                positions.push( xc + r * cos, yc + r * sin, 0 );
    
                uvs.push( uc + ul * cos, vc + vl * sin );
                        
                if ( j < s ) {
                
                    idx =  ( s + 1 ) * i + j + 4;
                    indices.push( i, idx, idx + 1 );
                    
                }
                
            }
            
        }
            
        const geometry = new THREE.BufferGeometry( );
        geometry.setIndex( new THREE.BufferAttribute( new Uint32Array( indices ), 1 ) );
        geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );
        geometry.setAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( uvs ), 2 ) );
        
        return geometry;	
        
    }
    

    constructor(id, name){
        if(name == null){
            name = "Placeholder"
        }
        let FONT_LOADER = new FontLoader()
        // basic test color material
        let black = new THREE.MeshBasicMaterial({
            color: 0x898989,
        })
        let white = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
        })
        let gray = new THREE.MeshBasicMaterial({
            color: 0xA9A9A9,
        })
        let blue = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
        })
        let red = new THREE.MeshLambertMaterial({
            color: 0xff0000,
        })

        // Box
        let geometry = this.RoundedRectangle(-40,-25,10,15)
        let mesh = new THREE.Mesh(geometry, black)
        mesh.rotation.y = Math.PI/4
        mesh.position.set(0,50,0)

        // Box 2
        geometry = this.RoundedRectangle(-40,20,10,15)
        let small_mesh = new THREE.Mesh(geometry, gray)
        small_mesh.rotation.y = Math.PI/4
        small_mesh.position.set(25,52.5,25)

        // Box 2
        geometry = new THREE.PlaneGeometry(80,10)
        let square = new THREE.Mesh(geometry, gray)
        square.rotation.y = Math.PI/4
        square.position.set(30,62.5,30)

        // Circle
        geometry = new THREE.CircleGeometry(17.5,25)
        let circle = new THREE.Mesh(geometry,gray)
        circle.rotation.y = Math.PI/4
        circle.position.set(35,125,35)
        circle.rotation.x = -Math.PI/5
        circle.rotation.z = -Math.PI/8

        // Player Head
        let PLAYER_LOADER = new PlayerLoader()
        let PLAYER_HEAD = PLAYER_LOADER.Load().children[5]
        PLAYER_HEAD.position.set(45,135,45)

        
        // Group Adding
        this.group = new THREE.Group()
        this.group.add(mesh)
        this.group.add(small_mesh)
        this.group.add(square)
        this.group.add(circle)
        this.group.add(PLAYER_HEAD)
        
        let group = this.group
        FONT_LOADER.load( '../../texture/fonts/Bahnschrift_Regular.json', function ( font ) {
            const geometry = new TextGeometry( name, {
                font: font,
                size: 8,
                height: 0,
                bevelEnabled: false,
            } );
            let mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color:0x000000}))
            mesh.rotation.y = Math.PI/4
            mesh.position.set(-2.5,70,45)
            group.add(mesh)    
        })
    }
}
export default Friend_UI;