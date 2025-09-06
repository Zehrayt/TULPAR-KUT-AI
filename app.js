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

            // Karakterler carousel ve counter animasyonunu çalıştır
            initCharacterCarousel();
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

            // Karakterler carousel ve counter animasyonunu çalıştır
            initCharacterCarousel();
            animateCounters();
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
    // KARAKTERLER CAROUSEL
    // ======================================================
    const initCharacterCarousel = () => {
  const cards = document.querySelectorAll(".character-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  if (!cards.length || !prevBtn || !nextBtn) return; // yoksa çık

  let currentIndex = 0;

  const updateCarousel = () => {
    cards.forEach((card, index) => {
      card.classList.toggle("active", index === currentIndex);
    });
  };

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  });

  updateCarousel();
};


    // ======================================================
    // NAVBAR VE MODAL EVENTLERİ
    // ======================================================
    document.body.addEventListener('click', (e) => {
        // Sayfa linkleri
        const pageLink = e.target.closest('a[data-page]');
        if (pageLink) {
            e.preventDefault();
            loadPage(pageLink.getAttribute('data-page'));
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

        // Kullanıcı hesabına tıklama
        const userMenu = e.target.closest('#user-menu');
        if (userMenu) {
            e.preventDefault();
            const menu = document.querySelector('#user-dropdown');
            if (menu) menu.classList.toggle('show');
        }
    });

    // ======================================================
    // SAYFA YÜKLEME (İLK AÇILIŞ)
    // ======================================================
    loadPage("anasayfa");
});
