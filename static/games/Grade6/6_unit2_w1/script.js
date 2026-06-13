const crosswordData = [
  {
    number: 1,
    word: "FORMÜL",
    direction: "across",
    x: 4,
    y: 6,
    clue: "Tablolama programında hesaplama yapmak için kullanılan ifade."
  },
  {
    number: 2,
    word: "GRAFİK",
    direction: "down",
    x: 4,
    y: 3,
    clue: "Verileri görsel olarak göstermeye yarayan araç."
  },
  {
    number: 3,
    word: "ARAYÜZ",
    direction: "across",
    x: 2,
    y: 5,
    clue: "Programda menü, sekme ve araçların bulunduğu kullanım ekranı."
  },
  {
    number: 4,
    word: "HÜCRE",
    direction: "down",
    x: 8,
    y: 5,
    clue: "Satır ve sütunun kesiştiği küçük kutucuk."
  },
  {
    number: 5,
    word: "SATIR",
    direction: "across",
    x: 0,
    y: 4,
    clue: "Tabloda yatay olarak ilerleyen bölüm."
  },
  {
    number: 6,
    word: "SÜTUN",
    direction: "down",
    x: 0,
    y: 4,
    clue: "Tabloda dikey olarak ilerleyen bölüm."
  },
  {
    number: 7,
    word: "EXCEL",
    direction: "across",
    x: 5,
    y: 9,
    clue: "Yaygın kullanılan bir tablolama programı."
  },
  {
    number: 8,
    word: "SAYFA",
    direction: "down",
    x: 1,
    y: 3,
    clue: "Tablolama dosyasında kullanılan çalışma alanlarından biri."
  },
  {
    number: 9,
    word: "TABLO",
    direction: "down",
    x: 2,
    y: 4,
    clue: "Bilgilerin satır ve sütunlarla düzenli gösterildiği yapı."
  },
  {
    number: 10,
    word: "VERİ",
    direction: "across",
    x: 6,
    y: 8,
    clue: "Tabloya girilen bilgi, sayı veya metin."
  }
];

const missions = [
  {
    title: "Görev 1: Doğru Programı Seç",
    question:
      "Öğretmen, öğrencilerin sınav notlarını listelemek ve ortalamalarını hesaplamak istiyor. Hangi program en uygundur?",
    options: ["Kelime işlemci programı", "Tablolama programı", "Çizim programı"],
    answer: "Tablolama programı",
    feedback:
      "Not listesi, ortalama hesaplama ve düzenli tablo oluşturma için tablolama programı kullanılır."
  },
  {
    title: "Görev 2: Uygun Özelliği Bul",
    question:
      "Bir sınıftaki öğrencilerin aylık kitap okuma sayılarını görsel olarak karşılaştırmak istiyoruz. Hangi özellik işimize yarar?",
    options: ["Grafik oluşturma", "Slayt geçişi ekleme", "Sayfa kenarlığı ayarlama"],
    answer: "Grafik oluşturma",
    feedback:
      "Grafikler sayısal verileri karşılaştırmayı ve yorumlamayı kolaylaştırır."
  },
  {
    title: "Görev 3: Arayüz Bilgisi",
    question:
      "Tablolama programında bir bilginin yazıldığı en küçük alan hangisidir?",
    options: ["Hücre", "Paragraf", "Slayt"],
    answer: "Hücre",
    feedback:
      "Hücre, satır ve sütunun kesiştiği alandır."
  },
  {
    title: "Görev 4: Verimlilik Kararı",
    question:
      "Bir market, haftalık satış miktarlarını kaydedip toplam satışını otomatik hesaplamak istiyor. Tablolama programı bu iş için neden verimlidir?",
    options: [
      "Çünkü hesaplamaları hızlı ve düzenli yapabilir.",
      "Çünkü sadece resim boyamak için kullanılır.",
      "Çünkü video düzenleme yapar."
    ],
    answer: "Çünkü hesaplamaları hızlı ve düzenli yapabilir.",
    feedback:
      "Tablolama programları verileri düzenler, hesaplar ve zamanı verimli kullanmayı sağlar."
  }
];

