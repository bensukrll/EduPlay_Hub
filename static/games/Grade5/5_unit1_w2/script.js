const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const nextBtn = document.getElementById("nextBtn");

const scene = document.getElementById("scene");
const sceneShade = document.getElementById("sceneShade");
const timeIcon = document.getElementById("timeIcon");
const timeLabel = document.getElementById("timeLabel");
const placeLabel = document.getElementById("placeLabel");
const stepCounter = document.getElementById("stepCounter");
const questionTitle = document.getElementById("questionTitle");
const questionText = document.getElementById("questionText");
const choiceA = document.getElementById("choiceA");
const choiceB = document.getElementById("choiceB");
const decisionPanel = document.getElementById("decisionPanel");
const feedbackBox = document.getElementById("feedbackBox");
const feedbackIcon = document.getElementById("feedbackIcon");
const feedbackTitle = document.getElementById("feedbackTitle");
const feedbackText = document.getElementById("feedbackText");

const bars = {
  energy: document.getElementById("energyBar"),
  eye: document.getElementById("eyeBar"),
  mood: document.getElementById("moodBar"),
  success: document.getElementById("successBar")
};

const barTexts = {
  energy: document.getElementById("energyText"),
  eye: document.getElementById("eyeText"),
  mood: document.getElementById("moodText"),
  success: document.getElementById("successText")
};

const QUESTION_COUNT = 8;
const wrongPenalty = 100 / QUESTION_COUNT;

const goodEffects = { 
  energy: 0, 
  eye: 0, 
  mood: 0, 
  success: 0 
};

const badEffects = { 
  energy: -wrongPenalty, 
  eye: -wrongPenalty, 
  mood: -wrongPenalty, 
  success: -wrongPenalty 
};

function createChoice(label, note, good, feedback, effects) {
  return {
    label: label,
    note: note,
    good: good,
    feedback: feedback,
    effects: effects || (good ? goodEffects : badEffects)
  };
}

