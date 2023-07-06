

export default class AntConfig{

    constructor(){
        this.speed = null;
        this.wiggle = null;
        this.turn_speed_factor = 0.15;
        this.turn_speed = null;
        this.pheromone_amount = null;
        this.pheromone_detection_distance = 10;
        this.nest_interact_distance = 10;


        // Parameter sliders
        this.ant_speed_slider = document.getElementById("ant_speed");
        this.speed = this.ant_speed_slider.value;
        this.ant_speed_slider.oninput = (event) => {
            this.speed = event.target.value;
        }

        this.ant_wiggle_slider = document.getElementById("ant_wiggle");
        this.wiggle = this.ant_wiggle_slider.value;
        this.turn_speed = this.wiggle * this.turn_speed_factor;
        this.ant_wiggle_slider.oninput = (event) => {
            this.wiggle = event.target.value;
            this.turn_speed = this.wiggle * this.turn_speed_factor;
        }

        this.pheromone_amount_slider = document.getElementById("pheromone_amount");
        this.pheromone_amount = this.pheromone_amount_slider.value;
        this.pheromone_amount_slider.oninput = (event) => {
            this.pheromone_amount = event.target.value;
        }
        
    }

}