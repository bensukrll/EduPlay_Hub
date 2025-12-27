const draggables = document.querySelectorAll(".drag");
const dropzones = document.querySelectorAll(".dropzone");
const rightPanel = document.querySelector(".right");


// --- SÜRÜKLEME BAŞLANGICI ---
draggables.forEach(drag => {
    drag.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text", drag.dataset.id);
        drag.classList.add("dragging");
    });

    drag.addEventListener("dragend", () => {
        drag.classList.remove("dragging");
    });
});


// --- DROPZONE OLAYLARI ---
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

        const id = e.dataTransfer.getData("text");
        const item = document.querySelector(`[data-id='${id}']`);

        // Önce eski kart varsa kaldır
        const oldCard = zone.querySelector(".drag");
        if (oldCard) rightPanel.appendChild(oldCard);

        // Kartı ekle
        zone.appendChild(item);
    });
});


// --- SAĞ PANEL DROPZONE (GERİ ALMA) ---
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

    const id = e.dataTransfer.getData("text");
    const item = document.querySelector(`[data-id='${id}']`);

    rightPanel.appendChild(item);
});


// --- CEVAP KONTROL ---
document.getElementById("check").addEventListener("click", () => {
    let correct = 0;

    dropzones.forEach(zone => {
        const item = zone.querySelector(".drag");
        if (item && item.dataset.id === zone.dataset.match) {
            correct++;
        }
    });

    const result = document.getElementById("result");

    if (correct === dropzones.length) {
        result.textContent = "✔ TEBRİKLER! Her şey doğru!";
        result.style.color = "green";
    } else {
        result.textContent = `❌ ${correct}/${dropzones.length} doğru. Tekrar dene!`;
        result.style.color = "red";
    }
});


// --- YENİDEN OYNA ---
document.getElementById("restart").addEventListener("click", () => {

    const items = document.querySelectorAll(".drag");

    // Kartları sağ tarafa taşı
    items.forEach(item => rightPanel.appendChild(item));

    document.getElementById("result").textContent = "";
});