const questionPool = [
  {
    time: "Çalışma Zamanı",
    place: "Çalışma Alanı",
    icon: "⌨️",
    bg: "images/yatak.png",
    shade: "",
    title: "Bilek sağlığını korumak için ne tercih edilmeli?",
    text: "Sürekli bilgisayar başında çalışan biri için doğru seçim hangisi?",
    choices: [
      createChoice(
        "Standart düz klavye ve fare kullanmak.",
        "Bu seçim bilek sağlığını korumada yeterli olmayabilir.",
        false,
        "Standart klavye ve fare uzun kullanımda bilek zorlanmasına neden olabilir. Ergonomik araçlar fiziksel sağlığı korumaya yardımcı olur."
      ),
      createChoice(
        "Ergonomik klavye ve jel destekli fare altlığı kullanmak.",
        "Bu seçim bilek sağlığı için daha uygundur.",
        true,
        "Doğru seçim! Ergonomik klavye ve jel destekli mousepad, uzun süreli bilgisayar kullanımında bileği korumaya yardımcı olur."
      )
    ]
  },

  {
    time: "Aile Zamanı",
    place: "Oturma Odası",
    icon: "📹",
    bg: "images/oturma.png",
    shade: "",
    title: "Uzaktaki aile bireylerinle konuşacaksın.",
    text: "Görüntülü konuşma, bilişim teknolojilerinin hangi olumlu etkisine örnektir?",
    choices: [
      createChoice(
        "Bireysel ve sosyal ilişkilerin güçlenmesi.",
        "Teknoloji iletişimi kolaylaştırabilir.",
        true,
        "Harika! Görüntülü konuşma, uzaktaki kişilerle iletişimi güçlendirir ve sosyal ilişkileri destekler."
      ),
      createChoice(
        "Fiziksel ve bedensel sağlığın gelişmesi.",
        "Bu durum doğrudan beden sağlığıyla ilgili değildir.",
        false,
        "Bu örnek daha çok iletişim ve sosyal ilişkilerle ilgilidir. Beden sağlığını doğrudan geliştiren bir durum değildir."
      )
    ]
  },

  {
    time: "Ödev Zamanı",
    place: "Çalışma Alanı",
    icon: "👀",
    bg: "images/yatak.png",
    shade: "",
    title: "Ekrana uzun süre baktın.",
    text: "Göz kuruluğu ve yorgunluğunu önlemek için ne yapmalısın?",
    choices: [
      createChoice(
        "Ekran parlaklığını en üst seviyeye getirmek.",
        "Çok parlak ekran gözleri daha fazla yorabilir.",
        false,
        "Ekran parlaklığını en üst seviyeye çıkarmak göz yorgunluğunu artırabilir. Parlaklık ortam ışığına uygun ayarlanmalıdır."
      ),
      createChoice(
        "20 dakikada bir 20 saniye boyunca uzağa bakmak.",
        "20-20-20 kuralı göz sağlığını destekler.",
        true,
        "Doğru! 20-20-20 kuralı, gözlerin dinlenmesine yardımcı olur ve ekran kaynaklı yorgunluğu azaltabilir."
      )
    ]
  },

  {
    time: "Sosyal Medya",
    place: "Oturma Odası",
    icon: "📱",
    bg: "images/oturma.png",
    shade: "",
    title: "Telefon ve tablet çok fazla kullanılıyor.",
    text: "Kontrolsüz ve aşırı kullanım hangi ruhsal duruma yol açabilir?",
    choices: [
      createChoice(
        "Teknolojik bağımlılık ve sosyal izolasyon.",
        "Aşırı kullanım ruh sağlığını etkileyebilir.",
        true,
        "Doğru seçim! Kontrolsüz teknoloji kullanımı bağımlılık, yalnızlaşma ve sosyal ilişkilerde zayıflama gibi sorunlara yol açabilir."
      ),
      createChoice(
        "Dikkat süresinin uzaması ve sabrın artması.",
        "Bu, aşırı kullanımın beklenen sonucu değildir.",
        false,
        "Aşırı teknoloji kullanımı genellikle dikkat süresini artırmaz; tam tersine dikkat dağınıklığı ve bağımlılık riski oluşturabilir."
      )
    ]
  },

  {
    time: "Akşam",
    place: "Çalışma Alanı",
    icon: "🪑",
    bg: "images/yatak.png",
    shade: "",
    title: "Bilgisayar başında oturuyorsun.",
    text: "Doğru oturuş pozisyonu için hangisi önemlidir?",
    choices: [
      createChoice(
        "Sırtın dik durması ve sandalyenin bel desteğinin olması.",
        "Bu, ergonomik oturuş için önemlidir.",
        true,
        "Çok iyi! Dik oturmak ve bel desteği kullanmak, uzun süreli bilgisayar kullanımında beden sağlığını korur."
      ),
      createChoice(
        "Ayakların yerden kesilip havada kalması.",
        "Bu doğru bir oturuş değildir.",
        false,
        "Ayakların havada kalması doğru değildir. Ayaklar yere basmalı, sırt desteklenmeli ve oturuş dengeli olmalıdır."
      )
    ]
  },

  {
    time: "Gece",
    place: "Yatak Odası",
    icon: "🌙",
    bg: "images/yatak.png",
    shade: "night",
    title: "Geç saate kadar oyun ve sosyal medya kullandın.",
    text: "Bu durum ruh ve beden sağlığını nasıl etkiler?",
    choices: [
      createChoice(
        "Uyku düzeninin bozulması ve kronik yorgunluk.",
        "Geç saatlerde ekran kullanımı uyku kalitesini düşürebilir.",
        true,
        "Doğru! Gece geç saatlere kadar ekran kullanmak uyku düzenini bozabilir ve ertesi gün yorgunluğa neden olabilir."
      ),
      createChoice(
        "Dijital okuryazarlık becerilerinin kendiliğinden artması.",
        "Uzun süreli gece kullanımı sağlıklı bir beceri kazandırmaz.",
        false,
        "Gece geç saatlere kadar ekran kullanmak dijital okuryazarlığı kendiliğinden artırmaz; uyku ve enerji üzerinde olumsuz etki oluşturur."
      )
    ]
  },

  {
    time: "Günlük İşler",
    place: "Oturma Odası",
    icon: "⏱️",
    bg: "images/oturma.png",
    shade: "",
    title: "İşlemlerini internetten hallettin.",
    text: "E-devlet veya internet bankacılığı gibi platformlar hangi olumlu etkiyi sağlar?",
    choices: [
      createChoice(
        "Zaman ve enerji tasarrufu sağlaması.",
        "Teknoloji günlük işleri kolaylaştırır.",
        true,
        "Doğru! Bu platformlar işlemleri hızlandırır, zaman ve enerji tasarrufu sağlar."
      ),
      createChoice(
        "Yüz yüze iletişim ihtiyacını tamamen ortadan kaldırması.",
        "Bu doğru bir ifade değildir.",
        false,
        "Teknoloji bazı işlemleri kolaylaştırır ama yüz yüze iletişim ihtiyacını tamamen ortadan kaldırmaz."
      )
    ]
  },

  {
    time: "Sosyal Medya",
    place: "Oturma Odası",
    icon: "😟",
    bg: "images/oturma.png",
    shade: "",
    title: "Telefonun yanında değilken çok kaygılandın.",
    text: "Nomofobi hangi sağlık kategorisine girer?",
    choices: [
      createChoice(
        "Ruh sağlığı yani psikolojik etkiler.",
        "Kaygı ve korku ruh sağlığıyla ilgilidir.",
        true,
        "Doğru! Nomofobi, telefonsuz kalınca aşırı kaygı yaşama durumudur ve psikolojik etkilerle ilgilidir."
      ),
      createChoice(
        "Beden sağlığı yani fiziksel etkiler.",
        "Bu durum doğrudan fiziksel bir sorun değildir.",
        false,
        "Nomofobi öncelikle ruh sağlığıyla ilgilidir. Kaygı ve korku gibi psikolojik etkiler oluşturur."
      )
    ]
  },

  {
    time: "Ödev Zamanı",
    place: "Çalışma Alanı",
    icon: "🖥️",
    bg: "images/yatak.png",
    shade: "",
    title: "Ekran yüksekliğini ayarlıyorsun.",
    text: "Ekranın üst kenarı göz hizamıza göre nasıl olmalıdır?",
    choices: [
      createChoice(
        "Ekranın üst kenarı göz hizasından çok daha yukarıda olmalıdır.",
        "Bu boyun sağlığını olumsuz etkileyebilir.",
        false,
        "Ekranın çok yukarıda olması boynu zorlayabilir. Ekran göz hizasına yakın olmalıdır."
      ),
      createChoice(
        "Ekranın üst kenarı göz hizasıyla hemen hemen aynı seviyede olmalıdır.",
        "Bu daha ergonomik bir kullanımdır.",
        true,
        "Doğru! Ekranın göz hizasına yakın olması boyun ve göz sağlığı için daha uygundur."
      )
    ]
  },

  {
    time: "Okul",
    place: "Sınıf",
    icon: "🛡️",
    bg: "images/sinif.png",
    shade: "school",
    title: "İnternette rahatsız edici davranışlar gördün.",
    text: "Siber zorbalık hangi olumsuz etkiye örnektir?",
    choices: [
      createChoice(
        "Fiziksel güvenlik yetersizliği.",
        "Bu durum daha çok psikolojik ve sosyal zararla ilgilidir.",
        false,
        "Siber zorbalık doğrudan fiziksel güvenlik değil; psikolojik ve sosyal zararlarla ilgilidir."
      ),
      createChoice(
        "Psikolojik ve sosyal zarar.",
        "Siber zorbalık bireyin ruh halini ve sosyal ilişkilerini etkiler.",
        true,
        "Doğru! Siber zorbalık, bireyin ruh sağlığını ve sosyal ilişkilerini olumsuz etkileyebilir."
      )
    ]
  },

  {
    time: "Okul",
    place: "Sınıf",
    icon: "🔔",
    bg: "images/sinif.png",
    shade: "school",
    title: "Ders çalışırken sürekli bildirim geliyor.",
    text: "Bildirimleri sürekli kontrol etme isteği hangi soruna sebep olur?",
    choices: [
      createChoice(
        "Bilgiyi daha hızlı analiz etme yeteneğine.",
        "Bildirimler genellikle dikkati güçlendirmez.",
        false,
        "Sürekli bildirim kontrol etmek bilgiyi daha hızlı analiz etmeyi sağlamaz. Dikkati bölebilir."
      ),
      createChoice(
        "Odaklanma sorunu ve dikkat dağınıklığına.",
        "Bildirimler dikkati dağıtabilir.",
        true,
        "Doğru! Sürekli bildirim kontrol etmek odaklanmayı zorlaştırır ve dikkat dağınıklığına neden olabilir."
      )
    ]
  },

  {
    time: "Sosyal Medya",
    place: "Oturma Odası",
    icon: "📰",
    bg: "images/oturma.png",
    shade: "",
    title: "İnternette asılsız haberler yayıldı.",
    text: "Doğruluğu kanıtlanmamış haberlerin yayılması toplumu nasıl etkiler?",
    choices: [
      createChoice(
        "Bilgi kirliliği ve toplumsal huzursuzluk.",
        "Yanlış bilgi toplumda karmaşa oluşturabilir.",
        true,
        "Doğru! Asılsız haberler bilgi kirliliğine ve toplumda huzursuzluğa yol açabilir."
      ),
      createChoice(
        "Toplumsal dayanışma ve güven duygusu.",
        "Yanlış bilgi güveni artırmaz.",
        false,
        "Asılsız haberler güven duygusunu artırmaz; bilgi kirliliği ve huzursuzluk yaratabilir."
      )
    ]
  },

  {
    time: "Akşam",
    place: "Yatak Odası",
    icon: "💻",
    bg: "images/yatak.png",
    shade: "",
    title: "Dizüstü bilgisayarı yatakta kullanıyorsun.",
    text: "Sürekli iki büklüm ve kucakta kullanım neye yol açabilir?",
    choices: [
      createChoice(
        "Boyun fıtığı ve duruş bozukluğu.",
        "Yanlış duruş fiziksel sağlığı etkileyebilir.",
        true,
        "Doğru! Yatakta veya koltukta yanlış pozisyonda bilgisayar kullanmak boyun ve duruş sorunlarına yol açabilir."
      ),
      createChoice(
        "Görme keskinliğinin aşırı derecede artması.",
        "Bu gerçekçi bir olumlu etki değildir.",
        false,
        "Yanlış pozisyonda bilgisayar kullanmak görmeyi güçlendirmez; boyun, bel ve duruş sorunlarına neden olabilir."
      )
    ]
  },

  {
    time: "Okul",
    place: "Sınıf",
    icon: "📚",
    bg: "images/sinif.png",
    shade: "school",
    title: "Teknoloji eğitimde kullanılıyor.",
    text: "Akıllı tahtalar ve dijital kütüphaneler topluma nasıl katkı sağlar?",
    choices: [
      createChoice(
        "Bilgiye erişimde fırsat eşitliği ve öğrenme kolaylığı.",
        "Eğitim teknolojileri öğrenmeyi destekler.",
        true,
        "Doğru! Teknolojinin eğitimde kullanılması bilgiye erişimi kolaylaştırır ve öğrenmeyi destekler."
      ),
      createChoice(
        "Öğrencilerin ezber yeteneğinin geliştirilmesi.",
        "Teknolojinin temel katkısı ezber değildir.",
        false,
        "Eğitim teknolojilerinin amacı sadece ezberi artırmak değildir; bilgiye erişimi ve öğrenmeyi kolaylaştırmaktır."
      )
    ]
  },

  {
    time: "Çalışma Zamanı",
    place: "Çalışma Alanı",
    icon: "🖱️",
    bg: "images/oturma.png",
    shade: "",
    title: "Uzun süre mouse kullandın.",
    text: "El bileğindeki sinirlerin sıkışmasıyla oluşan meslek hastalığı hangisidir?",
    choices: [
      createChoice(
        "Karpal Tünel Sendromu.",
        "Uzun süreli yanlış mouse kullanımıyla ilişkili olabilir.",
        true,
        "Doğru! Karpal Tünel Sendromu, bilekteki sinirlerin sıkışmasıyla oluşabilir."
      ),
      createChoice(
        "Skolyoz.",
        "Bu daha çok omurga eğriliğiyle ilgilidir.",
        false,
        "Skolyoz omurga eğriliğidir. Mouse kullanımında bilekle ilgili sorunlardan biri Karpal Tünel Sendromu olabilir."
      )
    ]
  },

  {
    time: "Sosyal Medya",
    place: "Oturma Odası",
    icon: "👥",
    bg: "images/oturma.png",
    shade: "",
    title: "Sanal arkadaşlıklar gerçek ilişkilerin yerini alıyor.",
    text: "Bu durum bireyde hangi ruhsal soruna yol açabilir?",
    choices: [
      createChoice(
        "Yalnızlık ve toplumdan yabancılaşma.",
        "Gerçek sosyal ilişkilerin azalması ruh halini etkileyebilir.",
        true,
        "Doğru! Sanal ilişkilerin gerçek ilişkilerin tamamen yerini alması yalnızlık ve yabancılaşma hissine yol açabilir."
      ),
      createChoice(
        "Liderlik ve empati yeteneğinin gelişmesi.",
        "Bu sonuç doğrudan beklenen bir etki değildir.",
        false,
        "Gerçek sosyal ilişkilerin azalması empatiyi güçlendirmek yerine yalnızlık ve yabancılaşma oluşturabilir."
      )
    ]
  },

  {
    time: "Okul",
    place: "Sınıf",
    icon: "🔌",
    bg: "images/sinif.png",
    shade: "school",
    title: "Bilgisayar laboratuvarındasın.",
    text: "Dağınık kablolar ve açıkta prizler hangi güvenliği tehdit eder?",
    choices: [
      createChoice(
        "Dijital veri güvenliğini.",
        "Bu durum veriyle değil fiziksel ortamla ilgilidir.",
        false,
        "Dağınık kablolar veri güvenliğinden çok fiziksel güvenliği tehdit eder."
      ),
      createChoice(
        "Fiziksel güvenlik önlemlerini.",
        "Kablolar ve prizler fiziksel risk oluşturabilir.",
        true,
        "Doğru! Açıkta kalan prizler ve dağınık kablolar düşme, çarpılma gibi fiziksel güvenlik riskleri oluşturabilir."
      )
    ]
  },

  {
    time: "Okul",
    place: "Sınıf",
    icon: "🌍",
    bg: "images/sinif.png",
    shade: "school",
    title: "Dünyadaki bilgiye erişiyorsun.",
    text: "Farklı kültürleri, sanat eserlerini ve bilimsel gelişmeleri öğrenmek neye katkı sağlar?",
    choices: [
      createChoice(
        "Kültürel etkileşimin ve küresel bilgi paylaşımının artmasına.",
        "Teknoloji dünyayı daha erişilebilir hale getirir.",
        true,
        "Doğru! Bilişim teknolojileri farklı kültürleri ve bilgileri tanımayı kolaylaştırır."
      ),
      createChoice(
        "Toplumların kendi içine kapanmasına.",
        "Bu örnek daha çok etkileşim ve paylaşım ile ilgilidir.",
        false,
        "Teknoloji doğru kullanıldığında toplumların kendi içine kapanmasından çok bilgi paylaşımını ve kültürel etkileşimi artırır."
      )
    ]
  },

  {
    time: "Gece",
    place: "Yatak Odası",
    icon: "📱",
    bg: "images/yatak.png",
    shade: "night",
    title: "Telefon ekranına sürekli aşağı bakıyorsun.",
    text: "Bu durumdan kaynaklanan boyun rahatsızlığı ne olarak adlandırılır?",
    choices: [
      createChoice(
        "Metin boynu yani Text neck sendromu.",
        "Sürekli aşağı bakmak boyun sağlığını etkileyebilir.",
        true,
        "Doğru! Sürekli telefona eğilerek bakmak boyun ağrısı ve duruş sorunlarına neden olabilir."
      ),
      createChoice(
        "Siberkondri.",
        "Bu internetten hastalık araştırma kaygısıyla ilgilidir.",
        false,
        "Siberkondri, internette hastalık araştırıp kaygılanma durumudur. Telefona eğilerek bakmak Text neck ile ilişkilidir."
      )
    ]
  },

  {
    time: "Sosyal Medya",
    place: "Oturma Odası",
    icon: "🎭",
    bg: "images/oturma.png",
    shade: "",
    title: "İnternette kırıcı yorumlar yapılıyor.",
    text: "Gerçekte söylenemeyen kırıcı sözleri çevrim içi söylemek hangi olumsuz durumdur?",
    choices: [
      createChoice(
        "Dijital sağlık bilinci.",
        "Bu olumlu bir bilinç durumu değildir.",
        false,
        "Kırıcı davranışlar dijital sağlık bilinci değildir. Bu durum empati kaybı ve sorumsuz çevrim içi davranışlarla ilgilidir."
      ),
      createChoice(
        "Dijital maskeler ardına sığınarak empati kaybı yaşama.",
        "Çevrim içi gizlilik yanlış davranışlara yol açabilir.",
        true,
        "Doğru! İnternetin sağladığı gizlilik bazen empati kaybına ve kırıcı davranışlara neden olabilir."
      )
    ]
  },

  {
    time: "Çalışma Zamanı",
    place: "Çalışma Alanı",
    icon: "🪑",
    bg: "images/oturma.png",
    shade: "",
    title: "Çalışma masasında oturuyorsun.",
    text: "Dik açıyla durması gereken iki temel vücut bölgesi hangisidir?",
    choices: [
      createChoice(
        "Sadece boyun ve baş bölgesi.",
        "Doğru ergonomik cevap bu değildir.",
        false,
        "Ergonomik oturuşta sadece baş ve boyun değil, kollar ve bacaklar da doğru konumda olmalıdır."
      ),
      createChoice(
        "Dirsekler yani kollar ve dizler yani bacaklar.",
        "Bu ergonomik oturuş için önemlidir.",
        true,
        "Doğru! Dirseklerin ve dizlerin yaklaşık dik açıyla durması daha sağlıklı bir oturuş sağlar."
      )
    ]
  },

  {
    time: "Günlük Yaşam",
    place: "Oturma Odası",
    icon: "🗺️",
    bg: "images/oturma.png",
    shade: "",
    title: "Navigasyon uygulaması kullanıyorsun.",
    text: "Harita ve navigasyon uygulamaları toplumsal yaşamda hangi olumlu etkiyi yaratmıştır?",
    choices: [
      createChoice(
        "Ulaşımı kolaylaştırmış ve adres arama stresini azaltmıştır.",
        "Navigasyon günlük yaşamı kolaylaştırır.",
        true,
        "Doğru! Navigasyon uygulamaları ulaşımı kolaylaştırır ve kaybolma ya da adres bulma stresini azaltır."
      ),
      createChoice(
        "İnsanların yön duygusunu tamamen yok etmiştir.",
        "Bu aşırı ve yanlış bir ifadedir.",
        false,
        "Navigasyon bazı alışkanlıkları değiştirebilir ama yön duygusunu tamamen yok eder demek doğru değildir."
      )
    ]
  },

  {
    time: "Gece",
    place: "Yatak Odası",
    icon: "💡",
    bg: "images/yatak.png",
    shade: "night",
    title: "Akşam telefona uzun süre baktın.",
    text: "Mavi ışığın melatonini baskılaması neye yol açar?",
    choices: [
      createChoice(
        "Kaliteli ve derin bir uyku çekmeye.",
        "Mavi ışık genellikle uykuya geçişi zorlaştırır.",
        false,
        "Akşam yoğun ekran kullanımı kaliteli uykuyu desteklemez. Uykuya dalmayı zorlaştırabilir."
      ),
      createChoice(
        "Uykuya dalma süresinin uzamasına ve uykusuzluğa.",
        "Mavi ışık uyku düzenini etkileyebilir.",
        true,
        "Doğru! Mavi ışık uyku hormonunu etkileyebilir ve uykuya dalmayı zorlaştırabilir."
      )
    ]
  },

  {
    time: "Dinlenme",
    place: "Oturma Odası",
    icon: "🌿",
    bg: "images/oturma.png",
    shade: "",
    title: "Dijital detoks yapmayı düşünüyorsun.",
    text: "Dijital Diyet veya Dijital Detoks neyi ifade eder?",
    choices: [
      createChoice(
        "Teknolojik cihazları hayatımızdan tamamen ve ömür boyu çıkarmayı.",
        "Dijital detoks tamamen bırakmak anlamına gelmez.",
        false,
        "Dijital detoks, teknolojiyi tamamen bırakmak değil; dengeli ve sınırlı kullanmayı öğrenmektir."
      ),
      createChoice(
        "Belirli dönemlerde teknoloji kullanımını sınırlayarak ruh ve beden sağlığını dinlendirmeyi.",
        "Bu, dengeli teknoloji kullanımıdır.",
        true,
        "Doğru! Dijital detoks, teknoloji kullanımını sınırlayıp zihni ve bedeni dinlendirmeyi amaçlar."
      )
    ]
  },

  {
    time: "Çalışma Zamanı",
    place: "Çalışma Alanı",
    icon: "💡",
    bg: "images/yatak.png",
    shade: "",
    title: "Çalışma ortamındaki ışığı ayarlıyorsun.",
    text: "Ekrana doğrudan ışık yansımasını önlemek için ne yapılmalıdır?",
    choices: [
      createChoice(
        "Işık kaynağının ekrana doğrudan vurmayacağı dolaylı bir aydınlatma seçilmelidir.",
        "Bu göz sağlığı için daha uygundur.",
        true,
        "Doğru! Işığın ekrana doğrudan vurması göz kamaşmasına neden olabilir. Dolaylı aydınlatma tercih edilmelidir."
      ),
      createChoice(
        "Karanlık odada sadece ekran ışığıyla çalışılmalıdır.",
        "Karanlık ortam gözleri yorabilir.",
        false,
        "Karanlıkta sadece ekran ışığıyla çalışmak gözleri yorabilir. Ortam ışığı dengeli olmalıdır."
      )
    ]
  }
];

