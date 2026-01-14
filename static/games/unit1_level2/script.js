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
    { q: "Monitör giriş birimidir.", a: false },
    { q: "Hard disk bilgisayarda verilerin kalıcı olarak saklandığı birimdir.", a: true },
    { q: "İşletim sistemi bilgisayar donanımını yönetir.", a: true },
    { q: "RAM dolduğunda bilgisayarın hızı artar.", a: false },
    { q: "Yazılım olmadan bilgisayar çalışamaz.", a: true },
    { q: "USB bellek bir depolama birimidir.", a: true },
];

let current = 0;
let chaseInterval = null;
let wrongCount = 0;

let monsterSpeed = 0.55;    
const monsterSpeedInc = 0.08; 

let timeLeft = 60;
let timerInterval = null;

let isGameOver = false;      

let step = 60;               
let startX = 200;            

const gameContainer = document.querySelector('.game-container');
const player = document.getElementById("player");
const monster = document.getElementById("monster");
const door = document.getElementById("door");
const questionText = document.getElementById("question");
const questionBox = document.getElementById("questionBox");
const startScreen = document.getElementById("startScreen");

const monsterRoar = document.getElementById("monsterRoar");
const winSound = document.getElementById("winSound");

// Başlangıç konumları
player.style.left = startX + "px";
if (!monster.style.left) monster.style.left = "-200px";

questionText.innerText = questions[current].q;

/* ===================== */
function startGame() {
    startScreen.style.display = "none";
    questionBox.style.display = "block";

    // Timer UI
    const timerEl = document.getElementById("time");
    if (timerEl) timerEl.innerText = timeLeft;

    // Adım hesaplama
    const doorCenter = door.offsetLeft + (door.offsetWidth / 2) - (player.offsetWidth / 2);
    const totalDistance = Math.max(300, doorCenter - startX); 
    step = Math.floor(totalDistance / questions.length);

    // ✅ ESKİ DOSYADAKİ GİBİ: Play State'i Running Yapıyoruz
    // Bu yöntem gönderdiğin örnekteki gibi çalışır.
    player.style.animationPlayState = "running";
    monster.style.animationPlayState = "running";
    gameContainer.style.animationPlayState = "running"; // Arka plan da aksın

    startChase();
    startTimer();
}

/* ===================== */
function startTimer() {
    timerInterval = setInterval(() => {
        if (isGameOver) return;

        timeLeft--;

        const timerEl = document.getElementById("time");
        if (timerEl) timerEl.innerText = timeLeft;

        if (timeLeft <= 0) {
            monsterRoar.play();
            loseGame("⏱ Süre doldu!");
        }
    }, 1000);
}

/* ===================== */
function startChase() {
    chaseInterval = setInterval(() => {
        if (isGameOver) return;

        let monsterPos = parseFloat(monster.style.left || -200);
        let playerPos = parseFloat(player.style.left);

        monster.style.left = (monsterPos + monsterSpeed) + "px";

        if (monsterPos + 120 >= playerPos) {
            monsterRoar.play();
            loseGame("Canavar seni yakaladı!");
        }
    }, 50);
}

/* ===================== */
function answer(userAnswer) {
    if (isGameOver) return;

    const correct = (userAnswer === questions[current].a);

    if (correct) {
        wrongCount = 0;
        current++;

        let currentLeft = parseInt(player.style.left);
        player.style.left = (currentLeft + step) + "px";

        monsterSpeed += monsterSpeedInc;

        if (current >= questions.length) {
            questionBox.style.display = "none";
            escapeThroughDoor();
            return;
        }
        questionText.innerText = questions[current].q;

    } else {
        wrongCount++;

        let monsterPos = parseInt(monster.style.left || -200);
        monster.style.left = (monsterPos + 60) + "px";

        gameContainer.style.transform = "translateX(6px)";
        setTimeout(() => gameContainer.style.transform = "translateX(0)", 120);

        monsterRoar.play();

        if (wrongCount >= 3) {
            loseGame("Çok fazla yanlış yaptın!");
        }
    }
}

/* ===================== */
function stopAll() {
    clearInterval(chaseInterval);
    clearInterval(timerInterval);
    chaseInterval = null;
    timerInterval = null;

    // ✅ ESKİ DOSYADAKİ GİBİ: Play State'i Paused Yapıyoruz
    player.style.animationPlayState = "paused";
    monster.style.animationPlayState = "paused";
    gameContainer.style.animationPlayState = "paused";
}

/* ===================== */
function loseGame(reason = "") {
    if (isGameOver) return; 
    isGameOver = true;

    stopAll();
    questionBox.style.display = "none";

    const old = document.querySelector(".game-over-box");
    if (old) old.remove();

    const msg = document.createElement("div");
    msg.className = "game-over-box";
    msg.innerHTML = `
        <div class="game-over-content" style="border-color:#e74c3c">
            <h2 style="color:#e74c3c">❌ YAKALANDIN</h2>
            <p>${reason}</p>
            <button class="restart-btn" onclick="restart()">Tekrar Dene</button>
        </div>
    `;
    document.getElementById("gameArea").appendChild(msg);

    monster.style.left = player.style.left;
}

/* ===================== */
function winGame() {
    if (isGameOver) return; 
    isGameOver = true;

    stopAll();
    winSound.play();

    const old = document.querySelector(".game-over-box");
    if (old) old.remove();

    const msg = document.createElement("div");
    msg.className = "game-over-box";
    msg.innerHTML = `
        <div class="game-over-content" style="border-color:#2ecc71">
            <h2 style="color:#2ecc71">🎉 SİSTEM KURTARILDI!</h2>
            <p>Tüm soruları doğru cevapladın.</p>
            <button class="restart-btn" onclick="restart()">Yeniden Oyna</button>
        </div>
    `;
    document.getElementById("gameArea").appendChild(msg);

    player.style.opacity = "0";
}

/* ===================== */
function escapeThroughDoor() {
    stopAll(); // Animasyonları durdur

    const doorLeft = door.offsetLeft;
    const centerPos = doorLeft + door.offsetWidth / 2 - player.offsetWidth / 2;

    player.style.transition = "left 0.8s ease-in-out, opacity 0.5s ease 0.6s";
    player.style.left = centerPos + "px";

    setTimeout(() => {
        player.style.opacity = "0";
    }, 650);

    setTimeout(winGame, 1200);
}

/* ===================== */
function restart() {
    location.reload();
}