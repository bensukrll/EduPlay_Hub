const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 40;
const COLS = 20;
const ROWS = 12;
const TOTAL_QUESTIONS = 8;

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

const questionPool = [
  {
    category: "Güvenlik Riski",
    text: "Tanımadığın bir kişi senden oyun hesabının şifresini istiyor. Bu durum hangi risktir?",
    answers: ["Kimlik / hesap hırsızlığı riski", "Donanım arızası", "Dosya sıkıştırma"],
    correct: 0,
    feedback: "Şifre paylaşmak hesabın ele geçirilmesine yol açabilir. Şifreler kimseyle paylaşılmamalıdır."
  },
  {
    category: "Güvenlik Önlemi",
    text: "Güçlü bir şifre için hangisi daha güvenlidir?",
    answers: ["123456", "Adın ve doğum yılın", "Harf, sayı ve sembol içeren uzun şifre"],
    correct: 2,
    feedback: "Güçlü şifreler uzun olmalı; harf, sayı ve sembol içermelidir."
  },
  {
    category: "Bilişim Suçu",
    text: "Bir kişinin sosyal medya hesabına izinsiz girmek hangi duruma örnektir?",
    answers: ["Bilişim suçu", "Yardımlaşma", "Dosya düzenleme"],
    correct: 0,
    feedback: "Başkasının hesabına izinsiz girmek bilişim suçu kapsamına girer."
  },
  {
    category: "Etik İhlal",
    text: "Arkadaşının fotoğrafını izinsiz paylaşmak hangi davranıştır?",
    answers: ["Etik ihlal", "Güvenlik önlemi", "Doğru kaynak kullanımı"],
    correct: 0,
    feedback: "Kişisel görseller izin alınmadan paylaşılmamalıdır. Bu hem etik olmayan hem de riskli bir davranıştır."
  },
  {
    category: "Bilişim Suçu Türü",
    text: "Sahte bir e-posta ile kullanıcıdan şifre istemeye ne denir?",
    answers: ["Oltalama / phishing", "Güncelleme", "Yedekleme"],
    correct: 0,
    feedback: "Oltalama saldırılarında kullanıcı kandırılarak şifre veya kişisel bilgi vermesi istenir."
  },
  {
    category: "Güvenlik Önlemi",
    text: "Şüpheli bir bağlantı içeren e-posta aldığında ne yapmalısın?",
    answers: ["Bağlantıya hemen tıklamalısın", "Güvenilirliğini kontrol edip tıklamamalısın", "Herkese göndermelisin"],
    correct: 1,
    feedback: "Şüpheli bağlantılar zararlı yazılım veya oltalama riski taşıyabilir."
  },
  {
    category: "Bilişim Etiği",
    text: "İnternetten aldığın bilgiyi ödevinde kullanırken doğru davranış hangisidir?",
    answers: ["Kaynak göstermek", "Aynen kopyalayıp kendi yazın gibi sunmak", "Kaynağı gizlemek"],
    correct: 0,
    feedback: "Başkasına ait bilgi kullanıldığında kaynak göstermek bilişim etiğine uygundur."
  },
  {
    category: "Bilişim Suçu",
    text: "Ücretli bir programı izinsiz ve korsan olarak indirmek neye örnektir?",
    answers: ["Telif hakkı ihlali", "Güvenli kullanım", "Veri yedekleme"],
    correct: 0,
    feedback: "Korsan yazılım kullanmak telif hakkı ihlalidir ve güvenlik riski de oluşturabilir."
  },
  {
    category: "Güvenlik Riski",
    text: "Bilgisayara zarar verebilen kötü amaçlı yazılımlar genel olarak nasıl adlandırılır?",
    answers: ["Zararlı yazılım", "Tarayıcı", "Klasör"],
    correct: 0,
    feedback: "Virüs, solucan ve casus yazılım gibi yazılımlar zararlı yazılım türleridir."
  },
  {
    category: "Güvenlik Önlemi",
    text: "Zararlı yazılımlara karşı hangi önlem alınabilir?",
    answers: ["Antivirüs kullanmak ve güncel tutmak", "Şifreyi herkesle paylaşmak", "Her dosyayı indirmek"],
    correct: 0,
    feedback: "Güncel antivirüs ve dikkatli indirme alışkanlığı cihaz güvenliğini artırır."
  },
  {
    category: "Bilişim Suçu Türü",
    text: "Bir kişinin özel bilgilerini izinsiz ele geçirip kullanmak hangi suça örnektir?",
    answers: ["Kimlik hırsızlığı", "Dosya adlandırma", "Ekran parlaklığı ayarlama"],
    correct: 0,
    feedback: "Kişisel bilgilerin izinsiz kullanılması kimlik hırsızlığına yol açabilir."
  },
  {
    category: "Etik İhlal Değerlendirme",
    text: "Sınıf grubunda bir arkadaşınla alay eden mesajlar paylaşmak nasıl değerlendirilir?",
    answers: ["Siber zorbalık", "Eğlenceli iletişim", "Dosya paylaşımı"],
    correct: 0,
    feedback: "Kişiyi rahatsız eden, küçük düşüren çevrim içi davranışlar siber zorbalıktır."
  },
  {
    category: "Güvenlik Önlemi",
    text: "Siber zorbalığa uğrayan bir öğrenci ilk olarak ne yapmalıdır?",
    answers: ["Kanıtları saklayıp güvenilir bir yetişkine bildirmeli", "Aynı şekilde cevap vermeli", "Herkese yaymalı"],
    correct: 0,
    feedback: "Siber zorbalıkta ekran görüntüsü gibi kanıtları saklamak ve güvenilir bir yetişkinden yardım almak önemlidir."
  },
  {
    category: "Güvenlik Riski",
    text: "Herkese açık Wi-Fi ağlarında banka şifresi girmek neden risklidir?",
    answers: ["Bilgiler ele geçirilebilir", "İnternet hızlanır", "Şifre güçlenir"],
    correct: 0,
    feedback: "Herkese açık ağlarda kişisel bilgiler üçüncü kişiler tarafından izlenebilir."
  },
  {
    category: "Güvenlik Önlemi",
    text: "Hesabını daha güvenli yapmak için şifre dışında hangi yöntem kullanılabilir?",
    answers: ["İki aşamalı doğrulama", "Şifreyi deftere açıkça yazma", "Şifreyi arkadaşına söyleme"],
    correct: 0,
    feedback: "İki aşamalı doğrulama, hesaba girişte ek güvenlik sağlar."
  },
  {
    category: "Etik İhlal",
    text: "Bir arkadaşının dosyasını izinsiz silmek nasıl bir davranıştır?",
    answers: ["Etik dışı ve zarar verici", "Güvenli davranış", "Yardımseverlik"],
    correct: 0,
    feedback: "Başkasının dosyalarına izinsiz müdahale etmek etik değildir ve ciddi sonuçlar doğurabilir."
  },
  {
    category: "Bilişim Suçu",
    text: "Bir web sitesini bilerek çalışamaz hâle getirmeye çalışmak hangi duruma örnektir?",
    answers: ["Siber saldırı", "Dosya yedekleme", "Kaynak gösterme"],
    correct: 0,
    feedback: "Sistemleri bilerek bozmak veya erişilemez hâle getirmek bilişim suçu olabilir."
  },
  {
    category: "Güvenlik Önlemi",
    text: "Önemli dosyaları kaybetmemek için hangi önlem alınmalıdır?",
    answers: ["Yedekleme yapmak", "Dosyaları silmek", "Şifreyi kaldırmak"],
    correct: 0,
    feedback: "Yedekleme, veri kaybı riskine karşı alınabilecek temel güvenlik önlemlerindendir."
  },
  {
    category: "Risk Değerlendirme",
    text: "Bir uygulama gereksiz yere konum, kamera ve rehber erişimi istiyorsa ne yapılmalıdır?",
    answers: ["İzinler dikkatle kontrol edilmelidir", "Tüm izinler hemen verilmelidir", "Uygulama herkese önerilmelidir"],
    correct: 0,
    feedback: "Uygulama izinleri kişisel veri güvenliği açısından dikkatle değerlendirilmelidir."
  },
  {
    category: "Bilişim Etiği",
    text: "Bir haberi doğrulamadan paylaşmak neden yanlıştır?",
    answers: ["Yanlış bilginin yayılmasına neden olabilir", "İnterneti hızlandırır", "Şifreyi güçlendirir"],
    correct: 0,
    feedback: "Doğrulanmamış bilgileri paylaşmak dijital ortamda sorumluluk bilincine aykırıdır."
  }
];

