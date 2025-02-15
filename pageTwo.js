/* Setup */
// Canvas
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
// Position
let x = 0;
let y = 0;
// Joe
let joeX = 0;
let joeY = 0;
let joeVelX = 0;
let joeVelY = 0;
const GRAVITY = 0.5;
const MOVE_SPEED = 3;
const JUMP_FORCE = -4;
let canJump = false;
// Time Tracking
let lastTime = 0;
let delta = 0;
// Colors
let OLDPAPER = "#f6eee3";
let OLDPAPER2 = "#e5d6c7";
let DARKBROWN = "#523211";
let BROWN = "#6e4616";
let JOE = "#444444";


/* Joe */
function updateJoe() {
    // Handle horizontal movement
    if (keys.left) {
        joeVelX = -MOVE_SPEED;
    } else if (keys.right) {
        joeVelX = MOVE_SPEED;
    } else {
        joeVelX = 0;
    }
    
    // Apply gravity
    joeVelY += GRAVITY * (delta/100);
    
    // Update position
    joeX += joeVelX;
    joeY += joeVelY;
    
    // Check platform collisions
    checkPlatformCollisions();
    
    // Ground collision
    if (joeY + 30 >= canvas.height) {
        joeY = canvas.height - 30;
        joeVelY = 0;
        canJump = true;
    }
    
    // Wall collisions
    if (joeX - 10 < 0) {
        joeX = 10;
    }
    if (joeX + 10 > canvas.width) {
        joeX = canvas.width - 10;
    }
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

/* Joe Movement */
// Keyboard state
const keys = {
    left: false,
    right: false,
    up: false
};

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'a':
            keys.left = true;
            break;
        case 'd':
            keys.right = true;
            break;
        case ' ':
            keys.up = true;
            if (canJump) {
                joeVelY = JUMP_FORCE;
                canJump = false;
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'a':
            keys.left = false;
            break;
        case 'd':
            keys.right = false;
            break;
        case ' ':
            keys.up = false;
            break;
    }
});

/* Platforms */
// NOTE: For now, hard-coding the platforms. 
let platforms = [
    {x: 0, y: canvas.height - 400, width: canvas.width, height: 20},
    {x: canvas.width/2-25, y: canvas.height - 550, width: 50, height: 20}
];

function checkPlatformCollisions() {
    canJump = false;
    
    for (let platform of platforms) {
        // Get the edges of Joe's bounding box
        const joeLeft = joeX - 10;
        const joeRight = joeX + 10;
        const joeTop = joeY;
        const joeBottom = joeY + 30;
        
        // Get the edges of the platform
        const platformLeft = platform.x;
        const platformRight = platform.x + platform.width;
        const platformTop = platform.y;
        const platformBottom = platform.y + platform.height;
        
        // Check for collision
        if (joeRight > platformLeft && 
            joeLeft < platformRight && 
            joeBottom > platformTop && 
            joeTop < platformBottom) {
            
            // Coming from above
            if (joeBottom - joeVelY <= platformTop) {
                joeY = platformTop - 30;
                joeVelY = 0;
                canJump = true;
            }
            // Coming from below
            else if (joeTop - joeVelY >= platformBottom) {
                joeY = platformBottom;
                joeVelY = 0;
            }
            // Coming from left
            else if (joeRight - joeVelX <= platformLeft) {
                joeX = platformLeft - 10;
                joeVelX = 0;
            }
            // Coming from right
            else if (joeLeft - joeVelX >= platformRight) {
                joeX = platformRight + 10;
                joeVelX = 0;
            }
        }
    }
}

function drawPlatforms() {
    ctx.save();

    for (let plt of platforms) {
        ctx.save();

        ctx.transform(1,0,0,1,plt.x,plt.y)
        ctx.fillStyle = DARKBROWN;
        ctx.fillRect(0,0, plt.width, plt.height);

        ctx.restore();
    }

    ctx.restore();
}

/* Current Page */
function drawComment() {
    ctx.save();
    ctx.fillStyle = BROWN;
    ctx.font = "24px serif";
    ctx.textAlign = "center";
    ctx.fillText("THE PAGE TURNS; JOE STAYS", canvas.width / 2, canvas.height / 2);
    ctx.restore();
}

function pageTwo(timestamp, running) {
    // Update time
    delta = timestamp - lastTime;
    lastTime = timestamp;

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (running) {
        ctx.fillStyle = OLDPAPER;
    }
    else {
        ctx.fillStyle = OLDPAPER2;
    }
    ctx.fillRect(0,0, canvas.width, canvas.height);
    drawComment()

    // Platforms
    drawPlatforms();

    // Joe
    updateJoe();
    drawJoe(joeX, joeY);

    // Loop
    if (running) {
        window.requestAnimationFrame(() => pageTwo(performance.now(), true));
    }
}

/* Previous Page */
function drawTutorial() {
    ctx.save();
    ctx.fillStyle = BROWN;
    ctx.font = "24px serif";
    ctx.textAlign = "center";
    ctx.fillText("SPACE: JUMP", canvas.width / 2, canvas.height / 4);
    ctx.translate(0, 20); // NOTE: Hard-coded
    ctx.fillText("A: MOVE LEFT", canvas.width / 2, canvas.height / 4);
    ctx.translate(0, 20);
    ctx.fillText("D: MOVE RIGHT", canvas.width / 2, canvas.height / 4);
    ctx.restore();
}

let oldPlatforms = [
    {x: 10, y: 500, width: 120, height: 20},
    {x: canvas.width - 130, y: 500, width: 120, height: 20},
    {x: 100, y: 340, width: 50, height: 20},
    {x: canvas.width - 150, y: 340, width: 50, height: 20}
];
let swatPlats = 0;

function titlePage(timestamp, running) {
    // Update time
    delta = timestamp - lastTime;
    lastTime = timestamp;

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = OLDPAPER;
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // Platforms
    swatPlats = platforms;
    platforms = oldPlatforms;
    drawPlatforms();
    platforms = swatPlats;
    
    // Text
    drawTutorial();
    
    // Joe
    updateJoe();
    drawJoe(joeX, joeY);

    // Loop
    if (running) {
        window.requestAnimationFrame(() => pageTwo(performance.now(), true));
    }
}

let turned = false; // Track if page has turned
function animatePageTurn(i, prevPage) {
    ctx.save();
    if (i <= 50) {
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Manually draw page under turning page
        pageTwo(performance.now(), false);
        // Turn page
        ctx.transform(1-i/50, 0, 0, 1, 0, 0);
        prevPage(performance.now());
        ctx.restore();
        window.requestAnimationFrame(() => animatePageTurn(i + 1, prevPage));
    }
    else {
        window.requestAnimationFrame(() => pageTwo(performance.now(), true));
    }
}

/* Setup Buttons */
document.getElementById('nextButton').addEventListener('click', function() {
    // Store the coordinates
    sessionStorage.setItem("joeX", joeX);
    sessionStorage.setItem("joeY", joeY);

    window.location.href = 'pageThree.html';
});

document.getElementById('prevButton').addEventListener('click', function() {
    // Store the coordinates
    sessionStorage.setItem("joeX", joeX);
    sessionStorage.setItem("joeY", joeY);

    window.location.href = 'pageOne.html';
});

/* Recover Joe */
joeX = Number(sessionStorage.getItem('joeX'));
joeY = Number(sessionStorage.getItem('joeY'));

/* Begin Drawing */
lastTime = performance.now();
animatePageTurn(0, titlePage);