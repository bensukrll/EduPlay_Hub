const scenarios = [
  {
    type: "LAN",
    title: "1. Sınıf İçi Mesajlaşma",
    text: "Ahmet’in Ayşe’ye mesaj gönderebilmesi için veri paketi önce switch’e uğramalıdır.",
    nodes: [
      { id: "ahmet", name: "Ahmet", icon: "💻", x: 18, y: 50 },
      { id: "switch", name: "Switch", icon: "🔀", x: 50, y: 50 },
      { id: "ayse", name: "Ayşe", icon: "🖥️", x: 82, y: 50 },
      { id: "zeynep", name: "Zeynep", icon: "💻", x: 18, y: 78 },
      { id: "printer", name: "Yazıcı", icon: "🖨️", x: 82, y: 78 }
    ],
    task: {
      title: "Ahmet’ten Ayşe’ye mesaj gönder",
      path: ["ahmet", "switch", "ayse"],
      method: "LAN",
      color: "#22c55e",
      success: "Mesaj paketi Ahmet’ten çıktı, switch’e uğradı ve Ayşe’ye ulaştı."
    }
  },
  {
    type: "WAN / İnternet",
    title: "2. Okuldan Web Sunucusuna",
    text: "Okuldaki bilgisayar internetteki web sunucusuna ulaşmak için switch, router, modem ve internet yolunu kullanır.",
    nodes: [
      { id: "pc", name: "Okul Bilgisayarı", icon: "💻", x: 12, y: 58 },
      { id: "switch", name: "Switch", icon: "🔀", x: 30, y: 58 },
      { id: "router", name: "Router", icon: "🧭", x: 47, y: 58 },
      { id: "modem", name: "Modem", icon: "📡", x: 64, y: 58 },
      { id: "internet", name: "İnternet", icon: "☁️", x: 80, y: 34 },
      { id: "server", name: "Web Sunucusu", icon: "🗄️", x: 88, y: 74 }
    ],
    task: {
      title: "Okul bilgisayarından web sunucusuna istek gönder",
      path: ["pc", "switch", "router", "modem", "internet", "server"],
      method: "İnternet",
      color: "#f97316",
      success: "İstek paketi okul ağından çıktı ve internet üzerinden web sunucusuna ulaştı."
    }
  },
  {
    type: "WLAN",
    title: "3. Kablosuz Sınıf Paylaşımı",
    text: "Tablet, kablosuz yazıcıya belge göndermek için Wi‑Fi noktasından geçmelidir.",
    nodes: [
      { id: "tablet", name: "Tablet", icon: "📱", x: 18, y: 48 },
      { id: "wifi", name: "Wi‑Fi Noktası", icon: "📶", x: 50, y: 48 },
      { id: "printer", name: "Kablosuz Yazıcı", icon: "🖨️", x: 82, y: 48 },
      { id: "router", name: "Router", icon: "🧭", x: 50, y: 76 },
      { id: "board", name: "Akıllı Tahta", icon: "🖥️", x: 82, y: 76 }
    ],
    task: {
      title: "Tabletten kablosuz yazıcıya belge gönder",
      path: ["tablet", "wifi", "printer"],
      method: "Wi‑Fi",
      color: "#a855f7",
      success: "Belge paketi tablet üzerinden çıktı, Wi‑Fi noktasından geçti ve kablosuz yazıcıya ulaştı."
    }
  }
];

let currentScenario = 0;
let selectedPath = [];
let completedRoute = null;
let animating = false;
let unlockedScenario = 0;

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const clearBtn = document.getElementById("clearBtn");

const scenarioNo = document.getElementById("scenarioNo");

const scenarioType = document.getElementById("scenarioType");
const scenarioTitle = document.getElementById("scenarioTitle");
const scenarioText = document.getElementById("scenarioText");
const taskTitle = document.getElementById("taskTitle");
const taskHint = document.getElementById("taskHint");
const selectedRoute = document.getElementById("selectedRoute");

const mapWrap = document.getElementById("mapWrap");
const lineLayer = document.getElementById("lineLayer");
const nodeLayer = document.getElementById("nodeLayer");
const packet = document.getElementById("packet");

const feedbackBox = document.getElementById("feedbackBox");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackText = document.getElementById("feedbackText");

const tabs = document.querySelectorAll(".tab");

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
clearBtn.addEventListener("click", clearSelection);
window.addEventListener("resize", drawCompletedRoute);

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const index = Number(tab.dataset.tab);

    if (index > unlockedScenario) {
      showFeedback("Senaryo kilitli", "Bu senaryoya geçmek için önce mevcut senaryoyu tamamlamalısın.", "error");
      return;
    }

    currentScenario = index;
    loadScenario();
  });
});

