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

function update_ui(){
    document.getElementById("food_counter").innerHTML = "Gathered food: " + world.nest.get_food_collected();
}

function loop(){
    // Advance model
    world.tick();

    // Draw
    update_ui();

    renderer.draw();
    window.requestAnimationFrame(loop);
}

// Click registration
let isMouseDown = false;

function startClickRegistration(event) {
  isMouseDown = true;
  registerClick(event);
}

function stopClickRegistration() {
  isMouseDown = false;
}

function registerClick(event) {
  if (isMouseDown) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    world.pheromone_map.place_food_at(x, y);
  }
}

canvas.addEventListener("mousedown", startClickRegistration);
canvas.addEventListener("mouseup", stopClickRegistration);
canvas.addEventListener("mousemove", registerClick);

// Start the animation loop
window.requestAnimationFrame(loop);