const gridSize = 14;

let grid = [];
let currentMission = 0;
let missionScore = 0;
let activeDirection = "across";

document.addEventListener("DOMContentLoaded", () => {
  initGrid();
  renderBoard();
  renderClues();
  setupNavigation();
});

function initGrid() {
  grid = [];

  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];

    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = null;
    }
  }

  crosswordData.forEach(item => {
    for (let i = 0; i < item.word.length; i++) {
      let row = item.y;
      let col = item.x;

      if (item.direction === "across") {
        col += i;
      } else {
        row += i;
      }

      if (!grid[row][col]) {
        grid[row][col] = {
          letter: item.word[i],
          numbers: []
        };
      }

      if (i === 0) {
        grid[row][col].numbers.push(item.number);
      }
    }
  });
}

function renderBoard() {
  const boardElement = document.getElementById("crossword-board");
  boardElement.innerHTML = "";

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cellDiv = document.createElement("div");
      cellDiv.className = "cell";

      if (grid[i][j]) {
        const input = document.createElement("input");

        input.maxLength = 1;
        input.dataset.row = i;
        input.dataset.col = j;
        input.dataset.answer = grid[i][j].letter;

        input.addEventListener("focus", () => highlightWord(i, j));

        if (grid[i][j].numbers.length > 0) {
          const numSpan = document.createElement("span");
          numSpan.className = "number";
          numSpan.innerText = grid[i][j].numbers.join(",");
          cellDiv.appendChild(numSpan);
        }

        cellDiv.appendChild(input);
      } else {
        cellDiv.classList.add("black-cell");
      }

      boardElement.appendChild(cellDiv);
    }
  }
}