function startGame() {
  currentScenario = 0;
  unlockedScenario = 0;
  selectedPath = [];
  completedRoute = null;
  animating = false;

  startScreen.classList.remove("active");
  endScreen.classList.remove("active");
  gameScreen.classList.add("active");

  loadScenario();
}

function restartGame() {
  endScreen.classList.remove("active");
  startGame();
}

function loadScenario() {
  const scenario = scenarios[currentScenario];

  selectedPath = [];
  completedRoute = null;
  animating = false;
  packet.classList.add("hidden");

  scenarioType.textContent = scenario.type;
  scenarioTitle.textContent = scenario.title;
  scenarioText.textContent = scenario.text;
  taskTitle.textContent = scenario.task.title;
  taskHint.textContent = scenario.task.hint;
  scenarioNo.textContent = currentScenario + 1;

  renderTabs();
  renderNodes();
  renderSelectedRoute();
  drawCompletedRoute();
  updateNodeStyles();
  updateHud();

  showFeedback("Senaryo başladı", "Görevdeki yolu sırayla seç.", "normal");
}

function renderTabs() {
  tabs.forEach((tab, index) => {
    tab.classList.toggle("active", index === currentScenario);
    tab.classList.toggle("locked", index > unlockedScenario);
  });
}

function renderNodes() {
  const scenario = scenarios[currentScenario];
  nodeLayer.innerHTML = "";

  scenario.nodes.forEach(node => {
    const btn = document.createElement("button");
    btn.className = "node";
    btn.dataset.id = node.id;
    btn.style.left = `${node.x}%`;
    btn.style.top = `${node.y}%`;

    btn.innerHTML = `
      <span class="node-icon">${node.icon}</span>
      <span class="node-name">${node.name}</span>
    `;

    btn.addEventListener("click", () => handleNodeClick(node.id));
    nodeLayer.appendChild(btn);
  });
}

function renderSelectedRoute() {
  selectedRoute.innerHTML = "";

  if (selectedPath.length === 0) {
    selectedRoute.innerHTML = `<span class="empty-chip">Henüz seçim yok</span>`;
    return;
  }

  selectedPath.forEach((id, index) => {
    const chip = document.createElement("span");
    chip.className = "chip done";
    chip.textContent = getNodeName(id);
    selectedRoute.appendChild(chip);

    if (index < selectedPath.length - 1) {
      const arrow = document.createElement("span");
      arrow.className = "arrow-chip";
      arrow.textContent = "➜";
      selectedRoute.appendChild(arrow);
    }
  });
}

function handleNodeClick(nodeId) {
  if (animating || completedRoute) return;

  const correctPath = scenarios[currentScenario].task.path;
  const expectedNode = correctPath[selectedPath.length];

  selectedPath.push(nodeId);
  renderSelectedRoute();
  updateNodeStyles();

  if (nodeId !== expectedNode) {
    markWrong(nodeId);

    showFeedback(
      "Yanlış nokta seçildi",
      `Bu adımda ${getNodeName(expectedNode)} seçilmeliydi. Yolu baştan dene.`,
      "error"
    );

    setTimeout(() => {
      selectedPath = [];
      renderSelectedRoute();
      updateNodeStyles();
    }, 700);

    return;
  }

  if (selectedPath.length < correctPath.length) {
    const nextNode = correctPath[selectedPath.length];
    showFeedback(
      "Doğru adım",
      `Şimdi ${getNodeName(nextNode)} seçmelisin.`,
      "success"
    );
    return;
  }

  completeScenario();
}

async function completeScenario() {
  const scenario = scenarios[currentScenario];
  animating = true;
  completedRoute = {
    path: scenario.task.path,
    method: scenario.task.method,
    color: scenario.task.color
  };

  updateHud();
  drawCompletedRoute();
  updateNodeStyles();

  showFeedback("Paket yola çıktı! 📨", "Veri paketi seçtiğin yoldan ilerliyor.", "success");

  await animatePacket(scenario.task.path);

  showFeedback("Senaryo tamamlandı! ✅", scenario.task.success, "success");

  setTimeout(() => {
    if (currentScenario === scenarios.length - 1) {
      endGame();
    } else {
      unlockedScenario = Math.max(unlockedScenario, currentScenario + 1);
      currentScenario++;
      loadScenario();
    }
  }, 1600);
}

function clearSelection() {
  if (animating || completedRoute) return;

  selectedPath = [];
  renderSelectedRoute();
  updateNodeStyles();
  showFeedback("Seçim temizlendi", "Yolu en baştan seçebilirsin.", "normal");
}

function markWrong(id) {
  document.querySelectorAll(".node").forEach(node => {
    if (node.dataset.id === id) {
      node.classList.add("wrong");
      setTimeout(() => node.classList.remove("wrong"), 500);
    }
  });
}