let questions = [];

function startGame() {
  questions = getRandomQuestions(questionPool, 8);

  current = 0;
  stats = { energy: 100, eye: 100, mood: 100, success: 100 };
  choicesHistory = [];
  updateBars();
  showScreen(gameScreen);
  loadQuestion();
}

if (startBtn) {
  startBtn.addEventListener("click", startGame);
}

if (nextBtn) {
  nextBtn.addEventListener("click", nextQuestion);
}

if (restartBtn) {
  restartBtn.addEventListener("click", startGame);
}


function getRandomQuestions(pool, count) {
  const mixed = [...pool];

  for (let i = mixed.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const temp = mixed[i];
    mixed[i] = mixed[randomIndex];
    mixed[randomIndex] = temp;
  }

  return mixed.slice(0, count);
}

let current = 0;
let stats = {
  energy: 100,
  eye: 100,
  mood: 100,
  success: 100
};
let choicesHistory = [];

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function showScreen(screen) {
  [startScreen, gameScreen, endScreen].forEach(item => item.classList.remove("active"));
  screen.classList.add("active");
}

function updateBars() {
  Object.keys(stats).forEach(key => {
    const value = clamp(stats[key]);
    bars[key].style.width = value + "%";
    barTexts[key].textContent = value;

    if (value < 35) {
      bars[key].style.background = "linear-gradient(90deg, #ef4444, #f97316)";
    } else if (value < 65) {
      bars[key].style.background = "linear-gradient(90deg, #f59e0b, #facc15)";
    } else {
      bars[key].style.background = "linear-gradient(90deg, #22c55e, #a3e635)";
    }
  });
}