function renderClues() {
  const acrossList = document.getElementById("across-clues");
  const downList = document.getElementById("down-clues");

  acrossList.innerHTML = "";
  downList.innerHTML = "";

  crosswordData.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.number}.</strong> ${item.clue}`;

    li.addEventListener("click", () => {
      highlightWordByItem(item);
    });

    if (item.direction === "across") {
      acrossList.appendChild(li);
    } else {
      downList.appendChild(li);
    }
  });
}

function highlightWord(row, col) {
  clearHighlights();

  const relatedItems = crosswordData.filter(item => {
    if (item.direction === "across") {
      return row === item.y && col >= item.x && col < item.x + item.word.length;
    } else {
      return col === item.x && row >= item.y && row < item.y + item.word.length;
    }
  });

  let selectedItem = relatedItems.find(item => item.direction === activeDirection);

  if (!selectedItem && relatedItems.length > 0) {
    selectedItem = relatedItems[0];
    activeDirection = selectedItem.direction;
  }

  if (selectedItem) {
    applyHighlightToItem(selectedItem);
  }
}

function highlightWordByItem(item) {
  clearHighlights();

  activeDirection = item.direction;
  applyHighlightToItem(item);

  const firstInput = document.querySelector(
    `input[data-row="${item.y}"][data-col="${item.x}"]`
  );

  if (firstInput) {
    firstInput.focus();
  }
}

function applyHighlightToItem(item) {
  for (let i = 0; i < item.word.length; i++) {
    let row = item.y;
    let col = item.x;

    if (item.direction === "across") {
      col += i;
    } else {
      row += i;
    }

    const input = document.querySelector(
      `input[data-row="${row}"][data-col="${col}"]`
    );

    if (input) {
      input.classList.add("word-highlight");
    }
  }
}

function clearHighlights() {
  document.querySelectorAll(".word-highlight").forEach(element => {
    element.classList.remove("word-highlight");
  });
}

function setupNavigation() {
  const inputs = document.querySelectorAll(".cell input");

  inputs.forEach(input => {
    input.addEventListener("keydown", event => {
      const row = parseInt(input.dataset.row);
      const col = parseInt(input.dataset.col);

      if (event.key === "ArrowRight") {
        event.preventDefault();
        activeDirection = "across";
        moveFocus(row, col, 1);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        activeDirection = "across";
        moveFocus(row, col, -1);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        activeDirection = "down";
        moveFocus(row, col, 1);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        activeDirection = "down";
        moveFocus(row, col, -1);
      }
    });

    input.addEventListener("keyup", event => {
      const row = parseInt(input.dataset.row);
      const col = parseInt(input.dataset.col);

      if (
        input.value.length === 1 &&
        event.key !== "Backspace" &&
        !event.key.startsWith("Arrow")
      ) {
        moveFocus(row, col, 1);
      }

      if (event.key === "Backspace" && input.value === "") {
        moveFocus(row, col, -1);
      }
    });

    input.addEventListener("input", function () {
      this.value = this.value.toLocaleUpperCase("tr-TR");
    });
  });
}

function moveFocus(row, col, direction) {
  let nextInput;

  if (activeDirection === "across") {
    nextInput = document.querySelector(
      `input[data-row="${row}"][data-col="${col + direction}"]`
    );
  } else {
    nextInput = document.querySelector(
      `input[data-row="${row + direction}"][data-col="${col}"]`
    );
  }

  if (nextInput) {
    nextInput.focus();

    if (direction === 1) {
      nextInput.select();
    }
  }
}

function checkAnswers() {
  const inputs = document.querySelectorAll(".cell input");
  let correctCount = 0;
  let filledCount = 0;

  inputs.forEach(input => {
    const userAnswer = input.value.toLocaleUpperCase("tr-TR");
    const correctAnswer = input.dataset.answer;

    if (userAnswer) {
      filledCount++;

      if (userAnswer === correctAnswer) {
        input.classList.add("correct");
        input.classList.remove("wrong");
        correctCount++;
      } else {
        input.classList.add("wrong");
        input.classList.remove("correct");
      }
    } else {
      input.classList.remove("correct", "wrong");
    }
  });

  const msgBox = document.getElementById("message-box");
  const total = inputs.length;
  const percentage = Math.round((correctCount / total) * 100);

  if (correctCount === total && filledCount === total) {
    msgBox.style.color = "#2eaf57";
    msgBox.innerText = "🎉 Kaçış Odası açıldı! Şimdi görev aşamasına geçebilirsin.";

    setTimeout(() => {
      openMissionSection();
    }, 1200);
  } else if (filledCount === 0) {
    msgBox.style.color = "#253156";
    msgBox.innerText = "Önce kutucukları doldurmalısın.";
  } else if (percentage >= 70) {
    msgBox.style.color = "#f08c00";
    msgBox.innerText = "Çok yaklaştın! Kırmızı kutuları kontrol ederek tekrar dene.";
  } else if (percentage >= 40) {
    msgBox.style.color = "#f08c00";
    msgBox.innerText = "Güzel başlangıç! İpuçlarını dikkatlice okuyup eksikleri tamamla.";
  } else {
    msgBox.style.color = "#e63946";
    msgBox.innerText = "Endişelenme! Satır, sütun, hücre ve formül kavramlarını tekrar düşün.";
  }
}

function resetGame() {
  const inputs = document.querySelectorAll(".cell input");

  inputs.forEach(input => {
    input.value = "";
    input.classList.remove("correct", "wrong", "word-highlight");
  });

  document.getElementById("message-box").innerText = "";
}

function openMissionSection() {
  document.getElementById("crossword-section").classList.add("hidden");
  document.getElementById("mission-section").classList.remove("hidden");

  document.getElementById("step-crossword").classList.remove("active");
  document.getElementById("step-mission").classList.add("active");

  currentMission = 0;
  missionScore = 0;
  renderMission();
}

function renderMission() {
  const mission = missions[currentMission];
  const missionCard = document.getElementById("mission-card");
  const missionOptions = document.getElementById("mission-options");
  const feedback = document.getElementById("mission-feedback");
  const nextBtn = document.getElementById("next-mission-btn");

  missionCard.innerHTML = `
    <h3>${mission.title}</h3>
    <p>${mission.question}</p>
  `;

  missionOptions.innerHTML = "";
  feedback.innerText = "";
  nextBtn.classList.add("hidden");

  mission.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.innerText = option;

    button.addEventListener("click", () => {
      checkMissionAnswer(button, option);
    });

    missionOptions.appendChild(button);
  });
}

function checkMissionAnswer(button, selectedOption) {
  const mission = missions[currentMission];
  const feedback = document.getElementById("mission-feedback");
  const nextBtn = document.getElementById("next-mission-btn");

  if (selectedOption === mission.answer) {
    missionScore++;
    button.classList.add("correct-option");

    feedback.style.color = "#2eaf57";
    feedback.innerText = `✅ Harika! ${mission.feedback}`;

    document.querySelectorAll(".option-btn").forEach(btn => {
      btn.disabled = true;
    });

    nextBtn.classList.remove("hidden");

    if (currentMission === missions.length - 1) {
      nextBtn.innerText = "Sonucu Gör";
    } else {
      nextBtn.innerText = "Sonraki Görev";
    }
  } else {
    button.classList.add("wrong-option");

    feedback.style.color = "#e63946";
    feedback.innerText =
      "❌ Bu cevap tam uygun olmadı. İpucunu tekrar düşün ve başka bir seçenek dene.";

    setTimeout(() => {
      button.classList.remove("wrong-option");
    }, 900);
  }
}

function nextMission() {
  currentMission++;

  if (currentMission < missions.length) {
    renderMission();
  } else {
    showResult();
  }
}

function showResult() {
  document.getElementById("mission-section").classList.add("hidden");
  document.getElementById("result-section").classList.remove("hidden");

  document.getElementById("step-mission").classList.remove("active");
  document.getElementById("step-result").classList.add("active");

  const resultIcon = document.getElementById("result-icon");
  const resultTitle = document.getElementById("result-title");
  const resultText = document.getElementById("result-text");
  const scoreText = document.getElementById("score-text");

  scoreText.innerText = `Görev puanın: ${missionScore} / ${missions.length}`;

  if (missionScore === missions.length) {
    resultIcon.innerText = "🏆";
    resultTitle.innerText = "Tablolama Uzmanı!";
    resultText.innerText =
      "Harika! Tablolama programlarının temel özelliklerini, kullanım alanlarını ve arayüz kavramlarını çok iyi anladın.";
  } else if (missionScore >= 3) {
    resultIcon.innerText = "🥇";
    resultTitle.innerText = "Dijital Verimlilik Kaşifi!";
    resultText.innerText =
      "Çok güzel ilerledin. Birkaç kavramı tekrar ettiğinde tablolama konusunda daha da güçleneceksin.";
  } else if (missionScore >= 2) {
    resultIcon.innerText = "🌟";
    resultTitle.innerText = "Tablo Yolcusu!";
    resultText.innerText =
      "İyi bir başlangıç yaptın. Hücre, satır, sütun, grafik ve formül kavramlarını tekrar inceleyebilirsin.";
  } else {
    resultIcon.innerText = "📚";
    resultTitle.innerText = "Tekrar Deneme Zamanı!";
    resultText.innerText =
      "Sorun değil! İpuçlarını tekrar okuyup oyunu yeniden oynarsan kavramları daha kolay hatırlarsın.";
  }
}

function restartAll() {
  document.getElementById("result-section").classList.add("hidden");
  document.getElementById("crossword-section").classList.remove("hidden");

  document.getElementById("step-result").classList.remove("active");
  document.getElementById("step-mission").classList.remove("active");
  document.getElementById("step-crossword").classList.add("active");

  currentMission = 0;
  missionScore = 0;

  resetGame();
}