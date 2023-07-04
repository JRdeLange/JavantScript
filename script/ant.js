import Vec2 from "./vec2.js"

export default class Ant{

    constructor(pos){
        this.pos = pos;
        this.rot = Math.random() * 2 * Math.PI;
        this.speed = 0.5;
    }

    tick(){
        this.move()
    }

    move(){
        // Wiggle
        this.rot += Math.random() * 0.4 - 0.2;
        
        // Move
        this.pos = this.pos.add(Vec2.fromRadians(this.rot));

    }

    get_rot(){
        return this.rot;
    }

    get_pos(){
        return this.pos;
    }

    set_pos(pos){
        this.pos = pos;
    }

}