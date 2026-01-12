document.addEventListener("DOMContentLoaded", () => {
  initNetworkGame();
});

function initNetworkGame() {
  // =========================
  // DOM Elementleri
  // =========================
  const stepSectionEl = document.getElementById("stepSection");
  const stepCounterEl = document.getElementById("stepCounter");
  const stepTitleEl = document.getElementById("stepTitle");
  const stepStoryEl = document.getElementById("stepStory");
  const optionsContainer = document.getElementById("optionsContainer");
  const feedbackEl = document.getElementById("feedback");
  const checkButton = document.getElementById("checkButton");
  const nextButton = document.getElementById("nextButton");
  const prevButton = document.getElementById("prevButton");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const sequenceHint = document.getElementById("sequenceHint");
  const sequenceOrder = document.getElementById("sequenceOrder");
  const resetSequenceButton = document.getElementById("resetSequenceButton");
  const gamePanel = document.querySelector(".game-panel");

  // Görsel alan
  const visualInnerEl = document.querySelector(".game-visual-inner");
  const visualCardEl = document.querySelector(".game-visual");
  const gameLayoutEl = document.querySelector(".game-layout");

  // Güvenlik kontrolü: sayfada gereken elementler yoksa sessizce çık
  if (
    !stepSectionEl ||
    !stepCounterEl ||
    !stepTitleEl ||
    !stepStoryEl ||
    !optionsContainer ||
    !feedbackEl ||
    !checkButton ||
    !nextButton ||
    !prevButton ||
    !progressBar ||
    !progressText ||
    !sequenceHint ||
    !sequenceOrder ||
    !resetSequenceButton ||
    !gamePanel ||
    !visualInnerEl ||
    !visualCardEl
  ) {
    console.warn("Network game: Gerekli DOM elementleri bulunamadı.");
    return;
  }

  // =========================
  // OYUN ADIMLARI
  // =========================
  const steps = [
    {
      id: 1,
      section: "Bölüm 1 • Ev Ağı (LAN)",
      visualTheme: "home",
      visualIcon: "🏠 💻 🔌",
      type: "sequence",
      title: "Evden Çıkış Yolu",
      story:
        "Paket, evdeki bilgisayarın içinde uyanıyor. İnternete çıkmak için önce evdeki donanımları doğru sırayla aşmalı.",
      options: ["Bilgisayar", "Modem", "Router"],
      correctOrder: ["Bilgisayar", "Modem", "Router"],
    },
    {
      id: 2,
      section: "Bölüm 1 • Ev Ağı (LAN)",
      visualTheme: "home",
      visualIcon: "🏢 🖨️",
      type: "single",
      title: "LAN Nasıl Bir Ağdır?",
      story: "Evin içine bakınca, cihazların birbirine yakın olduğunu görüyoruz. Bu yapıya ne denir?",
      options: [
        { id: "lan1", text: "Küçük alanları kapsayan yerel ağdır (LAN)." },
        { id: "lan2", text: "Dünyayı kapsayan geniş ağdır." },
        { id: "lan3", text: "Sadece bluetooth ile çalışır." },
      ],
      correctId: "lan1",
    },
    {
      id: 3,
      section: "Bölüm 2 • Kablosuz Ağ (WLAN)",
      visualTheme: "wifi",
      visualIcon: "📡",
      type: "single",
      title: "Sinyal Avı: Hangisi Kablosuz?",
      story: "Modemden çıkan görünmez dalgalar var. Bu bağlantı türü hangisidir?",
      options: [
        { id: "w1", text: "Wi-Fi bağlantısı" },
        { id: "w2", text: "Ethernet kablosu" },
      ],
      correctId: "w1",
    },
    {
      id: 4,
      section: "Bölüm 2 • Kablosuz Ağ (WLAN)",
      visualTheme: "wifi",
      visualIcon: "📱 📶 💻",
      type: "single",
      title: "WLAN Nasıl Bir Ağdır?",
      story: "Hava yoluyla iletişim kuran bu yerel ağa ne isim verilir?",
      options: [
        { id: "wl1", text: "Wireless LAN (Kablosuz Yerel Ağ)" },
        { id: "wl2", text: "Dünya Çapında Ağ" },
      ],
      correctId: "wl1",
    },
    {
      id: 5,
      section: "Bölüm 3 • Geniş Alan Ağı (WAN)",
      visualTheme: "wan",
      visualIcon: "🌍",
      type: "single",
      title: "Uzun Yolculuk: WAN",
      story: "Paket artık okyanusların altından geçen fiber kablolarda geziyor.",
      options: [
        { id: "wan1", text: "Ev içi küçük ağdır." },
        { id: "wan2", text: "Şehirleri ve ülkeleri bağlayan Geniş Alan Ağı'dır." },
      ],
      correctId: "wan2",
    },
    {
      id: 6,
      section: "Bölüm 3 • Geniş Alan Ağı (WAN)",
      visualTheme: "wan",
      visualIcon: "🌐 🏙️",
      type: "single",
      title: "LAN mı WAN mı?",
      story: "Küçük ofis ağı ile ülkeler arası ağ arasındaki fark nedir?",
      options: [
        { id: "lw1", text: "LAN yerel/küçük, WAN geniş/büyük alanları kapsar." },
        { id: "lw2", text: "İkisi de aynıdır." },
      ],
      correctId: "lw1",
    },
    {
      id: 7,
      section: "Bölüm 4 • Bulut Bilişim",
      visualTheme: "cloud",
      visualIcon: "☁️",
      type: "multi",
      title: "Buluta Neden Gideriz?",
      story:
        "Bilgilerimizi neden uzaktaki 'Bulut' sunuculara göndeririz? (Birden çok doğru cevap olabilir)",
      options: [
        { id: "b1", text: "Yedekleme ve güvenlik için." },
        { id: "b2", text: "Dosyalara her yerden erişmek için." },
        { id: "b3", text: "Bilgisayarı yavaşlatmak için." },
      ],
      correctIds: ["b1", "b2"],
    },
    {
      id: 8,
      section: "Bölüm 4 • Bulut Bilişim",
      visualTheme: "cloud",
      visualIcon: "🏢 💾",
      type: "single",
      title: "Bulut Nedir?",
      story: "Bulut aslında gökyüzünde midir?",
      options: [
        { id: "bc1", text: "Evet, su buharından oluşur." },
        { id: "bc2", text: "Hayır, internete bağlı devasa sunucu merkezleridir." },
      ],
      correctId: "bc2",
    },
    {
      id: 9,
      section: "Bölüm 5 • İnternet Adresleri",
      visualTheme: "wan",
      visualIcon: "🔗",
      type: "single",
      title: "Doğru Adresi Seç!",
      story: "MEB sitesine girmek için doğru adres yapısı hangisidir?",
      options: [
        { id: "url1", text: "https://www.meb.gov.tr" },
        { id: "url2", text: "www://meb.tr.gov" },
      ],
      correctId: "url1",
    },
    {
      id: 10,
      section: "Bölüm 5 • Web Tarayıcıları",
      visualTheme: "home",
      visualIcon: "🧭",
      type: "single",
      title: "Tarayıcı Ne İşe Yarar?",
      story: "Chrome, Edge veya Firefox ne işimize yarar?",
      options: [
        { id: "br1", text: "Web sayfalarını görüntülememizi sağlar." },
        { id: "br2", text: "İnterneti keser." },
      ],
      correctId: "br1",
    },
    {
      id: 11,
      section: "Bölüm 6 • Güvenilir Bilgi",
      visualTheme: "security",
      visualIcon: "🕵️‍♂️",
      type: "single",
      title: "Hangi Kaynak Güvenilir?",
      story: "İnternetteki her bilgi doğru mudur?",
      options: [
        { id: "src1", text: "Resmi (.gov, .edu) ve bilimsel siteler daha güvenilirdir." },
        { id: "src2", text: "Her gördüğümüze inanmalıyız." },
      ],
      correctId: "src1",
    },
    {
      id: 12,
      section: "Bölüm 7 • E-posta",
      visualTheme: "security",
      visualIcon: "📧",
      type: "single",
      title: "E-posta Adresi",
      story: "Resmi bir iletişim için hangi e-posta adresi uygundur?",
      options: [
        { id: "mail1", text: "kral_oyuncu_99@xmail.com" },
        { id: "mail2", text: "ad.soyad@okul.edu.tr" },
      ],
      correctId: "mail2",
    },
    {
      id: 13,
      section: "Bölüm 7 • Güvenlik",
      visualTheme: "security",
      visualIcon: "🛡️ 🔒",
      type: "multi",
      title: "Gizli Bilgiler",
      story:
        "E-postada veya internette neleri ASLA tanımadığımız kişilerle paylaşmamalıyız? (Birden çok doğru olabilir)",
      options: [
        { id: "em1", text: "Ev Adresi" },
        { id: "em2", text: "TC Kimlik No" },
        { id: "em3", text: "Şifreler" },
        { id: "em4", text: "Sevdiğimiz renk" },
      ],
      correctIds: ["em1", "em2", "em3"],
    },
  ];

  // =========================
  // STATE
  // =========================
  let currentStepIndex = 0;

  const history = new Array(steps.length).fill(null).map(() => ({
    selection: null,
    isAnswered: false,
    isCorrect: false,
  }));

  let selectedSingle = null;
  let selectedMulti = new Set();
  let selectedSequence = [];

  // =========================
  // Helpers
  // =========================
  function arraysEqual(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }

  function setsEqual(setA, setB) {
    if (!(setA instanceof Set) || !(setB instanceof Set)) return false;
    if (setA.size !== setB.size) return false;
    for (const val of setA) if (!setB.has(val)) return false;
    return true;
  }

  function showFeedback(isCorrect, message) {
    feedbackEl.textContent = message;
    feedbackEl.className = "feedback " + (isCorrect ? "feedback-success" : "feedback-error");
  }

  function updateProgress(correctCount, total) {
    const progressPercent = total === 0 ? 0 : (correctCount / total) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${correctCount} / ${total} doğru tamamlandı`;
  }

  function updateProgressOnCorrect() {
    const correctCount = history.filter((h) => h.isCorrect).length;
    updateProgress(correctCount, steps.length);
  }

  function updateSequenceOrderText() {
    if (selectedSequence.length === 0) {
      sequenceOrder.textContent = "Seçtiğin sıra: Henüz bir seçim yapmadın.";
    } else {
      sequenceOrder.textContent = "Seçtiğin sıra: " + selectedSequence.join(" → ");
    }
  }

  function updateResetButtonText(type) {
    resetSequenceButton.textContent = type === "sequence" ? "Sıralamayı Sıfırla" : "Cevabı Sıfırla";
  }

  // =========================
  // VISUAL STAGE
  // =========================
  function updateVisualStage(step) {
    // Tema class’ını sıfırla
    visualCardEl.className = "card game-visual";
    if (step.visualTheme) {
      visualCardEl.classList.add(`theme-${step.visualTheme}`);
    }

    let htmlContent = "";

    switch (step.visualTheme) {
      case "home":
        htmlContent = `
          <div class="visual-stage stage-enter">
            <div class="stage-bg"></div>
            <div class="stage-icon">${step.visualIcon || "🏠"}</div>
            <div class="cable-line"></div>
            <div class="stage-description">
              Ev Ağı (LAN)<br>
              <span style="font-size:0.9rem; opacity:0.8">Cihazlar yakın ve genelde kablolu/kısa mesafe.</span>
            </div>
          </div>
        `;
        break;

      case "wifi":
        htmlContent = `
          <div class="visual-stage stage-enter">
            <div class="signal-wave w1"></div>
            <div class="signal-wave w2"></div>
            <div class="signal-wave w3"></div>
            <div class="stage-icon" style="z-index:2; position:relative;">${step.visualIcon || "📡"}</div>
            <div class="stage-description">
              Kablosuz Ağ (WLAN)<br>
              <span style="font-size:0.9rem; opacity:0.8">Hava dalgalarıyla iletişim.</span>
            </div>
          </div>
        `;
        break;

      case "wan":
        htmlContent = `
          <div class="visual-stage stage-enter">
            <div class="planet-orbit"></div>
            <div class="stage-icon">${step.visualIcon || "🌍"}</div>
            <div class="stage-description" style="color:#fff;">
              Geniş Alan Ağı (WAN)<br>
              <span style="font-size:0.9rem; opacity:0.7">Şehirler/ülkeler arası iletişim.</span>
            </div>
          </div>
        `;
        break;

      case "cloud":
        htmlContent = `
          <div class="visual-stage stage-enter">
            <div class="upload-arrow">⬆️</div>
            <div class="stage-icon cloud-item">${step.visualIcon || "☁️"}</div>
            <div class="stage-description">
              Bulut Bilişim<br>
              <span style="font-size:0.9rem; opacity:0.8">Veriler uzak sunucularda.</span>
            </div>
          </div>
        `;
        break;

      case "security":
        htmlContent = `
          <div class="visual-stage stage-enter">
            <div class="shield-pulse"></div>
            <div class="stage-icon" style="z-index:2; position:relative;">${step.visualIcon || "🛡️"}</div>
            <div class="stage-description">
              Güvenlik & Gizlilik<br>
              <span style="font-size:0.9rem; opacity:0.8">Bilgilerini koruma altına al.</span>
            </div>
          </div>
        `;
        break;

      default:
        htmlContent = `
          <div class="visual-stage stage-enter">
            <div class="stage-icon">📦</div>
          </div>
        `;
    }

    visualInnerEl.innerHTML = htmlContent;
  }

  // =========================
  // RENDER OPTIONS
  // =========================
  function renderChoiceOptions(step, storedSelection) {
    if (step.type === "single" && storedSelection) {
      selectedSingle = storedSelection;
    } else if (step.type === "multi" && storedSelection) {
      selectedMulti = new Set(storedSelection);
    } else if (!history[currentStepIndex].isAnswered) {
      selectedSingle = null;
      selectedMulti = new Set();
    }

    step.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-button";
      btn.dataset.id = opt.id;

      const keySpan = document.createElement("span");
      keySpan.className = "option-key";
      keySpan.textContent = String.fromCharCode(65 + index);

      const textSpan = document.createElement("span");
      textSpan.className = "option-text";
      textSpan.textContent = opt.text;

      btn.append(keySpan, textSpan);

      const isSelectedSingle = step.type === "single" && selectedSingle === opt.id;
      const isSelectedMulti = step.type === "multi" && selectedMulti.has(opt.id);

      if (isSelectedSingle || isSelectedMulti) {
        btn.classList.add("option-selected");
        if (step.type === "multi") btn.classList.add("multi-selected");
      }

      btn.addEventListener("click", () => {
        if (history[currentStepIndex].isAnswered) return;

        feedbackEl.textContent = "";
        feedbackEl.className = "feedback";

        if (step.type === "single") {
          selectedSingle = opt.id;
          Array.from(optionsContainer.children).forEach((el) => el.classList.remove("option-selected"));
          btn.classList.add("option-selected");
        } else if (step.type === "multi") {
          if (selectedMulti.has(opt.id)) {
            selectedMulti.delete(opt.id);
            btn.classList.remove("option-selected", "multi-selected");
          } else {
            selectedMulti.add(opt.id);
            btn.classList.add("option-selected", "multi-selected");
          }
        }
      });

      optionsContainer.appendChild(btn);
    });
  }

  function renderSequenceOptions(step, storedSelection) {
    if (storedSelection) selectedSequence = [...storedSelection];
    else if (!history[currentStepIndex].isAnswered) selectedSequence = [];

    step.options.forEach((label, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-button";
      btn.dataset.value = label;

      const keySpan = document.createElement("span");
      keySpan.className = "option-key";
      keySpan.textContent = String.fromCharCode(65 + index);

      const textSpan = document.createElement("span");
      textSpan.className = "option-text";
      textSpan.textContent = label;

      btn.append(keySpan, textSpan);

      const seqIndex = selectedSequence.indexOf(label);
      if (seqIndex !== -1) {
        btn.classList.add("sequence-picked");
        btn.querySelector(".option-key").dataset.order = String(seqIndex + 1);
      }

      btn.addEventListener("click", () => {
        if (history[currentStepIndex].isAnswered) return;

        resetSequenceButton.hidden = false;
        updateResetButtonText("sequence");

        feedbackEl.textContent = "";
        feedbackEl.className = "feedback";

        const value = btn.dataset.value;
        if (!selectedSequence.includes(value)) {
          selectedSequence.push(value);
          btn.classList.add("sequence-picked");
          btn.querySelector(".option-key").dataset.order = String(selectedSequence.length);
          updateSequenceOrderText();
        }
      });

      optionsContainer.appendChild(btn);
    });

    updateSequenceOrderText();
  }

  // =========================
  // MARKING
  // =========================
  function markSingleChoices(step, isCorrect) {
    Array.from(optionsContainer.children).forEach((btn) => {
      const id = btn.dataset.id;
      btn.classList.remove("option-wrong", "option-correct");

      if (id === step.correctId) {
        // doğru şıkkı vurgula
        btn.classList.add("option-correct");
      } else if (!isCorrect && id === selectedSingle) {
        btn.classList.add("option-wrong");
      }
    });
  }

  function markMultiChoices(step, correctSet, isCorrect) {
    Array.from(optionsContainer.children).forEach((btn) => {
      const id = btn.dataset.id;
      btn.classList.remove("option-wrong", "option-correct");

      if (correctSet.has(id)) {
        // doğru şıkları göster
        btn.classList.add("option-correct");
      } else if (!isCorrect && selectedMulti.has(id) && !correctSet.has(id)) {
        // yanlış işaretlenenleri göster
        btn.classList.add("option-wrong");
      }

      if (selectedMulti.has(id)) btn.classList.add("multi-selected");
      else btn.classList.remove("multi-selected");
    });
  }

  function markSequenceChoices(step, isCorrect) {
    Array.from(optionsContainer.children).forEach((btn) => {
      btn.classList.remove("option-wrong", "option-correct");

      if (btn.classList.contains("sequence-picked")) {
        if (isCorrect) btn.classList.add("option-correct");
        else btn.classList.add("option-wrong");
      }
    });
  }

  // =========================
  // MAIN RENDER
  // =========================
  function renderStep() {
    if (currentStepIndex >= steps.length) {
      showFinishScreen();
      return;
    }

    const step = steps[currentStepIndex];
    const currentHistory = history[currentStepIndex];

    // Görsel panel güncelle
    updateVisualStage(step);

    // anim
    gamePanel.classList.remove("step-enter");
    void gamePanel.offsetWidth;
    gamePanel.classList.add("step-enter");

    // UI reset
    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";

    sequenceHint.hidden = step.type !== "sequence";
    sequenceOrder.hidden = step.type !== "sequence";
    resetSequenceButton.hidden = true;

    stepSectionEl.textContent = step.section;
    stepCounterEl.textContent = `Soru ${currentStepIndex + 1} / ${steps.length}`;
    stepTitleEl.textContent = step.title;
    stepStoryEl.textContent = step.story;

    updateProgress(history.filter((h) => h.isCorrect).length, steps.length);

    optionsContainer.innerHTML = "";
    sequenceOrder.textContent = "";

    if (step.type === "sequence") renderSequenceOptions(step, currentHistory.selection);
    else renderChoiceOptions(step, currentHistory.selection);

    // Butonlar
    prevButton.disabled = currentStepIndex === 0;

    if (currentHistory.isAnswered) {
      if (currentHistory.isCorrect) {
        nextButton.disabled = false;
        checkButton.disabled = true;
        checkButton.hidden = false;
        resetSequenceButton.hidden = true;
        showFeedback(true, "Bu soruyu doğru cevapladın 🎉");
      } else {
        nextButton.disabled = true;
        checkButton.disabled = false;
        checkButton.hidden = true;
        resetSequenceButton.hidden = false;
        updateResetButtonText(step.type === "sequence" ? "sequence" : "choice");
        showFeedback(false, "Bu soruyu yanlış cevaplamıştın. Tekrar dene.");
      }
    } else {
      nextButton.disabled = true;
      checkButton.disabled = false;
      checkButton.hidden = false;

      if (step.type === "sequence" && selectedSequence.length > 0) {
        resetSequenceButton.hidden = false;
        updateResetButtonText("sequence");
      }
    }

    // Eğer daha önce cevaplanmışsa işaretlemeleri göster
    if (currentHistory.isAnswered) {
      if (step.type === "single") {
        markSingleChoices(step, currentHistory.isCorrect);
      } else if (step.type === "multi") {
        markMultiChoices(step, new Set(step.correctIds), currentHistory.isCorrect);
      } else if (step.type === "sequence") {
        markSequenceChoices(step, currentHistory.isCorrect);
      }
    }
  }

  // =========================
  // CHECK BUTTON
  // =========================
  checkButton.addEventListener("click", () => {
    const step = steps[currentStepIndex];
    let isCorrect = false;
    let selectionData = null;

    if (step.type === "single") {
      if (!selectedSingle) {
        showFeedback(false, "Önce bir seçenek seçmelisin.");
        return;
      }
      isCorrect = selectedSingle === step.correctId;
      selectionData = selectedSingle;
      markSingleChoices(step, isCorrect);
    } else if (step.type === "multi") {
      if (selectedMulti.size === 0) {
        showFeedback(false, "En az bir seçenek işaretlemelisin.");
        return;
      }
      const correctSet = new Set(step.correctIds);
      isCorrect = setsEqual(selectedMulti, correctSet);
      selectionData = Array.from(selectedMulti);
      markMultiChoices(step, correctSet, isCorrect);
    } else if (step.type === "sequence") {
      if (selectedSequence.length !== step.options.length) {
        showFeedback(false, "Tüm adımları sırasıyla seçmelisin.");
        return;
      }
      isCorrect = arraysEqual(selectedSequence, step.correctOrder);
      selectionData = [...selectedSequence];
      markSequenceChoices(step, isCorrect);
    }

    history[currentStepIndex].isAnswered = true;
    history[currentStepIndex].selection = selectionData;
    history[currentStepIndex].isCorrect = isCorrect;

    if (isCorrect) {
      showFeedback(true, "Harika! Doğru cevap 🎉");
      nextButton.disabled = false;
      checkButton.disabled = true;
      checkButton.hidden = false;
      resetSequenceButton.hidden = true;
      updateProgressOnCorrect();
    } else {
      showFeedback(false, "Yanlış cevap. Tekrar dene.");
      nextButton.disabled = true;
      checkButton.hidden = true;
      resetSequenceButton.hidden = false;
      updateResetButtonText(step.type === "sequence" ? "sequence" : "choice");
    }
  });

  // =========================
  // NAV BUTTONS
  // =========================
  nextButton.addEventListener("click", () => {
    if (currentStepIndex < steps.length - 1) {
      currentStepIndex++;
      renderStep();
    } else if (currentStepIndex === steps.length - 1 && history[currentStepIndex].isCorrect) {
      showFinishScreen();
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      renderStep();
    }
  });

  // =========================
  // RESET BUTTON
  // =========================
  resetSequenceButton.addEventListener("click", () => {
    history[currentStepIndex].selection = null;
    history[currentStepIndex].isAnswered = false;
    history[currentStepIndex].isCorrect = false;

    selectedSingle = null;
    selectedMulti = new Set();
    selectedSequence = [];

    Array.from(optionsContainer.children).forEach((btn) => {
      btn.classList.remove(
        "sequence-picked",
        "option-wrong",
        "option-correct",
        "option-selected",
        "multi-selected"
      );
      const key = btn.querySelector(".option-key");
      if (key) key.removeAttribute("data-order");
    });

    updateSequenceOrderText();

    feedbackEl.textContent = "";
    feedbackEl.className = "feedback";

    nextButton.disabled = true;
    checkButton.disabled = false;
    checkButton.hidden = false;

    // reset butonu tekrar gizlensin
    resetSequenceButton.hidden = true;
  });

function showFinishScreen() {
  const totalSteps = steps.length;

  // Tüm paneli FULL SCREEN moda al
  gamePanel.innerHTML = "";
  gamePanel.className = "card game-panel final-screen";

  // Sol görsel paneli kapat
  visualCardEl.style.display = "none";

  // Layout'u merkezle
  if (gameLayoutEl) {
    gameLayoutEl.style.display = "flex";
    gameLayoutEl.style.justifyContent = "center";
    gameLayoutEl.style.alignItems = "center";
  }

  // Sertifika kartı
  const finalCard = document.createElement("div");
  finalCard.className = "final-card";

  const badge = document.createElement("span");
  badge.className = "step-section-pill";
  badge.textContent = "TEBRİKLER";

  const title = document.createElement("h2");
  title.className = "game-step-title";
  title.textContent = "Ağ Kahramanı Sertifikasını Kazandın! 🏅";

  const desc = document.createElement("p");
  desc.className = "game-story";
  desc.textContent =
    "Tüm soruları başarıyla tamamladın. Artık ileri seviye bir ağ kullanıcısısın!";

  const feedback = document.createElement("div");
  feedback.className = "feedback feedback-success";
  feedback.innerHTML = `
    <strong>Harika bir iş çıkardın!</strong><br>
    Bu seviyedeki tüm ağ kavramlarını başarıyla öğrendin.
  `;

  const restartBtn = document.createElement("button");
  restartBtn.className = "btn btn-primary";
  restartBtn.textContent = "Baştan Oyna";
  restartBtn.addEventListener("click", () => window.location.reload());

  finalCard.append(badge, title, desc, feedback, restartBtn);
  gamePanel.appendChild(finalCard);

  updateProgress(totalSteps, totalSteps);
}


  // İlk yükleme
  renderStep();
}
