import Vec2 from "./vec2.js"
import Ant from "./ant.js"
import AntConfig from "./antconfig.js"
import Nest from "./nest.js"
import PheromoneMap from "./pheromonemap.js"


export default class World{

    constructor(width, height, pheromone_scale){
        // World parameters
        this.width = width;
        this.height = height;
        this.pheromone_map = new PheromoneMap(pheromone_scale, width, height);

        // Ant parameters
        this.ant_config = new AntConfig();

        // Create nest and ants
        this.nest = null;
        this.nr_of_ants_slider = document.getElementById("nr_of_ants");
        this.ants = [];
        this.retiring_ants = [];
        this.initialize_nest_and_ants();
        
        this.ants_population_change_speed = 3;
    }

    initialize_nest_and_ants(){
        let x = Math.random() * this.width;
        let y = Math.random() * this.height;
        this.nest = new Nest(new Vec2(x, y));
        
        // Facilitate changing number of ants
        this.nr_of_ants_slider.oninput = (event) => {
            //this.change_nr_of_ants_to(event.target.value);
        }
    }
    
    change_nr_of_ants_to(new_nr){
        let difference = new_nr - this.nr_of_ants;
        if (difference > 0){
            while (this.ants.length < new_nr) {
                this.spawn_ant();
            }
        } else {
            while (this.ants.length > new_nr) {
                this.ants[this.ants.length-1].die();
                this.ants.pop();
            }
        }

        this.nr_of_ants = new_nr;
    }

    spawn_ant(){
        let new_ant = new Ant(this.nest, this.ant_config, this.pheromone_map, this.remove_ant);
        this.ants.push(new_ant);
    }

    get_ants(){
        return this.ants.concat(this.retiring_ants);
    }

    get_nest(){
        return this.nest;
    }

    get_pheromone_map(){
        return this.pheromone_map;
    }

    // Defined with => to make this.retiring_ants accessible
    remove_ant = (ant) => {
        ant.die();
        if (ant.get_state() == "RETIRE") {
            this.retiring_ants.splice(this.retiring_ants.indexOf(ant), 1);
        } else {
            this.ants.splice(this.ants.indexOf(ant), 1);
        }
    }

    // Return bool of whether the nr was adjusted
    adjust_nr_of_ants(){
        let total_ants = this.get_ants().length;
        if (total_ants > this.nr_of_ants_slider.value){
            if (this.ants.length > this.nr_of_ants_slider.value){
                let retiree = this.ants.pop();
                retiree.retire();
                this.retiring_ants.push(retiree);
            }
            
        } else if (total_ants < this.nr_of_ants_slider.value) {
            this.spawn_ant();
        } else {
            return false;
        }
        return true;
    }

    tick(){
        // adjust at most 5 ants per frame
        for (let iter = 0; iter < this.ants_population_change_speed; iter++) {
            this.adjust_nr_of_ants();
        }

        // For each ant
        for (const ant of this.get_ants()) {
            // Move
            ant.tick();

            // Keep inside world
            let pos = ant.get_pos();
            if (pos.x < 0) { pos.x = 0; } else if (pos.x > this.width) { pos.x = this.width; }
            if (pos.y < 0) { pos.y = 0; } else if (pos.y > this.height) { pos.y = this.height; }
        }

        this.pheromone_map.update_pheromones();

    }

}