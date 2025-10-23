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

// Dice count toggle functionality
const oneDiceBtn = document.getElementById('oneDiceBtn');
const twoDiceBtn = document.getElementById('twoDiceBtn');
const diceContainer = document.getElementById('diceContainer');
const resultsContainer = document.querySelector('.results-container');

// Check for saved dice count preference or default to 2
const savedDiceCount = localStorage.getItem('diceCount') || '2';
let currentDiceCount = parseInt(savedDiceCount);

function updateDiceMode(count) {
    currentDiceCount = count;

    if (count === 1) {
        diceContainer.classList.remove('two-dice-mode');
        diceContainer.classList.add('one-dice-mode');
        resultsContainer.classList.remove('two-dice-mode');
        resultsContainer.classList.add('one-dice-mode');
        oneDiceBtn.classList.add('active');
        twoDiceBtn.classList.remove('active');
    } else {
        diceContainer.classList.remove('one-dice-mode');
        diceContainer.classList.add('two-dice-mode');
        resultsContainer.classList.remove('one-dice-mode');
        resultsContainer.classList.add('two-dice-mode');
        oneDiceBtn.classList.remove('active');
        twoDiceBtn.classList.add('active');
    }

    localStorage.setItem('diceCount', count);
}

// Initialize with saved preference
updateDiceMode(currentDiceCount);

oneDiceBtn.addEventListener('click', () => updateDiceMode(1));
twoDiceBtn.addEventListener('click', () => updateDiceMode(2));

// Dice rolling functionality
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const result1 = document.getElementById('result1');
const result2 = document.getElementById('result2');

// Track rolling state for each die
const rollingState = {
    1: false,
    2: false
};

// Define rotations for each face to show on top
const diceRotations = {
    1: { x: 0, y: 0, z: 0 },           // front face
    2: { x: 0, y: 180, z: 0 },         // back face
    3: { x: 0, y: -90, z: 0 },         // right face
    4: { x: 0, y: 90, z: 0 },          // left face
    5: { x: -90, y: 0, z: 0 },         // top face
    6: { x: 90, y: 0, z: 0 }           // bottom face
};

// Quippy messages for each roll
const rollMessages = {
    1: "Ace in the hole!",
    2: "Snake eyes!",
    3: "Hat trick!",
    4: "Fantastic four!",
    5: "High five!",
    6: "Maxed out!"
};

function rollDice(diceId) {
    if (rollingState[diceId]) return;

    const dice = document.getElementById(`dice${diceId}`);
    const resultDisplay = document.getElementById(`result${diceId}`);

    rollingState[diceId] = true;
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
        resultDisplay.querySelector('p').textContent = rollMessages[randomNumber];
        resultDisplay.classList.add('show');

        rollingState[diceId] = false;
    }, 1000); // Match animation duration
}

// Add click events to both dice
dice1.addEventListener('click', () => rollDice(1));
dice2.addEventListener('click', () => rollDice(2));

// Add touch support for mobile
dice1.addEventListener('touchstart', (e) => {
    e.preventDefault();
    rollDice(1);
});

dice2.addEventListener('touchstart', (e) => {
    e.preventDefault();
    rollDice(2);
});

// Optional: Add keyboard support (press Space to roll all visible dice)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        rollDice(1);
        if (currentDiceCount === 2) {
            setTimeout(() => rollDice(2), 100); // Slight delay for visual effect
        }
    }
});

// Add visual feedback on interaction
function addDiceInteraction(dice) {
    dice.addEventListener('mousedown', () => {
        const diceId = dice.dataset.diceId;
        if (!rollingState[diceId]) {
            dice.style.transform = dice.style.transform + ' scale(0.95)';
        }
    });

    dice.addEventListener('mouseup', () => {
        dice.style.transform = dice.style.transform.replace(' scale(0.95)', '');
    });
}

addDiceInteraction(dice1);
addDiceInteraction(dice2);

// Initialize with a subtle animation
window.addEventListener('load', () => {
    dice1.style.transform = 'rotateX(-20deg) rotateY(-20deg)';
    dice2.style.transform = 'rotateX(-20deg) rotateY(-20deg)';
});
