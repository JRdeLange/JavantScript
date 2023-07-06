

export default class EnvironmentBitmap{

    constructor(pheromone_map, food_map, scale, width, height){
        this.scale = scale;
        this.world_width = width;
        this.world_height = height;
        this.width = width / scale;
        this.height = height / scale;

        this.pheromone_map = pheromone_map;
        this.food_map = food_map;

        // Pheromone + food bitmap things
        this.bitmap = new ImageData(this.width, this.height);
        this.pixel_data = this.bitmap.data;
        
        this.scaled_canvas = document.createElement("canvas");
        this.scaled_context = this.scaled_canvas.getContext("2d");

        this.initialize_bitmap();
    }

    initialize_bitmap(){
        // Init bitmap to white
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

    get_bitmap(){
        return this.bitmap;
    }

    get_scaled_canvas(){
        return this.scaled_canvas;
    }    

    update(){
        this.update_bitmap();
        this.update_scaled_canvas();
    }

    update_bitmap(){
        let pheromone_data = this.pheromone_map.get_pheromone_data();
        let food_data = this.food_map.get_food_data();
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (food_data[x][y] > 0){
                    this.set_pixel(x, y, [0, 150, 0]);
                } else {
                    this.set_pixel(x, y, [255, 255 - pheromone_data[x][y], 255 - pheromone_data[x][y]]);
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