// OYUN VERİLERİ
const filesData = [
    { type: 'doc', name: 'Odev_Taslak.docx', icon: '📄' },
    { type: 'doc', name: 'Ders_Notu.txt', icon: '📝' },
    { type: 'img', name: 'Tatil_Foto.jpg', icon: '📷' },
    { type: 'img', name: 'Ekran_Goruntusu.png', icon: '🖼️' },
    { type: 'music', name: 'Pop_Sarki.mp3', icon: '🎵' },
    { type: 'music', name: 'Ses_Kaydi.wav', icon: '🎙️' },
    { type: 'trash', name: 'Virus.exe', icon: '👾' },
    { type: 'trash', name: 'Hata_Raporu.log', icon: '⚠️' },
    { type: 'doc', name: 'Proje_Sunum.pptx', icon: '📊' },
    { type: 'img', name: 'Profil.png', icon: '👤' }
];

let score = 0;
let remainingFiles = filesData.length;

const desktop = document.getElementById('desktop');
const feedback = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const remainingEl = document.getElementById('remaining');

function initGame() {
    remainingEl.innerText = remainingFiles;
    filesData.forEach((file, index) => {
        createFileElement(file, index);
    });
    startClock();
}

function createFileElement(data, index) {
    const fileEl = document.createElement('div');
    fileEl.classList.add('file');
    fileEl.setAttribute('data-type', data.type);
    
    fileEl.innerHTML = `
        <div class="icon">${data.icon}</div>
        <div class="name">${data.name}</div>
    `;

    // GÜNCELLEME: Spawn Alanı Hesabı
    // Sol tarafta 100px (klasörler), Sağ tarafta 220px (panel) boşluk bırak.
    // Dosyalar bu iki alanın ortasında oluşsun.
    const safeXStart = 120; // Sol taraftan güvenli mesafe
    const safeXWidth = desktop.offsetWidth - 360; // (Toplam - Sol - Sağ)
    
    const randX = safeXStart + Math.random() * safeXWidth;
    const randY = 50 + Math.random() * (desktop.offsetHeight - 150);
    
    fileEl.style.left = randX + 'px';
    fileEl.style.top = randY + 'px';

    makeDraggable(fileEl);
    desktop.appendChild(fileEl);
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let originalZIndex = element.style.zIndex;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.zIndex = 100;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        element.style.zIndex = originalZIndex;
        checkCollision(element);
    }
}

function checkCollision(fileEl) {
    const folders = document.querySelectorAll('.folder');
    const fileRect = fileEl.getBoundingClientRect();

    for (const folder of folders) {
        const folderRect = folder.getBoundingClientRect();

        if (
            fileRect.left < folderRect.right &&
            fileRect.right > folderRect.left &&
            fileRect.top < folderRect.bottom &&
            fileRect.bottom > folderRect.top
        ) {
            const folderType = folder.getAttribute('data-type');
            const fileType = fileEl.getAttribute('data-type');

            if (folderType === fileType) {
                handleSuccess(fileEl, folder);
                break; 
            } else {
                handleError(folder.querySelector('.name').innerText);
            }
        }
    }
}

function handleSuccess(fileEl, folderEl) {
    folderEl.style.transform = "scale(1.1)";
    setTimeout(() => folderEl.style.transform = "scale(1)", 200);

    feedback.innerText = "✅ Harika! Doğru klasör.";
    feedback.style.color = "#4caf50";

    fileEl.remove();
    score += 10;
    remainingFiles--;
    scoreEl.innerText = score;
    remainingEl.innerText = remainingFiles;

    if (remainingFiles === 0) {
        setTimeout(() => {
            document.getElementById('game-over').classList.remove('hidden');
        }, 500);
    }
}

function handleError(folderName) {
    feedback.innerText = `❌ Hata! O dosya '${folderName}' klasörüne ait değil.`;
    feedback.style.color = "#ff4444";
    score -= 5;
    scoreEl.innerText = score;
}

function startClock() {
    setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('clock').innerText = `${hours}:${minutes}`;
    }, 1000);
}

initGame();