function setChoiceButton(button, choice, index) {
  const letter = index === 0 ? "A" : "B";
  button.innerHTML = `<strong>${letter}) ${choice.label}</strong><small>${choice.note}</small>`;
  button.classList.remove("good-choice", "bad-choice");
  button.onclick = () => selectChoice(choice);
}

function loadQuestion() {
  const q = questions[current];

  scene.style.setProperty("--scene-image", `url('${q.bg}')`);
  sceneShade.className = "scene-shade";
  if (q.shade) sceneShade.classList.add(q.shade);

  timeIcon.textContent = q.icon;
  timeLabel.textContent = q.time;
  placeLabel.textContent = q.place;
  stepCounter.textContent = `${current + 1} / ${questions.length}`;
  questionTitle.textContent = q.title;
  questionText.textContent = q.text;

  setChoiceButton(choiceA, q.choices[0], 0);
  setChoiceButton(choiceB, q.choices[1], 1);

  decisionPanel.classList.remove("hidden");
  feedbackBox.classList.add("hidden");
}

function selectChoice(choice) {
  Object.keys(choice.effects).forEach(key => {
    stats[key] = clamp(stats[key] + choice.effects[key]);
  });
  updateBars();

  choicesHistory.push({
    title: questions[current].title,
    good: choice.good,
    label: choice.label,
    feedback: choice.feedback
  });

  choiceA.classList.add(questions[current].choices[0].good ? "good-choice" : "bad-choice");
  choiceB.classList.add(questions[current].choices[1].good ? "good-choice" : "bad-choice");

  feedbackIcon.textContent = choice.good ? "✅" : "⚠️";
  feedbackTitle.textContent = choice.good ? "Dengeli karar!" : "Dikkatli ol!";
  feedbackText.textContent = choice.feedback;

  setTimeout(() => {
    decisionPanel.classList.add("hidden");
    feedbackBox.classList.remove("hidden");
  }, 350);
}

