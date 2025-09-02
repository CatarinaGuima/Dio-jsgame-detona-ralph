const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
    startButton: document.querySelector("#start-button"),
    restartButton: document.querySelector("#restart-button"),
    gameOverScreen: document.querySelector("#game-over"),
    finalScore: document.querySelector("#final-score"),
  },
  values: {
    gameVelocity: 600,
    hitPosition: null,
    result: 0,
    currentTime: 60,
    lives: 3,
  },
  actions: {
    timerId: null,
    countDownTimerId: null,
  },
};

// ---------- Funções ----------
function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });

  let randomIndex = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomIndex];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function countDown() {
 
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0 || state.values.lives <= 0) {
    endGame();
  }
}

function playSound(audioName) {
  let audio = new Audio(`./src/audios/${audioName}.m4a`);
  audio.volume = 0.02;
  audio.play();
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound("hit");
      } else {
        state.values.lives--;
        state.view.lives.textContent = "x" + state.values.lives;
        playSound("miss");
        if (state.values.lives <= 0) {
          endGame();
        }
      }
    });
  });
}

function startGame() {
  
  // Limpa intervalos anteriores
  if (state.actions.timerId) {
    clearInterval(state.actions.timerId);
    state.actions.timerId = null;
  }
  if (state.actions.countDownTimerId) {
    clearInterval(state.actions.countDownTimerId);
    state.actions.countDownTimerId = null;
  }
  
  resetGame();
  
  // Inicia os intervalos
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  state.actions.countDownTimerId = setInterval(countDown, 1000);
  
  // Mostra o primeiro inimigo imediatamente
  randomSquare();
  
  state.view.startButton.disabled = true;
}

function resetGame() {
  state.values.currentTime = 60;
  state.values.result = 0;
  state.values.lives = 3;

  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.score.textContent = state.values.result;
  state.view.lives.textContent = "x" + state.values.lives;

  state.view.gameOverScreen.style.display = "none";
  
  // Remove inimigos
  state.view.squares.forEach((square) => {
    square.classList.remove("enemy");
  });
}

function endGame() {
  clearInterval(state.actions.timerId);
  clearInterval(state.actions.countDownTimerId);
  
  state.actions.timerId = null;
  state.actions.countDownTimerId = null;

  state.view.finalScore.textContent = state.values.result;
  state.view.gameOverScreen.style.display = "flex";
  state.view.startButton.disabled = false;
  playSound("game_over");
}

// ---------- Inicialização ----------
function initialize() {

  addListenerHitBox();
  state.view.startButton.addEventListener("click", startGame);
  state.view.restartButton.addEventListener("click", startGame);
  
}

// Aguarda o DOM carregar completamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}