import World from "./world.js"
import Renderer from "./renderer.js"

let width = 1000;
let height = 900;

const canvas = get_and_setup_canvas(width, height);
const context = canvas.getContext("2d");

const low_res_scale = 5;
let world = new World(width, height, low_res_scale);
let renderer = new Renderer(world, canvas, context, loop, low_res_scale);

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
    event.preventDefault();
  
    let clientX, clientY;
    
    if (event.touches && event.touches.length > 0) {
      // Touch event
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
      
      // Prevent scrolling on touch devices
      event.preventDefault();
    } else {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    
    if (isMouseDown){
        world.get_food_map().place_food_at(x, y);
    }
  }
  

canvas.addEventListener("mousedown", startClickRegistration);
canvas.addEventListener("mouseup", stopClickRegistration);
canvas.addEventListener("mousemove", registerClick);
canvas.addEventListener("touchstart", startClickRegistration);
canvas.addEventListener("touchend", stopClickRegistration);
canvas.addEventListener("touchmove", registerClick);

// Start the animation loop
window.requestAnimationFrame(loop);
