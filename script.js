
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