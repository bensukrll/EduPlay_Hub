const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- OYUN AYARLARI ---
const TILE_SIZE = 40; 
const COLS = 20;
const ROWS = 12; 

// Harita: 1=Duvar, 0=Yol
// DÜZELTME: Yollar biraz daha ferahlatıldı, takılma yapabilecek bazı duvarlar kaldırıldı.
const mapDesign = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,0,1], 
    [1,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1,0,1], 
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,1,0,1,0,1], 
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1], // Orta ve alt geçişler rahatlatıldı
    [1,1,1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1], // Alt koridor açıldı
    [1,0,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const questions = [
    {
        text: "Bilişim teknolojilerini kullanırken uyulması gereken doğru ve yanlış davranışlara ne denir?",
        answers: ["Bilişim Etiği", "Dijital Okuryazarlık", "Siber Zorbalık"],
        correct: 0 
    },
    {
        text: "Başkasına ait bir dosyayı izinsiz kopyalamak hangi kurala aykırıdır?",
        answers: ["Güvenlik", "Telif Hakkı", "Virüs"],
        correct: 1
    },
    {
        text: "İnternette tanımadığımız kişilere hangisini ASLA vermemeliyiz?",
        answers: ["Oyun puanı", "Takma ad", "Ev adresi"],
        correct: 2
    },
    {
        text: "Güçlü bir şifre oluştururken hangisi YAPILMAMALIDIR?",
        answers: ["Harf ve rakam kullanmak", "123456 yapmak", "Sembol eklemek"],
        correct: 1
    },
    {
        text: "Bilgisayar laboratuvarında hangisini yapmak yanlıştır?",
        answers: ["Yiyecek yemek", "Sessiz olmak", "Öğretmeni dinlemek"],
        correct: 0
    }
];

// --- DEĞİŞKENLER ---
// DÜZELTME: player.size 25'ten 22'ye düşürüldü. Bu sayede görsel aynı kalsa da duvarlara takılma azalır.
let player = { x: TILE_SIZE * 1.5, y: TILE_SIZE * 1.5, size: 22, speed: 3, dx: 0, dy: 0 };

// DÜZELTME: 3. Canavar (Sağ alttaki) daha stratejik bir konuma alındı.
let enemies = [
    { x: TILE_SIZE * 8, y: TILE_SIZE * 1, dx: 1.5, dy: 0 }, // Üst koridor
    { x: TILE_SIZE * 5, y: TILE_SIZE * 5, dx: 0, dy: 1.5 }, // Sol orta
    // Yeni konum: Sağ taraftaki geniş koridorda aşağı yukarı devriye gezecek
    { x: TILE_SIZE * 13, y: TILE_SIZE * 7, dx: 0, dy: 1.5 } 
];

const answerZones = [
    { x: 2 * TILE_SIZE, y: 9 * TILE_SIZE, w: 3 * TILE_SIZE, h: 2 * TILE_SIZE, id: 0 }, 
    { x: 9 * TILE_SIZE, y: 5 * TILE_SIZE, w: 3 * TILE_SIZE, h: 2 * TILE_SIZE, id: 1 }, 
    { x: 16 * TILE_SIZE, y: 1 * TILE_SIZE, w: 3 * TILE_SIZE, h: 2 * TILE_SIZE, id: 2 }  
];

let currentQIndex = 0;
let score = 0;
let lives = 3;
let currentLevelAnswers = []; 
let isGameOver = false; 

// --- OYUN FONKSİYONLARI ---

function initGame() {
    loadQuestion();
    update();
}

function loadQuestion() {
    if (currentQIndex >= questions.length) {
        gameOver(true); 
        return;
    }

    const q = questions[currentQIndex];
    document.getElementById('question-text').innerText = q.text;
    
    let indices = [0, 1, 2];
    indices.sort(() => Math.random() - 0.5); 
    
    currentLevelAnswers = indices.map(i => ({
        text: q.answers[i],
        isCorrect: (i === q.correct)
    }));

    resetPlayerPos();
}

function resetPlayerPos() {
    player.x = TILE_SIZE * 1.5;
    player.y = TILE_SIZE * 1.5;
    player.dx = 0;
    player.dy = 0;
}

// Klavye Kontrolleri
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
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
    // DÜZELTME: Margin değeri artırılarak (2 -> 4) çarpışma toleransı yükseltildi. 
    // Bu, oyuncunun duvar kenarına sürtünse bile takılmamasını sağlar.
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
        
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS || mapDesign[row][col] === 1) {
            return true; 
        }
    }
    return false;
}

