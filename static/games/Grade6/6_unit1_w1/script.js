const fixedCategories = [
    { id: "yapay-zeka", name: "Yapay Zekâ", emoji: "🧠" },
    { id: "artirilmis-gerceklik", name: "Artırılmış Gerçeklik", emoji: "📱" },
    { id: "sanal-gerceklik", name: "Sanal Gerçeklik", emoji: "🥽" },
    { id: "giyilebilir-teknolojiler", name: "Giyilebilir Teknolojiler", emoji: "⌚" },
    { id: "bulut-depolama", name: "Bulut Depolama", emoji: "☁️" },
    { id: "nesnelerin-interneti", name: "Nesnelerin İnterneti", emoji: "🌐" }
];

const questionPool = {
    "yapay-zeka": [
        "İnsan gibi öğrenebilen, karar verebilen ve öneriler sunabilen sistemlerdir.",
        "Film, müzik veya video önerileri sunabilir.",
        "Hastalıkların erken tespitinde ve görüntü analizinde kullanılabilir.",
        "Verileri analiz ederek kullanıcıya uygun sonuçlar sunabilir."
    ],
    "artirilmis-gerceklik": [
        "Gerçek ortamın üzerine dijital görseller, bilgiler veya nesneler ekler.",
        "Kamera görüntüsünün üzerine sanal bilgiler yerleştirerek öğrenmeyi kolaylaştırır.",
        "Harita uygulamalarında yön bilgilerini gerçek görüntü üzerine ekleyebilir.",
        "Eğitimde üç boyutlu modelleri gerçek ortamda göstererek konuları somutlaştırır."
    ],
    "sanal-gerceklik": [
        "Kullanıcıyı tamamen bilgisayar tarafından oluşturulan sanal bir ortama taşır.",
        "Sanal gezi, sanal laboratuvar veya oyun deneyimi sunabilir.",
        "Özel gözlüklerle gerçek dünyadan farklı bir ortamdaymış gibi hissettirir.",
        "Eğitimde tehlikeli deneyleri güvenli bir sanal ortamda yapmayı sağlayabilir."
    ],
    "giyilebilir-teknolojiler": [
        "Üzerimizde ya da yanımızda taşıyabildiğimiz teknolojilerdir.",
        "Kalp atışı, adım sayısı ve uyku gibi sağlık verilerini takip edebilir.",
        "Akıllı saat ve akıllı bileklik bu teknolojiye örnektir.",
        "Spor yaparken vücut verilerini izlemeye yardımcı olur."
    ],
    "bulut-depolama": [
        "Dosyaların internet üzerinde saklanmasını ve farklı cihazlardan erişilmesini sağlar.",
        "Fotoğraf, belge ve videoların çevrim içi ortamda yedeklenmesine yardımcı olur.",
        "Dosya kaybolma riskini azaltır ve paylaşımı kolaylaştırır.",
        "Öğrencilerin ödevlerini ve projelerini internet ortamında saklamasını sağlar."
    ],
    "nesnelerin-interneti": [
        "İnternete bağlı akıllı cihazların birbirleriyle veri paylaşmasını sağlar.",
        "Akıllı buzdolabı, akıllı saat veya akıllı güvenlik kamerası bu teknolojiye örnektir.",
        "Evdeki cihazların birbiriyle bağlantılı çalışmasına yardımcı olur.",
        "Cihazların veri paylaşarak günlük işleri otomatikleştirmesini sağlar."
    ]
};

const dropzonesContainer = document.getElementById("dropzones-container");
const cardsContainer = document.getElementById("cards-container");
const rightPanel = document.querySelector(".right-panel");
const resultBox = document.getElementById("result-box");
const resultText = document.getElementById("result-text");

function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

function getUniqueCards() {
    const selectedCards = [];
    const usedTexts = new Set();

    fixedCategories.forEach(category => {
        const shuffledDescriptions = shuffle(questionPool[category.id]);

        const selectedText = shuffledDescriptions.find(text => !usedTexts.has(text));

        if (selectedText) {
            usedTexts.add(selectedText);

            selectedCards.push({
                categoryId: category.id,
                text: selectedText
            });
        }
    });

    return shuffle(selectedCards);
}

