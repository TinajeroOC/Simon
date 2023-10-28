//////////////////////////////////////// Declare game state globally ////////////////////////////////////////////////////////////////////////////////
let pattern = [];        // This array will hold the full current pattern
let canClick = false;    // Controls when the user can begin entering the pattern
let patternToGuess = []; // patternToGuess is a copy of the pattern array, which always holds the current pattern
const previousGamePattern = JSON.parse(localStorage.getItem("simon-game-pattern")); // Holds previous game pattern array, if it exists.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Declare variables globally /////////////////////////////////////////////////////////////////////////////////
let tiles = {};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Event Handlers for each tile ////////////////////////////////////////////////////////////////////////////////
// The original plan was to add an onclick attribute for each html element, but the tileClicked function could not be seen because the startGame function is inside an event listener from the startGame button
// Event listeners were removed from the startGame function because after the game restarted, the event listeners would stack and cause unexpected behavior, so we should bind them to event handlers at the start of the startGame function instead
const handleTopLeftMouseDown = () => {
    const topLeftTile = document.querySelector('.tile-tl');
    topLeftTile.style.background = 'white';
}

const handleTopLeftMouseUp = () => {
    const topLeftTile = document.querySelector('.tile-tl');
    topLeftTile.style.background = '';
    tileClicked(topLeftTile);
}

const handleTopRightMouseDown = () => {
    const topRightTile = document.querySelector('.tile-tr');
    topRightTile.style.background = 'white';
}

const handleTopRightMouseUp = () => {
    const topRightTile = document.querySelector('.tile-tr');
    topRightTile.style.background = '';
    tileClicked(topRightTile);
}

const handleBottomLeftMouseDown = () => {
    const bottomLeftTile = document.querySelector('.tile-bl');
    bottomLeftTile.style.background = 'white';
}

const handleBottomLeftMouseUp = () => {
    const bottomLeftTile = document.querySelector('.tile-bl');
    bottomLeftTile.style.background = '';
    tileClicked(bottomLeftTile);
}

const handleBottomRightMouseDown = () => {
    const bottomRightTile = document.querySelector('.tile-br');
    bottomRightTile.style.background = 'white';
}

