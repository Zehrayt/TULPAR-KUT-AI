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
        } catch (error) {
            console.error("Sayfa Yükleme Hatası:", error);
            contentContainer.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
        }
    };

    // ======================================================
    // BÖLÜM YÜKLEME (örn. #oyunkonusu)
    // ======================================================
    const attachOyunKonusuEvents = () => {
        const openBtn = document.getElementById("open-textbox-btn");
        const closeBtn = document.getElementById("close-btn");
        const overlay = document.getElementById("overlay");
        if (openBtn && overlay) openBtn.addEventListener("click", () => overlay.classList.add("active"));
        if (closeBtn && overlay) closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
        if (overlay) overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("active"); });
    };

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
        } catch (error) {
            console.error("Bölüm Yükleme Hatası:", error);
            contentContainer.innerHTML = `<div class="alert alert-danger text-center">${error.message}</div>`;
        }
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
    animateOnScroll(); // ilk yüklemede kontrol

    // ======================================================
    // DELEGATED EVENT LISTENER (ANKET MODAL)
    // ======================================================
    document.addEventListener("click", (e) => {
        // Örnek Anket butonları
        const surveyBtn = e.target.closest(".btn-outline-primary");
        if (surveyBtn) {
            e.preventDefault();
            const modalId = surveyBtn.getAttribute("data-target");
            const modal = document.querySelector(modalId);
            if (modal) modal.classList.add("active");
        }

        // Kapatma butonları
        const closeBtn = e.target.closest(".close-btn");
        if (closeBtn) {
            const modal = closeBtn.closest(".survey-modal");
            if (modal) modal.classList.remove("active");
        }

        // Modal arkaplanına tıklama
        const modalBg = e.target.closest(".survey-modal");
        if (modalBg && e.target === modalBg) modalBg.classList.remove("active");
    });

    // ======================================================
    // NAVBAR / SAYFA GEÇİŞLERİ
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
    });

    // ======================================================
// SAYAC (COUNTER) ANİMASYONU
// ======================================================
const animateCounters = () => {
    const counters = [
        { id: "counter1", target: 12 }, // Anket Türü sayısı
        { id: "counter2", target: 5 },  // Oyun Modu sayısı
        { id: "counter3", target: 50 }  // Sınırsız Rapor sayısı
    ];

    counters.forEach(counter => {
        const el = document.getElementById(counter.id);
        if (!el) return;

        let current = 0;
        const increment = Math.ceil(counter.target / 100); // 100 adımda bitir
        const interval = setInterval(() => {
            current += increment;
            if (current >= counter.target) {
                el.textContent = counter.target;
                clearInterval(interval);
            } else {
                el.textContent = current;
            }
        }, 20); // Her 20ms artış
    });
};

// Sayfa yüklendiğinde ve animasyon görünür olduğunda başlat
window.addEventListener("scroll", () => {
    const statsSection = document.getElementById("stats");
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
        animateCounters();
    }
});

// Eğer sayfa açıldığında zaten görünüyorsa çalıştır
const statsSection = document.getElementById("stats");
if (statsSection) {
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
        animateCounters();
    }
}

    // ======================================================
    // SAYFA İLK YÜKLENDİĞİNDE
    // ======================================================
    loadPage("anasayfa");
});