function drawCompletedRoute() {
  lineLayer.innerHTML = "";

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <marker id="arrowGreen" markerWidth="12" markerHeight="12" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#22c55e"></path>
    </marker>
    <marker id="arrowOrange" markerWidth="12" markerHeight="12" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#f97316"></path>
    </marker>
    <marker id="arrowPurple" markerWidth="12" markerHeight="12" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,6 L9,3 z" fill="#a855f7"></path>
    </marker>
  `;
  lineLayer.appendChild(defs);

  if (!completedRoute) return;

  const points = completedRoute.path.map(getPointById).filter(Boolean);

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", p1.x);
    line.setAttribute("y1", p1.y);
    line.setAttribute("x2", p2.x);
    line.setAttribute("y2", p2.y);
    line.setAttribute("stroke", completedRoute.color);
    line.setAttribute("class", "connection-line");
    line.setAttribute("marker-end", getArrowMarker(completedRoute.color));
    lineLayer.appendChild(line);
  }

  if (points.length >= 2) {
    const middleIndex = Math.floor((points.length - 1) / 2);
    const p1 = points[middleIndex];
    const p2 = points[middleIndex + 1];
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", midX - 44);
    bg.setAttribute("y", midY - 13);
    bg.setAttribute("rx", 9);
    bg.setAttribute("width", 88);
    bg.setAttribute("height", 26);
    bg.setAttribute("class", "route-label-bg");
    lineLayer.appendChild(bg);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", midX);
    text.setAttribute("y", midY + 4);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "route-label-text");
    text.textContent = completedRoute.method;
    lineLayer.appendChild(text);
  }
}

function getArrowMarker(color) {
  if (color === "#f97316") return "url(#arrowOrange)";
  if (color === "#a855f7") return "url(#arrowPurple)";
  return "url(#arrowGreen)";
}

async function animatePacket(path) {
  const points = path.map(getPointById).filter(Boolean);
  if (points.length === 0) return;

  packet.classList.remove("hidden");
  packet.style.transition = "none";
  packet.style.left = `${points[0].x}px`;
  packet.style.top = `${points[0].y}px`;

  await wait(80);

  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1];
    const current = points[i];
    const distance = Math.hypot(current.x - previous.x, current.y - previous.y);
    const duration = Math.max(450, Math.min(850, distance * 3));

    packet.style.transition = `left ${duration}ms linear, top ${duration}ms linear`;
    packet.style.left = `${current.x}px`;
    packet.style.top = `${current.y}px`;

    await wait(duration + 80);
  }

  await wait(250);
  packet.classList.add("hidden");
}

function updateNodeStyles() {
  const scenario = scenarios[currentScenario];
  const nextExpected = scenario.task.path[selectedPath.length];

  document.querySelectorAll(".node").forEach(nodeEl => {
    const id = nodeEl.dataset.id;
    nodeEl.classList.remove("selected", "next-target", "path-node");

    if (selectedPath.includes(id)) {
      nodeEl.classList.add("selected");
    }

    if (!completedRoute && id === nextExpected) {
      nodeEl.classList.add("next-target");
    }

    if (completedRoute && completedRoute.path.includes(id)) {
      nodeEl.classList.add("path-node");
    }
  });
}

function getPointById(id) {
  const scenario = scenarios[currentScenario];
  const node = scenario.nodes.find(n => n.id === id);
  if (!node) return null;

  const rect = mapWrap.getBoundingClientRect();

  return {
    x: (node.x / 100) * rect.width,
    y: (node.y / 100) * rect.height
  };
}

function getNodeName(id) {
  const scenario = scenarios[currentScenario];
  const node = scenario.nodes.find(n => n.id === id);
  return node ? node.name : id;
}

function updateHud() {
  scenarioNo.textContent = currentScenario + 1;
}

function showFeedback(title, text, type) {
  feedbackTitle.textContent = title;
  feedbackText.textContent = text;

  feedbackBox.classList.remove("success", "error");

  if (type === "success") feedbackBox.classList.add("success");
  if (type === "error") feedbackBox.classList.add("error");
}

function endGame() {
    gameScreen.classList.remove("active");
    endScreen.classList.add("active");

    // -----------------------
    // PUANI DATABASE'E GÖNDER
    // -----------------------
    // Burada örnek skor hesaplama, toplam senaryoların % olarak puanı
    const totalScenarios = scenarios.length;
    const completedCount = unlockedScenario; // tamamlanan senaryo sayısı
    const score = Math.round((completedCount / totalScenarios) * 100);

    fetch("/save-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            game_key: "5_unit3_w1",  // GAME_INFO ile eşleşmeli
            score: score
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) console.log("Skor kaydedildi:", score, data);
        else console.warn("Skor kaydedilemedi:", data.error);
    })
    .catch(err => console.error("Fetch hatası:", err));
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
