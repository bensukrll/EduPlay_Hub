const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


canvas.width = 800;
canvas.height = 480;

// --- OYUN AYARLARI ---
const TILE_SIZE = 40; 
const COLS = 20;
const ROWS = 12; 

// HARİTA
const mapDesign = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1], 
  [1,0,0,0,0,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1], 
  [1,0,1,1,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1], 
  [1,0,0,0,0,0,1,1,1,1,1,0,1,0,1,1,1,1,1,1], 
  [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], 
  [1,0,0,0,0,0,1,1,0,1,1,1,1,1,0,1,1,1,0,1], 
  [1,0,1,1,1,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1], 
  [1,0,0,0,1,0,1,0,1,0,1,0,1,1,1,1,0,1,1,1], 
  [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1], 
  [1,0,0,0,1,1,1,1,1,1,1,0,1,0,0,0,0,0,0,1], 
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]  
];

// 10 SORU
const questions = [
  { text: "Bilişim teknolojilerini kullanırken uyulması gereken doğru davranışlara ne denir?", answers: ["Bilişim Etiği", "Dijital<br>Okuryazarlık", "Siber Zorbalık"], correct: 0 },
  { text: "Başkasına ait bir dosyayı izinsiz kopyalamak hangi kurala aykırıdır?", answers: ["Güvenlik", "Telif Hakkı", "Virüs"], correct: 1 },
  { text: "İnternette tanımadığımız kişilere hangisini ASLA vermemeliyiz?", answers: ["Oyun puanı", "Takma ad", "Ev adresi"], correct: 2 },
  { text: "Güçlü bir şifre oluştururken hangisi YAPILMAMALIDIR?", answers: ["Harf ve rakam kullanmak", "123456 yapmak", "Sembol eklemek"], correct: 1 },
  { text: "Bilgisayar laboratuvarında hangisini yapmak yanlıştır?", answers: ["Yiyecek yemek", "Sessiz olmak", "Öğretmeni dinlemek"], correct: 0 },
  { text: "İnternette yaptığımız her işlemin arkada bıraktığı kalıcı veriye ne denir?", answers: ["Dijital Ayak İzi", "Silinmiş Veri", "İnternet Geçmişi"], correct: 0 },
  { text: "Seni rahatsız eden bir mesaj aldığında ne yapmalısın?", answers: ["Sen de hakaret et", "Cevap verme/Engelle", "Arkadaşına gönder"], correct: 1 },
  { text: "E-posta ile gelen ve ödül kazandığınızı söyleyen şüpheli linke ne yapılmalıdır?", answers: ["Hemen tıklanır", "Arkadaşa atılır", "Asla tıklanmaz"], correct: 2 },
  { text: "Bir ödev hazırlarken internetten aldığın bilgiyi nasıl kullanmalısın?", answers: ["Kopyala yapıştır", "Kaynak göstererek", "Değiştirip yazarak"], correct: 1 },
  { text: "Bilgisayarına zarar verebilecek kötü niyetli yazılımlara ne ad verilir?", answers: ["Anti-virüs", "Virüs<br>Malware", "İşletim Sistemi"], correct: 1 }
];

// Oyuncu
let player = { x: TILE_SIZE * 1.5, y: TILE_SIZE * 1.5, size: 22, speed: 2.5, dx: 0, dy: 0 };

// Canavarlar
let enemies = [
  { x: TILE_SIZE * 18, y: TILE_SIZE * 1, dx: -1, dy: 0 },
  { x: TILE_SIZE * 9,  y: TILE_SIZE * 5, dx: 1,  dy: 0 },
  { x: TILE_SIZE * 2,  y: TILE_SIZE * 9, dx: 0.8, dy: 0 }
];

const possibleLocations = [
  { x: 2 * TILE_SIZE,  y: 2 * TILE_SIZE },   
  { x: 9 * TILE_SIZE,  y: 2 * TILE_SIZE },   
  { x: 16 * TILE_SIZE, y: 2 * TILE_SIZE },  
  { x: 9 * TILE_SIZE,  y: 5 * TILE_SIZE },   
  { x: 2 * TILE_SIZE,  y: 9 * TILE_SIZE },   
  { x: 9 * TILE_SIZE,  y: 9 * TILE_SIZE },   
  { x: 15 * TILE_SIZE, y: 8 * TILE_SIZE }   
];

let activeAnswerZones = []; 
let currentQIndex = 0;
let score = 0;
let lives = 3;
let currentLevelAnswers = []; 
let isGameOver = false;
let isProcessingAnswer = false; 
let isLevelTransitioning = false;
let playerInvulnerable = false; 

