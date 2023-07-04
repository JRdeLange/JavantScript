import Vec2 from "./vec2.js"
import Ant from "./ant.js"

export default class World{

    constructor(nr_of_ants, width, height){
        this.width = width;
        this.height = height;
        this.nr_of_ants = nr_of_ants;
        this.ants = [];
        for (let idx = 0; idx < nr_of_ants; idx++) {
            this.spawn_ant();
            
        }
    }

    spawn_ant(){
        let x = Math.random() * this.width;
        let y = Math.random() * this.height;
        let new_pos = new Vec2(x, y);
        let new_ant = new Ant(new_pos);
        this.ants.push(new_ant);
    }

    get_ants(){
        return this.ants;
    }

    tick(){
        // For each ant
        for (const ant of this.ants) {
            // Move
            ant.tick();

            // Keep inside world
            let pos = ant.get_pos();
            if (pos.x < 0) { pos.x = 0; } else if (pos.x > this.width) { pos.x = this.width; }
            if (pos.y < 0) { pos.y = 0; } else if (pos.y > this.height) { pos.y = this.height; }
        }

    }

}