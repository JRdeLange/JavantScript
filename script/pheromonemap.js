

export default class PheromoneMap{

    constructor(scale, width, height){
        this.pheromone_map = [];
        this.scale = scale;
        this.world_width = width;
        this.world_height = height;
        this.width = width / scale;
        this.height = height / scale;

        this.spread_speed = 0.35;
        this.fade_multiplier = 0.996;
        this.pheromone_threshold = 5;

        this.initialize();
    }

    initialize(){
        for (let x = 0; x < this.width; x++) {
            let column = [];
            for (let y = 0; y < this.height; y++) {
                column.push(0);
            }
            this.pheromone_map.push(column);
        }
    }

    update_pheromones(){
        // TODO: Maybe make more performant? Do not check if each pixel is on the border but
        //       do it once per row. It is only run once a frame though, so it may not be worth it.

        let new_map = [];

        // For each pixel
        for (let x = 0; x < this.width; x++) {
            let column = [];
            for (let y = 0; y < this.height; y++) {
                // Average surrounding pixels
                let new_value = this.avg_surrounding_pixels(x, y);
                
                // Disappear a bit of it
                new_value = Math.max(0, new_value * this.fade_multiplier);      
                
                if (new_value < this.pheromone_threshold){
                    new_value = 0;
                }
                
                // Write new pheromone value
                column.push(new_value);
            }   
            new_map.push(column);
        }
        this.pheromone_map = new_map;
    }

    avg_surrounding_pixels(x, y){
        let n_pixels = 0;
        let sum = 0;

        if (x != 0) {
            sum += this.pheromone_map[x - 1][y];
            n_pixels++;
        }

        if (x != this.width - 1) {
            sum += this.pheromone_map[x + 1][y];
            n_pixels++;
        }

        if (y != 0) {
            sum += this.pheromone_map[x][y - 1];
            n_pixels++;
        }

        if (y != this.height - 1) {
            sum += this.pheromone_map[x][y + 1];
            n_pixels++;
        }

        sum /= n_pixels;

        return (this.spread_speed * this.pheromone_map[x][y] + sum) / (this.spread_speed + 1);
    }

    world_to_map_coords(x, y){
        x /= this.scale;
        y /= this.scale;
        x = Math.floor(x);
        y = Math.floor(y);
        return [x, y];
    }

    is_valid_coords(x, y){
        return !(x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1);
    }

    get_pheromone_at(x, y){
        let pos = this.world_to_map_coords(x, y);
        x = pos[0]; y = pos[1];
        if (this.is_valid_coords(x, y)){
            return this.pheromone_map[x][y];
        }
        return 0;
    }

    drop_pheromone_at(x, y, quantity){
        let pos = this.world_to_map_coords(x, y);
        x = pos[0]; y = pos[1];
        if (this.is_valid_coords(x, y)){
            this.pheromone_map[x][y] += quantity;
        }
    }

    get_pheromone_data(){
        return this.pheromone_map;
    }
}