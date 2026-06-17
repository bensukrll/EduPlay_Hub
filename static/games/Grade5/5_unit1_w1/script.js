const questionPool = [
    // 🟢 KOLAY SEVİYE
    { q: "Bilgisayar, tablet veya telefonun dokunabildiğimiz fiziksel parçalarına donanım denir.", a: true },
    { q: "EBA, WhatsApp ve oyunlar gibi bilgisayarın içindeki programlara veri denir.", a: false },
    { q: "Okullardaki Akıllı Tahtalar ve e-Okul sistemi, bilişim teknolojilerinin eğitim alanına girer.", a: true },
    { q: "Hastane randevusu aldığımız MHRS sistemi, bilişim teknolojilerinin ulaşım alanına girer.", a: false },
    { q: "Yol tarifi aldığımız navigasyon cihazları ulaşım alanında hayatımızı kolaylaştırır.", a: true },
    { q: "Dünyanın öbür ucuna saniyeler içinde mesaj göndermek, teknolojinin üretim alanına örnektir.", a: false },
    { q: "İçinde dijital bir sistem barındırmayan klasik kurşun kalem, bir bilişim teknolojisi ürünü değildir.", a: true },
    { q: "Market kasalarında ürün barkodunu okutarak fiyat çıkaran sistemler güvenlik alanına girer.", a: false },

    // 🟡 ORTA SEVİYE
    { q: "İlk icat edilen bilgisayarlar, günümüzdeki bilgisayarlara göre çok daha küçük ve hızlıydı.", a: false },
    { q: "Eskiden günler süren mektup yerine bugün e-posta kullanılması, iletişimin hızlandığını gösterir.", a: true },
    { q: "Fatura ödemelerini bankaya gitmeden telefon uygulamasından yapmak bankacılık/finans alanına girer.", a: true },
    { q: "Sokakları izleyerek hırsızlık gibi olayları engelleyen MOBESE kameraları sağlık alanına aittir.", a: false },
    { q: "Akıllı telefonların hem müzik çalıp hem fotoğraf çekebilmesi, eski cihazların tek çatıda birleştiğini gösterir.", a: true },
    { q: "Fabrikalarda araba montajı yapan bilgisayar programlı robot kollar, sanayi/üretim alanına örnektir.", a: true },
    { q: "Vatandaşların devlet işlerini internetten hallettiği platforma e-Okul denir.", a: false },
    { q: "Eskiden fotoğrafların basılması günlerce sürerken bugün anında görebilmemiz, fotoğraf çekme amacımızı tamamen değiştirmiştir.", a: false },
    { q: "Toprağın nemini ölçüp otomatik sulama yapan akıllı fıskiyeler, tarım alanına aittir.", a: true },

    // 🔴 ZOR SEVİYE
    { q: "Bilgisayara girilen ham gerçeklere bilgi, işlenmiş ve anlamlı hale gelmiş şekline ise veri denir.", a: false },
    { q: "Geçmişten günümüze bilişim teknolojisi araçlarının boyutları küçülürken, hızları ve kapasiteleri artmıştır.", a: true },
    { q: "İnternette sadece eğlence için komik kedi videoları izlemek, teknolojinin eğitim alanına girer.", a: false },
    { q: "Bir cihazın bilişim teknolojisi sayılması için bilgiyi toplama, işleme, saklama veya iletme özelliklerinden en az birini yapması gerekir.", a: true },
    { q: "Eskiden kütüphanede kitap aramak ile bugün Google'da arama yapmak arasındaki benzerlik, ikisinin de bilgiye ulaşmayı sağlamasıdır.", a: true },
    { q: "Bilgisayarların bilgi alışverişi yapmak ve yazıcıyı paylaşmak için birbirine bağlanmasıyla oluşan sisteme bilgisayar ağı denir.", a: true },
    { q: "Depolama araçlarının gelişimi, insanların artık daha az bilgi sakladığını gösterir.", a: false },
    { q: "Bir Sanal Gerçeklik gözlüğü, kullanım amacına göre hem eğitim hem de eğlence alanına dahil edilebilir.", a: true }
];

// 25 soruluk havuzdan rastgele 10 soru seçer
const questions = questionPool
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

let current = 0;
let step = 100; // İlerleme miktarı
let monsterSpeed = 0.5;
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

    // -----------------------
    // PUANI DATABASE'E GÖNDER
    // -----------------------
    const finalScore = Math.round((current / questions.length) * 100); // 0-100 arası skor

    fetch("/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // session cookie gönderimi
        body: JSON.stringify({
            game_key: "5_unit1_w1", // GAME_INFO ile eşleşmeli
            score: finalScore
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) console.log("Skor kaydedildi:", finalScore, data);
        else console.warn("Skor kaydedilemedi:", data.error);
    })
    .catch(err => console.error("Fetch hatası:", err));
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