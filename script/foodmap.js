

export default class FoodMap{

    constructor(scale, width, height){
        this.food_map = [];
        this.scale = scale;
        this.world_width = width;
        this.world_height = height;
        this.width = width / scale;
        this.height = height / scale;

        this.initialize();

        this.food_brush_radius = 3;
    }

    initialize(){
        for (let x = 0; x < this.width; x++) {
            let column = [];
            for (let y = 0; y < this.height; y++) {
                column.push(0);
            }
            this.food_map.push(column);
        }
        this.drop_test_food();
    }

    drop_test_food(){
        for (let x = 80; x < 90; x++){
            for (let y = 60; y < 70; y++){
                this.food_map[x][y] = 255;
            }
        }
    }

    place_food_at(x, y){
        let pos = this.world_to_map_coords(x, y);
        x = pos[0]; y = pos[1];
        let x_range = [x];
        let y_range = [y];
        for (let offset = 0; offset < this.food_brush_radius; offset++){
            x_range.push(x + offset); x_range.push(x - offset);
            y_range.push(y + offset); y_range.push(y - offset);
        }

        for (const idx_x of x_range) {
            for (const idx_y of y_range) {
                if (this.is_valid_coords(idx_x, idx_y)){
                    this.food_map[idx_x][idx_y] = 255;
                }
            }
        }
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

    get_food_at(x, y){
        let pos = this.world_to_map_coords(x, y);
        x = pos[0]; y = pos[1];
        if (this.is_valid_coords(x, y)){
            return this.food_map[x][y];
        }
        return 0;
    }

    get_food_data(){
        return this.food_map;
    }

    take_food_at(x, y, amount){
        let pos = this.world_to_map_coords(x, y);
        x = pos[0]; y = pos[1];
        if (this.is_valid_coords(x, y)){
            this.food_map[x][y] -= amount;
        }
        
    }
}