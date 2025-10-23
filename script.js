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
const diceCountToggle = document.getElementById('diceCountToggle');
const diceContainer = document.getElementById('diceContainer');
const resultsContainer = document.querySelector('.results-container');

// Get dice elements early so they're available in updateDiceMode
const dice1 = document.getElementById('dice1');
const dice2 = document.getElementById('dice2');
const resultDisplay = document.getElementById('result');

// Check for saved dice count preference or default to 2
const savedDiceCount = localStorage.getItem('diceCount') || '2';
let currentDiceCount = parseInt(savedDiceCount);

function updateDiceMode(count) {
    currentDiceCount = count;

    if (count === 1) {
        diceContainer.classList.remove('two-dice-mode');
        diceContainer.classList.add('one-dice-mode');
        if (resultsContainer) {
            resultsContainer.classList.remove('two-dice-mode');
            resultsContainer.classList.add('one-dice-mode');
        }
        diceCountToggle.checked = false;
    } else {
        diceContainer.classList.remove('one-dice-mode');
        diceContainer.classList.add('two-dice-mode');
        if (resultsContainer) {
            resultsContainer.classList.remove('one-dice-mode');
            resultsContainer.classList.add('two-dice-mode');
        }
        diceCountToggle.checked = true;
    }

    // Reset both dice to isometric position when toggling
    if (dice1) {
        dice1.style.transform = 'rotateX(-20deg) rotateY(-20deg)';
    }
    if (dice2) {
        dice2.style.transform = 'rotateX(-20deg) rotateY(-20deg)';
    }

    localStorage.setItem('diceCount', count);
}

// Initialize with saved preference
updateDiceMode(currentDiceCount);

// Listen to toggle changes
diceCountToggle.addEventListener('change', () => {
    updateDiceMode(diceCountToggle.checked ? 2 : 1);
});

// Check if dice elements exist
if (!dice1 || !dice2 || !resultDisplay) {
    console.error('Required elements not found:', { dice1, dice2, resultDisplay });
}

// Track rolling state
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

// Single die messages
const singleDieMessages = {
    1: "Ace in the hole!",
    2: "Deuce!",
    3: "Hat trick!",
    4: "Fantastic four!",
    5: "High five!",
    6: "Maxed out!"
};

// Craps lingo messages for combined rolls
const crapsMessages = {
    2: "Snake eyes!",
    3: "Ace deuce!",
    4: "Little Joe!",
    5: "Fever five!",
    6: "Jimmy Hicks!",
    7: "Natural seven!",
    8: "Eighter from Decatur!",
    9: "Nina!",
    10: "Big Dick!",
    11: "Yo-leven!",
    12: "Boxcars!"
};

function rollSingleDie(dice) {
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

    dice.classList.add('rolling');

    return new Promise((resolve) => {
        setTimeout(() => {
            dice.classList.remove('rolling');
            dice.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg) rotateZ(${finalZ}deg)`;
            resolve(randomNumber);
        }, 1000);
    });
}

function rollDice() {
    if (isRolling) return;

    isRolling = true;
    resultDisplay.classList.remove('show');
    resultDisplay.querySelector('p').textContent = 'Rolling...';

    if (currentDiceCount === 1) {
        // Roll only one die
        rollSingleDie(dice1).then((result) => {
            resultDisplay.querySelector('p').textContent = singleDieMessages[result];
            resultDisplay.classList.add('show');
            isRolling = false;
        }).catch((error) => {
            console.error('Error rolling die:', error);
            isRolling = false;
        });
    } else {
        // Roll both dice simultaneously
        Promise.all([
            rollSingleDie(dice1),
            rollSingleDie(dice2)
        ]).then(([result1, result2]) => {
            const sum = result1 + result2;
            const message = crapsMessages[sum] || `${sum}!`;
            resultDisplay.querySelector('p').textContent = message;
            resultDisplay.classList.add('show');
            isRolling = false;
        }).catch((error) => {
            console.error('Error rolling dice:', error);
            isRolling = false;
        });
    }
}

// Add click events to both dice - clicking either one rolls both
if (dice1 && dice2) {
    dice1.addEventListener('click', rollDice);
    dice2.addEventListener('click', rollDice);

    // Add touch support for mobile
    dice1.addEventListener('touchstart', (e) => {
        e.preventDefault();
        rollDice();
    });

    dice2.addEventListener('touchstart', (e) => {
        e.preventDefault();
        rollDice();
    });

    // Add visual feedback on interaction
    function addDiceInteraction(dice) {
        dice.addEventListener('mousedown', () => {
            if (!isRolling) {
                const currentTransform = dice.style.transform || '';
                if (!currentTransform.includes('scale(0.95)')) {
                    dice.style.transform = currentTransform + ' scale(0.95)';
                }
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
}

// Optional: Add keyboard support (press Space to roll)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        rollDice();
    }
});
