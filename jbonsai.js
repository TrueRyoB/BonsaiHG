// Constants and enums
const branchType = {
    TRUNK: 0,
    SHOOT_LEFT: 1,
    SHOOT_RIGHT: 2,
    DYING: 3,
    DEAD: 4
};

// Colors (ANSI color codes mapped to CSS)
const colors = {
    BROWN: '#A52A2A',
    GREEN: '#00AA00',
    DARK_GREEN: '#006400',
    YELLOW: '#CCCC00',
    GRAY: '#888888'
};

// Config and state variables
let config = {
    live: false,
    lifeStart: 32,
    multiplier: 5,
    baseType: 1,
    seed: 0,
    leaves: ['&'],
    timeStep: 30, // milliseconds
    message: null
};

let state = {
    grid: [],
    gridWidth: 0,
    gridHeight: 0,
    branches: 0,
    shoots: 0,
    shootCounter: 0,
    pendingOperations: []
};

// Utility functions
function seedRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

let randomSeed = config.seed || Date.now();
function random() {
    randomSeed = (randomSeed * 9301 + 49297) % 233280;
    return randomSeed / 233280;
}

function roll(mod) {
    return Math.floor(random() * mod);
}

// Initialize grid
function initGrid(width, height) {
    state.gridWidth = width;
    state.gridHeight = height;
    state.grid = [];

    for (let y = 0; y < height; y++) {
        state.grid[y] = [];
        for (let x = 0; x < width; x++) {
            state.grid[y][x] = { char: ' ', color: null };
        }
    }
}

// Draw grid
function drawGrid() {
    const treeDiv = document.getElementById('tree');
    treeDiv.innerHTML = '';
    treeDiv.style.gridTemplateColumns = `repeat(${state.gridWidth}, 1ch)`;

    for (let y = 0; y < state.gridHeight; y++) {
        for (let x = 0; x < state.gridWidth; x++) {
            const cell = state.grid[y][x];
            const span = document.createElement('span');
            span.textContent = cell.char;
            if (cell.color) {
                span.style.color = cell.color;
            }
            treeDiv.appendChild(span);
        }
    }
}

