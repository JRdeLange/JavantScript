

export default class AntConfig{

    constructor(){
        this.speed = null;
        this.wiggle = null;

        // Parameter sliders
        this.ant_speed_slider = document.getElementById("ant_speed");
        this.speed = this.ant_speed_slider.value;
        this.ant_speed_slider.oninput = (event) => {
            this.speed = event.target.value;
        }

        this.ant_wiggle_slider = document.getElementById("ant_wiggle");
        this.wiggle = this.ant_wiggle_slider.value;
        this.ant_wiggle_slider.oninput = (event) => {
            this.wiggle = event.target.value;
        }
        
    }

}