function initGame() {
    dropzonesContainer.innerHTML = "";
    cardsContainer.innerHTML = "";
    resultBox.className = "result-box hidden";
    resultText.textContent = "";

    fixedCategories.forEach(category => {
        const dropzone = document.createElement("div");
        dropzone.classList.add("dropzone");
        dropzone.dataset.match = category.id;

        dropzone.innerHTML = `
            <span class="label">${category.emoji} ${category.name}</span>
        `;

        dropzonesContainer.appendChild(dropzone);
    });

    const selectedCards = getUniqueCards();

    selectedCards.forEach((cardData, index) => {
        const card = document.createElement("div");
        card.classList.add("drag");
        card.draggable = true;
        card.id = `card-${index}`;
        card.dataset.id = cardData.categoryId;
        card.textContent = cardData.text;

        cardsContainer.appendChild(card);
    });

    attachDragAndDropEvents();
}

function attachDragAndDropEvents() {
    const draggables = document.querySelectorAll(".drag");
    const dropzones = document.querySelectorAll(".dropzone");

    draggables.forEach(drag => {
        drag.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", drag.id);
            drag.classList.add("dragging");
        });

        drag.addEventListener("dragend", () => {
            drag.classList.remove("dragging");
        });
    });

    dropzones.forEach(zone => {
        zone.addEventListener("dragover", e => {
            e.preventDefault();
            zone.classList.add("hover");
        });

        zone.addEventListener("dragleave", () => {
            zone.classList.remove("hover");
        });

        zone.addEventListener("drop", e => {
            e.preventDefault();
            zone.classList.remove("hover");

            const cardId = e.dataTransfer.getData("text/plain");
            const draggedCard = document.getElementById(cardId);

            if (!draggedCard) return;

            const oldCard = zone.querySelector(".drag");

            if (oldCard && oldCard.id !== draggedCard.id) {
                cardsContainer.appendChild(oldCard);
            }

            zone.appendChild(draggedCard);
        });
    });

    rightPanel.addEventListener("dragover", e => {
        e.preventDefault();
        rightPanel.classList.add("hover");
    });

    rightPanel.addEventListener("dragleave", () => {
        rightPanel.classList.remove("hover");
    });

    rightPanel.addEventListener("drop", e => {
        e.preventDefault();
        rightPanel.classList.remove("hover");

        const cardId = e.dataTransfer.getData("text/plain");
        const draggedCard = document.getElementById(cardId);

        if (draggedCard) {
            cardsContainer.appendChild(draggedCard);
        }
    });
}

document.getElementById("check").addEventListener("click", () => {
    const dropzones = document.querySelectorAll(".dropzone");
    let correctCount = 0;
    let placedCardCount = 0;

    dropzones.forEach(zone => {
        zone.classList.remove("correct-match", "wrong-match");

        const card = zone.querySelector(".drag");

        if (card) {
            placedCardCount++;

            if (card.dataset.id === zone.dataset.match) {
                correctCount++;
                zone.classList.add("correct-match");
            } else {
                zone.classList.add("wrong-match");
            }
        }
    });

    resultBox.className = "result-box";

    if (placedCardCount === 0) {
        resultBox.classList.add("warning");
        resultText.textContent = "Lütfen kontrol etmeden önce kartları kutulara sürükleyin!";
    } else if (correctCount === dropzones.length) {
        resultBox.classList.add("success");
        resultText.textContent = `🎉 Harika! Tüm yenilikçi teknolojileri doğru eşleştirdin. (${correctCount}/${dropzones.length})`;
    } else {
        resultBox.classList.add("warning");
        resultText.textContent = `💪 Güzel gidiyorsun! ${correctCount}/${dropzones.length} doğru yaptın. Birkaç eşleşmeyi tekrar düşün.`;
    }

    // -------------------
    // PUANI VERİTABANINA GÖNDER
    // -------------------
    const score = Math.round((correctCount / dropzones.length) * 100);

    fetch("/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin", // session cookie gönderimi
        body: JSON.stringify({
            game_key: "6_unit1_w1", // GAME_INFO ile eşleşmeli
            score: score
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) console.log("Skor kaydedildi:", score, data);
        else console.warn("Skor kaydedilemedi:", data.error);
    })
    .catch(err => console.error("Fetch hatası:", err));
});

document.getElementById("restart").addEventListener("click", initGame);

window.addEventListener("DOMContentLoaded", initGame);