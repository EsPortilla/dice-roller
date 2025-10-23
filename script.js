// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const themeIcon = document.querySelector('.theme-icon');

// Check for saved theme preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') {
    root.classList.add('light-theme');
    themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    root.classList.toggle('light-theme');
    const isLight = root.classList.contains('light-theme');
    themeIcon.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Dice rolling functionality
const dice = document.getElementById('dice');
const resultDisplay = document.getElementById('result');
let isRolling = false;

// Define rotations for each face to show on top
const diceRotations = {
    1: { x: 0, y: 0, z: 0 },           // front face
    2: { x: 0, y: 180, z: 0 },         // back face
    3: { x: 0, y: -90, z: 0 },         // right face
    4: { x: 0, y: 90, z: 0 },          // left face
    5: { x: -90, y: 0, z: 0 },         // top face
    6: { x: 90, y: 0, z: 0 }           // bottom face
};

function rollDice() {
    if (isRolling) return;

    isRolling = true;
    dice.classList.add('rolling');
    resultDisplay.classList.remove('show');
    resultDisplay.querySelector('p').textContent = 'Rolling...';

    // Generate random number between 1 and 6
    const randomNumber = Math.floor(Math.random() * 6) + 1;

    // Get the rotation for this number
    const rotation = diceRotations[randomNumber];

    // Add some randomness to make each roll unique
    const extraRotations = Math.floor(Math.random() * 3) + 2; // 2-4 extra full rotations
    const finalX = rotation.x + (360 * extraRotations);
    const finalY = rotation.y + (360 * extraRotations);
    const finalZ = rotation.z;

    // Set CSS variables for the final position
    dice.style.setProperty('--final-x', `${finalX}deg`);
    dice.style.setProperty('--final-y', `${finalY}deg`);
    dice.style.setProperty('--final-z', `${finalZ}deg`);

    // Wait for animation to complete
    setTimeout(() => {
        dice.classList.remove('rolling');
        dice.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg) rotateZ(${finalZ}deg)`;

        // Show result
        resultDisplay.querySelector('p').textContent = `You rolled a ${randomNumber}!`;
        resultDisplay.classList.add('show');

        isRolling = false;
    }, 1000); // Match animation duration
}

// Add click event to dice
dice.addEventListener('click', rollDice);

// Add touch support for mobile
dice.addEventListener('touchstart', (e) => {
    e.preventDefault();
    rollDice();
});

// Optional: Add keyboard support (press Space to roll)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        rollDice();
    }
});

// Add visual feedback on interaction
dice.addEventListener('mousedown', () => {
    if (!isRolling) {
        dice.style.transform = dice.style.transform + ' scale(0.95)';
    }
});

dice.addEventListener('mouseup', () => {
    if (!isRolling) {
        dice.style.transform = dice.style.transform.replace(' scale(0.95)', '');
    }
});

// Initialize with a subtle animation
window.addEventListener('load', () => {
    dice.style.transform = 'rotateX(-20deg) rotateY(-20deg)';
});