// Draw base
function drawBase() {
    switch (config.baseType) {
        case 1: // Wide pot
        const baseY = state.gridHeight - 4;
        const baseWidth = 31;
        const baseX = Math.floor((state.gridWidth - baseWidth) / 2);
    
        // Draw top of pot
        let x = baseX;
        state.grid[baseY][x++] = { char: ':', color: colors.GRAY };
        for (let i = 0; i < 11; i++)
        state.grid[baseY][x++] = { char: '_', color: colors.GREEN };
        state.grid[baseY][x++] = { char: '.', color: colors.YELLOW };
        state.grid[baseY][x++] = { char: '/', color: colors.YELLOW };
        state.grid[baseY][x++] = { char: '~', color: colors.YELLOW };
        state.grid[baseY][x++] = { char: '~', color: colors.YELLOW };
        state.grid[baseY][x++] = { char: '~', color: colors.YELLOW };
        state.grid[baseY][x++] = { char: '\\', color: colors.YELLOW };
        state.grid[baseY][x++] = { char: '.', color: colors.YELLOW };
        for (let i = 0; i < 11; i++)
        state.grid[baseY][x++] = { char: '_', color: colors.GREEN };
        state.grid[baseY][x++] = { char: ':', color: colors.GRAY };
    
        // Draw middle of pot
        x = baseX;
        state.grid[baseY+1][x++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY+1][x++] = { char: '\\', color: colors.GRAY };
        for (let i = 0; i < 25; i++)
        state.grid[baseY+1][x++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY+1][x++] = { char: '/', color: colors.GRAY };
        state.grid[baseY+1][x++] = { char: ' ', color: colors.GRAY };
    
        // Draw bottom of pot
        x = baseX;
        state.grid[baseY+2][x++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY+2][x++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY+2][x++] = { char: '\\', color: colors.GRAY };
        for (let i = 0; i < 23; i++)
        state.grid[baseY+2][x++] = { char: '_', color: colors.GRAY };
        state.grid[baseY+2][x++] = { char: '/', color: colors.GRAY };
        state.grid[baseY+2][x++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY+2][x++] = { char: ' ', color: colors.GRAY };
    
        // Draw feet of pot
        x = baseX;
        state.grid[baseY+3][x++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY+3][x++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY+3][x++] = { char: '(', color: colors.GRAY };
        state.grid[baseY+3][x++] = { char: '_', color: colors.GRAY };
        state.grid[baseY+3][x++] = { char: ')', color: colors.GRAY };
        for (let i = 0; i < 19; i++)
        state.grid[baseY+3][x++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY+3][x++] = { char: '(', color: colors.GRAY };
        state.grid[baseY+3][x++] = { char: '_', color: colors.GRAY };
        state.grid[baseY+3][x++] = { char: ')', color: colors.GRAY };
        state.grid[baseY+3][x++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY+3][x++] = { char: ' ', color: colors.GRAY };
        break;
    
        case 2: // Narrow pot
        const baseY2 = state.gridHeight - 3;
        const baseWidth2 = 15;
        const baseX2 = Math.floor((state.gridWidth - baseWidth2) / 2);
    
        // Draw top of pot
        let x2 = baseX2;
        state.grid[baseY2][x2++] = { char: '(', color: colors.GRAY };
        for (let i = 0; i < 3; i++)
        state.grid[baseY2][x2++] = { char: '-', color: colors.GREEN };
        state.grid[baseY2][x2++] = { char: '.', color: colors.YELLOW };
        state.grid[baseY2][x2++] = { char: '/', color: colors.YELLOW };
        state.grid[baseY2][x2++] = { char: '~', color: colors.YELLOW };
        state.grid[baseY2][x2++] = { char: '~', color: colors.YELLOW };
        state.grid[baseY2][x2++] = { char: '~', color: colors.YELLOW };
        state.grid[baseY2][x2++] = { char: '\\', color: colors.YELLOW };
        state.grid[baseY2][x2++] = { char: '.', color: colors.YELLOW };
        for (let i = 0; i < 3; i++)
        state.grid[baseY2][x2++] = { char: '-', color: colors.GREEN };
        state.grid[baseY2][x2++] = { char: ')', color: colors.GRAY };
    
        // Draw middle of pot
        x2 = baseX2;
        state.grid[baseY2+1][x2++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY2+1][x2++] = { char: '(', color: colors.GRAY };
        for (let i = 0; i < 11; i++)
        state.grid[baseY2+1][x2++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY2+1][x2++] = { char: ')', color: colors.GRAY };
        state.grid[baseY2+1][x2++] = { char: ' ', color: colors.GRAY };
    
        // Draw bottom of pot
        x2 = baseX2;
        state.grid[baseY2+2][x2++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY2+2][x2++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY2+2][x2++] = { char: '(', color: colors.GRAY };
        state.grid[baseY2+2][x2++] = { char: '_', color: colors.GRAY };
        for (let i = 0; i < 7; i++)
        state.grid[baseY2+2][x2++] = { char: '_', color: colors.GRAY };
        state.grid[baseY2+2][x2++] = { char: ')', color: colors.GRAY };
        state.grid[baseY2+2][x2++] = { char: ' ', color: colors.GRAY };
        state.grid[baseY2+2][x2++] = { char: ' ', color: colors.GRAY };
        break;
    }
}

// Set deltas for branches
function setDeltas(type, life, age, multiplier) {
    let dx = 0;
    let dy = 0;
    let dice;

    switch (type) {
    case branchType.TRUNK: // trunk
    // new or dead trunk
    if (age <= 2 || life < 4) {
    dy = 0;
    dx = roll(3) - 1;
}
// young trunk should grow wide
else if (age < (multiplier * 3)) {
// every (multiplier * 0.8) steps, raise tree to next level
if (age % Math.floor(multiplier * 0.5) === 0) dy = -1;
else dy = 0;

dice = roll(10);
if (dice >= 0 && dice <= 0) dx = -2;
else if (dice >= 1 && dice <= 3) dx = -1;
else if (dice >= 4 && dice <= 5) dx = 0;
else if (dice >= 6 && dice <= 8) dx = 1;
else if (dice >= 9 && dice <= 9) dx = 2;
}
// middle-aged trunk
else {
dice = roll(10);
if (dice > 2) dy = -1;
else dy = 0;
dx = roll(3) - 1;
}
break;

case branchType.SHOOT_LEFT: // left shoot: trend left and little vertical movement
dice = roll(10);
if (dice >= 0 && dice <= 1) dy = -1;
else if (dice >= 2 && dice <= 7) dy = 0;
else if (dice >= 8 && dice <= 9) dy = 1;

dice = roll(10);
if (dice >= 0 && dice <= 1) dx = -2;
else if (dice >= 2 && dice <= 5) dx = -1;
else if (dice >= 6 && dice <= 8) dx = 0;
else if (dice >= 9 && dice <= 9) dx = 1;
break;

case branchType.SHOOT_RIGHT: // right shoot: trend right and little vertical movement
dice = roll(10);
if (dice >= 0 && dice <= 1) dy = -1;
else if (dice >= 2 && dice <= 7) dy = 0;
else if (dice >= 8 && dice <= 9) dy = 1;

dice = roll(10);
if (dice >= 0 && dice <= 1) dx = 2;
else if (dice >= 2 && dice <= 5) dx = 1;
else if (dice >= 6 && dice <= 8) dx = 0;
else if (dice >= 9 && dice <= 9) dx = -1;
break;

case branchType.DYING: // dying: discourage vertical growth(?); trend left/right (-3,3)
dice = roll(10);
if (dice >= 0 && dice <= 1) dy = -1;
else if (dice >= 2 && dice <= 8) dy = 0;
else if (dice >= 9 && dice <= 9) dy = 1;

dice = roll(15);
if (dice >= 0 && dice <= 0) dx = -3;
else if (dice >= 1 && dice <= 2) dx = -2;
else if (dice >= 3 && dice <= 5) dx = -1;
else if (dice >= 6 && dice <= 8) dx = 0;
else if (dice >= 9 && dice <= 11) dx = 1;
else if (dice >= 12 && dice <= 13) dx = 2;
else if (dice >= 14 && dice <= 14) dx = 3;
break;

case branchType.DEAD: // dead: fill in surrounding area
dice = roll(10);
if (dice >= 0 && dice <= 2) dy = -1;
else if (dice >= 3 && dice <= 6) dy = 0;
else if (dice >= 7 && dice <= 9) dy = 1;
dx = roll(3) - 1;
break;
}

return { dx, dy };
}