function initGame() {
  loadQuestion();
  update();
}

function isPathReachable(startCol, startRow, targetCol, targetRow) {
  let queue = [[startCol, startRow]];
  let visited = new Set();

  visited.add(`${startCol},${startRow}`);

  let iterations = 0; 
    
  while (queue.length > 0) {
    let [c, r] = queue.shift();
    if (c === targetCol && r === targetRow) return true;
        
    const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
    for (let [dc, dr] of dirs) {
      let nc = c + dc;
      let nr = r + dr;

      if (
        nc >= 0 && nc < COLS && nr >= 0 && nr < ROWS &&
        mapDesign[nr][nc] === 0 &&
        !visited.has(`${nc},${nr}`)
      ) {
        visited.add(`${nc},${nr}`);
        queue.push([nc, nr]);
      }
    }

    iterations++;
    if (iterations > ROWS * COLS) break; 
  }
  return false;
}

function loadQuestion() {
  if (currentQIndex >= questions.length) {
    gameOver(true); 
    return;
  }

  isLevelTransitioning = true;
  const q = questions[currentQIndex];
  document.getElementById('question-text').innerText = q.text;
    
  let indices = [0, 1, 2];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
    
  currentLevelAnswers = indices.map(i => ({
    text: q.answers[i],
    isCorrect: (i === q.correct)
  }));

  let shuffledLocs = [...possibleLocations].sort(() => Math.random() - 0.5);
  activeAnswerZones = [];
  const SAFE_DISTANCE = 160;

  let pCol = Math.floor(player.x / TILE_SIZE);
  let pRow = Math.floor(player.y / TILE_SIZE);

  for (let loc of shuffledLocs) {
    let dist = Math.hypot(loc.x - player.x, loc.y - player.y);
        
    if (dist > SAFE_DISTANCE) {
      let tCol = Math.floor(loc.x / TILE_SIZE);
      let tRow = Math.floor(loc.y / TILE_SIZE);
            
      if (isPathReachable(pCol, pRow, tCol, tRow)) {
        activeAnswerZones.push({
          x: loc.x, y: loc.y, w: 4 * TILE_SIZE, h: 1.5 * TILE_SIZE, id: activeAnswerZones.length 
        });
      }
    }
    if (activeAnswerZones.length === 3) break;
  }
    
  if (activeAnswerZones.length < 3) {
    for (let loc of shuffledLocs) {
      if (activeAnswerZones.length === 3) break;
      let exists = activeAnswerZones.find(z => z.x === loc.x && z.y === loc.y);
      if (!exists) {
        let tCol = Math.floor(loc.x / TILE_SIZE);
        let tRow = Math.floor(loc.y / TILE_SIZE);
        if (isPathReachable(pCol, pRow, tCol, tRow)) {
          activeAnswerZones.push({
            x: loc.x, y: loc.y, w: 4 * TILE_SIZE, h: 1.5 * TILE_SIZE, id: activeAnswerZones.length
          });
        }
      }
    }
  }

  updateSpaceshipVisuals();

  setTimeout(() => {
    isLevelTransitioning = false;
  }, 1000);
}

