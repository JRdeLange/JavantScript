import Vec2 from "./vec2.js"


export default class Ant{

    constructor(nest, config, pheromone_map, food_map, remove_me_function){
        this.nest = nest;
        this.pos = nest.pos;
        this.rot = Math.random() * 2 * Math.PI;
        this.config = config;
        this.pheromone_map = pheromone_map;
        this.food_map = food_map;
        
        this.remove_me_function = remove_me_function;

        // States are:
        // SEARCH:  Look for pheromones -> food
        // CARRY:   Carry food back to nest, drop pheromones
        // RETIRE:  Return back to the nest for deletion
        this.state = "SEARCH"

        this.food_origin = null;
        this.food_origin_distance_to_nest = null;

        this.pheromone_search_timeout = 0;
    }

    tick(){
        this.move()
    }

    // Return true if pheromones were found
    turn_to_pheromones(){
        // At three positions
        let ahead = Vec2.from_radians(this.rot).multiply(this.config.pheromone_detection_distance);
        let sensor_directions = [-this.config.turn_speed, 0, this.config.turn_speed * 2];

        // Evaluate pheromones
        let highest_idx = -1;
        let highest_value = 0;
        for (let idx = 0; idx < sensor_directions.length; idx++){
            let sensor_location = this.pos.add(ahead.rotate(sensor_directions[idx]));
            let value = this.pheromone_map.get_pheromone_at(sensor_location.x, sensor_location.y);
            if (value > highest_value){
                highest_value = value;
                highest_idx = idx;
            }
        }

        // If the highest is over 0, turn towards it (determine by ant wiggle?)
        if (highest_value > 0){
            this.rot += sensor_directions[highest_idx];
            return true;
        }
        return false
    }

    pick_up_food(){
        this.food_map.take_food_at(this.pos.x, this.pos.y);
        // Switch state
        this.state = "CARRY";
        this.drop_food_found_pheromones();
        this.food_origin = this.pos.clone();
        this.food_origin_distance_to_nest = this.nest.pos.subtract(this.pos).magnitude();
        this.rot += Math.PI;
    }

    search(){
        let found_pheromones = this.turn_to_pheromones();

        // Check for food
        if (this.food_map.get_food_at(this.pos.x, this.pos.y)){
            // Pick up food
            this.pick_up_food();
        }

        return found_pheromones;
    }

    return_to_nest(){// Find direction to nest
        let dir = Vec2.from_radians(this.rot);
        let angle_to_nest = dir.angle_to(this.nest.pos.subtract(this.pos));

        // Turn towards it 
        if (angle_to_nest > 0){
            this.rot += Math.min(this.config.wiggle * 0.1, angle_to_nest);
        } else {
            this.rot += Math.max(-this.config.wiggle * 0.1, angle_to_nest);
        }
    }

    enter_nest(){
        this.remove_me_function(this);
    }

    drop_food(){
        this.state = "SEARCH";
        this.food_origin_distance_to_nest = null;
        this.food_origin = null;
        this.rot += Math.PI;
        this.nest.deposit_food();
        // Add food to the counter
    }

    at_nest(){
        return (this.nest.pos.subtract(this.pos).magnitude() < this.config.nest_interact_distance);
    }

    drop_pheromones(){
        let drop_fraction = 0;
        if (this.food_origin_distance_to_nest > 0){
            drop_fraction = this.nest.pos.subtract(this.pos).magnitude() / this.food_origin_distance_to_nest;
            drop_fraction = drop_fraction * 0.65 + 0.35;
        }
        this.pheromone_map.drop_pheromone_at(this.pos.x, this.pos.y, this.config.pheromone_amount * drop_fraction);
    }

    drop_food_found_pheromones(){
        this.pheromone_map.drop_pheromone_at(this.pos.x, this.pos.y, this.config.pheromone_amount * 100);
    }

    move(){
        if (this.state == "SEARCH"){
            // If no pheromones were found
            if (this.pheromone_search_timeout > 0){
                this.pheromone_search_timeout--;
            } else {
                if (!this.search()){
                    this.pheromone_search_timeout = this.config.pheromone_lockout_window;
                }
            }
        } else if (this.state == "CARRY"){
            this.return_to_nest();
            this.drop_pheromones();
            if (this.at_nest()){    
                this.drop_food();
            }
        } else if (this.state == "RETIRE"){
            this.return_to_nest();
            if (this.at_nest()){    
                this.enter_nest();
            }

        }
        // Wiggle
        this.rot += (Math.random() - 0.5) * this.config.wiggle;
        
        // Move
        this.pos = this.pos.add(Vec2.from_radians(this.rot).multiply(this.config.speed));
    }

    get_rot(){
        return this.rot;
    }

    turn_around(){
        this.rot += Math.PI;
    }

    get_pos(){
        return this.pos;
    }

    set_pos(pos){
        this.pos = pos;
    }

    get_state(){
        return this.state;
    }

    die(){
        // Do things like drop whatever is being carried
    }

    retire(){
        this.state = "RETIRE";

        // Drop food
    }

}