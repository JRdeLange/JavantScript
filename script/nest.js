

export default class Nest{

    constructor(pos){
        this.pos = pos;
        this.rot = Math.random() * 2 * Math.PI;
    }

    get_pos(){
        return this.pos;
    }

    get_rot(){
        return this.rot;
    }

}