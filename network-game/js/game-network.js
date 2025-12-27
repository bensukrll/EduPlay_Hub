// js/game-network.js (Kod önceki revizyondan aynıdır)

document.addEventListener("DOMContentLoaded", () => {
    initNetworkGame();
});

function initNetworkGame() {
    // DOM Elementleri
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

    // OYUN ADIMLARI (Orijinal veri korunmuştur)
    const steps = [
        // Adımlarınızın tamamını buraya yapıştırın (13 soru)
        {
            id: 1,
            section: "Bölüm 1 • Ev Ağı (LAN)",
            type: "sequence",
            title: "Evden Çıkış Yolu",
            story:
                "Paket, evdeki bilgisayarın içinde uyanıyor. Dış dünyaya çıkıp internete bağlanmak istiyor. " +
                "Ama önce ev ağındaki cihazlardan doğru sırayla geçmesi gerekiyor. Yanlış cihaza giderse yolunu kaybedebilir. " +
                "Evden internete çıkmak için hangi sırayı izlemelidir?",
            options: ["Bilgisayar", "Modem", "Router"],
            correctOrder: ["Bilgisayar", "Modem", "Router"],
        },
        {
            id: 2,
            section: "Bölüm 1 • Ev Ağı (LAN)",
            type: "single",
            title: "LAN Nasıl Bir Ağdır?",
            story:
                "Paket, evin etrafına bakınca aslında küçük bir alan olduğunu fark ediyor. " +
                "Ev ağı, yalnızca bu evdeki cihazları birbirine bağlıyor. Bu tür ağlara ne ad verildiğini hatırlıyor musun?",
            options: [
                {
                    id: "lan1",
                    text: "Küçük alanları kapsayan yerel ağdır (ev, okul, ofis gibi).",
                },
                {
                    id: "lan2",
                    text: "Ülkeleri ve kıtaları kapsayan çok geniş ağdır.",
                },
                {
                    id: "lan3",
                    text: "Sadece kablosuz çalışan ağ türüdür.",
                },
            ],
            correctId: "lan1",
        },
        {
            id: 3,
            section: "Bölüm 2 • Kablosuz Ağ (WLAN)",
            type: "single",
            title: "Sinyal Avı: Hangisi Kablosuz?",
            story:
                "Paket, modemden çıkan farklı bağlantılara bakıyor. Bazı kablolar, bazı da görünmez dalgalar var. " +
                "Kablosuz çalışan bağlantı türünü seçmesine yardım et.",
            options: [
                { id: "w1", text: "Wi-Fi bağlantısı" },
                { id: "w2", text: "Ethernet (RJ-45) kablosu" },
                { id: "w3", text: "Yazıcıya giden USB kablosu" },
            ],
            correctId: "w1",
        },
        {
            id: 4,
            section: "Bölüm 2 • Kablosuz Ağ (WLAN)",
            type: "single",
            title: "WLAN Nasıl Bir Ağdır?",
            story:
                "Paket, havada dolaşan görünmez dalgalarla taşınıyor. 'Demek ki bu ağda kablo yok' diye düşünüyor. " +
                "Peki WLAN ne tür bir ağdır?",
            options: [
                { id: "wl1", text: "Kablosuz çalışan yerel ağdır." },
                { id: "wl2", text: "Sadece ülkeler arasında kullanılan ağdır." },
                { id: "wl3", text: "Hiçbir cihazı birbirine bağlamayan hayali bir ağdır." },
            ],
            correctId: "wl1",
        },
        {
            id: 5,
            section: "Bölüm 3 • Geniş Alan Ağı (WAN)",
            type: "single",
            title: "Uzun Yolculuk: WAN Ne Kadar Geniş?",
            story:
                "Paket artık evden çıktı, şehirler ve ülkeler arasında dolaşan kablolara ulaştı. " +
                "Bu kadar büyük bir ağı tanımlayan kavram hangisidir?",
            options: [
                {
                    id: "wan1",
                    text: "Ev ve okulu kapsayan küçük alan ağıdır.",
                },
                {
                    id: "wan2",
                    text: "Birden fazla şehir ve ülkeyi kapsayan geniş alan ağıdır.",
                },
                {
                    id: "wan3",
                    text: "Sadece bir bilgisayarın içindeki bağlantıdır.",
                },
            ],
            correctId: "wan2",
        },
        {
            id: 6,
            section: "Bölüm 3 • Geniş Alan Ağı (WAN)",
            type: "single",
            title: "LAN mı WAN mı?",
            story:
                "Paket iki kapı ile karşılaşıyor: Birinde 'Küçük Alan', diğerinde 'Geniş Alan' yazıyor. " +
                "LAN ve WAN arasındaki farkı hatırlaması gerekiyor. Hangisi doğrudur?",
            options: [
                {
                    id: "lw1",
                    text: "LAN küçük alan ağlarını, WAN ise geniş alan ağlarını ifade eder.",
                },
                {
                    id: "lw2",
                    text: "LAN ve WAN aynı şeydir, aralarında fark yoktur.",
                },
                {
                    id: "lw3",
                    text: "WAN yalnızca ev içindeki kablosuz ağı ifade eder.",
                },
            ],
            correctId: "lw1",
        },
        {
            id: 7,
            section: "Bölüm 4 • Bulut Bilişim",
            type: "multi",
            title: "Buluta Neden Gideriz?",
            story:
                "Paket, gökyüzündeki bulut sunuculara yaklaşıyor. Sunucular ona soruyor: 'Bize neden geliyorsun?' " +
                "Bulut sistemlerini kullanmanın doğru nedenlerini seç.",
            options: [
                {
                    id: "b1",
                    text: "Bilgileri güvenli bir yerde saklayabilmek için.",
                },
                {
                    id: "b2",
                    text: "Uygulama ve dosyalara her yerden erişebilmek için.",
                },
                {
                    id: "b3",
                    text: "Verilerin kaybolmasını sağlamak için.",
                },
                {
                    id: "b4",
                    text: "Bilgisayarı gereksiz yere yavaşlatmak için.",
                },
            ],
            correctIds: ["b1", "b2"],
        },
        {
            id: 8,
            section: "Bölüm 4 • Bulut Bilişim",
            type: "single",
            title: "Bulut Gerçek Bir Cihaz mı?",
            story:
                "Paket, bulutun üstüne çıkıp oturmayı deniyor ama elinden kayıp gidiyor. " +
                "'Acaba bulut gerçekten evde duran tek bir cihaz mı?' diye düşünüyor. Ne dersin?",
            options: [
                {
                    id: "bc1",
                    text: "Evet, her evde bulunması gereken tek bir fiziksel cihazdır.",
                },
                {
                    id: "bc2",
                    text: "Hayır, internet üzerinden erişilen uzak bilgisayarlar ve sunuculardır.",
                },
            ],
            correctId: "bc2",
        },
        {
            id: 9,
            section: "Bölüm 5 • İnternet Adresleri",
            type: "single",
            title: "Doğru Adresi Seç!",
            story:
                "Paket, MEB’in web sitesine gitmek istiyor ama adresler karışmış durumda. " +
                "Hangisi doğru yazılmış bir web adresidir?",
            options: [
                { id: "url1", text: "https://www.meb.gov.tr" },
                { id: "url2", text: "www://meb.tr.gov" },
                { id: "url3", text: "http//:meb.gov" },
            ],
            correctId: "url1",
        },
        {
            id: 10,
            section: "Bölüm 5 • Web Tarayıcıları",
            type: "single",
            title: "Tarayıcı Ne İşe Yarar?",
            story:
                "Paket, Chrome, Firefox ve Edge'in olduğu bir odaya giriyor. Tarayıcılar ona el sallıyor. " +
                "Ama paket onların ne işe yaradığını tam hatırlamıyor. Sen hatırlıyor musun?",
            options: [
                {
                    id: "br1",
                    text: "İnternette web sayfalarını açmamızı sağlar.",
                },
                {
                    id: "br2",
                    text: "Bilgisayarın fişini çekmeden kapatır.",
                },
                {
                    id: "br3",
                    text: "Tüm şifreleri otomatik olarak kırar.",
                },
            ],
            correctId: "br1",
        },
        {
            id: 11,
            section: "Bölüm 6 • Güvenilir Bilgi",
            type: "single",
            title: "Hangi Kaynağa Güvenilir?",
            story:
                "Paket bilgi ararken iki farklı siteyle karşılaşıyor: Birinde 'Uzaylılar Ankara’ya indi!' diye bağıran bir haber, " +
                "diğerinde ise bilimsel bir dergi sitesi var. Paket doğru bilgiye ulaşmak istiyor. Hangisine daha çok güvenmeli?",
            options: [
                {
                    id: "src1",
                    text: "Bilimsel dergi ve resmi kurum siteleri.",
                },
                {
                    id: "src2",
                    text: "Abartılı başlık atan, kaynağı belirsiz siteler.",
                },
            ],
            correctId: "src1",
        },
        {
            id: 12,
            section: "Bölüm 7 • E-posta Kullanımı",
            type: "single",
            title: "Uygun E-posta Adresi",
            story:
                "Paket kendine bir e-posta adresi almak istiyor. Ciddiye alınmak ve güvenli görünmek istiyor. " +
                "Aşağıdaki adreslerden hangisi daha uygundur?",
            options: [
                { id: "mail1", text: "efsane-kral-222@example.com" },
                { id: "mail2", text: "tugba.kayihan@ogrenci.meb.tr" },
                { id: "mail3", text: "delipaket-9999@example.com" },
            ],
            correctId: "mail2",
        },
        {
            id: 13,
            section: "Bölüm 7 • E-posta Güvenliği",
            type: "multi",
            title: "E-postada Neleri Paylaşmamalısın?",
            story:
                "Paket ilk e-postasını yazarken yanlışlıkla şifre alanına tıklıyor ve durup düşünüyor: " +
                "'E-postada hangi bilgileri asla paylaşmamalıyım?' Doğru seçenekleri işaretle.",
            options: [
                { id: "em1", text: "Hesap şifresi" },
                { id: "em2", text: "TC kimlik numarası" },
                { id: "em3", text: "Ev adresi" },
                { id: "em4", text: "Ödev dosyası (PDF)" },
            ],
            correctIds: ["em1", "em2", "em3"],
        },
    ];

    let currentStepIndex = 0;
    
    const $history = new Array(steps.length).fill(null).map(() => ({
        selection: null, 
        isAnswered: false, 
        isCorrect: false, 
    }));

    let selectedSingle = null;
    let selectedMulti = new Set();
    let selectedSequence = [];

    // Mevcut adımı arayüze yükler
    function renderStep() {
        if (currentStepIndex >= steps.length) {
            showFinishScreen();
            return;
        }

        const step = steps[currentStepIndex];
        const currentHistory = $history[currentStepIndex];

        gamePanel.classList.remove("step-enter");
        void gamePanel.offsetWidth; 
        gamePanel.classList.add("step-enter");

        feedbackEl.textContent = "";
        feedbackEl.className = "feedback";
        
        sequenceHint.hidden = step.type !== "sequence";
        sequenceOrder.hidden = step.type !== "sequence";
        resetSequenceButton.hidden = step.type !== "sequence";

        stepSectionEl.textContent = step.section;
        stepCounterEl.textContent = `Soru ${currentStepIndex + 1} / ${steps.length}`;
        stepTitleEl.textContent = step.title;
        stepStoryEl.textContent = step.story;

        updateProgress($history.filter(h => h.isCorrect).length, steps.length);

        optionsContainer.innerHTML = "";
        sequenceOrder.textContent = "";

        if (step.type === "sequence") {
            renderSequenceOptions(step, currentHistory.selection);
        } else {
            renderChoiceOptions(step, currentHistory.selection);
        }

        nextButton.disabled = !currentHistory.isCorrect; 
        checkButton.disabled = currentHistory.isCorrect; 
        prevButton.disabled = currentStepIndex === 0; 

        if (currentHistory.isAnswered) {
             if (step.type === "single") {
                markSingleChoices(step, currentHistory.isCorrect);
            } else if (step.type === "multi") {
                const correctSet = new Set(step.correctIds);
                markMultiChoices(step, correctSet);
            } else if (step.type === "sequence") {
                 markSequenceChoices(step, currentHistory.isCorrect);
            }
             if (currentHistory.isCorrect) {
                 showFeedback(true, "Bu soruyu doğru cevapladın 🎉");
             } else {
                 showFeedback(false, "Bu soruyu daha önce yanlış cevapladın. Yeniden deneyebilirsin.");
             }
        }
        
    }

    // Tekli/Çoklu seçenek butonlarını oluşturur
    function renderChoiceOptions(step, storedSelection) {
        if (step.type === "single" && storedSelection) {
            selectedSingle = storedSelection;
        } else if (step.type === "multi" && storedSelection) {
            selectedMulti = new Set(storedSelection);
        } else {
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

            if ((step.type === "single" && selectedSingle === opt.id) || 
                (step.type === "multi" && selectedMulti.has(opt.id))) {
                btn.classList.add("option-selected");
                if (step.type === "multi") {
                     btn.classList.add("multi-selected");
                }
            }


            btn.addEventListener("click", () => {
                if ($history[currentStepIndex].isCorrect === true && checkButton.disabled === true) {
                    return; 
                }

                feedbackEl.textContent = "";
                feedbackEl.className = "feedback";

                if (step.type === "single") {
                    selectedSingle = opt.id;
                    Array.from(optionsContainer.children).forEach((el) =>
                        el.classList.remove("option-selected")
                    );
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

    // Sıralama (sequence) seçenek butonlarını oluşturur
    function renderSequenceOptions(step, storedSelection) {
        if (storedSelection) {
            selectedSequence = [...storedSelection];
        } else {
             selectedSequence = [];
        }

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
                btn.querySelector(".option-key").dataset.order = seqIndex + 1;
            }

            btn.addEventListener("click", () => {
                if ($history[currentStepIndex].isCorrect === true && checkButton.disabled === true) {
                    return; 
                }

                feedbackEl.textContent = "";
                feedbackEl.className = "feedback";
                
                const value = btn.dataset.value;
                if (!selectedSequence.includes(value)) {
                    selectedSequence.push(value);
                    btn.classList.add("sequence-picked");
                    btn.querySelector(".option-key").dataset.order = selectedSequence.length; 
                    updateSequenceOrderText();
                }
            });

            optionsContainer.appendChild(btn);
        });

        updateSequenceOrderText();
    }

    function updateSequenceOrderText() {
        if (selectedSequence.length === 0) {
            sequenceOrder.textContent = "Seçtiğin sıra: Henüz bir seçim yapmadın.";
        } else {
            sequenceOrder.textContent =
                "Seçtiğin sıra: " + selectedSequence.join(" → ");
        }
    }

    function showFeedback(isCorrect, message) {
        feedbackEl.textContent = message;
        feedbackEl.className =
            "feedback " + (isCorrect ? "feedback-success" : "feedback-error");
    }

    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    function setsEqual(setA, setB) {
        if (setA.size !== setB.size) return false;
        for (const val of setA) {
            if (!setB.has(val)) return false;
        }
        return true;
    }

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
            markMultiChoices(step, correctSet);

        } else if (step.type === "sequence") {
            if (selectedSequence.length !== step.options.length) {
                showFeedback(
                    false,
                    "Tüm adımları sırasıyla seçmelisin. Henüz bazıları eksik."
                );
                return;
            }
            isCorrect = arraysEqual(selectedSequence, step.correctOrder);
            selectionData = selectedSequence;
            markSequenceChoices(step, isCorrect);
        }

        $history[currentStepIndex].isAnswered = true;
        $history[currentStepIndex].selection = selectionData;
        $history[currentStepIndex].isCorrect = isCorrect;
        
        if (isCorrect) {
            showFeedback(true, "Harika! Doğru cevap 🎉");
            nextButton.disabled = false;
            checkButton.disabled = true; 
            updateProgressOnCorrect();
        } else {
            showFeedback(
                false,
                "Bu cevap tam olarak doğru değil. Metni yeniden okuyup tekrar dene."
            );
        }
    });

    function markSingleChoices(step, isCorrect) {
        Array.from(optionsContainer.children).forEach((btn) => {
            const id = btn.dataset.id;
            btn.classList.remove("option-wrong", "option-correct");
            if (id === step.correctId) {
                btn.classList.add("option-correct");
            } else if (id === selectedSingle && !isCorrect) {
                btn.classList.add("option-wrong");
            }
        });
    }

    function markMultiChoices(step, correctSet) {
        Array.from(optionsContainer.children).forEach((btn) => {
            const id = btn.dataset.id;
            btn.classList.remove("option-wrong", "option-correct");
            if (correctSet.has(id)) {
                btn.classList.add("option-correct");
            } else if (selectedMulti.has(id) && !correctSet.has(id)) {
                btn.classList.add("option-wrong");
            }
            // Çoklu seçimde her zaman seçilenleri vurgulamak için
            if ($history[currentStepIndex].selection && $history[currentStepIndex].selection.includes(id)) {
                 btn.classList.add("multi-selected");
            } else {
                 btn.classList.remove("multi-selected");
            }
        });
    }

    function markSequenceChoices(step, isCorrect) {
        Array.from(optionsContainer.children).forEach((btn) => {
            btn.classList.remove("option-wrong", "option-correct");

            if (btn.classList.contains("sequence-picked")) {
                if (isCorrect) {
                    btn.classList.add("option-correct");
                } else {
                    btn.classList.add("option-wrong");
                }
            }
        });
    }


    function updateProgress(correctCount, total) {
        const progressPercent = (correctCount / total) * 100;
        progressBar.style.width = `${progressPercent}%`;
        progressText.textContent = `${correctCount} / ${total} doğru tamamlandı`;
    }

    function updateProgressOnCorrect() {
        const correctCount = $history.filter(h => h.isCorrect).length;
        updateProgress(correctCount, steps.length);
    }


    nextButton.addEventListener("click", () => {
        if (currentStepIndex < steps.length - 1) {
            currentStepIndex++;
            renderStep();
        } else if (currentStepIndex === steps.length - 1 && $history[currentStepIndex].isCorrect) {
            showFinishScreen();
        }
    });

    prevButton.addEventListener("click", () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderStep();
        }
    });

    resetSequenceButton.addEventListener("click", () => {
        $history[currentStepIndex].selection = null;
        $history[currentStepIndex].isAnswered = false;
        $history[currentStepIndex].isCorrect = false;

        selectedSequence = [];
        Array.from(optionsContainer.children).forEach((btn) => {
            btn.classList.remove("sequence-picked", "option-wrong", "option-correct");
            const key = btn.querySelector(".option-key");
            if (key) {
                key.removeAttribute("data-order");
            }
        });
        updateSequenceOrderText();
        
        feedbackEl.textContent = "Sıralama sıfırlandı. Yeniden deneyebilirsin.";
        feedbackEl.className = "feedback";
        nextButton.disabled = true;
        checkButton.disabled = false;
    });

    function showFinishScreen() {
        const totalSteps = steps.length;
        gamePanel.innerHTML = "";
        gamePanel.classList.remove("step-enter"); 

        const finishHeader = document.createElement("div");
        finishHeader.className = "game-step-header";

        const finishBadge = document.createElement("span");
        finishBadge.className = "step-section-pill";
        finishBadge.textContent = "Tebrikler";

        const finishCounter = document.createElement("span");
        finishCounter.className = "step-counter";
        finishCounter.textContent = `${totalSteps} / ${totalSteps} tamamlandı`;

        finishHeader.append(finishBadge, finishCounter);

        const finishTitle = document.createElement("h2");
        finishTitle.className = "game-finish-title";
        finishTitle.textContent = "Ağ Kahramanı Sertifikasını Kazandın! 🏅";

        const finishText = document.createElement("p");
        finishText.className = "game-finish-text";
        finishText.textContent =
            "Bilgi paketini ev ağından, kablosuz bağlantılardan, geniş alan ağlarından ve bulut sunuculardan geçirerek " +
            "doğru ve güvenli bir şekilde hedefe ulaştırdın. Artık bilgisayar ağlarının nasıl çalıştığına dair güçlü bir fikrin var.";

        const restartBtn = document.createElement("button");
        restartBtn.type = "button";
        restartBtn.className = "btn btn-primary";
        restartBtn.textContent = "Baştan Oyna";
        restartBtn.addEventListener("click", () => {
            window.location.reload();
        });

        updateProgress(totalSteps, totalSteps);

        gamePanel.append(finishHeader, finishTitle, finishText, restartBtn);
        gamePanel.classList.add("step-enter");
    }

    renderStep();
}