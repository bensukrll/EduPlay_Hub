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
  filesData.forEach(createFileElement);
  startClock();
}

function createFileElement(data) {
  const fileEl = document.createElement('div');
  fileEl.className = 'file';
  fileEl.dataset.type = data.type;

  fileEl.innerHTML = `
    <div class="icon">${data.icon}</div>
    <div class="name">${data.name}</div>
  `;

  fileEl.style.left = 150 + Math.random() * 400 + 'px';
  fileEl.style.top = 80 + Math.random() * 250 + 'px';

  makeDraggable(fileEl);
  desktop.appendChild(fileEl);
}

function makeDraggable(el) {
  let startX, startY, offsetX, offsetY;

  el.onmousedown = (e) => {
    e.preventDefault();

    startX = el.offsetLeft;
    startY = el.offsetTop;

    offsetX = e.clientX;
    offsetY = e.clientY;

    el.style.zIndex = 100;

    document.onmousemove = drag;
    document.onmouseup = drop;
  };

  function drag(e) {
    el.style.left = el.offsetLeft + (e.clientX - offsetX) + 'px';
    el.style.top  = el.offsetTop  + (e.clientY - offsetY) + 'px';

    offsetX = e.clientX;
    offsetY = e.clientY;
  }

  function drop(e) {
    document.onmousemove = null;
    document.onmouseup = null;
    el.style.zIndex = '';

    // Dosyayı geçici olarak tıklanamaz yap
    el.style.pointerEvents = 'none';
    const target = document.elementFromPoint(e.clientX, e.clientY);
    el.style.pointerEvents = 'auto';

    const folder = target?.closest('.folder');

    if (!folder) {
      resetPosition();
      return;
    }

    if (folder.dataset.type === el.dataset.type) {
      handleSuccess(el, folder);
    } else {
      handleError(folder.querySelector('.name').innerText);
      resetPosition();
    }
  }

  function resetPosition() {
    el.style.left = startX + 'px';
    el.style.top  = startY + 'px';
  }
}

function handleSuccess(fileEl, folderEl) {
  feedback.innerText = "✅ Harika! Doğru klasör.";
  feedback.style.color = "#4caf50";

  folderEl.style.transform = "scale(1.1)";
  setTimeout(() => folderEl.style.transform = "scale(1)", 200);

  fileEl.remove();
  score += 10;
  remainingFiles--;

  scoreEl.innerText = score;
  remainingEl.innerText = remainingFiles;

  if (remainingFiles === 0) {
    document.getElementById('game-over').classList.remove('hidden');
  }
}

function handleError(folderName) {
  // 🔴 TEMPLATE STRING HATASI DÜZELTİLDİ
  feedback.innerText = `❌ Hata! Bu dosya "${folderName}" klasörüne ait değil.`;
  feedback.style.color = "#ff4444";

  score -= 5;
  scoreEl.innerText = score;
}

function startClock() {
  setInterval(() => {
    const now = new Date();

    // 🔴 TEMPLATE STRING HATASI DÜZELTİLDİ
    document.getElementById('clock').innerText =
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }, 1000);
}

initGame();
