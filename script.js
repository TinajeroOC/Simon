
// Show welcome screen dynamically after every page load/reload
document.addEventListener('DOMContentLoaded', () => {
    displayMainMenu();
});

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
    startBtn.innerText = 'Start Game';
    startBtn.addEventListener('click', startGame);

    // Create How to Play button
    const howToPlayBtn = document.createElement('button');
    howToPlayBtn.className = 'button';
    howToPlayBtn.innerText = 'How to Play';
    howToPlayBtn.addEventListener('click', displayHowToPlay)

    // Append to container
    gameControlLayout.appendChild(title);
    gameControlLayout.appendChild(startBtn);
    gameControlLayout.appendChild(howToPlayBtn);
}



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



const startGame = () => {
    // Hide main menu
    let gameControlLayout = document.querySelector('.game-control-layout');
    gameControlLayout.style.display = 'none';

    // Get each tile
    const topLeftTile = document.querySelector('.tile-tl');
    const topRightTile = document.querySelector('.tile-tr');
    const bottomLeftTile = document.querySelector('.tile-bl');
    const bottomRightTile = document.querySelector('.tile-br');

    // Add event listeners for each tile
    // The original plan was to add an onclick attribute for each html element, but the tileClicked function could not be seen because the startGame function is inside an event listener from the startGame button
    topLeftTile.addEventListener('click', () => {
        tileClicked(topLeftTile);
    });
    
    topRightTile.addEventListener('click', () => {
        tileClicked(topRightTile);
    });
    
    bottomLeftTile.addEventListener('click', () => {
        tileClicked(bottomLeftTile);
    });
    
    bottomRightTile.addEventListener('click', () => {
        tileClicked(bottomRightTile);
    });
    


    // This function returns a random tile for the next item in the pattern
    const getRandomTile = () => {
        // Create a group of all tiles for the function to choose from
        const tiles = [
            topLeftTile,
            topRightTile,
            bottomLeftTile,
            bottomRightTile,
        ];
        // Gets a random value between 0 and 3, then rounds it down to the nearest whole number
        // The result is a random index corresponding to one of the tiles in the array
        return tiles[parseInt(Math.random() * tiles.length)]
    }

    // This array will hold the full current pattern
    const pattern = [
        getRandomTile()
    ];
    // This array is a copy of the pattern
    // The user will keep guessing the next tile, and each time the first element will be removed so the next tile can be checked
    // After the user has guessed all correct tiles and this array is empty, it will copy the pattern, including the new tile at the end, inside the tileClicked function
    // For now it just copies the only element in the pattern array, which is the result from getRandomTile
    let patternToGuess = [...pattern];

    // This function controls the flashing for each tile
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
            }, 900);
        });
    }

    // The user cannot click any tiles yet
    let canClick = false;

    // This function records the tiles the user clicks
    const tileClicked = selectedTile => {
        if (!canClick) return;
        // The next tile we are expecting to see in the users pattern is the next tile in the patternToGuess array
        // Each time the user clicks a correct tile, the shift() function puts the next tile in the pattern inside 'expectedTile'
        // shift() will always remove the first element in the patternToGuess array, which corresponds with the next tile in the pattern that should be clicked
        const expectedTile = patternToGuess.shift();
        // Check if the correct tile was selected
        if (expectedTile === selectedTile) {
            // Check if the tile that was clicked was the last tile in the current pattern
            if (patternToGuess.length === 0) {
                // Add a new random tile to the pattern
                pattern.push(getRandomTile());
                // Put the the new pattern with the new random tile inside the patternToGuess array
                // patternToGuess is a copy of the pattern array, which always holds the current pattern
                // The reason we need patternToGuess is because shift() devours the current element, so each time the pattern is used up, we need to re-copy it from the pattern array
                patternToGuess = [...pattern];
                // Once the new pattern is ready, start outputting it
                startFlashing();
            }
        }
        else { // If the wrong tile was selected, end the game
            alert('You lose. You have brought shame upon your family :(');
        }
    }

    const startFlashing = async () => {
        // The user cannot click any tiles while the pattern is being displayed 
        canClick = false;
        for (const tile of pattern) {
            // await promise so every tile doesn't flash at the same time
            await flash(tile);
        }
        // The user can now click tiles since the pattern has finished flashing
        canClick = true;
    }

    startFlashing();
}

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