

export default class Renderer{

    constructor(world, canvas, context, loop_function){
        this.world = world;
        this.canvas = canvas;
        this.context = context;
        this.loop_function = loop_function;

        // setup sprites
        this.nest_sprite = null;
        this.ant_sprite = null;
        this.initialize_sprites();
    }

    initialize_sprites(){
        this.nest_sprite = new Image();
        this.nest_sprite.src = "./assets/nest.png";
        this.nest_sprite.onload = () => {
            this.checkSpritesLoaded();
        };

        this.ant_sprite = new Image();
        this.ant_sprite.src = "./assets/ant.png";
        this.ant_sprite.onload = () => {
            this.checkSpritesLoaded();
        };
    }


    draw(){
        this.context.clearRect(0, 0, canvas.width, canvas.height);

        this.draw_pheromone_map();
        this.draw_nest();
        this.draw_ants();
    }

    draw_nest(){
        let pos = this.world.get_nest().get_pos();
        let rot = this.world.get_nest().get_rot();
        this.context.save();
        this.context.translate(pos.x, pos.y);
        this.context.rotate(rot);
        // Draw at minus half the dimensions of the sprite to rotate from the center
        this.context.drawImage(this.nest_sprite, this.nest_sprite.width / -2, this.nest_sprite.height / -2);
        this.context.restore();
    }
    
    draw_ants(){
        for (const ant of this.world.get_ants()) {
            let pos = ant.get_pos();
            let rot = ant.get_rot();
            this.context.save();
            this.context.translate(pos.x, pos.y);
            this.context.rotate(rot);
            // Draw at minus half the dimensions of the sprite to rotate from the center
            this.context.drawImage(this.ant_sprite, this.ant_sprite.width / -2, this.ant_sprite.height / -2);
            this.context.restore();
        }
    }

    draw_pheromone_map(){
        let map_canvas = this.world.get_pheromone_map().get_scaled_canvas();
        this.context.drawImage(map_canvas, 0, 0);
    }

    checkSpritesLoaded(){
        // Check if both sprites have been loaded
        if (this.nest_sprite.complete && this.ant_sprite.complete) {
          // Kickstart the main loop
          window.requestAnimationFrame(this.loop_function);
        }
    }
}