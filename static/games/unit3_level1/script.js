document.addEventListener("DOMContentLoaded", () => {
    /*
        OYUN MANTIĞI:
        - HTML'de 4 kablolu + 4 kablosuz slot olduğu için her oyunda 8 kart gelir.
        - Havuz daha geniştir.
        - Her girişte havuzdan rastgele 4 kablolu + 4 kablosuz kart seçilir.
    */

    const WIRED_COUNT = 4;
    const WIRELESS_COUNT = 4;

    let currentItems = [];

    const allItems = [
        /* =========================================================================
        KABLOLU BAĞLANTI KARTLARI (type: "wired") - 15 Adet
        ========================================================================= */

        {
            id: 1,
            type: "wired",
            text: "Evdeki masaüstü bilgisayar hep aynı masada duruyor ve internetin kesilmemesi isteniyor.",
            color: "yellow"
        },
        {
            id: 2,
            type: "wired",
            text: "Online oyun oynayan bir öğrenci, maç sırasında gecikme ve donma yaşamak istemiyor.",
            color: "purple"
        },
        {
            id: 3,
            type: "wired",
            text: "Bilişim sınıfındaki bilgisayarlar her ders aynı yerde kullanılıyor ve okul ağına bağlı kalıyor.",
            color: "green"
        },
        {
            id: 4,
            type: "wired",
            text: "Akıllı tahtada ders videosu açılırken görüntünün takılmadan devam etmesi isteniyor.",
            color: "blue"
        },
        {
            id: 5,
            type: "wired",
            text: "Evde büyük bir oyun dosyası indirilirken hızın sürekli değişmemesi isteniyor.",
            color: "yellow"
        },
        {
            id: 6,
            type: "wired",
            text: "Okuldaki öğretmen bilgisayarı hep aynı yerde duruyor ve bağlantının kararlı olması gerekiyor.",
            color: "green"
        },
        {
            id: 7,
            type: "wired",
            text: "Güvenlik kamerası sürekli aynı noktayı izliyor ve görüntüyü kesintisiz göndermesi gerekiyor.",
            color: "purple"
        },
        {
            id: 8,
            type: "wired",
            text: "Kütüphanedeki bilgisayarlar sabit masalarda kullanılıyor ve hızlı internet gerekiyor.",
            color: "blue"
        },
        {
            id: 9,
            type: "wired",
            text: "Canlı yayın yapan bir bilgisayarda bağlantının dalgalanmaması ve görüntünün donmaması isteniyor.",
            color: "green"
        },
        {
            id: 10,
            type: "wired",
            text: "Oyun konsolu televizyonun yanında sabit duruyor ve çevrim içi maçlarda düşük gecikme isteniyor.",
            color: "purple"
        },
        {
            id: 11,
            type: "wired",
            text: "Bilgisayarın yeri değişmeyecekse, hareket özgürlüğünden çok hız ve kararlılık önemli oluyor.",
            color: "blue"
        },
        {
            id: 12,
            type: "wired",
            text: "Okulun bilgisayar odasında tüm cihazların düzenli ve güvenilir şekilde ağa bağlı kalması gerekiyor.",
            color: "yellow"
        },
        {
            id: 13,
            type: "wired",
            text: "Evde modemle aynı odada duran bilgisayarda en kararlı internet bağlantısı tercih ediliyor.",
            color: "green"
        },
        {
            id: 14,
            type: "wired",
            text: "Bir sınıfta yapılan çevrim içi sınavda bağlantının kopmaması çok önemli oluyor.",
            color: "purple"
        },
        {
            id: 15,
            type: "wired",
            text: "Sabit duran bir bilgisayarda internetin duvarlardan ve uzaklıktan etkilenmemesi isteniyor.",
            color: "blue"
        },

        /* =========================================================================
        KABLOSUZ BAĞLANTI KARTLARI (type: "wireless") - 15 Adet
        ========================================================================= */

        {
            id: 16,
            type: "wireless",
            text: "Öğrenci tabletiyle sınıfta dolaşırken internete bağlı kalmak istiyor.",
            color: "blue"
        },
        {
            id: 17,
            type: "wireless",
            text: "Telefon, okul bahçesinde 4.5G veya 5G ile internete giriyor.",
            color: "yellow"
        },
        {
            id: 18,
            type: "wireless",
            text: "Kablosuz kulaklık, yakındaki telefondan müzik sesini alıyor.",
            color: "purple"
        },
        {
            id: 19,
            type: "wireless",
            text: "Akıllı saat, öğrencinin telefonuna yakınken bildirimleri gösteriyor.",
            color: "green"
        },
        {
            id: 20,
            type: "wireless",
            text: "Dizüstü bilgisayar evde salondan balkona taşınırken internete bağlı kalıyor.",
            color: "blue"
        },
        {
            id: 21,
            type: "wireless",
            text: "Kafedeki müşteriler internet ağına şifre girerek bağlanıyor.",
            color: "yellow"
        },
        {
            id: 22,
            type: "wireless",
            text: "Robot süpürge evin odalarında dolaşırken telefondaki uygulamadan kontrol ediliyor.",
            color: "green"
        },
        {
            id: 23,
            type: "wireless",
            text: "Aynı odadaki iki telefon birbirine yakınken fotoğraf paylaşıyor.",
            color: "purple"
        },
        {
            id: 24,
            type: "wireless",
            text: "Parkta modem yokken telefondan haritaya bakılıyor.",
            color: "yellow"
        },
        {
            id: 25,
            type: "wireless",
            text: "Tablet, evdeki modemden gelen görünmez sinyallerle internete bağlanıyor.",
            color: "green"
        },
        {
            id: 26,
            type: "wireless",
            text: "Kablosuz yazıcı başka odada duruyor ve bilgisayardan gönderilen belgeyi yazdırıyor.",
            color: "blue"
        },
        {
            id: 27,
            type: "wireless",
            text: "Kablosuz fare, masadaki bilgisayarla kısa mesafeden iletişim kuruyor.",
            color: "purple"
        },
        {
            id: 28,
            type: "wireless",
            text: "Otobüste yolculuk yapan öğrenci telefonuyla mesaj gönderiyor.",
            color: "yellow"
        },
        {
            id: 29,
            type: "wireless",
            text: "Modemden uzaklaşınca tabletin internet hızının azalabildiği fark ediliyor.",
            color: "blue"
        },
        {
            id: 30,
            type: "wireless",
            text: "Evdeki akıllı lamba telefondaki uygulama ile uzaktan açılıp kapatılıyor.",
            color: "green"
        }
    ];

    const sourceArea = document.getElementById("sourceArea");
    const checkBtn = document.getElementById("checkBtn");
    const resetBtn = document.getElementById("resetBtn");
    const slots = document.querySelectorAll(".slot");

    let seconds = 0;
    let timerInterval;
    const timerElement = document.getElementById("timer");

    let draggedItem = null;

    initGame();

    function shuffleArray(array) {
        const copiedArray = [...array];

        for (let i = copiedArray.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            const temp = copiedArray[i];
            copiedArray[i] = copiedArray[randomIndex];
            copiedArray[randomIndex] = temp;
        }

        return copiedArray;
    }

    function getRandomItems() {
        const wiredItems = allItems.filter(item => item.type === "wired");
        const wirelessItems = allItems.filter(item => item.type === "wireless");

        const selectedWired = shuffleArray(wiredItems).slice(0, WIRED_COUNT);
        const selectedWireless = shuffleArray(wirelessItems).slice(0, WIRELESS_COUNT);

        return shuffleArray([...selectedWired, ...selectedWireless]);
    }

    function initGame() {
        currentItems = getRandomItems();

        sourceArea.innerHTML = "";

        currentItems.forEach(item => {
            const card = document.createElement("div");

            card.classList.add("card", `card-${item.color}`);
            card.setAttribute("draggable", "true");
            card.setAttribute("data-id", item.id);
            card.setAttribute("data-type", item.type);
            card.textContent = item.text;

            card.addEventListener("dragstart", dragStart);
            card.addEventListener("dragend", dragEnd);

            sourceArea.appendChild(card);
        });

        slots.forEach(slot => {
            slot.innerHTML = "";
            slot.classList.remove("hovered");
        });

        resetTimer();
        startTimer();
    }

    function dragStart() {
        draggedItem = this;

        setTimeout(() => {
            this.style.opacity = "0.5";
        }, 0);
    }

    function dragEnd() {
        if (this) {
            this.style.opacity = "1";
        }
    }

    slots.forEach(slot => {
        slot.addEventListener("dragover", dragOver);
        slot.addEventListener("dragenter", dragEnter);
        slot.addEventListener("dragleave", dragLeave);
        slot.addEventListener("drop", dragDrop);
    });

    sourceArea.addEventListener("dragover", dragOver);

    sourceArea.addEventListener("drop", e => {
        e.preventDefault();

        if (draggedItem) {
            draggedItem.classList.remove("correct", "wrong");
            sourceArea.appendChild(draggedItem);
            draggedItem.style.opacity = "1";
            draggedItem = null;
        }
    });

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();

        if (this.classList.contains("slot")) {
            this.classList.add("hovered");
        }
    }

    function dragLeave() {
        if (this.classList.contains("slot")) {
            this.classList.remove("hovered");
        }
    }

    function dragDrop() {
        this.classList.remove("hovered");

        if (!draggedItem) return;

        draggedItem.classList.remove("correct", "wrong");

        if (this.classList.contains("slot") && this.children.length === 0) {
            this.appendChild(draggedItem);
        } else if (this.classList.contains("slot") && this.children.length > 0) {
            const existingCard = this.children[0];
            existingCard.classList.remove("correct", "wrong");
            sourceArea.appendChild(existingCard);
            this.appendChild(draggedItem);
        }

        draggedItem.style.opacity = "1";
        draggedItem = null;
    }

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
                }
            }
        });

        if (placedCount < currentItems.length) {
            showModal("Eksik Var!", "Lütfen tüm kartları kutucuklara yerleştir.", "⚠️");
        } else if (correctCount === currentItems.length) {
            stopTimer();
            const score = Math.max(100, 1000 - seconds * 5);

            fetch("http://127.0.0.1:5000/save-progress", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ game_key: "5_unit3_w2", score: score })
            });

            showModal("Harika İş!", `Tüm bağlantıları ${formatTime(seconds)} sürede doğru yerleştirdin!`, "🏆");
            checkBtn.style.display = "none";
            resetBtn.style.display = "inline-block";
        } else {
            fetch("http://127.0.0.1:5000/save-progress", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ game_key: "5_unit3_w2", score: 0 })
            });

            showModal("Bazı Hatalar Var", "Kırmızı yanan kartları tekrar kontrol et.", "❌");
        }
    }

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