function update() {
    if (isGameOver) return;

    if (!checkWallCollision(player.x + player.dx, player.y)) player.x += player.dx;
    if (!checkWallCollision(player.x, player.y + player.dy)) player.y += player.dy;

    // Canavar Mantığı
    enemies.forEach(enemy => {
        let nextX = enemy.x + enemy.dx;
        let nextY = enemy.y + enemy.dy;
        
        let col = Math.floor(nextX / TILE_SIZE);
        let row = Math.floor(nextY / TILE_SIZE);
        
        // Sınır ve Duvar kontrolü
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS || mapDesign[row][col] === 1) {
            enemy.dx *= -1;
            enemy.dy *= -1;
        } else {
            enemy.x = nextX;
            enemy.y = nextY;
        }

        let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist < player.size + 5) { // +5 ekleyerek canavarın temasını netleştirdik
            loseLife();
        }
    });

    // Cevap Bölgesi Kontrolü
    answerZones.forEach((zone, index) => {
        if (player.x > zone.x && player.x < zone.x + zone.w &&
            player.y > zone.y && player.y < zone.y + zone.h) {
            checkAnswer(index);
        }
    });

    draw();
    requestAnimationFrame(update);
}

let isProcessingAnswer = false; 
function checkAnswer(zoneIndex) {
    if(isProcessingAnswer) return;
    isProcessingAnswer = true;
    
    let selectedAnswer = currentLevelAnswers[zoneIndex];
    
    if (selectedAnswer.isCorrect) {
        score += 100;
        document.getElementById('score').innerText = score;
        currentQIndex++;
        document.getElementById('level').innerText = currentQIndex + 1;
        
        setTimeout(() => {
            loadQuestion();
            isProcessingAnswer = false;
        }, 500);
    } else {
        loseLife();
        setTimeout(() => { isProcessingAnswer = false; }, 500);
    }
}

function loseLife() {
    lives--;
    document.getElementById('lives').innerText = lives;
    resetPlayerPos();
    
    canvas.style.borderColor = "red";
    setTimeout(() => canvas.style.borderColor = "#00f2ff", 300);

    if (lives <= 0) {
        gameOver(false);
    }
}

function gameOver(win) {
    isGameOver = true;
    const screen = document.getElementById('game-over-screen');
    const title = document.getElementById('game-over-title');
    screen.classList.remove('hidden');
    document.getElementById('final-score').innerText = "Toplam Puan: " + score;
    
    if (win) {
        title.innerText = "TEBRİKLER! Etiği Öğrendin!";
        title.style.color = "#00ff00";
    } else {
        title.innerText = "OYUN BİTTİ!";
        title.style.color = "red";
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Duvarları Çiz
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

    // Cevap Bölgelerini Çiz
    answerZones.forEach((zone, i) => {
        ctx.fillStyle = "rgba(0, 242, 255, 0.15)"; 
        ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
        
        ctx.strokeStyle = "#00f2ff";
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00f2ff";
        ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
        ctx.shadowBlur = 0;

        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px 'Roboto', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        let text = currentLevelAnswers[i] ? currentLevelAnswers[i].text : "";
        ctx.fillText(text, zone.x + zone.w/2, zone.y + zone.h/2);
    });

    // Oyuncuyu Çiz
    // Görsel olarak büyük görünmeye devam etsin diye fontu büyük bıraktım (35px)
    // Ama arkadaki çarpışma kutusu yukarıda küçültüldü.
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f2ff";
    ctx.font = "35px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🤖", player.x, player.y);
    ctx.shadowBlur = 0;

    // Canavarları Çiz
    enemies.forEach(enemy => {
        ctx.font = "35px Arial";
        ctx.fillText("👾", enemy.x, enemy.y);
    });
}

initGame();