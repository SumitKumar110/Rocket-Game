// Game setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Rocket image
const rocketImage = new Image();
rocketImage.src = 'ship.png'; // 

// Rocket and asteroid parameters
const asteroidSize = 40;
const bulletRadius = 5;

// Rocket properties
let rocket = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0
};

// Bullet array
let bullets = [];

// Asteroids array
let asteroids = [];

// Score
let score = 0;

// Game over flag
let gameOver = false;

// Event listeners for movement and shooting
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') rocket.dy = -rocket.speed;
    if (e.key === 'ArrowDown') rocket.dy = rocket.speed;
    if (e.key === 'ArrowLeft') rocket.dx = -rocket.speed;
    if (e.key === 'ArrowRight') rocket.dx = rocket.speed;
    if (e.key === ' ') shootBullet(); // Spacebar to shoot
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') rocket.dy = 0;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') rocket.dx = 0;
});

// Draw rocket
function drawRocket() {
    ctx.drawImage(rocketImage, rocket.x, rocket.y, rocket.width, rocket.height);
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bulletRadius, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw asteroids
function drawAsteroids() {
    ctx.fillStyle = 'gray';
    asteroids.forEach(asteroid => {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroidSize, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Move rocket
function moveRocket() {
    rocket.x += rocket.dx;
    rocket.y += rocket.dy;

    // Prevent rocket from going out of bounds
    if (rocket.x < 0) rocket.x = 0;
    if (rocket.x + rocket.width > canvas.width) rocket.x = canvas.width - rocket.width;
    if (rocket.y < 0) rocket.y = 0;
    if (rocket.y + rocket.height > canvas.height) rocket.y = canvas.height - rocket.height;
}

// Move bullets
function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1); // Remove bullet if it goes off screen

        // Check for collision with asteroids
        asteroids.forEach((asteroid, asteroidIndex) => {
            if (isCollision(bullet, asteroid)) {
                // Remove asteroid and bullet when they collide
                asteroids.splice(asteroidIndex, 1);
                bullets.splice(index, 1);
                score++; // Increment score when an asteroid is hit
            }
        });
    });
}

// Move asteroids
function moveAsteroids() {
    asteroids.forEach((asteroid, index) => {
        asteroid.y += asteroid.speed;
        if (asteroid.y > canvas.height) {
            asteroids.splice(index, 1); // Remove asteroid if it goes off screen
        }

        // Check for collision with rocket
        if (isCollision(rocket, asteroid)) {
            gameOver = true;
        }
    });
}

// Check for collision
function isCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < asteroidSize + bulletRadius;
}

// Shooting bullets
function shootBullet() {
    if (gameOver) return;

    bullets.push({
        x: rocket.x + rocket.width / 2,
        y: rocket.y,
        speed: 5
    });
}

// Spawn asteroids
function spawnAsteroids() {
    if (gameOver) return;

    // Spawn a single asteroid after a small delay
    if (Math.random() < 0.01) { // Reduced the spawn rate of asteroids
        const randomX = Math.random() * (canvas.width - asteroidSize);
        const randomSpeed = Math.random() * 2 + 1;

        asteroids.push({
            x: randomX,
            y: -asteroidSize,
            speed: randomSpeed
        });
    }
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 30);
}

// Display Game Over
function showGameOver() {
    const gameOverText = document.getElementById('gameOverText');
    gameOverText.style.display = 'block';
}

// Main game loop
function gameLoop() {
    if (gameOver) {
        showGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawRocket();
    drawBullets();
    drawAsteroids();
    drawScore();
    moveRocket();
    moveBullets();
    moveAsteroids();
    spawnAsteroids();

    requestAnimationFrame(gameLoop); // Call the game loop again
}

// Start the game loop
gameLoop();
