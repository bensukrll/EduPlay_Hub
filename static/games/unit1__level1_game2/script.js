let draggedCard = null;

document.addEventListener("dragstart", e => {
  const card = e.target.closest(".card");
  if(card){
    draggedCard = card;
  }
});
document.querySelectorAll(".drop-area, .items").forEach(area=>{
  area.addEventListener("dragover", e => e.preventDefault());

  area.addEventListener("drop", ()=>{
    if(draggedCard){
      area.appendChild(draggedCard);
    }
  });
});

document.getElementById("checkBtn").addEventListener("click", ()=>{
  let correct = 0;

  document.querySelectorAll(".drop-area").forEach(area=>{
    let zone = area.dataset.zone;
    area.querySelectorAll(".card").forEach(card=>{
      if(card.dataset.type === zone){
        card.style.background = "#4caf50";
        correct++;
      }else{
        card.style.background = "#e53935";
      }
    });
  });

  document.getElementById("result").innerText =
    "Doğru eşleştirme sayısı: " + correct;
});

const itemsArea = document.getElementById("items");
const restartBtn = document.getElementById("restartBtn");

restartBtn.addEventListener("click", restartGame);

function restartGame(){
  // Kartları geri topla
  document.querySelectorAll(".card").forEach(card=>{
    card.style.background = "#f39c12";
    itemsArea.appendChild(card);
  });

  // Sonuç yazısını temizle
  document.getElementById("result").innerText = "";
}

