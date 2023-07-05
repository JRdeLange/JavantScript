

export default class PheromoneMap{

    constructor(scale, width, height){
        this.map = [];
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

        this.spread_speed = 500;
        this.fade_speed = 2;
    }

    initialize(){
        for (let x = 0; x < this.width; x++) {
            let column = [];
            for (let y = 0; y < this.height; y++) {
                column.push(0);
            }
            this.map.push(column);
        }

        // Init map to white
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                this.set_pixel(x, y, [255, 255, 255]);
            }   
        }

        // Set scaled_canvas dimensions
        this.scaled_canvas.width = this.world_width;
        this.scaled_canvas.height = this.world_height;
        this.scaled_context.scale(this.scale, this.scale);
    }

    drop_at_world_coords(x, y, quantity){
        x /= this.scale;
        y /= this.scale;
        if (this.is_valid_coords(x, y)){
            this.map[Math.floor(x)][Math.floor(y)] += quantity;
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
                new_value = Math.max(0, new_value - this.fade_speed);                
                
                // Write new pheromone value
                column.push(new_value);
                // Make it appear red
                this.set_pixel(x, y, [255, 255 - new_value, 255 - new_value]);
            }   
            new_map.push(column);
        }
        this.map = new_map;

        this.update_scaled_bitmap();
    }

    avg_surrounding_pixels(x, y){
        let n_pixels = 0;
        let sum = 0;

        if (x != 0) {
            sum += this.map[x - 1][y];
            n_pixels++;
        }

        if (x != this.width - 1) {
            sum += this.map[x + 1][y];
            n_pixels++;
        }

        if (y != 0) {
            sum += this.map[x][y - 1];
            n_pixels++;
        }

        if (y != this.height - 1) {
            sum += this.map[x][y + 1];
            n_pixels++;
        }

        sum /= n_pixels;

        return (this.spread_speed * this.map[x][y] + sum) / (this.spread_speed + 1);
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
        return !(x < 0 || x > this.width || y < 0 || y > this.height);
    }

    get_bitmap(){
        return this.bitmap;
    }

    get_scaled_canvas(){
        return this.scaled_canvas;
    }

    update_scaled_bitmap(){
        let unscaled_canvas = document.createElement("canvas");
        unscaled_canvas.width = this.width;
        unscaled_canvas.height = this.height;
        unscaled_canvas.getContext("2d").putImageData(this.bitmap, 0, 0);

        this.scaled_context.drawImage(unscaled_canvas, 0, 0);

    }
}