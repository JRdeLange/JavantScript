import World from "./world.js"
import Renderer from "./renderer.js"

let width = 800;
let height = 600;

const canvas = get_and_setup_canvas(width, height);
const context = canvas.getContext("2d");

const pheromone_scale = 5;
let world = new World(width, height, pheromone_scale);
let renderer = new Renderer(world, canvas, context, loop);

function get_and_setup_canvas(){
    const canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function loop(){
    // Advance model
    world.tick();

    // Draw
    renderer.draw();
    window.requestAnimationFrame(loop);
}


// when all sprites have been loaded
// window.requestAnimationFrame(loop);
