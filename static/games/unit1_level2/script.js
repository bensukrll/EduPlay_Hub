const questions = [
    { q: "CPU bilgisayarın işlemcisidir.", a: true },
    { q: "RAM kalıcı bir bellektir.", a: false },
    { q: "ROM sadece okunabilir bellektir.", a: true },
    { q: "SSD, HDD'den daha yavaştır.", a: false },
    { q: "Anakart tüm parçaları birbirine bağlar.", a: true },
    { q: "GPU grafik işlemlerini yapar.", a: true },
    { q: "Mouse bir çıkış birimidir.", a: false },
    { q: "Klavye giriş birimidir.", a: true },
    { q: "BIOS açılışta sistemi başlatır.", a: true },
    { q: "Monitör giriş birimidir.", a: false }
];

let current = 0;
let step = 100; // İlerleme miktarı
let monsterSpeed = 1.5;
let chaseInterval = null;
let wrongCount = 0;

const gameContainer = document.querySelector('.game-container');
const player = document.getElementById("player");
const monster = document.getElementById("monster");
const door = document.getElementById("door");
const questionText = document.getElementById("question");
const questionBox = document.getElementById("questionBox");
const startScreen = document.getElementById("startScreen");

const monsterRoar = document.getElementById("monsterRoar");
const winSound = document.getElementById("winSound");

// Oyuncu başlangıç konumu
player.style.left = "200px";

questionText.innerText = questions[current].q;

function startGame() {
    startScreen.style.display = "none";
    questionBox.style.display = "block";

    gameContainer.style.animationPlayState = "running";
    player.style.animationPlayState = "running";
    monster.style.animationPlayState = "running";

    startChase();
}

function startChase() {
    chaseInterval = setInterval(() => {
        // Canavar henüz görünmüyorsa ekran dışından (-200) başlasın
        let monsterPos = parseInt(monster.style.left || -200);
        let playerPos = parseInt(player.style.left);

        monster.style.left = (monsterPos + monsterSpeed) + "px";

        // ÇARPIŞMA AYARI:
        // Canavarın görsel genişliğine göre burayı ayarlıyoruz.
        // Eğer canavar çok erken yakalıyorsa 120'yi küçült, geç yakalıyorsa büyüt.
        if (monsterPos + 120 >= playerPos) {
            monsterRoar.play();
            loseGame();
        }
    }, 50);
}

function answer(userAnswer) {
    if (userAnswer === questions[current].a) {
        // DOĞRU CEVAP
        wrongCount = 0; 
        current++;

        // Oyuncuyu ilerlet
        let currentLeft = parseInt(player.style.left);
        player.style.left = (currentLeft + step) + "px";
        
        monsterSpeed += 0.3; // Canavar hızlansın

        if (current === questions.length) {
            questionBox.style.display = "none";
            escapeThroughDoor();
            return;
        }
        questionText.innerText = questions[current].q;

    } else {
        // YANLIŞ CEVAP
        wrongCount++;
        let monsterPos = parseInt(monster.style.left || -200);
        monster.style.left = (monsterPos + 60) + "px"; // Canavar yaklaşsın
        
        // Hata efekti: Ekran titremesi
        gameContainer.style.transform = "translateX(5px)";
        setTimeout(() => gameContainer.style.transform = "translateX(0)", 100);

        monsterRoar.play();

        if (wrongCount >= 3) {
            loseGame();
        }
    }
}

function stopAllAnimations() {
    clearInterval(chaseInterval);
    gameContainer.style.animationPlayState = "paused";
    player.style.animationPlayState = "paused";
    monster.style.animationPlayState = "paused";
}

function loseGame() {
    stopAllAnimations();
    questionBox.style.display = "none";

    const msg = document.createElement("div");
    msg.className = "game-over-box";
    msg.innerHTML = `
        <div class="game-over-content" style="border-color: #e74c3c;">
            <h2 style="color: #e74c3c">❌ YAKALANDIN!</h2>
            <p>Virüs sistemini ele geçirdi.</p>
            <button class="restart-btn" onclick="restart()">Tekrar Dene</button>
        </div>
    `;
    document.getElementById("gameArea").appendChild(msg);
    
    // Canavarı oyuncunun üstüne getir
    monster.style.left = player.style.left;
}

function winGame() {
    stopAllAnimations();
    winSound.play();

    const msg = document.createElement("div");
    msg.className = "game-over-box";
    msg.innerHTML = `
        <div class="game-over-content" style="border-color: #2ecc71;">
            <h2 style="color: #2ecc71">🎉 SİSTEM KURTARILDI!</h2>
            <p>Tüm soruları bildin ve güvenli çıkış yaptın.</p>
            <button class="restart-btn" onclick="restart()">Yeniden Oyna</button>
        </div>
    `;
    document.getElementById("gameArea").appendChild(msg);
    player.style.opacity = "0";
}

function restart() {
    location.reload();
}

function escapeThroughDoor() {
    clearInterval(chaseInterval);
    monster.style.animationPlayState = "paused";

    const doorLeft = door.offsetLeft;
    const doorWidth = door.offsetWidth;
    const playerWidth = player.offsetWidth;
    
    // Oyuncuyu kapının ortasına götür
    const centerPos = doorLeft + (doorWidth / 2) - (playerWidth / 2);

    player.style.transition = "left 1s ease-in-out, opacity 0.5s ease 0.8s";
    player.style.left = centerPos + "px";

    setTimeout(() => {
        winGame();
    }, 1200);
}