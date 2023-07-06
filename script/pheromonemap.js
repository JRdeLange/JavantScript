

export default class PheromoneMap{

    constructor(scale, width, height){
        this.pheromone_map = [];
        this.food_map = [];
        this.scale = scale;
        this.world_width = width;
        this.world_height = height;
        this.width = width / scale;
        this.height = height / scale;

        this.bitmap = new ImageData(this.width, this.height);
        this.pixel_data = this.bitmap.data;
        
        this.scaled_canvas = document.createElement("canvas");
        this.scaled_context = this.scaled_canvas.getContext("2d");

        this.initialize();

        this.spread_speed = 0.35;
        this.fade_multiplier = 0.995;
        this.pheromone_threshold = 5;

        this.food_brush_radius = 3;
    }

    initialize(){
        for (let x = 0; x < this.width; x++) {
            let column = [];
            for (let y = 0; y < this.height; y++) {
                column.push(0);
            }
            this.pheromone_map.push(column);
            this.food_map.push(structuredClone(column));
        }

        // Init bitmap to white
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.set_pixel(x, y, [255, 255, 255]);
            }   
        }

        this.drop_test_food();

        // Set scaled_canvas dimensions
        this.scaled_canvas.width = this.world_width;
        this.scaled_canvas.height = this.world_height;
        this.scaled_context.scale(this.scale, this.scale);
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

    spread_pheromones(){
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

    update_pheromones(){
        this.spread_pheromones()

        this.update_bitmap();

        this.update_scaled_canvas();
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

    get_pixel(x, y, pixel_data=this.pixel_data){
        let rgb = [];
        let idx = this.coords_to_idx(x, y);
        rgb.push(pixel_data[idx]);
        rgb.push(pixel_data[idx+1]);
        rgb.push(pixel_data[idx+2]);
        return rgb;
    }

    set_pixel(x, y, rgb, pixel_data=this.pixel_data){
        let idx = this.coords_to_idx(x, y);
        pixel_data[idx] = rgb[0];
        pixel_data[idx+1] = rgb[1];
        pixel_data[idx+2] = rgb[2];
        pixel_data[idx+3] = 255;
    }

    coords_to_idx(x, y){
        // Size of pixel_data is height * width * 4 (channels (rgba))
        // Stride between pixels is 4
        // Stride between rows are width * 4
        return x * 4 + y * this.width * 4;
    }

    world_to_map_coords(x, y){
        x /= this.scale;
        y /= this.scale;
        x = Math.floor(x);
        y = Math.floor(y);
        return [x, y];
    }

    add_rgb(rgb1, rgb2){
        return [rgb1[0] + rgb2[0], rgb1[1] + rgb2[1], rgb1[2] + rgb2[2]];
    }

    add_constant(rgb, constant){
        return [Math.min(rgb[0] + constant, 255), Math.min(rgb[1] + constant, 255), Math.min(rgb[2] + constant, 255)]
    }

    div_rgb(rgb, div){
        return [rgb[0] / div, rgb[1] / div, rgb[2] / div]
    }

    is_valid_coords(x, y){
        return !(x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1);
    }

    get_bitmap(){
        return this.bitmap;
    }

    get_scaled_canvas(){
        return this.scaled_canvas;
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

    get_food_at(x, y){
        let pos = this.world_to_map_coords(x, y);
        x = pos[0]; y = pos[1];
        if (this.is_valid_coords(x, y)){
            return this.food_map[x][y];
        }
        return 0;
    }

    take_food_at(x, y, amount){
        let pos = this.world_to_map_coords(x, y);
        x = pos[0]; y = pos[1];
        if (this.is_valid_coords(x, y)){
            this.food_map[x][y] -= amount;
        }
        
    }
    

    update_bitmap(){
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.food_map[x][y] > 0){
                    this.set_pixel(x, y, [0, 150, 0]);
                } else {
                    this.set_pixel(x, y, [255, 255 - this.pheromone_map[x][y], 255 - this.pheromone_map[x][y]]);
                }
            }
        }
    }

    update_scaled_canvas(){
        let unscaled_canvas = document.createElement("canvas");
        unscaled_canvas.width = this.width;
        unscaled_canvas.height = this.height;
        unscaled_canvas.getContext("2d").putImageData(this.bitmap, 0, 0);

        this.scaled_context.drawImage(unscaled_canvas, 0, 0);

    }
}