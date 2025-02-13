/* Setup */
// Canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
// Position
let x = 0;
let y = 0;
// Time Tracking
let lastTime = 0;
let delta = 0;
// Colors
let OLDPAPER = "#f6eee3";
let OLDPAPER2 = "#e5d6c7";
let DARKBROWN = "#523211";
let BROWN = "#6e4616";
let JOE = "#444444";

/* Helper Functions */
// function randTransform()

/* Drawing Functions */
function drawBook() {
    ctx.save();

    // Spine
    ctx.fillStyle = DARKBROWN;
    ctx.fillRect(0,0, canvas.width,canvas.height);

    // Cover
    ctx.fillStyle = BROWN;
    ctx.translate(canvas.width/8,canvas.height/24);
    ctx.fillRect(0,0, 6*canvas.width/8,canvas.height/1.1);

    // Pages
    ctx.fillStyle = OLDPAPER;
    ctx.translate(6.5*canvas.width/8,-canvas.height/24);
    ctx.fillRect(0,0, canvas.width/16,canvas.height);
    for (let i = 0; i < 4; i++) {
        ctx.fillStyle = OLDPAPER2;
        ctx.translate(canvas.width/80, 0);
        ctx.fillRect(0, 0, canvas.width/160, canvas.height);
    }

    ctx.restore();
    // Seems strange, but just being careful
    ctx.save();

    // Title
    ctx.fillStyle = OLDPAPER;
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillText("BOOK OF JOE", canvas.width / 2, canvas.height / 4);

    ctx.restore();
}

function drawJoe(x, y) {
    ctx.save();

    // Style
    ctx.strokeStyle = JOE;
    ctx.lineWidth = 2;
    
    // Head
    ctx.beginPath();
    ctx.arc(x,y, 5, 0, 2 * Math.PI);
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x, y + 20);
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x - 10, y + 15);
    ctx.moveTo(x, y + 10);
    ctx.lineTo(x + 10, y + 15);
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x - 10, y + 30);
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x + 10, y + 30);
    ctx.stroke();

    ctx.restore();
}

function drawSpinningStar(x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(lastTime / 1000);
    ctx.fillStyle = OLDPAPER;
    ctx.beginPath();
    
    const radius = 50; // Outer radius of the star
    for (let i = 0; i < 5; i++) {
        // Move to outer point
        ctx.lineTo(0, -radius);
        // Move to inner point
        ctx.rotate(Math.PI * 2 / 10);
        ctx.lineTo(0, -radius/2);
        // Rotate for next point
        ctx.rotate(Math.PI * 2 / 10);
    }
    
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

/* Draw the scene */
function coverPage(timestamp) {
    // Update time
    delta = timestamp - lastTime;
    lastTime = timestamp;

    // Draw
    drawBook();
    x = canvas.width/2;
    y = canvas.height/3;
    drawSpinningStar(x, y);
    drawJoe(x, y);

    // Loop
    window.requestAnimationFrame(coverPage);
}

/* Begin Drawing */
lastTime = performance.now();
window.requestAnimationFrame(coverPage);