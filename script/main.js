import World from "./world.js"


let width = 600;
let height = 600;
let nr_of_ants = 30;
const canvas = get_and_setup_canvas(width, height);
const context = canvas.getContext("2d");
const sprite = new Image();
sprite.src = "./assets/ant.png";

let world = new World(nr_of_ants, width, height);



function get_and_setup_canvas(){
    const canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas
}


function draw_ants(){
    
    for (const ant of world.get_ants()) {
        let pos = ant.get_pos();
        let rot = ant.get_rot();
        context.save();
        context.translate(pos.x, pos.y);
        context.rotate(rot);
        // Draw at minus half the dimensions of the sprite to rotate from the center
        context.drawImage(sprite, -8, -8);
        context.restore();
    }
    // Draw each ant at its position
}


function loop(){
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Advance model
    world.tick();

    // Draw
    draw_ants();
    window.requestAnimationFrame(loop);
}


sprite.onload = function() { window.requestAnimationFrame(loop); };