const handleBottomRightMouseUp = () => {
    const bottomRightTile = document.querySelector('.tile-br');
    bottomRightTile.style.background = '';
    tileClicked(bottomRightTile);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Event listener to show the welcome screen dynamically after every page load/reload //////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    displayMainMenu();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Function that displays how to play //////////////////////////////////////////////////////////////////////////
const displayMainMenu = () => {
    const gameControlLayout = document.querySelector('.game-control-layout');
    gameControlLayout.innerHTML = ''; // Remove any existing html

    // Create h3
    const title = document.createElement('h3');
    title.className = 'title';
    title.innerText = 'Simon';

    // Create Start Game button
    const startBtn = document.createElement('button');
    startBtn.className = 'button';
    startBtn.innerText = (previousGamePattern ? 'New Game' : 'Start Game');
    startBtn.addEventListener('click', () => { startGame(); });

    // Create How to Play button
    const howToPlayBtn = document.createElement('button');
    howToPlayBtn.className = 'button';
    howToPlayBtn.innerText = 'How to Play';
    howToPlayBtn.addEventListener('click', displayHowToPlay)

    // Create Continue Game button
    const continueGameBtn = document.createElement('button');
    continueGameBtn.className = 'button';
    continueGameBtn.innerText = 'Continue Game';
    continueGameBtn.addEventListener('click', () => { startGame(true); })

    // Append to container
    gameControlLayout.appendChild(title);
    gameControlLayout.appendChild(startBtn);
    previousGamePattern && gameControlLayout.appendChild(continueGameBtn);
    gameControlLayout.appendChild(howToPlayBtn);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Function that displays how to play //////////////////////////////////////////////////////////////////////////
const displayHowToPlay = () => {
    const gameControlLayout = document.querySelector(".game-control-layout");
    gameControlLayout.innerHTML = ''; // Remove any existing html

    // Create h3
    let title = document.createElement('h3');
    title.className = 'title';
    title.innerText = 'How To Play'

    // Create Paragraph
    let instructions = document.createElement("p");
    instructions.className = "instructions";
    instructions.innerText = 'Simon Says is an endless pattern matching game that repeats a pattern of buttons and increases by one each turn. Test your memory and see how far you can get before messing up. Good luck!';

    // Create button
    let backToMenu = document.createElement("button");
    backToMenu.className = 'button';
    backToMenu.innerText = 'Back to Menu';
    backToMenu.addEventListener('click', displayMainMenu);

    // Append to container
    gameControlLayout.appendChild(title);
    gameControlLayout.appendChild(instructions);
    gameControlLayout.appendChild(backToMenu);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// This function returns a random tile for the next item in the pattern ///////////////////////////////////////
const getRandomTile = () => {
    // Create a group of all tiles for the function to choose from
    const tilesKeys = Object.keys(tiles);

    // Gets a random value between 0 and 3, then rounds it down to the nearest whole number
    // The result is a random index corresponding to one of the tiles in the array
    return tilesKeys[parseInt(Math.random() * tilesKeys.length)]
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// This function records the tiles the user clicks /////////////////////////////////////////////////////////////
const tileClicked = selectedTile => {
    if (!canClick) return;
    // The next tile we are expecting to see in the users pattern is the next tile in the patternToGuess array
    // Each time the user clicks a correct tile, the shift() function puts the next tile in the pattern inside 'expectedTile'
    // shift() will always remove the first element in the patternToGuess array, which corresponds with the next tile in the pattern that should be clicked
    const expectedTile = tiles[patternToGuess.shift()];
    // Check if the correct tile was selected
    if (expectedTile === selectedTile) {
        // Check if the tile that was clicked was the last tile in the current pattern
        if (patternToGuess.length === 0) {
            // Add a new random tile to the pattern
            pattern.push(getRandomTile());
            // Put the the new pattern with the new random tile inside the patternToGuess array
            // The reason we need patternToGuess is because shift() devours the current element, so each time the pattern is used up, we need to re-copy it from the pattern array
            patternToGuess = [...pattern];
            setTimeout(() => {
                // Start outputting the next pattern after 500 ms
                startFlashing();
            }, 500)
            localStorage.setItem("simon-game-pattern", JSON.stringify(patternToGuess));
        }
    }
    else { // If the wrong tile was selected, end the game
        localStorage.removeItem("simon-game-pattern");
        endGame();
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// This function controls the flashing for each tile ///////////////////////////////////////////////////////////
const flash = tile => {
    return new Promise((resolve, reject) => {
        // Activates the current tile in the pattern
        tile.className += ' active';
        // Set a timer for how long the active tile flashes before changing the active tile
        setTimeout(() => {
            tile.className = tile.className.replace(
                ' active',
                ''
            );
            // In case the pattern has the same tile back to back, it will be 2 short flashes instead of one long flash
            setTimeout(() => {
                resolve();
            }, 200);
        }, 700);
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// This function controls the pattern flashes /////////////////////////////////////////////////////////////////
const startFlashing = async () => {
    // The user cannot click any tiles while the pattern is being displayed 
    canClick = false;
    for (const tile of pattern) {
        // await promise so every tile doesn't flash at the same time
        await flash(tiles[tile]);
    }
    // The user can now click tiles since the pattern has finished flashing
    canClick = true;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// Main function to run game ////////////////////////////////////////////////////////////////////////////
const startGame = (continuation = false) => {
    // Hide main menu
    let gameControlLayout = document.querySelector('.game-control-layout');
    gameControlLayout.style.display = 'none';

    // Set tiles object with each game tile
    tiles = {
        tl: document.querySelector('.tile-tl'),
        tr: document.querySelector('.tile-tr'),
        bl: document.querySelector('.tile-bl'),
        br: document.querySelector('.tile-br')
    }

    // Bind event listeners to event handlers
    tiles.tl.addEventListener('mousedown', handleTopLeftMouseDown);
    tiles.tl.addEventListener('mouseup', handleTopLeftMouseUp);
    tiles.tr.addEventListener('mousedown', handleTopRightMouseDown);
    tiles.tr.addEventListener('mouseup', handleTopRightMouseUp);
    tiles.bl.addEventListener('mousedown', handleBottomLeftMouseDown);
    tiles.bl.addEventListener('mouseup', handleBottomLeftMouseUp);
    tiles.br.addEventListener('mousedown', handleBottomRightMouseDown);
    tiles.br.addEventListener('mouseup', handleBottomRightMouseUp);

    // Initialize the pattern with the first random tile
    pattern = continuation ? previousGamePattern : [getRandomTile()];

    // This array is a copy of the pattern
    // The user will keep guessing the next tile, and each time the first element will be removed so the next tile can be checked
    // After the user has guessed all correct tiles and this array is empty, it will copy the pattern, including the new tile at the end, inside the tileClicked function
    // First iteration it just copies the only element in the pattern array, which is the result from getRandomTile
    patternToGuess = [...pattern];

    // Store the initial game pattern to browser
    localStorage.setItem("simon-game-pattern", JSON.stringify(pattern));

    startFlashing();
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Function to reset game after loss //////////////////////////////////////////////////////////////////////////


const endGame = () => {
    // Show game over menu
    const gameControlLayout = document.querySelector('.game-control-layout');
    gameControlLayout.innerHTML = ''; // Clear all existing HTML
    gameControlLayout.style.display = 'flex';
    gameControlLayout.style.justifyContent = 'center';

    const h3 = document.createElement('h3');
    h3.className = 'title';
    h3.innerText = 'You Lost!';

    const btn = document.createElement('button');
    btn.className = 'button';
    btn.innerText = 'Try Again'

    btn.addEventListener('click', () => { startGame(); });

    gameControlLayout.appendChild(h3);
    gameControlLayout.appendChild(btn);

    // Get tiles
    const topLeftTile = document.querySelector('.tile-tl');
    const topRightTile = document.querySelector('.tile-tr');
    const bottomLeftTile = document.querySelector('.tile-bl');
    const bottomRightTile = document.querySelector('.tile-br');

    // Remove event listeners so they don't stack
    topLeftTile.removeEventListener('mousedown', handleTopLeftMouseDown);
    topLeftTile.removeEventListener('mouseup', handleTopLeftMouseUp);
    topRightTile.removeEventListener('mousedown', handleTopRightMouseDown);
    topRightTile.removeEventListener('mouseup', handleTopRightMouseUp);
    bottomLeftTile.removeEventListener('mousedown', handleBottomLeftMouseUp);
    bottomLeftTile.removeEventListener('mouseup', handleBottomLeftMouseUp);
    bottomRightTile.removeEventListener('mousedown', handleBottomRightMouseDown);
    bottomRightTile.removeEventListener('mouseup', handleBottomRightMouseUp);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////// Ways we can improve the code

// Functionality
//   As the user progresses, have the flashing timer decrease, or offer different difficulties at the beginning
//   Have the duration of the flashes be random
//   Add sound effects
//   Add a timer that gives the user a limited time to input the pattern
//   Add an evil red flash randomly in the pattern that is clearly not part of the pattern but meant to trip up the user

// Style
//   For each tile, add a more vibrant version of its color when it flashes or is clicked
//   When the user fails, a menu pops up similar to the start menu instead of an alert and have all buttons flash at once
//   Add responsiveness with media queries