// Choose string for branch
function chooseString(type, life, dx, dy) {
    let branchStr = "?"; // fallback character

    if (life < 4) type = branchType.DYING;

    switch (type) {
        case branchType.TRUNK:
        if (dy === 0) branchStr = "/~";
        else if (dx < 0) branchStr = "\\|";
        else if (dx === 0) branchStr = "/|\\";
        else if (dx > 0) branchStr = "|/";
        break;
        case branchType.SHOOT_LEFT:
        if (dy > 0) branchStr = "\\";
        else if (dy === 0) branchStr = "\\_";
        else if (dx < 0) branchStr = "\\|";
        else if (dx === 0) branchStr = "/|";
        else if (dx > 0) branchStr = "/";
        break;
        case branchType.SHOOT_RIGHT:
        if (dy > 0) branchStr = "/";
        else if (dy === 0) branchStr = "_/";
        else if (dx < 0) branchStr = "\\|";
        else if (dx === 0) branchStr = "/|";
        else if (dx > 0) branchStr = "/";
        break;
        case branchType.DYING:
        case branchType.DEAD:
        branchStr = config.leaves[roll(config.leaves.length)];
        break;
    }

    return branchStr;
}

// Choose color for branch
function chooseColor(type) {
    let color;

    switch (type) {
        case branchType.TRUNK:
        case branchType.SHOOT_LEFT:
        case branchType.SHOOT_RIGHT:
        if (roll(2) === 0) color = colors.YELLOW;
        else color = colors.BROWN;
        break;
        case branchType.DYING:
        if (roll(10) === 0) color = colors.GREEN;
        else color = colors.GREEN;
        break;
        case branchType.DEAD:
        if (roll(3) === 0) color = colors.DARK_GREEN;
        else color = colors.DARK_GREEN;
        break;
    }

    return color;
}

// Draw character at position
function drawChar(x, y, char, color) {
    if (y >= 0 && y < state.gridHeight && x >= 0 && x < state.gridWidth) {
        // For multi-character strings like "/~", only put first char
        // This is a simplification from the C version
        state.grid[y][x] = { char: char.charAt(0), color };
    
        // If string is 2 chars and if we have space, put second char too
        if (char.length > 1 && x + 1 < state.gridWidth) {
            state.grid[y][x + 1] = { char: char.charAt(1), color };
        }
    }
}

