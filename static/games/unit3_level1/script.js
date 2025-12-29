document.addEventListener("DOMContentLoaded", () => {
    // 1. OYUN VERİLERİ (Görseldeki içerikler)
    const items = [
        { id: 1, type: "wired", text: "100 GB boyutundaki dev bir oyun dosyasını indirmek.", color: "yellow" },
        { id: 2, type: "wireless", text: "Dağ başında kamp yaparken manzara fotoğrafı paylaşmak.", color: "yellow" },
        { id: 3, type: "wireless", text: "Robot süpürge evin her odasını geziyor.", color: "green" },
        { id: 4, type: "wireless", text: "Bir kafede tabletten sipariş vermek.", color: "blue" },
        { id: 5, type: "wired", text: "E-spor turnuvası finalindesin, hız şart.", color: "purple" },
        { id: 6, type: "wireless", text: "Şehirlerarası otobüsle yolculuk yaparken haritaya bakmak.", color: "yellow" },
        { id: 7, type: "wired", text: "Okulun laboratuvarındaki masaüstü bilgisayarlar.", color: "green" },
        { id: 8, type: "wired", text: "Sınıftaki akıllı tahtadan donmadan video izlemek.", color: "yellow" }
    ];

    const sourceArea = document.getElementById("sourceArea");
    const checkBtn = document.getElementById("checkBtn");
    const resetBtn = document.getElementById("resetBtn");
    const slots = document.querySelectorAll(".slot");
    
    // Timer
    let seconds = 0;
    let timerInterval;
    const timerElement = document.getElementById("timer");

    // Oyunu Başlat
    initGame();

    function initGame() {
        // Karıştır
        const shuffledItems = items.sort(() => Math.random() - 0.5);
        
        // Kartları oluştur
        sourceArea.innerHTML = "";
        shuffledItems.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card", `card-${item.color}`);
            card.setAttribute("draggable", "true");
            card.setAttribute("data-id", item.id);
            card.setAttribute("data-type", item.type); // Cevap kontrolü için
            card.textContent = item.text;

            // Sürükleme Olayları
            card.addEventListener("dragstart", dragStart);
            
            sourceArea.appendChild(card);
        });

        // Slotları temizle
        slots.forEach(slot => {
            slot.innerHTML = "";
            slot.classList.remove("hovered");
        });

        resetTimer();
        startTimer();
    }

    // --- DRAG & DROP FONKSİYONLARI ---

    let draggedItem = null;

    function dragStart(e) {
        draggedItem = this;
        setTimeout(() => (this.style.opacity = "0.5"), 0);
    }

    // Slot Olayları
    slots.forEach(slot => {
        slot.addEventListener("dragover", dragOver);
        slot.addEventListener("dragenter", dragEnter);
        slot.addEventListener("dragleave", dragLeave);
        slot.addEventListener("drop", dragDrop);
    });

    // Kaynak alanına geri bırakma (Kartı iptal etme)
    sourceArea.addEventListener("dragover", dragOver);
    sourceArea.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedItem) {
            sourceArea.appendChild(draggedItem);
            draggedItem.style.opacity = "1";
            draggedItem = null;
        }
    });

    function dragOver(e) {
        e.preventDefault(); // Drop'a izin ver
    }

    function dragEnter(e) {
        e.preventDefault();
        if(this.classList.contains("slot")) {
            this.classList.add("hovered");
        }
    }

    function dragLeave() {
        if(this.classList.contains("slot")) {
            this.classList.remove("hovered");
        }
    }

    function dragDrop() {
        this.classList.remove("hovered");
        
        // Eğer bu bir slotsa ve içi boşsa
        if (this.classList.contains("slot") && this.children.length === 0) {
            this.appendChild(draggedItem);
        } 
        // Eğer slot doluysa ve üzerine başka kart geldiyse, yer değiştir (Opsiyonel özellik)
        else if (this.classList.contains("slot") && this.children.length > 0) {
            // Dolu slota atılırsa eski kartı kaynak alana geri atabiliriz
            const existingCard = this.children[0];
            sourceArea.appendChild(existingCard);
            this.appendChild(draggedItem);
        }

        if(draggedItem) {
            draggedItem.style.opacity = "1";
            draggedItem = null;
        }
    }

    // --- KONTROL MEKANİZMASI ---

    checkBtn.addEventListener("click", checkAnswers);
    resetBtn.addEventListener("click", () => {
        resetBtn.style.display = "none";
        checkBtn.style.display = "inline-block";
        initGame();
    });

    function checkAnswers() {
        let correctCount = 0;
        let placedCount = 0;

        slots.forEach(slot => {
            if (slot.children.length > 0) {
                placedCount++;
                const card = slot.children[0];
                const slotType = slot.getAttribute("data-type");
                const cardType = card.getAttribute("data-type");

                if (slotType === cardType) {
                    card.classList.add("correct");
                    card.classList.remove("wrong");
                    correctCount++;
                } else {
                    card.classList.add("wrong");
                    card.classList.remove("correct");
                    // Yanlış olanı bir süre sonra temizlemek istersen:
                    // setTimeout(() => card.classList.remove("wrong"), 1000);
                }
            }
        });

        if (placedCount < items.length) {
            showModal("Eksik Var!", "Lütfen tüm kartları kutucuklara yerleştir.", "⚠️");
        } else if (correctCount === items.length) {
            stopTimer();
            showModal("Harika İş!", `Tüm bağlantıları ${formatTime(seconds)} sürede doğru yaptın!`, "🏆");
            checkBtn.style.display = "none";
            resetBtn.style.display = "inline-block";
        } else {
            showModal("Bazı Hatalar Var", "Kırmızı yanan kartları tekrar kontrol et.", "❌");
        }
    }

    // --- ZAMANLAYICI & MODAL ---

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            seconds++;
            timerElement.textContent = formatTime(seconds);
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function resetTimer() {
        stopTimer();
        seconds = 0;
        timerElement.textContent = "00:00";
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    // Modal işlemleri
    const modal = document.getElementById("resultModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalText = document.getElementById("modalText");
    const modalIcon = document.getElementById("modalIcon");
    const modalClose = document.getElementById("modalCloseBtn");

    function showModal(title, text, icon) {
        modalTitle.textContent = title;
        modalText.textContent = text;
        modalIcon.textContent = icon;
        modal.classList.remove("hidden");
    }

    modalClose.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
});