function nextQuestion() {
  if (current >= questions.length - 1) {
    endGame();
    return;
  }

  current++;
  loadQuestion();
}

function calculateFinalScore() {
  return Math.round((stats.energy + stats.eye + stats.mood + stats.success) / 4);
}

function endGame() {
  const score = calculateFinalScore();
  const goodCount = choicesHistory.filter(item => item.good).length;

  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalEnergy").textContent = stats.energy + " / 100";
  document.getElementById("finalEye").textContent = stats.eye + " / 100";
  document.getElementById("finalMood").textContent = stats.mood + " / 100";
  document.getElementById("finalSuccess").textContent = stats.success + " / 100";

  const endBadge = document.getElementById("endBadge");
  const endTitle = document.getElementById("endTitle");
  const endText = document.getElementById("endText");

  if (score >= 80) {
    if (endBadge) endBadge.textContent = "Dijital Denge Uzmanı ⭐";
    endTitle.textContent = "Harika bir gün yönettin!";
    endText.textContent = `Bugün ${goodCount}/${questions.length} dengeli karar verdin. Teknolojiyi öğrenme, iletişim ve eğlence için kullandın; beden ve ruh sağlığını da korudun.`;
  } else if (score >= 60) {
    if (endBadge) endBadge.textContent = "Dijital Denge Yolunda 🌱";
    endTitle.textContent = "Günün fena değildi!";
    endText.textContent = `Bugün ${goodCount}/${questions.length} dengeli karar verdin. Bazı seçimlerin iyiydi, bazı noktalarda ekran süresi, mola ve uyku düzenine daha çok dikkat edebilirsin.`;
  } else {
    if (endBadge) endBadge.textContent = "Dijital Dengeye Dikkat ⚠️";
    endTitle.textContent = "Daha sağlıklı seçimler mümkün.";
    endText.textContent = `Bugün ${goodCount}/${questions.length} dengeli karar verdin. Uzun ekran kullanımı enerji, göz sağlığı, ruh hali ve başarı üzerinde olumsuz etki oluşturabilir.`;
  }

  const summaryList = document.getElementById("summaryList");
  summaryList.innerHTML = "";

  choicesHistory.forEach((item, index) => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${index + 1}. ${item.good ? "✅" : "⚠️"} ${item.title}</b><br><span>${item.label}</span>`;
    summaryList.appendChild(div);
  });

  showScreen(endScreen);

  // -----------------------
  // PUANI DATABASE'E GÖNDER
  // -----------------------
  fetch("/save-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
          game_key: "5_unit1_w2",  // GAME_INFO ile eşleşmeli
          score: score
      })
  })
  .then(res => res.json())
  .then(data => {
      if(data.success) console.log("Skor kaydedildi:", score, data);
      else console.warn("Skor kaydedilemedi:", data.error);
  })
  .catch(err => console.error("Fetch hatası:", err));
}