// Branch function (recursive)
function branch(y, x, type, life) {
    state.branches++;
    let age = 0;
    let shootCooldown = config.multiplier;
    let pendingBranches = [];

    // Create a sequence of operations for this branch that can be executed in live mode
    function createBranchOperation(y, x, type, life, remainingLife) {
        return function() {
            life--;
            age = config.lifeStart - life;
        
            const { dx, dy } = setDeltas(type, life, age, config.multiplier);
        
            // Reduce dy if too close to the ground
            let modifiedDy = dy;
            if (dy > 0 && y > (state.gridHeight - 6)) modifiedDy--;
        
            // Branch into leaves near death
            if (life < 3) {
                pendingBranches.push(() => branch(y, x, branchType.DEAD, life));
            }
            // Dying trunk should branch into a lot of leaves
            else if (type === branchType.TRUNK && life < (config.multiplier + 2)) {
                pendingBranches.push(() => branch(y, x, branchType.DYING, life));
            }
            // Dying shoot should branch into a lot of leaves
            else if ((type === branchType.SHOOT_LEFT || type === branchType.SHOOT_RIGHT) &&
            life < (config.multiplier + 2)) {
                pendingBranches.push(() => branch(y, x, branchType.DYING, life));
            }
            // Trunks should re-branch
            else if (type === branchType.TRUNK && (((roll(3)) === 0) || (life % config.multiplier === 0))) {
                // If trunk is branching and not about to die, create another trunk with random life
                if ((roll(8) === 0) && life > 7) {
                    shootCooldown = config.multiplier * 2;
                    pendingBranches.push(() => branch(y, x, branchType.TRUNK, life + (roll(5) - 2)));
                }
                // Otherwise create a shoot
                else if (shootCooldown <= 0) {
                    shootCooldown = config.multiplier * 2;
                
                    const shootLife = (life + config.multiplier);
                
                    state.shoots++;
                    state.shootCounter++;
                
                    // Create shoot
                    pendingBranches.push(() => branch(y, x, (state.shootCounter % 2) + 1, shootLife));
                }
            }
            shootCooldown--;
        
            // Move in x and y directions
            x += dx;
            y += modifiedDy;
        
            const color = chooseColor(type);
            const branchStr = chooseString(type, life, dx, dy);
        
            drawChar(x, y, branchStr, color);
            drawGrid();
        
            // Return true if branch should continue growing, false if done
            return life > 0;
        };
    }

    // Add all steps to pending operations
    for (let remainingLife = life; remainingLife > 0; remainingLife--) {
        state.pendingOperations.push(createBranchOperation(y, x, type, remainingLife + 1, remainingLife));
    }

    // For immediate mode, just run all steps now
    if (!config.live) {
        let ops = [...state.pendingOperations];
        state.pendingOperations = [];
    
        while (ops.length > 0) {
            const op = ops.shift();
            op();
        
            // Add any new branches that were created
            while (pendingBranches.length > 0) {
                const branchOp = pendingBranches.shift();
                branchOp();
            }
        }
    }
}

// Add message box
function addMessage(message) {
    if (!message) return;

    const messageBox = document.getElementById('messageBox');
    messageBox.style.display = 'block';
    messageBox.textContent = message;
}

// Generate tree
function generateTree() {
    // Clear state
    state.branches = 0;
    state.shoots = 0;
    state.shootCounter = roll(100);
    state.pendingOperations = [];

    // Get window size
    const width = Math.min(120, Math.floor(window.innerWidth / 10));
    const height = Math.min(40, Math.floor(window.innerHeight / 20));

    // Initialize grid
    initGrid(width, height);

    // Draw base if needed
    if (config.baseType > 0) {
    drawBase();
}

// Start trunk at bottom center
const startY = height - (config.baseType === 0 ? 1 : (config.baseType === 1 ? 5 : 4));
const startX = Math.floor(width / 2);

// Start branching
branch(startY, startX, branchType.TRUNK, config.lifeStart);

// Draw the tree
drawGrid();

// Add message if specified
if (config.message) {
addMessage(config.message);
}

// If in live mode, process operations one by one
if (config.live) {
processNextOperation();
}
}

// Process next pending operation for live mode
function processNextOperation() {
    if (state.pendingOperations.length > 0) {
        const op = state.pendingOperations.shift();
        const continueBranch = op();
    
        // Schedule next operation
        setTimeout(processNextOperation, config.timeStep);
    }
}

// Setup event handlers
document.getElementById('generate').addEventListener('click', function() {
    // Read config from inputs
    config.multiplier = parseInt(document.getElementById('multiplier').value, 10);
    config.lifeStart = parseInt(document.getElementById('life').value, 10);
    config.baseType = parseInt(document.getElementById('baseType').value, 10);
    config.leaves = document.getElementById('leaves').value.split(',');
    config.message = document.getElementById('message').value || null;
    config.seed = parseInt(document.getElementById('seed').value, 10);
    config.live = false;

    if (config.seed === 0) {
        config.seed = Date.now();
    }
    randomSeed = config.seed;

    // Generate tree
    generateTree();
});

document.getElementById('liveMode').addEventListener('click', function() {
    // Read config from inputs
    config.multiplier = parseInt(document.getElementById('multiplier').value, 10);
    config.lifeStart = parseInt(document.getElementById('life').value, 10);
    config.baseType = parseInt(document.getElementById('baseType').value, 10);
    config.leaves = document.getElementById('leaves').value.split(',');
    config.message = document.getElementById('message').value || null;
    config.seed = parseInt(document.getElementById('seed').value, 10);
    config.live = true;

    if (config.seed === 0) {
        config.seed = Date.now();
    }
    randomSeed = config.seed;

    // Generate tree
    generateTree();
});

// Initial generation
window.addEventListener('load', function() {
    generateTree();
});