let questions = shuffleArray([...questionPool]).slice(0, TOTAL_QUESTIONS);

let player = {
  x: TILE_SIZE * 1.5,
  y: TILE_SIZE * 1.5,
  size: 24,
  speed: 3.6,
  dx: 0,
  dy: 0
};

let enemies = [
  { x: TILE_SIZE * 18, y: TILE_SIZE * 1, dx: -1.1, dy: 0 },
  { x: TILE_SIZE * 9, y: TILE_SIZE * 5, dx: 1.1, dy: 0 },
  { x: TILE_SIZE * 2, y: TILE_SIZE * 9, dx: 1.1, dy: 0 }
];

const possibleLocations = [
  { x: 2 * TILE_SIZE, y: 2 * TILE_SIZE },
  { x: 9 * TILE_SIZE, y: 2 * TILE_SIZE },
  { x: 15 * TILE_SIZE, y: 2 * TILE_SIZE },
  { x: 8 * TILE_SIZE, y: 5 * TILE_SIZE },
  { x: 2 * TILE_SIZE, y: 9 * TILE_SIZE },
  { x: 9 * TILE_SIZE, y: 9 * TILE_SIZE },
  { x: 14 * TILE_SIZE, y: 8 * TILE_SIZE }
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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function isPathReachable(startCol, startRow, targetCol, targetRow) {
  let queue = [[startCol, startRow]];
  let visited = new Set();
  visited.add(`${startCol},${startRow}`);

  while (queue.length > 0) {
    let [c, r] = queue.shift();

    if (c === targetCol && r === targetRow) return true;

    const dirs = [[0,1], [0,-1], [1,0], [-1,0]];

    for (let [dc, dr] of dirs) {
      let nc = c + dc;
      let nr = r + dr;

      if (
        nc >= 0 &&
        nc < COLS &&
        nr >= 0 &&
        nr < ROWS &&
        mapDesign[nr][nc] === 0 &&
        !visited.has(`${nc},${nr}`)
      ) {
        visited.add(`${nc},${nr}`);
        queue.push([nc, nr]);
      }
    }
  }

  return false;
}

function loadQuestion() {
  hideFeedback();

  if (currentQIndex >= questions.length) {
    gameOver(true);
    return;
  }

  isLevelTransitioning = true;

  const q = questions[currentQIndex];

  document.getElementById('question-text').innerText = q.text;
  document.getElementById('category-text').innerText = "Kategori: " + q.category;

  let indices = [0, 1, 2];
  shuffleArray(indices);

  currentLevelAnswers = indices.map(i => ({
    text: q.answers[i],
    isCorrect: i === q.correct,
    feedback: q.feedback
  }));

  let shuffledLocs = shuffleArray([...possibleLocations]);
  activeAnswerZones = [];

  const SAFE_DISTANCE = 120;

  let pCol = Math.floor(player.x / TILE_SIZE);
  let pRow = Math.floor(player.y / TILE_SIZE);

  for (let loc of shuffledLocs) {
    let dist = Math.hypot(loc.x - player.x, loc.y - player.y);

    if (dist > SAFE_DISTANCE) {
      let tCol = Math.floor(loc.x / TILE_SIZE);
      let tRow = Math.floor(loc.y / TILE_SIZE);

      if (isPathReachable(pCol, pRow, tCol, tRow)) {
        activeAnswerZones.push({
          x: loc.x,
          y: loc.y,
          w: 4.5 * TILE_SIZE,
          h: 1.8 * TILE_SIZE,
          id: activeAnswerZones.length
        });
      }
    }

    if (activeAnswerZones.length === 3) break;
  }

  updateAnswerVisuals();

  setTimeout(() => {
    isLevelTransitioning = false;
  }, 800);
}

function updateAnswerVisuals() {
  activeAnswerZones.forEach((zone, index) => {
    const btn = document.getElementById(`btn-answer-${index}`);

    if (btn) {
      btn.style.left = zone.x + 'px';
      btn.style.top = zone.y + 'px';
      btn.style.width = zone.w + 'px';
      btn.style.height = zone.h + 'px';

      btn.innerHTML = currentLevelAnswers[index].text;
      btn.className = 'spaceship-answer';
      btn.onclick = () => checkAnswer(index);
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (isGameOver) return;

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
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
    { x: newX - player.size / 2 + margin, y: newY - player.size / 2 + margin },
    { x: newX + player.size / 2 - margin, y: newY - player.size / 2 + margin },
    { x: newX - player.size / 2 + margin, y: newY + player.size / 2 - margin },
    { x: newX + player.size / 2 - margin, y: newY + player.size / 2 - margin }
  ];

  for (let corner of corners) {
    let col = Math.floor(corner.x / TILE_SIZE);
    let row = Math.floor(corner.y / TILE_SIZE);

    if (
      row < 0 ||
      row >= ROWS ||
      col < 0 ||
      col >= COLS ||
      mapDesign[row][col] === 1
    ) {
      return true;
    }
  }

  return false;
}

function update() {
  if (isGameOver) return;

  if (!checkWallCollision(player.x + player.dx, player.y)) {
    player.x += player.dx;
  }

  if (!checkWallCollision(player.x, player.y + player.dy)) {
    player.y += player.dy;
  }

  enemies.forEach(enemy => {
    let nextX = enemy.x + enemy.dx;
    let nextY = enemy.y + enemy.dy;
    let col = Math.floor(nextX / TILE_SIZE);
    let row = Math.floor(nextY / TILE_SIZE);

    if (
      row < 0 ||
      row >= ROWS ||
      col < 0 ||
      col >= COLS ||
      mapDesign[row][col] === 1
    ) {
      enemy.dx *= -1;
      enemy.dy *= -1;
    } else {
      enemy.x = nextX;
      enemy.y = nextY;
    }

    let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    if (dist < player.size + 5 && !playerInvulnerable) {
      loseLife();
      resetPlayerPosition();
    }
  });

  if (!isLevelTransitioning) {
    activeAnswerZones.forEach((zone, index) => {
      if (
        player.x > zone.x &&
        player.x < zone.x + zone.w &&
        player.y > zone.y &&
        player.y < zone.y + zone.h
      ) {
        checkAnswer(index);
      }
    });
  }

  draw();
  requestAnimationFrame(update);
}

function checkAnswer(zoneIndex) {
  if (isProcessingAnswer || isLevelTransitioning) return;

  isProcessingAnswer = true;

  let selectedAnswer = currentLevelAnswers[zoneIndex];
  let btn = document.getElementById(`btn-answer-${zoneIndex}`);

  if (selectedAnswer.isCorrect) {
    if (btn) btn.classList.add('spaceship-correct');

    score += 100;
    document.getElementById('score').innerText = score;

    showFeedback("Doğru!", selectedAnswer.feedback);

    setTimeout(() => {
      currentQIndex++;
      document.getElementById('level').innerText = Math.min(currentQIndex + 1, TOTAL_QUESTIONS);
      loadQuestion();
      isProcessingAnswer = false;
    }, 1500);

  } else {
    if (btn) btn.classList.add('spaceship-wrong');

    showFeedback(
      "Tekrar düşün!",
      "Bu seçenek doğru değil. Can kaybetmedin, ipucunu oku ve başka bir cevabı dene."
    );

    setTimeout(() => {
      if (btn) btn.classList.remove('spaceship-wrong');
      isProcessingAnswer = false;
    }, 1200);
  }
}

function showFeedback(title, text) {
  const panel = document.getElementById('feedback-panel');

  document.getElementById('feedback-title').innerText = title;
  document.getElementById('feedback-text').innerText = text;

  panel.classList.remove('hidden');
}

function hideFeedback() {
  document.getElementById('feedback-panel').classList.add('hidden');
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

  showFeedback("Dikkat!", "Canavara yakalandın. Başlangıç noktasına döndün.");

  if (lives <= 0) {
    setTimeout(() => gameOver(false), 600);
  } else {
    setTimeout(() => {
      playerInvulnerable = false;
    }, 1500);
  }
}

function resetPlayerPosition() {
  player.x = TILE_SIZE * 1.5;
  player.y = TILE_SIZE * 1.5;
  player.dx = 0;
  player.dy = 0;
}

function gameOver(win) {
  isGameOver = true;

  const screen = document.getElementById('game-over-screen');
  const title = document.getElementById('game-over-title');
  const finalMessage = document.getElementById('final-message');

  screen.classList.remove('hidden');
  document.getElementById('final-score').innerText = "PUAN: " + score;

  if (win) {
    title.innerText = "TEBRİKLER! DİJİTAL GÜVENLİK UZMANI OLDUN! 🛡️";
    title.style.color = "#ffd700";
    finalMessage.innerText = "Güvenlik risklerini tanıdın, doğru önlemleri seçtin ve bilişim etiğiyle bilişim suçlarını ayırt ettin.";
  } else {
    title.innerText = "OYUN BİTTİ";
    title.style.color = "#ff3333";
    finalMessage.innerText = "Tekrar dene! Canavara daha dikkatli yaklaş ve güvenlik sorularını çözerek ilerle.";
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
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🤖", player.x, player.y);
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1.0;

  enemies.forEach(enemy => {
    ctx.font = "34px Arial";
    ctx.fillText("👾", enemy.x, enemy.y);
  });
}

initGame();