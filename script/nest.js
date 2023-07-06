

export default class Nest{

    constructor(pos){
        this.pos = pos;
        this.rot = Math.random() * 2 * Math.PI;
        this.food_collected = 0;
    }

    deposit_food(){
        this.food_collected++;
    }

    get_food_collected(){
        return this.food_collected;
    }

    get_pos(){
        return this.pos;
    }

    get_rot(){
        return this.rot;
    }

}