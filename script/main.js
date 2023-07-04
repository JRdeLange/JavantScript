import World from "./world.js"
import Renderer from "./renderer.js"

let width = 800;
let height = 600;

const canvas = get_and_setup_canvas(width, height);
const context = canvas.getContext("2d");

let world = new World(width, height);
let renderer = new Renderer(world, context, loop);

function get_and_setup_canvas(){
    const canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function test(){
    console.log(test);
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
