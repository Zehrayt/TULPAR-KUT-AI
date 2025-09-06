document.addEventListener("DOMContentLoaded", () => {
    const contentContainer = document.getElementById("content-container");

    // ======================================================
    // SAYFA YÜKLEME
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

            // Eventleri bağla
            attachOyunKonusuEvents();
            attachSurveyEvents();
            animateCounters();
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

            if (sectionId === "#oyunkonusu") attachOyunKonusuEvents();
            attachSurveyEvents();
            animateCounters();
        } catch (error) {
            console.error("Bölüm Yükleme Hatası:", error);
            contentContainer.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
        }
    };

    // ======================================================
    // HİKAYE / OYUN KONUSU OVERLAY
    // ======================================================
    const attachOyunKonusuEvents = () => {
        const overlay = document.getElementById("overlay");
        if (!overlay) return;

        const openBtn = document.getElementById("open-textbox-btn");
        const closeBtn = document.getElementById("close-btn");

        if (openBtn) openBtn.addEventListener("click", () => overlay.classList.add("active"));
        if (closeBtn) closeBtn.addEventListener("click", () => overlay.classList.remove("active"));

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.classList.remove("active");
        });
    };

    // ======================================================
    // ANKET MODAL EVENTLERİ
    // ======================================================
    const attachSurveyEvents = () => {
        const surveyBtns = document.querySelectorAll(".btn-outline-primary");
        surveyBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const modalId = btn.getAttribute("data-target");
                const modal = document.querySelector(modalId);
                if (modal) modal.classList.add("active");
            });
        });

        const closeBtns = document.querySelectorAll(".close-btn");
        closeBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const modal = btn.closest(".survey-modal");
                if (modal) modal.classList.remove("active");
            });
        });

        const modals = document.querySelectorAll(".survey-modal");
        modals.forEach(modal => {
            modal.addEventListener("click", (e) => {
                if (e.target === modal) modal.classList.remove("active");
            });
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
    // KARAKTERLER (SABİT KARTLAR)
    // ======================================================
    const initCharacterCarousel = () => {
        // Kartlar sabit duracak, kaydırma yok
        const cards = document.querySelectorAll(".character-card");
        if (!cards) return;
        cards.forEach(card => card.classList.add("active")); // hepsi görünür
    };
    initCharacterCarousel();

    // ======================================================
    // NAVBAR VE SAYFA GEÇİŞLERİ
    // ======================================================
    document.body.addEventListener('click', (e) => {
        const pageLink = e.target.closest('a[data-page]');
        if (pageLink) {
            e.preventDefault();
            loadPage(pageLink.getAttribute('data-page'));
            return;
        }

        const sectionLink = e.target.closest('a[data-section]');
        if (sectionLink) {
            e.preventDefault();
            loadSection(sectionLink.getAttribute('data-section'));
            return;
        }

        const logoutButton = e.target.closest('#logout-button');
        if (logoutButton) {
            e.preventDefault();
            localStorage.removeItem('userToken');
            localStorage.removeItem('userId');
            alert('Başarıyla çıkış yaptınız.');
            window.location.href = 'index.html';
        }

        const userMenu = e.target.closest('#user-menu');
        if (userMenu) {
            e.preventDefault();
            const menu = document.querySelector('#user-dropdown');
            if (menu) menu.classList.toggle('show');
        }
    });

    // ======================================================
    // SAYFA İLK YÜKLEME
    // ======================================================
    loadPage("anasayfa");
});