function updateSpaceshipVisuals() {
  activeAnswerZones.forEach((zone, index) => {
    const btn = document.getElementById(`btn-answer-${index}`);
    if (btn) {
      btn.style.left = zone.x + 'px';
      btn.style.top = zone.y + 'px';
      btn.style.width = zone.w + 'px';
      btn.style.height = zone.h + 'px';
            
      if (currentLevelAnswers[index]) {
        btn.innerHTML = currentLevelAnswers[index].text;
      }
      btn.className = 'spaceship-answer'; 
      btn.onclick = () => checkAnswer(index);
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (isGameOver) return;

  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) {
    e.preventDefault();
  }

  if (e.key === 'ArrowRight') player.dx = player.speed;
  if (e.key === 'ArrowLeft') player.dx = -player.speed;
  if (e.key === 'ArrowUp') player.dy = -player.speed;
  if (e.key === 'ArrowDown') player.dy = player.speed;
});

document.addEventListener('keyup', (e) => {
  if (['ArrowRight', 'ArrowLeft'].includes(e.key)) player.dx = 0;
  if (['ArrowUp', 'ArrowDown'].includes(e.key)) player.dy = 0;
});

function checkWallCollision(newX, newY) {
  const margin = 4; 
  const corners = [
    {x: newX - player.size/2 + margin, y: newY - player.size/2 + margin},
    {x: newX + player.size/2 - margin, y: newY - player.size/2 + margin},
    {x: newX - player.size/2 + margin, y: newY + player.size/2 - margin},
    {x: newX + player.size/2 - margin, y: newY + player.size/2 - margin}
  ];

  for (let corner of corners) {
    let col = Math.floor(corner.x / TILE_SIZE);
    let row = Math.floor(corner.y / TILE_SIZE);

    if (
      row < 0 || row >= ROWS || col < 0 || col >= COLS ||
      mapDesign[row][col] === 1
    ) {
      return true; 
    }
  }
  return false;
}

function update() {
  if (isGameOver) return;

  if (!checkWallCollision(player.x + player.dx, player.y)) player.x += player.dx;
  if (!checkWallCollision(player.x, player.y + player.dy)) player.y += player.dy;

  enemies.forEach(enemy => {
    let nextX = enemy.x + enemy.dx;
    let nextY = enemy.y + enemy.dy;
    let col = Math.floor(nextX / TILE_SIZE);
    let row = Math.floor(nextY / TILE_SIZE);
        
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS || mapDesign[row][col] === 1) {
      enemy.dx *= -1;
      enemy.dy *= -1;
    } else {
      enemy.x = nextX;
      enemy.y = nextY;
    }

    let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        
    if (dist < player.size + 5) {
      if (!playerInvulnerable) { 
        loseLife();
      }
    }
  });

  if (!isLevelTransitioning) {
    activeAnswerZones.forEach((zone, index) => {
      if (
        player.x > zone.x && player.x < zone.x + zone.w &&
        player.y > zone.y && player.y < zone.y + zone.h
      ) {
        checkAnswer(index);
      }
    });
  }

  draw();
  requestAnimationFrame(update);
}

function checkAnswer(zoneIndex) {
  if (isProcessingAnswer) return;
  if (isLevelTransitioning) return; 

  isProcessingAnswer = true;
    
  let selectedAnswer = currentLevelAnswers[zoneIndex];
  let btn = document.getElementById(`btn-answer-${zoneIndex}`);
    
  if (selectedAnswer && selectedAnswer.isCorrect) {
    if (btn) btn.classList.add('spaceship-correct');
    score += 100;
    document.getElementById('score').innerText = score;

    if (score >= 1000) {
      setTimeout(() => {
        gameOver(true); 
      }, 500);
      return;
    }
        
    setTimeout(() => {
      currentQIndex++;
      document.getElementById('level').innerText = currentQIndex + 1;
      loadQuestion();
      isProcessingAnswer = false;
    }, 1000); 
  } else {
    if (btn) btn.classList.add('spaceship-wrong');
        
    setTimeout(() => {
      loseLife();
      if (btn) btn.classList.remove('spaceship-wrong');
      isProcessingAnswer = false;
    }, 800);
  }
}

function loseLife() {
  playerInvulnerable = true;

  const hearts = document.querySelectorAll('.heart:not(.heart-lost)');
  if (hearts.length > 0) {
    const heartToRemove = hearts[hearts.length - 1];
    heartToRemove.classList.add('heart-lost');
        
    setTimeout(() => {
      heartToRemove.style.visibility = 'hidden';
    }, 600);
  }

  lives--;
    
  if (lives <= 0) {
    setTimeout(() => gameOver(false), 600);
  } else {
    setTimeout(() => {
      playerInvulnerable = false;
    }, 1500);
  }
}

function gameOver(win) {
  isGameOver = true;
  const screen = document.getElementById('game-over-screen');
  const title = document.getElementById('game-over-title');
  screen.classList.remove('hidden');
  document.getElementById('final-score').innerText = "SCORE: " + score;
    
  if (win) {
    title.innerText = "TEBRİKLER! KAZANDINIZ! 🏆";
    title.style.color = "#ffd700"; 
  } else {
    title.innerText = "OYUN BİTTİ";
    title.style.color = "red";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#5d2c91"; 
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (mapDesign[row][col] === 1) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#a64dff";
        ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.shadowBlur = 0; 
      }
    }
  }

  if (playerInvulnerable) {
    ctx.globalAlpha = 0.5; 
  }

  ctx.shadowBlur = 15;
  ctx.shadowColor = "#00f2ff";
  ctx.font = "35px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🤖", player.x, player.y);
  ctx.shadowBlur = 0;

  ctx.globalAlpha = 1.0;

  enemies.forEach(enemy => {
    ctx.font = "35px Arial";
    ctx.fillText("👾", enemy.x, enemy.y);
  });
}

initGame();
