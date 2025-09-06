document.addEventListener("DOMContentLoaded", () => {
    const contentContainer = document.getElementById("content-container");

    // ======================================================
    // SAYFA YÜKLEME (partials)
    // ======================================================
    const loadPage = async (pageName) => {
        try {
            contentContainer.innerHTML = `
                <div class="text-center p-5">
                    <div class="spinner-border text-danger" role="status">
                        <span class="visually-hidden">Yükleniyor...</span>
                    </div>
                </div>`;
            const response = await fetch(`partials/${pageName}.html`);
            if (!response.ok) throw new Error(`'${pageName}.html' bulunamadı.`);
            const html = await response.text();
            contentContainer.innerHTML = html;

            // Partial içindeki scriptleri çalıştır
            const scripts = Array.from(contentContainer.querySelectorAll("script"));
            for (const oldScript of scripts) {
                const newScript = document.createElement("script");
                Array.from(oldScript.attributes).forEach(attr =>
                    newScript.setAttribute(attr.name, attr.value)
                );
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            }

        } catch (error) {
            console.error("Sayfa Yükleme Hatası:", error);
            contentContainer.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
        }
    };

    // ======================================================
    // SAYFA BÖLÜMÜ YÜKLEME
    // ======================================================
    const loadSection = async (sectionId) => {
        try {
            const response = await fetch("partials/anasayfa.html");
            if (!response.ok) throw new Error("anasayfa.html bulunamadı.");
            const html = await response.text();
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;
            const section = tempDiv.querySelector(sectionId);
            if (!section) throw new Error("Bölüm bulunamadı.");
            contentContainer.innerHTML = "";
            contentContainer.appendChild(section);
            window.scrollTo({ top: contentContainer.offsetTop, behavior: "smooth" });

            
            // Karakterler carousel ve counter animasyonunu çalıştır
            if (sectionId === "#karakterler") {
            initCharacterCarousel(); 
  }
            animateCounters();
            // Oyun konusu overlay
            if (sectionId === "#oyunkonusu") attachOyunKonusuEvents();
        } catch (error) {
            console.error("Bölüm Yükleme Hatası:", error);
            contentContainer.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
        }
    };

    // ======================================================
    // HİKAYE (OYUN KONUSU) OVERLAY EVENTLERİ
    // ======================================================
    const attachOyunKonusuEvents = () => {
        const openBtn = document.getElementById("open-textbox-btn");
        const closeBtn = document.getElementById("close-btn");
        const overlay = document.getElementById("overlay");

        if (openBtn && overlay)
            openBtn.addEventListener("click", () => overlay.classList.add("active"));
        if (closeBtn && overlay)
            closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
        if (overlay)
            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) overlay.classList.remove("active");
            });
    };

    // ======================================================
    // SCROLL ANİMASYONLARI
    // ======================================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll(".animate-on-scroll");
        const isInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
        };
        elements.forEach(el => {
            if (isInViewport(el)) el.classList.add("active");
            else el.classList.remove("active");
        });
    };
    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll();

    // ======================================================
    // COUNTER ANİMASYONU
    // ======================================================
    const animateCounters = () => {
        const counters = [
            { id: "counter1", target: 12 },
            { id: "counter2", target: 5 },
            { id: "counter3", target: 50 }
        ];

        counters.forEach(counter => {
            const el = document.getElementById(counter.id);
            if (!el) return;

            let current = 0;
            const increment = Math.ceil(counter.target / 100);
            const interval = setInterval(() => {
                current += increment;
                if (current >= counter.target) {
                    el.textContent = counter.target;
                    clearInterval(interval);
                } else {
                    el.textContent = current;
                }
            }, 20);
        });
    };

   // ======================================================
// KARAKTERLER CAROUSEL - YENİ KOD
// ======================================================
const initCharacterCarousel = () => {
    // Gerekli tüm elemanları seç
    const cards = document.querySelectorAll(".character-card");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    // Eğer elemanlar sayfada yoksa, fonksiyonu sonlandır
    if (!cards || cards.length === 0) return;

    let currentIndex = 0; // Başlangıçta ilk kart aktif

    // Kartların aktiflik durumunu güncelleyen ana fonksiyon
    const updateCards = () => {
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add("active");
                card.classList.remove("passive");
            } else {
                card.classList.add("passive");
                card.classList.remove("active");
            }
        });

        // Butonların görünürlüğünü güncelle (isteğe bağlı)
        prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
        prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
        nextBtn.style.opacity = currentIndex === cards.length - 1 ? "0.5" : "1";
        nextBtn.style.pointerEvents = currentIndex === cards.length - 1 ? "none" : "auto";
    };

    // İleri butonuna tıklama olayı
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                updateCards();
            }
        });
    }

    // Geri butonuna tıklama olayı
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCards();
            }
        });
    }

    // Fonksiyon ilk çağrıldığında kartları başlat
    updateCards();
};

// Bu fonksiyonu, `loadSection` fonksiyonunuzun içinde çağırabilirsiniz.
// loadSection fonksiyonunun içine zaten ekliydi.
// Sadece yukarıdaki fonksiyonu onunla değiştirmeniz yeterli.
//
// const loadSection = async (sectionId) => {
//    ...
//    contentContainer.appendChild(section);
//
//   
//    ...
// };

    // ======================================================
    // NAVBAR / SAYFA GEÇİŞLERİ
    // ======================================================
    document.body.addEventListener("click", (e) => {
        // Partials sayfa linkleri
        const pageLink = e.target.closest('a[data-page]');
        if (pageLink) {
            e.preventDefault();
            const pageName = pageLink.getAttribute('data-page');

            // Kullanıcı paneli ayrı sayfa
            if (pageName === "KullanıcıSayfa") {
                window.location.href = "KullanıcıSayfa.html";
            } else {
                loadPage(pageName);
            }
            return;
        }

        // Section linkleri
        const sectionLink = e.target.closest('a[data-section]');
        if (sectionLink) {
            e.preventDefault();
            loadSection(sectionLink.getAttribute('data-section'));
            return;
        }

        // Logout
        const logoutButton = e.target.closest('#logout-button');
        if (logoutButton) {
            e.preventDefault();
            localStorage.removeItem('userToken');
            localStorage.removeItem('userId');
            alert('Başarıyla çıkış yaptınız.');
            window.location.href = 'index.html';
        }
    });

    // ======================================================
    // ANKET MODAL EVENTLERİ
    // ======================================================
    document.addEventListener("click", (e) => {
        const surveyBtn = e.target.closest(".btn-outline-primary");
        if (surveyBtn) {
            e.preventDefault();
            const modalId = surveyBtn.getAttribute("data-target");
            const modal = document.querySelector(modalId);
            if (modal) modal.classList.add("active");
        }

        const closeBtn = e.target.closest(".close-btn");
        if (closeBtn) {
            const modal = closeBtn.closest(".survey-modal");
            if (modal) modal.classList.remove("active");
        }

        const modalBg = e.target.closest(".survey-modal");
        if (modalBg && e.target === modalBg) modalBg.classList.remove("active");
    });

    // ======================================================
    // SAYFA İLK YÜKLENDİĞİNDE
    // ======================================================
    loadPage("anasayfa");
    
});
