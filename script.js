class Game {
  static STORAGE_KEY_PATTERN = 'simon-game-pattern'
  static STORAGE_KEY_DIFFICULTY = 'simon-game-difficulty'
  static TILE_FLASH_DELAY_MS = 600
  static TILE_REMOVAL_DELAY_MS = 300
  static TILE_FLASH_MULTIPLIER_DIFFICULTY = 0.5

  constructor() {
    // Game State Variables
    this.round = 1
    this.gameDifficulty = localStorage.getItem(Game.STORAGE_KEY_DIFFICULTY) ?? 'Normal'
    this.pattern = []
    this.patternToGuess = []
    this.previousPattern = JSON.parse(localStorage.getItem(Game.STORAGE_KEY_PATTERN)) ?? []
    this.canClick = false
    this.tiles = {
      tl: document.querySelector('.tile-tl'),
      tr: document.querySelector('.tile-tr'),
      bl: document.querySelector('.tile-bl'),
      br: document.querySelector('.tile-br'),
    }

    // Tile Event Listeners
    for (const tile in this.tiles) {
      this.tiles[tile].addEventListener('click', () => this.tileClick(this.tiles[tile]))
    }

    // HTML DOM Elements
    this.gameRoundTracker = null
    this.gameControlLayout = document.querySelector('.game-control-layout')
  }

  displayMainMenu() {
    const existsPreviousPattern = Array.isArray(this.previousPattern) && this.previousPattern.length > 0
    this.gameControlLayout.innerHTML = ''

    const title = document.createElement('span')
    title.className = 'title'
    title.innerText = 'Simon'

    const startButton = document.createElement('button')
    startButton.className = 'button'
    startButton.innerText = existsPreviousPattern ? 'New Game' : 'Start Game'
    startButton.addEventListener('click', () => this.startGame())

    const continueGameButton = document.createElement('button')
    continueGameButton.className = 'button'
    continueGameButton.innerText = 'Continue Game'
    continueGameButton.addEventListener('click', () => this.startGame(true))

    const difficultyButton = document.createElement('button')
    difficultyButton.className = 'button'
    difficultyButton.id = 'difficulty'
    difficultyButton.innerText = `${this.gameDifficulty} Mode`
    difficultyButton.addEventListener('click', () => this.switchDifficulty())

    const tutorialButton = document.createElement('button')
    tutorialButton.className = 'button'
    tutorialButton.innerText = 'How to Play'
    tutorialButton.addEventListener('click', () => this.displayTutorialMenu())

    this.gameControlLayout.append(title, startButton, difficultyButton, tutorialButton)
    existsPreviousPattern && this.gameControlLayout.insertBefore(continueGameButton, difficultyButton)
  }

  // Switches current difficulty setting between normal and hard
  switchDifficulty() {
    this.gameDifficulty = this.gameDifficulty === "Normal" ? "Hard" : "Normal"
    localStorage.setItem(Game.STORAGE_KEY_DIFFICULTY, this.gameDifficulty)
    document.getElementById('difficulty').innerText = `${this.gameDifficulty} Mode`
  }

  displayTutorialMenu() {
    this.gameControlLayout.innerHTML = ''

    const title = document.createElement('span')
    title.className = 'title'
    title.innerText = 'How To Play'

    const description = document.createElement('p')
    description.className = 'instructions'
    description.innerText = 'Simon Says is an endless pattern matching game that repeats a pattern of buttons and increases by one each turn. Test your memory and see how far you can get before messing up. Good luck!'

    const mainMenuButton = document.createElement('button')
    mainMenuButton.className = 'button'
    mainMenuButton.innerText = 'Back to Menu'
    mainMenuButton.addEventListener('mouseup', () => this.displayMainMenu())

    this.gameControlLayout.append(title, description, mainMenuButton)
  }

  displayGameSessionMenu() {
    this.gameControlLayout.innerHTML = ''

    const title = document.createElement('span')
    title.className = 'title'
    title.innerText = 'Playing'

    const roundDisplay = document.createElement('div')
    roundDisplay.className = 'round-tracker'
    roundDisplay.innerText = this.round.toString()

    this.gameControlLayout.append(title, roundDisplay)
    this.gameRoundTracker = document.querySelector('.round-tracker')
  }

  startGame(resumePreviousGame = false) {
    this.round = resumePreviousGame ? this.previousPattern.length : 1
    this.pattern = resumePreviousGame ? this.previousPattern : [this.getRandomTile()]
    this.patternToGuess = [...this.pattern]

    this.saveGameState()
    this.displayGameSessionMenu()
    this.tilePatternFlash()
  }

  endGame() {
    this.clearGameState()
    this.gameControlLayout.innerHTML = ''

    const title = document.createElement('span')
    title.className = 'title'
    title.innerText = 'You Lost'

    const restartButton = document.createElement('button')
    restartButton.className = 'button'
    restartButton.innerText = 'Try Again'
    restartButton.addEventListener('click', () => this.startGame())

    const difficultyButton = document.createElement('button')
    difficultyButton.className = 'button'
    difficultyButton.id = 'difficulty'
    difficultyButton.innerText = `${this.gameDifficulty} Mode`
    difficultyButton.addEventListener('click', () => this.switchDifficulty())

    this.gameControlLayout.append(title, restartButton, difficultyButton)
  }

  updateRoundTracker() {
    this.round++
    this.gameRoundTracker.innerText = this.round.toString()
  }

  getRandomTile() {
    const keys = Object.keys(this.tiles)
    return keys[parseInt(Math.random() * keys.length)]
  }

  async tilePatternFlash() {
    this.canClick = false
    for (const tile of this.pattern) {
      await this.tileFlash(this.tiles[tile])
    }
    this.canClick = true
  }

  tileFlash(tile) {
    return new Promise((resolve, reject) => {
      tile.classList.add('active')
      setTimeout(() => {
        tile.classList.remove('active')
        setTimeout(() => {
          resolve()
        }, this.gameDifficulty === 'Normal' ? Game.TILE_REMOVAL_DELAY_MS : Game.TILE_REMOVAL_DELAY_MS * Game.TILE_FLASH_MULTIPLIER_DIFFICULTY)
      }, this.gameDifficulty === 'Normal' ? Game.TILE_FLASH_DELAY_MS : Game.TILE_REMOVAL_DELAY_MS * Game.TILE_FLASH_MULTIPLIER_DIFFICULTY)
    })
  }

  tileClick(tile) {
    if (!this.canClick) return

    const expectedTile = this.tiles[this.patternToGuess.shift()]
    if (tile === expectedTile) {
      if (this.patternToGuess.length === 0) {
        this.pattern.push(this.getRandomTile())
        this.patternToGuess = [...this.pattern]
        setTimeout(() => {
          this.tilePatternFlash()
        }, Game.TILE_FLASH_DELAY_MS)
        this.updateRoundTracker()
        this.saveGameState()
      }
    } else {
      this.endGame()
    }
  }

  saveGameState() {
    localStorage.setItem(Game.STORAGE_KEY_PATTERN, JSON.stringify(this.pattern))
  }

  clearGameState() {
    localStorage.removeItem(Game.STORAGE_KEY_PATTERN)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game()
  game.displayMainMenu()
})