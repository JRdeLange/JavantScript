import Vec2 from "./vec2.js"


export default class Ant{

    constructor(nest, config, pheromone_map){
        this.nest = nest;
        this.pos = nest.pos;
        this.rot = Math.random() * 2 * Math.PI;
        this.config = config;
        this.pheromone_map = pheromone_map;

        // States are:
        // SEARCH:  Look for pheromones -> food
        // CARRY:   Carry food back to nest, drop pheromones
        // RETIRE:  Return back to the nest for deletion
        this.state = "SEARCH"
    }

    tick(){
        this.move()
    }

    search(){
        // Look for pheromones

        // Follow pheromones

        // Check for food

        // Pick up food

        // Maybe switch state
    }

    return_to_nest(){
        console.log();
    }

    drop_pheromones(){
        this.pheromone_map.drop_at_world_coords(this.pos.x, this.pos.y, this.config.phermone_amount);
    }

    move(){
        if (this.state == "SEARCH"){
            this.search();
        } else if (this.state == "CARRY"){
            this.return_to_nest();
            this.drop_pheromones();
        } else if (this.state == "RETIRE"){
            this.return_to_nest();
        }


        // Wiggle
        this.rot += (Math.random() -0.5) * this.config.wiggle;
        
        // Move
        this.pos = this.pos.add(Vec2.fromRadians(this.rot).multiply(this.config.speed));

        this.pheromone_map.drop_at_world_coords(this.pos.x, this.pos.y, 50);
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

    die(){
        // Do things like drop whatever is being carried
    }

}